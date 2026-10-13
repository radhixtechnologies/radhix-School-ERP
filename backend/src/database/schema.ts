import { Knex } from "knex";

export async function createTables(db: Knex): Promise<void> {
  // 1. Institutes Table (Multi-School Tenants)
  if (!(await db.schema.hasTable("institutes"))) {
    await db.schema.createTable("institutes", (table) => {
      table.string("id").primary();
      table.string("name").notNullable();
      table.string("code").notNullable().unique();
      table.string("institute_type").defaultTo("SCHOOL");
      table.string("email").nullable();
      table.string("phone").nullable();
      table.string("address").nullable();
      table.string("city").nullable();
      table.string("state").nullable();
      table.string("logo_url").nullable();
      table.string("status").defaultTo("ACTIVE"); // "ACTIVE", "INACTIVE", "TRIAL"
      table.integer("student_limit").defaultTo(1500);
      table.integer("staff_limit").defaultTo(100);
      table.string("plan_name").defaultTo("Standard Plan");
      table.date("validity_start").nullable();
      table.date("validity_end").nullable();
      table.text("enabled_modules").defaultTo("[]"); // JSON string
      table.timestamp("created_at").defaultTo(db.fn.now());
      table.timestamp("updated_at").defaultTo(db.fn.now());
    });
  }

  // 2. SaaS Plans Master
  if (!(await db.schema.hasTable("plans"))) {
    await db.schema.createTable("plans", (table) => {
      table.string("id").primary();
      table.string("name").notNullable();
      table.string("tier").notNullable(); // "BASIC", "STANDARD", "PREMIUM"
      table.decimal("price_per_year", 10, 2).defaultTo(0);
      table.integer("student_limit").defaultTo(500);
      table.integer("staff_limit").defaultTo(50);
      table.text("features").defaultTo("[]"); // JSON string
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 3. Users Table (Multi-tenant with institute_id)
  if (!(await db.schema.hasTable("users"))) {
    await db.schema.createTable("users", (table) => {
      table.string("id").primary();
      table.string("institute_id").nullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("username").notNullable().unique();
      table.string("email").nullable();
      table.string("phone").nullable();
      table.string("password_hash").notNullable();
      table.string("role").notNullable(); // SUPER_ADMIN, INSTITUTE_ADMIN, TEACHER, STAFF, STUDENT, PARENT
      table.boolean("is_active").defaultTo(true);
      table.boolean("force_password_change").defaultTo(false);
      table.timestamp("last_login").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 4. Academic Years
  if (!(await db.schema.hasTable("academic_years"))) {
    await db.schema.createTable("academic_years", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("name").notNullable(); // e.g. "2026-2027"
      table.date("start_date").notNullable();
      table.date("end_date").notNullable();
      table.boolean("is_current").defaultTo(true);
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 5. School Classes
  if (!(await db.schema.hasTable("school_classes"))) {
    await db.schema.createTable("school_classes", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("name").notNullable(); // "Class 1", "Class 10"
      table.integer("numeric_order").defaultTo(1);
    });
  }

  // 6. School Sections
  if (!(await db.schema.hasTable("sections"))) {
    await db.schema.createTable("sections", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("class_id").notNullable().references("id").inTable("school_classes").onDelete("CASCADE");
      table.string("name").notNullable(); // "A", "B", "C"
      table.string("room_number").nullable();
      table.string("class_teacher_id").nullable();
    });
  }

  // 7. Subjects Master
  if (!(await db.schema.hasTable("subjects"))) {
    await db.schema.createTable("subjects", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("name").notNullable();
      table.string("code").nullable();
      table.string("class_id").nullable().references("id").inTable("school_classes").onDelete("CASCADE");
      table.string("type").defaultTo("THEORY");
    });
  }

  // 8. Staff / Teacher Profiles
  if (!(await db.schema.hasTable("staff_profiles"))) {
    await db.schema.createTable("staff_profiles", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.string("employee_code").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").defaultTo("");
      table.string("designation").notNullable();
      table.string("department").nullable();
      table.string("phone").nullable();
      table.date("joining_date").nullable();
      table.string("qualification").nullable();
    });
  }

  // 9. Student Profiles
  if (!(await db.schema.hasTable("student_profiles"))) {
    await db.schema.createTable("student_profiles", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
      table.string("admission_number").notNullable();
      table.string("roll_number").nullable();
      table.string("first_name").notNullable();
      table.string("last_name").defaultTo("");
      table.date("dob").nullable();
      table.string("gender").defaultTo("MALE");
      table.string("blood_group").nullable();
      table.string("class_id").nullable().references("id").inTable("school_classes");
      table.string("section_id").nullable().references("id").inTable("sections");
      table.string("parent_name").nullable();
      table.string("parent_phone").nullable();
      table.text("address").nullable();
      table.date("admission_date").nullable();
    });
  }

  // 10. Daily Attendance
  if (!(await db.schema.hasTable("attendance"))) {
    await db.schema.createTable("attendance", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("student_id").notNullable().references("id").inTable("student_profiles").onDelete("CASCADE");
      table.date("date").notNullable();
      table.string("status").notNullable(); // "PRESENT", "ABSENT", "LATE", "HALF_DAY"
      table.string("remarks").nullable();
      table.string("marked_by_staff_id").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 11. Notices & Circulars
  if (!(await db.schema.hasTable("notices"))) {
    await db.schema.createTable("notices", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("title").notNullable();
      table.text("content").notNullable();
      table.string("target_audience").defaultTo("ALL"); // "ALL", "STUDENTS", "STAFF", "PARENTS"
      table.string("category").defaultTo("GENERAL");
      table.string("attachment_url").nullable();
      table.timestamp("published_at").defaultTo(db.fn.now());
      table.string("created_by").nullable();
    });
  }

  // 12. Fee Structures Master
  if (!(await db.schema.hasTable("fee_structures"))) {
    await db.schema.createTable("fee_structures", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("fee_head").notNullable(); // "Tuition Fee", "Transport Fee"
      table.decimal("amount", 10, 2).notNullable();
      table.string("frequency").defaultTo("QUARTERLY");
      table.string("class_id").nullable().references("id").inTable("school_classes");
      table.date("due_date").nullable();
      table.decimal("late_fine_per_day", 10, 2).defaultTo(10.00);
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 13. Student Fee Allocations
  if (!(await db.schema.hasTable("student_fee_allocations"))) {
    await db.schema.createTable("student_fee_allocations", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("student_id").notNullable().references("id").inTable("student_profiles").onDelete("CASCADE");
      table.string("structure_id").notNullable().references("id").inTable("fee_structures").onDelete("CASCADE");
      table.decimal("original_amount", 10, 2).notNullable();
      table.decimal("discount_amount", 10, 2).defaultTo(0.00);
      table.string("concession_reason").nullable();
      table.decimal("fine_amount", 10, 2).defaultTo(0.00);
      table.decimal("net_amount", 10, 2).notNullable();
      table.decimal("paid_amount", 10, 2).defaultTo(0.00);
      table.string("status").defaultTo("PENDING"); // PENDING, PARTIAL, PAID
      table.date("due_date").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 14. Fee Payments & Transaction Ledger
  if (!(await db.schema.hasTable("fee_payments"))) {
    await db.schema.createTable("fee_payments", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("student_id").notNullable().references("id").inTable("student_profiles").onDelete("CASCADE");
      table.string("allocation_id").nullable().references("id").inTable("student_fee_allocations");
      table.decimal("amount_paid", 10, 2).notNullable();
      table.string("payment_mode").notNullable(); // ONLINE_RAZORPAY, CASH, CHEQUE, UPI
      table.string("transaction_id").nullable();
      table.string("receipt_number").notNullable().unique();
      table.string("cheque_number").nullable();
      table.string("bank_name").nullable();
      table.text("remarks").nullable();
      table.string("collected_by").nullable();
      table.timestamp("paid_at").defaultTo(db.fn.now());
    });
  }

  // 15. Homework Diary
  if (!(await db.schema.hasTable("homework"))) {
    await db.schema.createTable("homework", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("class_id").notNullable().references("id").inTable("school_classes");
      table.string("section_id").notNullable().references("id").inTable("sections");
      table.string("teacher_id").nullable().references("id").inTable("staff_profiles");
      table.string("subject_name").notNullable();
      table.string("title").notNullable();
      table.text("description").notNullable();
      table.date("due_date").notNullable();
      table.string("file_attachment").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 16. Homework Submissions
  if (!(await db.schema.hasTable("homework_submissions"))) {
    await db.schema.createTable("homework_submissions", (table) => {
      table.string("id").primary();
      table.string("homework_id").notNullable().references("id").inTable("homework").onDelete("CASCADE");
      table.string("student_id").notNullable().references("id").inTable("student_profiles").onDelete("CASCADE");
      table.string("student_name").notNullable();
      table.text("submission_text").nullable();
      table.string("file_name").nullable();
      table.string("file_url").nullable();
      table.timestamp("submitted_at").defaultTo(db.fn.now());
      table.string("status").defaultTo("SUBMITTED"); // SUBMITTED, CHECKED, REJECTED
      table.text("teacher_remarks").nullable();
      table.integer("marks_obtained").nullable();
    });
  }

  // 17. Exams
  if (!(await db.schema.hasTable("exams"))) {
    await db.schema.createTable("exams", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("class_id").nullable().references("id").inTable("school_classes");
      table.string("name").notNullable(); // e.g. "Term 1 Examination", "Unit Test 1"
      table.string("academic_year").defaultTo("2026-27");
      table.date("start_date").nullable();
      table.date("end_date").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 18. Exam Marks / Results
  if (!(await db.schema.hasTable("exam_marks"))) {
    await db.schema.createTable("exam_marks", (table) => {
      table.string("id").primary();
      table.string("exam_id").notNullable().references("id").inTable("exams").onDelete("CASCADE");
      table.string("student_id").notNullable().references("id").inTable("student_profiles").onDelete("CASCADE");
      table.string("subject_name").notNullable();
      table.decimal("marks_obtained", 5, 2).notNullable();
      table.decimal("max_marks", 5, 2).defaultTo(100);
      table.string("grade").nullable(); // "A+", "A", "B", etc.
      table.string("remarks").nullable();
    });
  }

  // 19. Timetables (Daily periods)
  if (!(await db.schema.hasTable("timetables"))) {
    await db.schema.createTable("timetables", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("class_id").notNullable().references("id").inTable("school_classes");
      table.string("section_id").notNullable().references("id").inTable("sections");
      table.string("day_of_week").notNullable(); // Mon, Tue, Wed, Thu, Fri, Sat
      table.integer("period_number").notNullable();
      table.string("start_time").notNullable();
      table.string("end_time").notNullable();
      table.string("subject_name").notNullable();
      table.string("teacher_name").nullable();
      table.string("room_number").nullable();
    });
  }

  // 20. Teacher Leave Requests
  if (!(await db.schema.hasTable("teacher_leaves"))) {
    await db.schema.createTable("teacher_leaves", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("staff_id").notNullable().references("id").inTable("staff_profiles").onDelete("CASCADE");
      table.string("leave_type").notNullable(); // "CASUAL", "MEDICAL", "MATERNITY", "DUTY"
      table.date("start_date").notNullable();
      table.date("end_date").notNullable();
      table.text("reason").notNullable();
      table.string("status").defaultTo("PENDING"); // PENDING, APPROVED, REJECTED
      table.timestamp("applied_at").defaultTo(db.fn.now());
      table.string("reviewed_by").nullable();
    });
  }

  // 21. Transport & Live Bus Tracking
  if (!(await db.schema.hasTable("transport_routes"))) {
    await db.schema.createTable("transport_routes", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("route_name").notNullable();
      table.string("bus_number").notNullable();
      table.string("driver_name").notNullable();
      table.string("driver_phone").notNullable();
      table.text("stops_json").defaultTo("[]");
      table.decimal("current_lat", 10, 6).defaultTo(28.6139);
      table.decimal("current_lng", 10, 6).defaultTo(77.2090);
      table.string("current_status").defaultTo("ON_ROUTE"); // "ON_ROUTE", "DELAYED", "ARRIVED"
    });
  }

  // 22. Fleet Drivers Registry & Verification
  if (!(await db.schema.hasTable("drivers"))) {
    await db.schema.createTable("drivers", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("name").notNullable();
      table.string("phone").notNullable();
      table.string("alternate_phone").nullable();
      table.string("dob").nullable();
      table.string("blood_group").nullable();
      table.text("address").nullable();
      table.string("aadhaar_number").nullable();
      table.string("license_number").notNullable();
      table.string("license_type").defaultTo("HMV_COMMERCIAL");
      table.string("license_expiry").nullable();
      table.string("badge_number").nullable();
      table.integer("experience_years").defaultTo(0);
      table.string("assigned_bus").nullable();
      table.string("route").nullable();
      table.string("police_verification").defaultTo("VERIFIED"); // VERIFIED, PENDING, UNDER_REVIEW
      table.string("police_station").nullable();
      table.string("police_report_date").nullable();
      table.string("medical_fitness").defaultTo("FIT"); // FIT, PENDING, UNFIT
      table.string("fitness_certificate_no").nullable();
      table.string("fitness_doctor").nullable();
      table.string("status").defaultTo("ACTIVE_DUTY"); // ACTIVE_DUTY, STANDBY, ON_LEAVE, INACTIVE
      table.string("joining_date").nullable();
      table.text("notes").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 23. School Fleet Vehicles & Documentation Registry
  if (!(await db.schema.hasTable("vehicles"))) {
    await db.schema.createTable("vehicles", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("vehicle_number").notNullable();
      table.string("vehicle_model").notNullable();
      table.string("vehicle_type").defaultTo("BUS"); // BUS, MINI_BUS, VAN, CAB
      table.integer("seating_capacity").defaultTo(40);
      table.string("fuel_type").defaultTo("DIESEL"); // DIESEL, CNG, ELECTRIC, PETROL
      table.string("chassis_number").nullable();
      table.string("engine_number").nullable();
      table.string("rc_number").nullable();
      table.string("rc_expiry").nullable();
      table.string("fitness_cert_no").nullable();
      table.string("fitness_expiry").nullable();
      table.string("insurance_policy_no").nullable();
      table.string("insurance_company").nullable();
      table.string("insurance_expiry").nullable();
      table.string("puc_cert_no").nullable();
      table.string("puc_expiry").nullable();
      table.string("permit_number").nullable();
      table.string("permit_expiry").nullable();
      table.boolean("speed_governor_fitted").defaultTo(true);
      table.integer("speed_limit_kmh").defaultTo(40);
      table.string("gps_device_imei").nullable();
      table.boolean("cctv_installed").defaultTo(true);
      table.integer("cctv_camera_count").defaultTo(2);
      table.boolean("fire_extinguisher").defaultTo(true);
      table.boolean("emergency_exit").defaultTo(true);
      table.string("assigned_driver_id").nullable();
      table.string("assigned_driver_name").nullable();
      table.string("assigned_route_id").nullable();
      table.string("assigned_route_name").nullable();
      table.string("status").defaultTo("ACTIVE"); // ACTIVE, MAINTENANCE, STANDBY, OUT_OF_SERVICE
      table.text("notes").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // 24. Admission Inquiries & Leads (For Admission Counsellor)
  if (!(await db.schema.hasTable("admission_inquiries"))) {
    await db.schema.createTable("admission_inquiries", (table) => {
      table.string("id").primary();
      table.string("institute_id").notNullable().references("id").inTable("institutes").onDelete("CASCADE");
      table.string("student_name").notNullable();
      table.string("parent_name").notNullable();
      table.string("phone").notNullable();
      table.string("email").nullable();
      table.string("class_applying").notNullable();
      table.string("source").defaultTo("WALK_IN"); // WALK_IN, WEBSITE, REFERRAL, PHONE
      table.string("status").defaultTo("NEW_INQUIRY"); // NEW_INQUIRY, CAMPUS_VISIT, FORM_SUBMITTED, ENROLLED, CLOSED
      table.string("counsellor_name").defaultTo("Priya Sharma (Senior Counsellor)");
      table.date("follow_up_date").nullable();
      table.text("notes").nullable();
      table.timestamp("created_at").defaultTo(db.fn.now());
    });
  }

  // Ensure extra document & admission columns in student_profiles
  if (await db.schema.hasTable("student_profiles")) {
    const hasFather = await db.schema.hasColumn("student_profiles", "father_name");
    if (!hasFather) {
      await db.schema.table("student_profiles", (table) => {
        table.string("father_name").nullable();
        table.string("mother_name").nullable();
        table.string("father_occupation").nullable();
        table.string("mother_occupation").nullable();
        table.string("student_aadhaar").nullable();
        table.string("admission_type").defaultTo("FRESHER"); // FRESHER, TRANSFER
        table.string("previous_school").nullable();
        table.string("previous_board").nullable();
        table.string("previous_class").nullable();
        table.string("previous_tc_number").nullable();
        table.date("tc_issue_date").nullable();
        table.text("documents_json").defaultTo("[]");
      });
    }
  }

  // Ensure document upload columns in drivers
  if (await db.schema.hasTable("drivers")) {
    const hasLicenseDoc = await db.schema.hasColumn("drivers", "license_document_url");
    if (!hasLicenseDoc) {
      await db.schema.table("drivers", (table) => {
        table.string("license_document_url").nullable();
        table.string("police_cert_url").nullable();
        table.string("medical_cert_url").nullable();
        table.string("badge_document_url").nullable();
      });
    }
  }

  // Ensure document upload columns in vehicles
  if (await db.schema.hasTable("vehicles")) {
    const hasRcDoc = await db.schema.hasColumn("vehicles", "rc_document_url");
    if (!hasRcDoc) {
      await db.schema.table("vehicles", (table) => {
        table.string("rc_document_url").nullable();
        table.string("insurance_document_url").nullable();
        table.string("fitness_document_url").nullable();
        table.string("puc_document_url").nullable();
        table.string("permit_document_url").nullable();
      });
    }
  }
}



