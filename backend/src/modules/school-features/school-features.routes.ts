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

// 4. Teacher Leave Requests & Substitute Teacher (Proxy) Assignment
router.get("/teacher-leaves", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || "1";
    let query = db("teacher_leaves")
      .join("staff_profiles", "teacher_leaves.staff_id", "=", "staff_profiles.id")
      .select(
        "teacher_leaves.*",
        "staff_profiles.first_name",
        "staff_profiles.last_name",
        "staff_profiles.employee_code",
        "staff_profiles.designation",
        "staff_profiles.department",
        "staff_profiles.phone"
      );

    if (tenantId && req.user?.role !== "SUPER_ADMIN") {
      query = query.where("teacher_leaves.institute_id", tenantId);
    }

    const leaves = await query.orderBy("teacher_leaves.applied_at", "desc");
    res.json({ success: true, data: leaves });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/teacher-leaves", requireRole(["TEACHER", "INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { leave_type, start_date, end_date, reason, staff_id, substitute_staff_id, substitute_name, substitution_notes } = req.body;
    let targetStaffId = staff_id;

    if (!targetStaffId) {
      const staff = await db("staff_profiles").where({ user_id: req.user!.userId }).first();
      targetStaffId = staff?.id;
    }

    if (!targetStaffId) {
      const firstStaff = await db("staff_profiles").first();
      targetStaffId = firstStaff?.id;
    }

    const tenantId = req.user?.instituteId || (await db("institutes").first())?.id || "1";
    const id = uuidv4();

    await db("teacher_leaves").insert({
      id,
      institute_id: tenantId,
      staff_id: targetStaffId,
      leave_type: leave_type || "CASUAL",
      start_date,
      end_date,
      reason,
      status: req.user?.role === "INSTITUTE_ADMIN" ? "APPROVED" : "PENDING",
      substitute_staff_id: substitute_staff_id || null,
      substitute_name: substitute_name || null,
      substitution_notes: substitution_notes || null,
      admin_remarks: req.user?.role === "INSTITUTE_ADMIN" ? "Recorded directly by School Admin." : null,
      approved_at: req.user?.role === "INSTITUTE_ADMIN" ? db.fn.now() : null,
    });

    res.status(201).json({ success: true, message: "Leave request registered successfully", id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Review & Assign Substitute Teacher to cover classes
router.put("/teacher-leaves/:id/assign-substitute", requireRole(["INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      status, // "APPROVED", "REJECTED", "PENDING"
      substitute_staff_id,
      substitute_name,
      substitution_notes,
      admin_remarks,
    } = req.body;

    const leave = await db("teacher_leaves").where({ id }).first();
    if (!leave) {
      res.status(404).json({ success: false, message: "Leave record not found" });
      return;
    }

    await db("teacher_leaves")
      .where({ id })
      .update({
        status: status || leave.status,
        substitute_staff_id: substitute_staff_id !== undefined ? substitute_staff_id : leave.substitute_staff_id,
        substitute_name: substitute_name !== undefined ? substitute_name : leave.substitute_name,
        substitution_notes: substitution_notes !== undefined ? substitution_notes : leave.substitution_notes,
        admin_remarks: admin_remarks !== undefined ? admin_remarks : leave.admin_remarks,
        approved_at: status === "APPROVED" ? db.fn.now() : leave.approved_at,
        reviewed_by: req.user?.username || "School Principal",
      });

    const updated = await db("teacher_leaves").where({ id }).first();
    res.json({
      success: true,
      message: `Teacher leave status updated to ${updated.status} and substitute teacher assigned.`,
      data: updated,
    });
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

// =========================================================================
// 6. SCHOOL FINANCE & ACCOUNTING HUB (Income vs Expenses, Salary & Fleet)
// =========================================================================

// 6.1 Complete Finance Overview & Cash Flow
router.get("/finance/overview", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || (await db("institutes").first())?.id || "1";

    // 1. Total Income from Student Fees
    let totalInflow = 0;
    let feesToday = 0;
    try {
      const allFees = await db("fee_payments")
        .where({ institute_id: tenantId })
        .sum("amount_paid as total")
        .first();
      totalInflow = Number(allFees?.total || 0);

      const todayFees = await db("fee_payments")
        .where({ institute_id: tenantId })
        .whereRaw("date(paid_at) = date('now')")
        .sum("amount_paid as total")
        .first();
      feesToday = Number(todayFees?.total || 0);
    } catch {}

    // 2. Staff Salaries (Paid vs Pending)
    let totalSalariesPaid = 0;
    let totalSalariesPending = 0;
    let salariesCount = 0;
    try {
      const paidSalaries = await db("staff_salaries")
        .where({ institute_id: tenantId, payment_status: "PAID" })
        .sum("net_salary as total")
        .first();
      totalSalariesPaid = Number(paidSalaries?.total || 0);

      const pendingSalaries = await db("staff_salaries")
        .where({ institute_id: tenantId, payment_status: "PENDING" })
        .sum("net_salary as total")
        .first();
      totalSalariesPending = Number(pendingSalaries?.total || 0);

      const countRes = await db("staff_salaries").where({ institute_id: tenantId }).count("id as count").first();
      salariesCount = Number(countRes?.count || 0);
    } catch {}

    // 3. Vehicle & Transport Expenses (Paid vs Pending)
    let totalTransportPaid = 0;
    let totalTransportPending = 0;
    let transportCount = 0;
    try {
      const paidTrp = await db("transport_expenses")
        .where({ institute_id: tenantId, payment_status: "PAID" })
        .sum("amount as total")
        .first();
      totalTransportPaid = Number(paidTrp?.total || 0);

      const pendingTrp = await db("transport_expenses")
        .where({ institute_id: tenantId, payment_status: "PENDING" })
        .sum("amount as total")
        .first();
      totalTransportPending = Number(pendingTrp?.total || 0);

      const countRes = await db("transport_expenses").where({ institute_id: tenantId }).count("id as count").first();
      transportCount = Number(countRes?.count || 0);
    } catch {}

    // 4. Net Cashflow Calculations
    const totalOutflow = totalSalariesPaid + totalTransportPaid;
    const netCashflow = totalInflow - totalOutflow;
    const pendingPayables = totalSalariesPending + totalTransportPending;

    // 5. Build Unified Recent Transactions Ledger
    const recentTransactions: any[] = [];

    // Recent Fee Payments (Income)
    try {
      const recentFees = await db("fee_payments")
        .join("student_profiles", "fee_payments.student_id", "=", "student_profiles.id")
        .where("fee_payments.institute_id", tenantId)
        .select(
          "fee_payments.id",
          "fee_payments.amount_paid as amount",
          "fee_payments.payment_mode",
          "fee_payments.receipt_number as reference",
          "fee_payments.paid_at as date",
          "student_profiles.first_name",
          "student_profiles.last_name",
          "student_profiles.admission_number"
        )
        .orderBy("fee_payments.paid_at", "desc")
        .limit(5);

      recentFees.forEach((f: any) => {
        recentTransactions.push({
          id: f.id,
          type: "INCOME",
          category: "Student Fee Collection",
          title: `Fee Collected - ${f.first_name} ${f.last_name || ""} (${f.admission_number})`,
          amount: Number(f.amount),
          date: f.date,
          status: "RECEIVED",
          payment_mode: f.payment_mode,
          reference: f.reference,
        });
      });
    } catch {}

    // Recent Salary Disbursals (Expense)
    try {
      const recentSal = await db("staff_salaries")
        .where({ institute_id: tenantId, payment_status: "PAID" })
        .orderBy("payment_date", "desc")
        .limit(4);

      recentSal.forEach((s: any) => {
        recentTransactions.push({
          id: s.id,
          type: "EXPENSE",
          category: "Staff Salary Disbursal",
          title: `Salary Paid - ${s.staff_name} (${s.designation}) [${s.month_year}]`,
          amount: Number(s.net_salary),
          date: s.payment_date || s.created_at,
          status: "PAID",
          payment_mode: s.payment_mode || "BANK_TRANSFER",
          reference: s.voucher_number || s.transaction_ref || "VCH-PAID",
        });
      });
    } catch {}

    // Recent Transport Payouts (Expense)
    try {
      const recentTrp = await db("transport_expenses")
        .where({ institute_id: tenantId, payment_status: "PAID" })
        .orderBy("payment_date", "desc")
        .limit(4);

      recentTrp.forEach((t: any) => {
        recentTransactions.push({
          id: t.id,
          type: "EXPENSE",
          category: "Vehicle Transport Expense",
          title: `${t.expense_type === "MONTHLY_CONTRACT" ? "Monthly Contract" : t.expense_type} - ${t.vehicle_number} (${t.vendor_or_payee})`,
          amount: Number(t.amount),
          date: t.payment_date || t.created_at,
          status: "PAID",
          payment_mode: t.payment_mode,
          reference: t.receipt_number || t.transaction_ref || "TRP-PAID",
        });
      });
    } catch {}

    // Sort transactions by date descending
    recentTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({
      success: true,
      data: {
        totalInflow,
        totalOutflow,
        netCashflow,
        feesToday,
        totalSalariesPaid,
        totalSalariesPending,
        totalTransportPaid,
        totalTransportPending,
        pendingPayables,
        salariesCount,
        transportCount,
        recentTransactions: recentTransactions.slice(0, 8),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6.2 Staff Salaries List
router.get("/finance/salaries", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || (await db("institutes").first())?.id || "1";
    const { month_year, status } = req.query;

    let query = db("staff_salaries").where({ institute_id: tenantId });
    if (month_year && month_year !== "ALL") {
      query = query.where({ month_year: month_year as string });
    }
    if (status && status !== "ALL") {
      query = query.where({ payment_status: status as string });
    }

    const salaries = await query.orderBy("created_at", "desc");
    res.json({ success: true, data: salaries });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6.3 Disburse Individual Staff Salary
router.post("/finance/salaries/disburse", requireRole(["INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { salary_id, payment_mode, transaction_ref, remarks } = req.body;
    if (!salary_id) {
      res.status(400).json({ success: false, message: "salary_id is required" });
      return;
    }

    const salary = await db("staff_salaries").where({ id: salary_id }).first();
    if (!salary) {
      res.status(404).json({ success: false, message: "Salary record not found" });
      return;
    }

    const voucherNumber = "SLP-2026-" + Math.floor(1000 + Math.random() * 9000);
    const paymentDate = new Date().toISOString().split("T")[0];

    await db("staff_salaries")
      .where({ id: salary_id })
      .update({
        payment_status: "PAID",
        payment_mode: payment_mode || "BANK_TRANSFER",
        payment_date: paymentDate,
        transaction_ref: transaction_ref || `TXN-${Date.now().toString().slice(-6)}`,
        voucher_number: voucherNumber,
        remarks: remarks || "Salary disbursed by School Admin.",
        disbursed_by: req.user?.username || "School Principal",
      });

    const updated = await db("staff_salaries").where({ id: salary_id }).first();
    res.json({
      success: true,
      message: `Salary of ₹${updated.net_salary} disbursed successfully to ${updated.staff_name}!`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6.4 Bulk Disburse All Pending Salaries
router.post("/finance/salaries/bulk-disburse", requireRole(["INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (await db("institutes").first())?.id || "1";
    const { month_year, payment_mode } = req.body;

    const pending = await db("staff_salaries")
      .where({ institute_id: tenantId, payment_status: "PENDING" });

    const paymentDate = new Date().toISOString().split("T")[0];

    for (const sal of pending) {
      const voucherNumber = "SLP-2026-" + Math.floor(1000 + Math.random() * 9000);
      await db("staff_salaries").where({ id: sal.id }).update({
        payment_status: "PAID",
        payment_mode: payment_mode || "BANK_TRANSFER",
        payment_date: paymentDate,
        transaction_ref: `NEFT-BULK-${Date.now().toString().slice(-6)}`,
        voucher_number: voucherNumber,
        remarks: `Bulk salary disbursement for ${sal.month_year}`,
        disbursed_by: req.user?.username || "School Principal",
      });
    }

    res.json({
      success: true,
      message: `Successfully disbursed salaries for ${pending.length} staff members!`,
      count: pending.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6.5 Vehicle Transport & Monthly Contract Expenses List
router.get("/finance/transport-expenses", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || (await db("institutes").first())?.id || "1";
    const { month_year, expense_type } = req.query;

    let query = db("transport_expenses").where({ institute_id: tenantId });
    if (month_year && month_year !== "ALL") {
      query = query.where({ month_year: month_year as string });
    }
    if (expense_type && expense_type !== "ALL") {
      query = query.where({ expense_type: expense_type as string });
    }

    const expenses = await query.orderBy("payment_date", "desc");
    res.json({ success: true, data: expenses });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6.6 Create or Disburse Monthly Vehicle Expense
router.post("/finance/transport-expenses", requireRole(["INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (await db("institutes").first())?.id || "1";
    const {
      vehicle_id,
      vehicle_number,
      expense_type,
      month_year,
      vendor_or_payee,
      amount,
      payment_mode,
      payment_status,
      transaction_ref,
      notes,
    } = req.body;

    if (!vehicle_number || !vendor_or_payee || !amount) {
      res.status(400).json({
        success: false,
        message: "Vehicle Number, Payee/Vendor Name, and Amount are required.",
      });
      return;
    }

    const receiptNumber = "TRP-2026-" + Math.floor(100 + Math.random() * 900);
    const id = uuidv4();

    await db("transport_expenses").insert({
      id,
      institute_id: tenantId,
      vehicle_id: vehicle_id || null,
      vehicle_number,
      expense_type: expense_type || "MONTHLY_CONTRACT",
      month_year: month_year || "October 2026",
      vendor_or_payee,
      amount: parseFloat(amount),
      payment_status: payment_status || "PAID",
      payment_mode: payment_mode || "BANK_TRANSFER",
      payment_date: new Date().toISOString().split("T")[0],
      transaction_ref: transaction_ref || `TRP-TXN-${Date.now().toString().slice(-6)}`,
      receipt_number: receiptNumber,
      notes: notes || null,
    });

    const created = await db("transport_expenses").where({ id }).first();
    res.status(201).json({
      success: true,
      message: `Transport payout of ₹${amount} recorded successfully for ${vehicle_number}!`,
      data: created,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6.7 Pay Pending Transport Expense
router.put("/finance/transport-expenses/:id/pay", requireRole(["INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { payment_mode, transaction_ref, notes } = req.body;

    const expense = await db("transport_expenses").where({ id }).first();
    if (!expense) {
      res.status(404).json({ success: false, message: "Transport expense record not found" });
      return;
    }

    await db("transport_expenses")
      .where({ id })
      .update({
        payment_status: "PAID",
        payment_mode: payment_mode || "BANK_TRANSFER",
        payment_date: new Date().toISOString().split("T")[0],
        transaction_ref: transaction_ref || `TRP-TXN-${Date.now().toString().slice(-6)}`,
        notes: notes || expense.notes,
      });

    const updated = await db("transport_expenses").where({ id }).first();
    res.json({
      success: true,
      message: `Vehicle contract expense of ₹${updated.amount} marked as PAID.`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =========================================================================
// 7. ONLINE CLASSES / VIRTUAL CLASSROOMS
// =========================================================================

// 7.1 List Online Classes
router.get("/online-classes", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || (await db("institutes").first())?.id || "1";
    const { class_name, status } = req.query;

    let query = db("online_classes").where({ institute_id: tenantId });
    if (class_name && class_name !== "ALL") {
      query = query.where({ class_name: class_name as string });
    }
    if (status && status !== "ALL") {
      query = query.where({ status: status as string });
    }

    const classes = await query.orderBy("class_date", "desc");
    res.json({ success: true, data: classes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7.2 Schedule New Online Class
router.post("/online-classes", requireRole(["TEACHER", "INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (await db("institutes").first())?.id || "1";
    const {
      class_id,
      class_name,
      section_name,
      subject_name,
      teacher_id,
      teacher_name,
      topic,
      class_date,
      start_time,
      end_time,
      platform,
      meeting_link,
      passcode,
      instructions,
    } = req.body;

    if (!class_name || !subject_name || !topic || !class_date || !start_time || !meeting_link) {
      res.status(400).json({
        success: false,
        message: "Class, Subject, Topic, Date, Start Time, and Meeting Link are required.",
      });
      return;
    }

    const id = uuidv4();
    await db("online_classes").insert({
      id,
      institute_id: tenantId,
      class_id: class_id || null,
      class_name,
      section_name: section_name || "Section A",
      subject_name,
      teacher_id: teacher_id || null,
      teacher_name: teacher_name || req.user?.username || "Faculty Teacher",
      topic,
      class_date,
      start_time,
      end_time: end_time || "1 Hour",
      platform: platform || "GOOGLE_MEET",
      meeting_link,
      passcode: passcode || null,
      status: "SCHEDULED",
      instructions: instructions || null,
    });

    const created = await db("online_classes").where({ id }).first();
    res.status(201).json({
      success: true,
      message: `Online class for ${class_name} (${subject_name}) scheduled successfully!`,
      data: created,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7.3 Update Online Class (Change status to LIVE, COMPLETED, CANCELLED or edit details)
router.put("/online-classes/:id", requireRole(["TEACHER", "INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.institute_id;
    delete updateData.created_at;

    await db("online_classes").where({ id }).update(updateData);
    const updated = await db("online_classes").where({ id }).first();

    res.json({
      success: true,
      message: `Online class updated successfully! Status: ${updated.status}`,
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7.4 Delete Online Class
router.delete("/online-classes/:id", requireRole(["TEACHER", "INSTITUTE_ADMIN"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db("online_classes").where({ id }).delete();
    res.json({ success: true, message: "Online class removed successfully." });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 8. CAMPUS CLEANLINESS & HYGIENE INSPECTION MODULE
// -------------------------------------------------------------

// 8.1 Get All Facility Zones (Washrooms, Gardens, Parks, Water Stations, etc.)
router.get("/cleanliness/zones", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || "1";
    let query = db("cleanliness_zones");
    if (tenantId && req.user?.role !== "SUPER_ADMIN") {
      query = query.where({ institute_id: tenantId });
    }
    const zones = await query.orderBy("category", "asc").orderBy("name", "asc");
    const parsed = zones.map((z: any) => ({
      ...z,
      last_cleaned_tasks: typeof z.last_cleaned_tasks === "string" ? JSON.parse(z.last_cleaned_tasks || "[]") : (z.last_cleaned_tasks || []),
      checklist_json: typeof z.checklist_json === "string" ? JSON.parse(z.checklist_json || "[]") : (z.checklist_json || []),
    }));
    res.json({ success: true, data: parsed });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8.2 Create New Facility Zone
router.post("/cleanliness/zones", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || "1";
    const id = uuidv4();
    const {
      name,
      code,
      category,
      location_block,
      assigned_cleaner,
      cleaner_phone,
      assigned_supervisor,
      cleaning_frequency,
      checklist_json,
    } = req.body;

    const newZone = {
      id,
      institute_id: tenantId,
      name,
      code: code || `ZN-${Date.now().toString().slice(-4)}`,
      category: category || "WASHROOM",
      location_block: location_block || "Campus Main",
      assigned_cleaner: assigned_cleaner || "Staff Cleaner",
      cleaner_phone: cleaner_phone || "",
      assigned_supervisor: assigned_supervisor || "Campus Supervisor",
      cleaning_frequency: cleaning_frequency || "Twice Daily",
      last_cleaned_at: new Date().toISOString(),
      last_cleaned_by: assigned_cleaner || "Staff Cleaner",
      last_cleaned_tasks: JSON.stringify(["Initial Sanitization", "Safety Check"]),
      next_cleaning_scheduled_at: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      last_inspected_at: null,
      last_inspected_by: null,
      next_inspection_due_at: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 5.0,
      checklist_json: JSON.stringify(checklist_json || []),
      latest_inspection_remarks: "Zone successfully registered & ready for regular monitoring.",
    };

    await db("cleanliness_zones").insert(newZone);
    res.status(201).json({ success: true, data: { ...newZone, checklist_json: checklist_json || [] } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8.3 Log Cleaning ("Safai Kab Hui" - Records that cleaning was just performed)
router.post("/cleanliness/log-cleaning", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || "1";
    const { zone_id, cleaned_by, tasks, next_cleaning_scheduled_at, remarks } = req.body;

    const zone = await db("cleanliness_zones").where({ id: zone_id }).first();
    if (!zone) {
      res.status(404).json({ success: false, message: "Facility zone not found" });
      return;
    }

    const now = new Date().toISOString();
    await db("cleanliness_zones")
      .where({ id: zone_id })
      .update({
        last_cleaned_at: now,
        last_cleaned_by: cleaned_by || zone.assigned_cleaner,
        last_cleaned_tasks: JSON.stringify(tasks || ["Mopping & Sanitization"]),
        next_cleaning_scheduled_at: next_cleaning_scheduled_at || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        inspection_status: "PENDING_INSPECTION",
        updated_at: now,
      });

    const logId = uuidv4();
    await db("cleanliness_inspections").insert({
      id: logId,
      institute_id: tenantId,
      zone_id,
      zone_name: zone.name,
      category: zone.category,
      log_type: "CLEANING_LOG",
      action_date: now,
      performed_by: cleaned_by || zone.assigned_cleaner,
      role: "JANITOR",
      rating: null,
      status: "CLEANED",
      checklist_results: JSON.stringify(tasks || []),
      next_scheduled_date: next_cleaning_scheduled_at,
      remarks: remarks || "Regular scheduled cleaning executed.",
    });

    const updatedZone = await db("cleanliness_zones").where({ id: zone_id }).first();
    res.json({
      success: true,
      message: `Cleaning logged for ${zone.name}.`,
      data: updatedZone,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8.4 Conduct Inspection Flow ("Inspection Date & Verification Flow")
router.post("/cleanliness/conduct-inspection", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || "1";
    const {
      zone_id,
      inspector_name,
      rating,
      status,
      checklist,
      next_inspection_due_at,
      remarks,
    } = req.body;

    const zone = await db("cleanliness_zones").where({ id: zone_id }).first();
    if (!zone) {
      res.status(404).json({ success: false, message: "Facility zone not found" });
      return;
    }

    const now = new Date().toISOString();

    await db("cleanliness_zones")
      .where({ id: zone_id })
      .update({
        last_inspected_at: now,
        last_inspected_by: inspector_name || req.user?.username || "Campus Supervisor",
        next_inspection_due_at: next_inspection_due_at || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        inspection_status: status || "VERIFIED_CLEAN",
        hygiene_rating: Number(rating) || 5.0,
        checklist_json: JSON.stringify(checklist || []),
        latest_inspection_remarks: remarks || "Hygiene verified.",
        updated_at: now,
      });

    const logId = uuidv4();
    await db("cleanliness_inspections").insert({
      id: logId,
      institute_id: tenantId,
      zone_id,
      zone_name: zone.name,
      category: zone.category,
      log_type: "INSPECTION",
      action_date: now,
      performed_by: inspector_name || req.user?.username || "Campus Supervisor",
      role: "SUPERVISOR",
      rating: Number(rating) || 5.0,
      status: status || "VERIFIED_CLEAN",
      checklist_results: JSON.stringify(checklist || []),
      next_scheduled_date: next_inspection_due_at,
      remarks: remarks || "Hygiene verified.",
    });

    const updatedZone = await db("cleanliness_zones").where({ id: zone_id }).first();
    res.json({
      success: true,
      message: `Inspection audit recorded for ${zone.name}.`,
      data: updatedZone,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8.5 Get Inspection History & Audit Trail
router.get("/cleanliness/history", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.instituteId || (req.query.institute_id as string) || "1";
    let query = db("cleanliness_inspections");
    if (tenantId && req.user?.role !== "SUPER_ADMIN") {
      query = query.where({ institute_id: tenantId });
    }
    const history = await query.orderBy("action_date", "desc").limit(100);
    const parsed = history.map((h: any) => ({
      ...h,
      checklist_results: typeof h.checklist_results === "string" ? JSON.parse(h.checklist_results || "[]") : (h.checklist_results || []),
    }));
    res.json({ success: true, data: parsed });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8.6 Delete Zone
router.delete("/cleanliness/zones/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await db("cleanliness_zones").where({ id }).delete();
    res.json({ success: true, message: "Facility zone deleted successfully." });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

