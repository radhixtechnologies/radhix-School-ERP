import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../database/connection";
import { authenticateJWT, requireRole } from "../../middleware/auth";

const router = Router();
router.use(authenticateJWT);

// 1. Transport & Live Bus Tracking
router.get("/transport", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId;
    let query = db("transport_routes");
    if (tenantId) {
      query = query.where({ institute_id: tenantId });
    }
    const routes = await query.select("*");
    const parsed = routes.map((r: any) => ({
      ...r,
      stops: typeof r.stops_json === "string" ? JSON.parse(r.stops_json) : r.stops_json,
    }));
    res.json({ success: true, data: parsed });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update GPS coordinates for Bus (Driver / simulation)
router.post("/transport/update-location", async (req: Request, res: Response): Promise<void> => {
  try {
    const { route_id, lat, lng, current_status } = req.body;
    await db("transport_routes")
      .where({ id: route_id })
      .update({
        current_lat: lat,
        current_lng: lng,
        current_status: current_status || "ON_ROUTE",
      });
    res.json({ success: true, message: "Bus location updated" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Exams & Report Cards
router.get("/exams", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId;
    let query = db("exams");
    if (tenantId) query = query.where({ institute_id: tenantId });
    const exams = await query.orderBy("created_at", "desc");
    res.json({ success: true, data: exams });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Student's or Ward's Exam Results
router.get("/my-results", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let studentId = user.userId;

    const studentProfile = await db("student_profiles")
      .where({ user_id: user.userId })
      .orWhere({ parent_phone: user.username })
      .orWhere({ admission_number: user.username })
      .first();

    if (studentProfile) {
      studentId = studentProfile.id;
    }

    const marks = await db("exam_marks")
      .join("exams", "exam_marks.exam_id", "=", "exams.id")
      .where("exam_marks.student_id", studentId)
      .select(
        "exam_marks.*",
        "exams.name as exam_name",
        "exams.academic_year"
      );

    res.json({ success: true, data: marks });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Teacher entries / updates marks
router.post("/exams/marks", requireRole(["TEACHER", "INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { exam_id, student_id, subject_name, marks_obtained, max_marks, grade, remarks } = req.body;

    const existing = await db("exam_marks")
      .where({ exam_id, student_id, subject_name })
      .first();

    if (existing) {
      await db("exam_marks").where({ id: existing.id }).update({
        marks_obtained,
        max_marks: max_marks || 100,
        grade,
        remarks,
      });
    } else {
      await db("exam_marks").insert({
        id: uuidv4(),
        exam_id,
        student_id,
        subject_name,
        marks_obtained,
        max_marks: max_marks || 100,
        grade,
        remarks,
      });
    }

    res.json({ success: true, message: "Marks saved successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Timetables (Daily periods schedule)
router.get("/timetable", async (req: Request, res: Response): Promise<void> => {
  try {
    const { class_id, day_of_week } = req.query;
    let query = db("timetables");
    if (req.user?.instituteId) query = query.where({ institute_id: req.user.instituteId });
    if (class_id) query = query.where({ class_id: class_id as string });
    if (day_of_week) query = query.where({ day_of_week: day_of_week as string });

    const schedule = await query.orderBy("period_number", "asc");
    res.json({ success: true, data: schedule });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Teacher Leave Requests
router.get("/teacher-leaves", async (req: Request, res: Response): Promise<void> => {
  try {
    const leaves = await db("teacher_leaves")
      .join("staff_profiles", "teacher_leaves.staff_id", "=", "staff_profiles.id")
      .select("teacher_leaves.*", "staff_profiles.first_name", "staff_profiles.last_name", "staff_profiles.employee_code")
      .orderBy("teacher_leaves.applied_at", "desc");
    res.json({ success: true, data: leaves });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/teacher-leaves", requireRole(["TEACHER"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { leave_type, start_date, end_date, reason } = req.body;
    const staff = await db("staff_profiles").where({ user_id: req.user!.userId }).first();

    const id = uuidv4();
    await db("teacher_leaves").insert({
      id,
      institute_id: req.user!.instituteId || staff?.institute_id,
      staff_id: staff?.id || req.user!.userId,
      leave_type: leave_type || "CASUAL",
      start_date,
      end_date,
      reason,
      status: "PENDING",
    });

    res.status(201).json({ success: true, message: "Leave request submitted", id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
