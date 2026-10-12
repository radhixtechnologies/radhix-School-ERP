import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../database/connection";
import { authenticateJWT, requireRole } from "../../middleware/auth";
import { requireActiveTenant } from "../../middleware/tenant";

const router = Router();

router.use(authenticateJWT);
router.use(requireActiveTenant);

// ==========================================
// School ERP Endpoints
// ==========================================

// Get Classes with their Sections
router.get("/classes", async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await db("school_classes")
      .where({ institute_id: req.tenantId! })
      .orderBy("numeric_order", "asc");

    const enriched = await Promise.all(
      classes.map(async (c) => {
        const sections = await db("sections").where({ class_id: c.id });
        const studentCount = await db("student_profiles").where({ class_id: c.id }).count("id as count").first();
        return {
          ...c,
          sections,
          student_count: Number(studentCount?.count || 0),
        };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Class
router.post("/classes", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, numeric_order } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: "Class name is required" });
      return;
    }

    const classId = uuidv4();
    await db("school_classes").insert({
      id: classId,
      institute_id: req.tenantId!,
      name,
      numeric_order: numeric_order || 1,
    });

    // Default Section 'A'
    await db("sections").insert({
      id: uuidv4(),
      institute_id: req.tenantId!,
      class_id: classId,
      name: "A",
    });

    res.status(201).json({ success: true, message: "Class created with default Section A", classId });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Section
router.post("/classes/:classId/sections", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { classId } = req.params;
    const { name, room_number } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: "Section name is required" });
      return;
    }

    const sectionId = uuidv4();
    await db("sections").insert({
      id: sectionId,
      institute_id: req.tenantId!,
      class_id: classId,
      name,
      room_number: room_number || null,
    });

    res.status(201).json({ success: true, message: "Section added", sectionId });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// College ERP Endpoints
// ==========================================

// Get Courses with Departments & Semesters
router.get("/courses", async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await db("college_courses")
      .where({ institute_id: req.tenantId! })
      .orderBy("name", "asc");

    const enriched = await Promise.all(
      courses.map(async (crs) => {
        const departments = await db("college_departments").where({ course_id: crs.id });
        const deptsWithSemesters = await Promise.all(
          departments.map(async (dept) => {
            const semesters = await db("college_semesters")
              .where({ department_id: dept.id })
              .orderBy("semester_number", "asc");
            return { ...dept, semesters };
          })
        );

        const studentCount = await db("student_profiles").where({ course_id: crs.id }).count("id as count").first();

        return {
          ...crs,
          departments: deptsWithSemesters,
          student_count: Number(studentCount?.count || 0),
        };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Course
router.post("/courses", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, duration_years, departments } = req.body;
    if (!name || !code) {
      res.status(400).json({ success: false, message: "Course name and code are required" });
      return;
    }

    const courseId = uuidv4();
    await db("college_courses").insert({
      id: courseId,
      institute_id: req.tenantId!,
      name,
      code,
      duration_years: duration_years || 4,
    });

    // Optionally create department and semesters if provided
    if (departments && Array.isArray(departments)) {
      for (const d of departments) {
        const deptId = uuidv4();
        await db("college_departments").insert({
          id: deptId,
          institute_id: req.tenantId!,
          course_id: courseId,
          name: d.name,
          code: d.code,
        });

        const semCount = (duration_years || 4) * 2;
        for (let i = 1; i <= semCount; i++) {
          await db("college_semesters").insert({
            id: uuidv4(),
            institute_id: req.tenantId!,
            department_id: deptId,
            semester_number: i,
            name: `Semester ${i}`,
          });
        }
      }
    }

    res.status(201).json({ success: true, message: "College Course created successfully", courseId });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// Subjects Master (Shared)
// ==========================================
router.get("/subjects", async (req: Request, res: Response): Promise<void> => {
  try {
    const subjects = await db("subjects").where({ institute_id: req.tenantId! });
    res.json({ success: true, data: subjects });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/subjects", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, class_id, semester_id, credits, type } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: "Subject name is required" });
      return;
    }

    const id = uuidv4();
    await db("subjects").insert({
      id,
      institute_id: req.tenantId!,
      name,
      code: code || null,
      class_id: class_id || null,
      semester_id: semester_id || null,
      credits: credits || 3,
      type: type || "THEORY",
    });

    res.status(201).json({ success: true, message: "Subject added", id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Class
router.delete("/classes/:id", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db("school_classes").where({ id, institute_id: req.tenantId! }).delete();
    res.json({ success: true, message: "Class deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Section
router.delete("/sections/:id", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db("sections").where({ id, institute_id: req.tenantId! }).delete();
    res.json({ success: true, message: "Section deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Subject
router.delete("/subjects/:id", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db("subjects").where({ id, institute_id: req.tenantId! }).delete();
    res.json({ success: true, message: "Subject deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
