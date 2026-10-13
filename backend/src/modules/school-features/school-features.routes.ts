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

// Drivers Management & Full Registration Endpoints
router.get("/transport/drivers", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || "1";
    let query = db("drivers");
    if (tenantId && req.user?.role !== "SUPER_ADMIN") {
      query = query.where({ institute_id: tenantId });
    }
    const drivers = await query.orderBy("created_at", "desc");
    res.json({ success: true, data: drivers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/transport/drivers", async (req: Request, res: Response): Promise<void> => {
  try {
    let tenantId = req.user?.instituteId || req.body.institute_id;
    if (!tenantId || tenantId === "1") {
      const inst = await db("institutes").first();
      tenantId = inst ? inst.id : "1";
    }

    const {
      name,
      phone,
      alternate_phone,
      dob,
      blood_group,
      address,
      aadhaar_number,
      license_number,
      license_type,
      license_expiry,
      badge_number,
      experience_years,
      assigned_bus,
      route,
      police_verification,
      police_station,
      police_report_date,
      medical_fitness,
      fitness_certificate_no,
      fitness_doctor,
      status,
      joining_date,
      notes,
    } = req.body;

    if (!name || !phone || !license_number) {
      res.status(400).json({
        success: false,
        message: "Driver Name, Phone Number, and License Number are mandatory.",
      });
      return;
    }

    const newDriver = {
      id: uuidv4(),
      institute_id: tenantId,
      name,
      phone,
      alternate_phone: alternate_phone || null,
      dob: dob || null,
      blood_group: blood_group || "B+ve",
      address: address || null,
      aadhaar_number: aadhaar_number || null,
      license_number,
      license_type: license_type || "HMV_COMMERCIAL",
      license_expiry: license_expiry || null,
      badge_number: badge_number || null,
      experience_years: parseInt(experience_years || "0", 10),
      assigned_bus: assigned_bus || "Unassigned",
      route: route || "General Route",
      police_verification: police_verification || "VERIFIED",
      police_station: police_station || null,
      police_report_date: police_report_date || null,
      medical_fitness: medical_fitness || "FIT",
      fitness_certificate_no: fitness_certificate_no || null,
      fitness_doctor: fitness_doctor || null,
      status: status || "ACTIVE_DUTY",
      joining_date: joining_date || new Date().toISOString().split("T")[0],
      license_document_url: req.body.license_document_url || null,
      police_cert_url: req.body.police_cert_url || null,
      medical_cert_url: req.body.medical_cert_url || null,
      badge_document_url: req.body.badge_document_url || null,
      notes: notes || null,
    };

    await db("drivers").insert(newDriver);
    res.status(201).json({
      success: true,
      message: "Driver registered and verified successfully!",
      data: newDriver,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/transport/drivers/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.created_at;

    await db("drivers").where({ id }).update(updateData);
    const updated = await db("drivers").where({ id }).first();
    res.json({
      success: true,
      message: "Driver details updated successfully!",
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/transport/drivers/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db("drivers").where({ id }).delete();
    res.json({ success: true, message: "Driver removed from registry." });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Vehicles Management & Complete Registration Endpoints
router.get("/transport/vehicles", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || "1";
    let query = db("vehicles");
    if (tenantId && req.user?.role !== "SUPER_ADMIN") {
      query = query.where({ institute_id: tenantId });
    }
    const vehicles = await query.orderBy("created_at", "desc");
    res.json({ success: true, data: vehicles });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/transport/vehicles", async (req: Request, res: Response): Promise<void> => {
  try {
    let tenantId = req.user?.instituteId || req.body.institute_id;
    if (!tenantId || tenantId === "1") {
      const inst = await db("institutes").first();
      tenantId = inst ? inst.id : "1";
    }

    const {
      vehicle_number,
      vehicle_model,
      vehicle_type,
      seating_capacity,
      fuel_type,
      chassis_number,
      engine_number,
      rc_number,
      rc_expiry,
      fitness_cert_no,
      fitness_expiry,
      insurance_policy_no,
      insurance_company,
      insurance_expiry,
      puc_cert_no,
      puc_expiry,
      permit_number,
      permit_expiry,
      speed_governor_fitted,
      speed_limit_kmh,
      gps_device_imei,
      cctv_installed,
      cctv_camera_count,
      fire_extinguisher,
      emergency_exit,
      assigned_driver_id,
      assigned_driver_name,
      assigned_route_id,
      assigned_route_name,
      status,
      notes,
    } = req.body;

    if (!vehicle_number || !vehicle_model) {
      res.status(400).json({
        success: false,
        message: "Vehicle Registration Number and Model are mandatory.",
      });
      return;
    }

    const newVehicle = {
      id: uuidv4(),
      institute_id: tenantId,
      vehicle_number: vehicle_number.toUpperCase().trim(),
      vehicle_model,
      vehicle_type: vehicle_type || "BUS",
      seating_capacity: parseInt(seating_capacity || "40", 10),
      fuel_type: fuel_type || "DIESEL",
      chassis_number: chassis_number || null,
      engine_number: engine_number || null,
      rc_number: rc_number || vehicle_number.toUpperCase().trim(),
      rc_expiry: rc_expiry || null,
      fitness_cert_no: fitness_cert_no || null,
      fitness_expiry: fitness_expiry || null,
      insurance_policy_no: insurance_policy_no || null,
      insurance_company: insurance_company || null,
      insurance_expiry: insurance_expiry || null,
      puc_cert_no: puc_cert_no || null,
      puc_expiry: puc_expiry || null,
      permit_number: permit_number || null,
      permit_expiry: permit_expiry || null,
      speed_governor_fitted: speed_governor_fitted !== false,
      speed_limit_kmh: parseInt(speed_limit_kmh || "40", 10),
      gps_device_imei: gps_device_imei || null,
      cctv_installed: cctv_installed !== false,
      cctv_camera_count: parseInt(cctv_camera_count || "2", 10),
      fire_extinguisher: fire_extinguisher !== false,
      emergency_exit: emergency_exit !== false,
      assigned_driver_id: assigned_driver_id || null,
      assigned_driver_name: assigned_driver_name || null,
      assigned_route_id: assigned_route_id || null,
      assigned_route_name: assigned_route_name || null,
      status: status || "ACTIVE",
      rc_document_url: req.body.rc_document_url || null,
      insurance_document_url: req.body.insurance_document_url || null,
      fitness_document_url: req.body.fitness_document_url || null,
      puc_document_url: req.body.puc_document_url || null,
      permit_document_url: req.body.permit_document_url || null,
      notes: notes || null,
    };

    await db("vehicles").insert(newVehicle);
    res.status(201).json({
      success: true,
      message: "Vehicle registered with all documents successfully!",
      data: newVehicle,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/transport/vehicles/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.created_at;

    await db("vehicles").where({ id }).update(updateData);
    const updated = await db("vehicles").where({ id }).first();
    res.json({
      success: true,
      message: "Vehicle details and documents updated successfully!",
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/transport/vehicles/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db("vehicles").where({ id }).delete();
    res.json({ success: true, message: "Vehicle deleted from fleet registry." });
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

// 5. Admission Inquiries & Leads (Admission Counsellor Hub)
router.get("/admissions/inquiries", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || req.tenantId;
    let query = db("admission_inquiries");
    if (tenantId) query = query.where({ institute_id: tenantId });
    const inquiries = await query.orderBy("created_at", "desc");
    res.json({ success: true, data: inquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/admissions/inquiries", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || req.tenantId;
    const { student_name, parent_name, phone, email, class_applying, source, status, counsellor_name, follow_up_date, notes } = req.body;
    if (!student_name || !parent_name || !phone || !class_applying) {
      res.status(400).json({ success: false, message: "Student Name, Parent Name, Phone, and Class are required" });
      return;
    }

    const id = uuidv4();
    await db("admission_inquiries").insert({
      id,
      institute_id: tenantId,
      student_name,
      parent_name,
      phone,
      email: email || null,
      class_applying,
      source: source || "WALK_IN",
      status: status || "NEW_INQUIRY",
      counsellor_name: counsellor_name || "Senior Counsellor",
      follow_up_date: follow_up_date || null,
      notes: notes || null,
    });

    const created = await db("admission_inquiries").where({ id }).first();
    res.status(201).json({ success: true, message: "Admission inquiry registered successfully", data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/admissions/inquiries/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.instituteId || req.tenantId;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.institute_id;

    await db("admission_inquiries").where({ id, institute_id: tenantId }).update(updateData);
    const updated = await db("admission_inquiries").where({ id }).first();
    res.json({ success: true, message: "Inquiry updated successfully", data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/admissions/inquiries/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.instituteId || req.tenantId;
    await db("admission_inquiries").where({ id, institute_id: tenantId }).delete();
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
