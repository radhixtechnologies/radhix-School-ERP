import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "./connection";
import { createTables } from "./schema";

export async function runSeed(): Promise<void> {
  console.log("Creating database tables if not existing...");
  await createTables(db);

  const existingSuperAdmin = await db("users").where({ username: "superadmin@radhix.com" }).first();
  if (existingSuperAdmin) {
    console.log("Seed data already present. Checking drivers, vehicles, counsellor, leaves, finance, and online classes...");
    await seedDriversIfEmpty();
    await seedVehiclesIfEmpty();
    await seedCounsellorIfEmpty();
    await seedLeavesAndSubstitutionIfEmpty();
    await seedSalariesIfEmpty();
    await seedTransportExpensesIfEmpty();
    await seedOnlineClassesIfEmpty();
    await seedFeesIfEmpty();
    await seedCleanlinessIfEmpty();
    return;
  }


  console.log("Seeding fresh demo data for Radhix Multi-Vendor School ERP SaaS Platform...");

  const hashPassword = (pw: string) => bcrypt.hashSync(pw, 10);

  // 1. Super Admin (Platform Owner)
  const superAdminId = uuidv4();
  await db("users").insert({
    id: superAdminId,
    institute_id: null,
    username: "superadmin@radhix.com",
    email: "superadmin@radhix.com",
    phone: "9876543210",
    password_hash: hashPassword("Admin@123"),
    role: "SUPER_ADMIN",
    is_active: true,
    force_password_change: false,
  });

  // 2. SaaS Plans (Matching user screenshot: Basic ₹2,000, Standard ₹5,000, Premium ₹10,000 per month)
  const plans = [
    {
      id: uuidv4(),
      name: "Basic Plan",
      tier: "BASIC",
      price_per_year: 24000, // ₹2,000/month
      student_limit: 300,
      staff_limit: 25,
      features: JSON.stringify(["Admissions", "Student & Teacher Mgmt", "Daily Attendance", "Timetable", "Notices"]),
    },
    {
      id: uuidv4(),
      name: "Standard Plan",
      tier: "STANDARD",
      price_per_year: 60000, // ₹5,000/month
      student_limit: 1500,
      staff_limit: 80,
      features: JSON.stringify(["Basic Features", "Online Fees (Razorpay)", "Exams & Marksheets", "Homework Diary", "Parent & Student Mobile App", "SMS/Push Notifications"]),
    },
    {
      id: uuidv4(),
      name: "Premium Plan",
      tier: "PREMIUM",
      price_per_year: 120000, // ₹10,000/month
      student_limit: 5000,
      staff_limit: 250,
      features: JSON.stringify(["All Standard Features", "Live GPS Bus Tracking", "Teacher Mobile App", "Salary & Expense Accounting", "Custom Branding", "Priority Support"]),
    },
  ];
  await db("plans").insert(plans);

  // 3. School 1: Delhi Public Academy (New Delhi) - Standard Plan
  const school1Id = uuidv4();
  await db("institutes").insert({
    id: school1Id,
    name: "Delhi Public Academy",
    code: "DPA101",
    institute_type: "SCHOOL",
    email: "principal@dpa.edu.in",
    phone: "011-23456789",
    address: "Sector 14, Institutional Area, Rohini",
    city: "New Delhi",
    state: "Delhi",
    logo_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=128&q=80",
    status: "ACTIVE",
    student_limit: 1500,
    staff_limit: 80,
    plan_name: "Standard Plan",
    validity_start: "2026-04-01",
    validity_end: "2027-03-31",
    enabled_modules: JSON.stringify(["attendance", "homework", "fees", "exams", "notices", "transport"]),
  });

  // School 2: St. Xavier's International School (Mumbai) - Premium Plan
  const school2Id = uuidv4();
  await db("institutes").insert({
    id: school2Id,
    name: "St. Xavier's International School",
    code: "SXS202",
    institute_type: "SCHOOL",
    email: "contact@stxaviersmumbai.org",
    phone: "022-87654321",
    address: "CST Road, Fort",
    city: "Mumbai",
    state: "Maharashtra",
    logo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",
    status: "ACTIVE",
    student_limit: 5000,
    staff_limit: 250,
    plan_name: "Premium Plan",
    validity_start: "2026-01-01",
    validity_end: "2026-12-31",
    enabled_modules: JSON.stringify(["attendance", "homework", "fees", "exams", "notices", "transport", "gps_tracking"]),
  });

  // School 3: Greenwood Public School (Bengaluru) - Basic Plan
  const school3Id = uuidv4();
  await db("institutes").insert({
    id: school3Id,
    name: "Greenwood Public School",
    code: "GPS303",
    institute_type: "SCHOOL",
    email: "info@greenwoodblr.edu.in",
    phone: "080-22334455",
    address: "Sarjapur Road, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    logo_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=128&q=80",
    status: "ACTIVE",
    student_limit: 300,
    staff_limit: 25,
    plan_name: "Basic Plan",
    validity_start: "2026-06-01",
    validity_end: "2027-05-31",
    enabled_modules: JSON.stringify(["attendance", "homework", "notices"]),
  });

  // 4. Users for Delhi Public Academy:
  // 4.1 Principal / School Admin
  const schoolAdminId = uuidv4();
  await db("users").insert({
    id: schoolAdminId,
    institute_id: school1Id,
    username: "schooladmin@radhix.com",
    email: "schooladmin@radhix.com",
    phone: "9811122233",
    password_hash: hashPassword("School@123"),
    role: "INSTITUTE_ADMIN",
    is_active: true,
    force_password_change: false,
  });

  // 4.2 School Classes & Sections
  const class10Id = uuidv4();
  await db("school_classes").insert({
    id: class10Id,
    institute_id: school1Id,
    name: "Class 10",
    numeric_order: 10,
  });

  const secAId = uuidv4();
  await db("sections").insert({
    id: secAId,
    institute_id: school1Id,
    class_id: class10Id,
    name: "A",
    room_number: "Room 302",
  });

  const class9Id = uuidv4();
  await db("school_classes").insert({
    id: class9Id,
    institute_id: school1Id,
    name: "Class 9",
    numeric_order: 9,
  });

  const secBId = uuidv4();
  await db("sections").insert({
    id: secBId,
    institute_id: school1Id,
    class_id: class9Id,
    name: "A",
    room_number: "Room 201",
  });

  // 4.3 Teacher User
  const teacherUserId = uuidv4();
  await db("users").insert({
    id: teacherUserId,
    institute_id: school1Id,
    username: "teacher@school.com",
    email: "teacher@school.com",
    phone: "9822233344",
    password_hash: hashPassword("Teacher@123"),
    role: "TEACHER",
    is_active: true,
  });

  const teacherStaffId = uuidv4();
  await db("staff_profiles").insert({
    id: teacherStaffId,
    institute_id: school1Id,
    user_id: teacherUserId,
    employee_code: "TCH-101",
    first_name: "Sunita",
    last_name: "Sharma",
    designation: "Class Teacher (10-A) & Senior Science Faculty",
    department: "Science",
    phone: "9822233344",
    joining_date: "2024-07-01",
    qualification: "M.Sc. Physics, B.Ed.",
  });

  // 4.4 Student User
  const studentUserId = uuidv4();
  await db("users").insert({
    id: studentUserId,
    institute_id: school1Id,
    username: "DPS-2026-001",
    email: "dps.student@radhix.com",
    phone: "9833344455",
    password_hash: hashPassword("Student@123"),
    role: "STUDENT",
    is_active: true,
  });

  const studentProfileId = uuidv4();
  await db("student_profiles").insert({
    id: studentProfileId,
    institute_id: school1Id,
    user_id: studentUserId,
    admission_number: "DPS-2026-001",
    roll_number: "12",
    first_name: "Aarav",
    last_name: "Kumar",
    dob: "2010-08-15",
    gender: "MALE",
    blood_group: "O+",
    class_id: class10Id,
    section_id: secAId,
    parent_name: "Ramesh Kumar",
    parent_phone: "9844455566",
    address: "H-42, Vasant Vihar, New Delhi",
    admission_date: "2026-04-05",
  });

  // 4.5 Parent User
  const parentUserId = uuidv4();
  await db("users").insert({
    id: parentUserId,
    institute_id: school1Id,
    username: "parent@school.com",
    email: "parent@school.com",
    phone: "9844455566",
    password_hash: hashPassword("Parent@123"),
    role: "PARENT",
    is_active: true,
  });

  // Additional demo students for class 10-A
  const demoStudents = [
    { roll: "01", name: "Aanya", last: "Verma", adm: "DPS-2026-002" },
    { roll: "02", name: "Anik", last: "Sen", adm: "DPS-2026-003" },
    { roll: "03", name: "Dev", last: "Malhotra", adm: "DPS-2026-004" },
    { roll: "04", name: "Diya", last: "Singh", adm: "DPS-2026-005" },
    { roll: "05", name: "Ishaan", last: "Gupta", adm: "DPS-2026-006" },
    { roll: "06", name: "Kavya", last: "Joshi", adm: "DPS-2026-007" },
    { roll: "07", name: "Manav", last: "Chopra", adm: "DPS-2026-008" },
    { roll: "08", name: "Nitya", last: "Reddy", adm: "DPS-2026-009" },
    { roll: "09", name: "Pranav", last: "Deshmukh", adm: "DPS-2026-010" },
    { roll: "10", name: "Riya", last: "Mishra", adm: "DPS-2026-011" },
    { roll: "11", name: "Rohan", last: "Mehta", adm: "DPS-2026-012" },
  ];

  for (const s of demoStudents) {
    const sUid = uuidv4();
    await db("users").insert({
      id: sUid,
      institute_id: school1Id,
      username: s.adm,
      email: `${s.name.toLowerCase()}@dpa.edu.in`,
      phone: "98000" + Math.floor(10000 + Math.random() * 90000),
      password_hash: hashPassword("Student@123"),
      role: "STUDENT",
      is_active: true,
    });
    await db("student_profiles").insert({
      id: uuidv4(),
      institute_id: school1Id,
      user_id: sUid,
      admission_number: s.adm,
      roll_number: s.roll,
      first_name: s.name,
      last_name: s.last,
      dob: "2010-05-10",
      gender: s.roll === "01" || s.roll === "04" || s.roll === "06" || s.roll === "08" || s.roll === "10" ? "FEMALE" : "MALE",
      class_id: class10Id,
      section_id: secAId,
      parent_name: `${s.last} Guardian`,
      parent_phone: "98111" + Math.floor(10000 + Math.random() * 90000),
      address: "New Delhi",
      admission_date: "2026-04-05",
    });
  }

  // 5. Fee Structures & Allocations
  const feeStruct1Id = uuidv4();
  await db("fee_structures").insert({
    id: feeStruct1Id,
    institute_id: school1Id,
    fee_head: "Term 1 Tuition Fee",
    amount: 12000,
    frequency: "QUARTERLY",
    class_id: class10Id,
    due_date: "2026-10-31",
  });

  const feeStruct2Id = uuidv4();
  await db("fee_structures").insert({
    id: feeStruct2Id,
    institute_id: school1Id,
    fee_head: "Bus Transport Fee (Q1)",
    amount: 4500,
    frequency: "QUARTERLY",
    class_id: class10Id,
    due_date: "2026-10-31",
  });

  const allocId = uuidv4();
  await db("student_fee_allocations").insert({
    id: allocId,
    institute_id: school1Id,
    student_id: studentProfileId,
    structure_id: feeStruct2Id,
    original_amount: 4500,
    discount_amount: 0,
    fine_amount: 0,
    net_amount: 4500,
    paid_amount: 0,
    status: "PENDING",
    due_date: "2026-10-31",
  });

  // Recorded previous payment for tuition fee
  await db("fee_payments").insert({
    id: uuidv4(),
    institute_id: school1Id,
    student_id: studentProfileId,
    allocation_id: null,
    amount_paid: 12000,
    payment_mode: "ONLINE_RAZORPAY",
    transaction_id: "pay_rzp_demo_98231",
    receipt_number: "RCPT-2026-0104",
    remarks: "Term 1 Tuition Fee paid online via Razorpay",
    collected_by: "Razorpay Gateway",
  });

  // 6. Homework Diary
  await db("homework").insert([
    {
      id: uuidv4(),
      institute_id: school1Id,
      class_id: class10Id,
      section_id: secAId,
      teacher_id: teacherStaffId,
      subject_name: "Physics",
      title: "Ray Optics & Mirror Formula Numerical",
      description: "Solve NCERT Chapter 10 Questions 1 to 15 in homework notebook. Draw ray diagrams neatly with pencil.",
      due_date: "2026-10-14",
    },
    {
      id: uuidv4(),
      institute_id: school1Id,
      class_id: class10Id,
      section_id: secAId,
      teacher_id: teacherStaffId,
      subject_name: "Mathematics",
      title: "Quadratic Equations Exercise 4.3",
      description: "Complete all word problems based on speed, distance and time.",
      due_date: "2026-10-15",
    },
    {
      id: uuidv4(),
      institute_id: school1Id,
      class_id: class10Id,
      section_id: secAId,
      teacher_id: teacherStaffId,
      subject_name: "English Literature",
      title: "First Flight: Letter to God",
      description: "Write character sketch of Lencho and answer long answer questions in 120 words.",
      due_date: "2026-10-16",
    },
  ]);

  // 7. Exams & Marksheets
  const examId = uuidv4();
  await db("exams").insert({
    id: examId,
    institute_id: school1Id,
    class_id: class10Id,
    name: "Term 1 Mid-Term Examination",
    academic_year: "2026-27",
    start_date: "2026-09-15",
    end_date: "2026-09-25",
  });

  await db("exam_marks").insert([
    {
      id: uuidv4(),
      exam_id: examId,
      student_id: studentProfileId,
      subject_name: "English",
      marks_obtained: 88,
      max_marks: 100,
      grade: "A",
      remarks: "Excellent comprehension & essay writing",
    },
    {
      id: uuidv4(),
      exam_id: examId,
      student_id: studentProfileId,
      subject_name: "Mathematics",
      marks_obtained: 94,
      max_marks: 100,
      grade: "A+",
      remarks: "Outstanding problem solving skills",
    },
    {
      id: uuidv4(),
      exam_id: examId,
      student_id: studentProfileId,
      subject_name: "Science (Physics & Chem)",
      marks_obtained: 91,
      max_marks: 100,
      grade: "A+",
      remarks: "Very strong conceptual grasp",
    },
    {
      id: uuidv4(),
      exam_id: examId,
      student_id: studentProfileId,
      subject_name: "Social Science",
      marks_obtained: 85,
      max_marks: 100,
      grade: "A",
      remarks: "Good understanding of map work and history",
    },
    {
      id: uuidv4(),
      exam_id: examId,
      student_id: studentProfileId,
      subject_name: "Computer Applications",
      marks_obtained: 96,
      max_marks: 100,
      grade: "A+",
      remarks: "Exceptional coding & logic",
    },
  ]);

  // 8. Timetable periods for Class 10-A
  const periods = [
    { day: "Mon", num: 1, start: "08:30 AM", end: "09:15 AM", subject: "English Literature", room: "302" },
    { day: "Mon", num: 2, start: "09:15 AM", end: "10:00 AM", subject: "Mathematics", room: "302" },
    { day: "Mon", num: 3, start: "10:00 AM", end: "10:45 AM", subject: "Physics (Theory)", room: "Physics Lab" },
    { day: "Mon", num: 4, start: "11:00 AM", end: "11:45 AM", subject: "Chemistry", room: "Chem Lab" },
    { day: "Mon", num: 5, start: "11:45 AM", end: "12:30 PM", subject: "Social Science", room: "302" },
    { day: "Mon", num: 6, start: "01:00 PM", end: "01:45 PM", subject: "Physical Education", room: "Playground" },
  ];
  for (const p of periods) {
    await db("timetables").insert({
      id: uuidv4(),
      institute_id: school1Id,
      class_id: class10Id,
      section_id: secAId,
      day_of_week: p.day,
      period_number: p.num,
      start_time: p.start,
      end_time: p.end,
      subject_name: p.subject,
      teacher_name: "Sunita Sharma",
      room_number: p.room,
    });
  }

  // 9. Transport Route
  await db("transport_routes").insert({
    id: uuidv4(),
    institute_id: school1Id,
    route_name: "Route #12 (Rohini - Pitampura - Vasant Vihar)",
    bus_number: "DL-1PB-4521",
    driver_name: "Mukesh Kumar",
    driver_phone: "9871234567",
    stops_json: JSON.stringify([
      { name: "Rohini Sector 14 School Gate", time: "07:15 AM", status: "PASSED" },
      { name: "Madhuban Chowk Metro", time: "07:35 AM", status: "PASSED" },
      { name: "Pitampura Club", time: "07:50 AM", status: "PASSED" },
      { name: "Dhaula Kuan Junction", time: "08:05 AM", status: "CURRENT" },
      { name: "Vasant Vihar H-Block (Aarav Stop)", time: "08:18 AM", status: "UPCOMING" },
    ]),
    current_lat: 28.5912,
    current_lng: 77.1624,
    current_status: "ON_ROUTE",
  });

  // 10. Notices & Circulars
  await db("notices").insert([
    {
      id: uuidv4(),
      institute_id: school1Id,
      title: "Annual Sports Day 2026 Selection Trials",
      content: "Selection trials for Athletics, Badminton, and Football will be conducted on 18th Oct from 8:30 AM on the main school ground. All interested students must register with physical education teachers.",
      target_audience: "ALL",
      category: "EVENT",
      published_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      institute_id: school1Id,
      title: "Parent-Teacher Meeting (PTM) for Term 1",
      content: "Term 1 PTM will be held on Saturday, 24th Oct from 9:00 AM to 1:00 PM. Parents are requested to adhere to their allotted time slots to discuss academic progress and report cards.",
      target_audience: "PARENTS",
      category: "GENERAL",
      published_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      institute_id: school1Id,
      title: "Diwali Vacation Schedule Announced",
      content: "The school will remain closed for Diwali festivities from 28th October to 3rd November 2026. Regular classes will resume on 4th November.",
      target_audience: "ALL",
      category: "HOLIDAY",
      published_at: new Date().toISOString(),
    },
  ]);

  // Seed Drivers & Vehicles
  await seedDriversIfEmpty(school1Id);
  await seedVehiclesIfEmpty(school1Id);

  console.log("Seeding finished successfully!");
}


export async function seedDriversIfEmpty(instId?: string): Promise<void> {
  const count = await db("drivers").count("id as count").first();
  if (Number(count?.count || 0) > 0) return;

  const firstInst = await db("institutes").first();
  if (!firstInst) {
    console.log("No institute found to attach drivers. Skipping...");
    return;
  }
  const targetInstituteId = instId || firstInst.id;
  console.log(`Seeding verified school drivers registry for institute: ${targetInstituteId}...`);


  await db("drivers").insert([
    {
      id: uuidv4(),
      institute_id: targetInstituteId,
      name: "Mukesh Kumar",
      phone: "+91 98712 34567",
      alternate_phone: "+91 98110 99881",
      dob: "1984-05-12",
      blood_group: "B+ve",
      address: "H-42, Sector 15, Rohini, New Delhi - 110085",
      aadhaar_number: "4829-1920-5512",
      license_number: "DL-14-2018-HMV-8821",
      license_type: "HMV_COMMERCIAL",
      license_expiry: "2029-12-24",
      badge_number: "PSV-DEL-77821",
      experience_years: 9,
      assigned_bus: "DL-1PB-4521 (Bus #12)",
      route: "Rohini - Pitampura - Vasant Vihar",
      police_verification: "VERIFIED",
      police_station: "North Rohini Police Station",
      police_report_date: "2026-01-14",
      medical_fitness: "FIT",
      fitness_certificate_no: "CMO-ND-2026-9081",
      fitness_doctor: "Dr. A. K. Verma (CMO)",
      status: "ACTIVE_DUTY",
      joining_date: "2021-04-01",
      notes: "Clean driving record. Zero traffic violations or rash driving reports.",
    },
    {
      id: uuidv4(),
      institute_id: targetInstituteId,
      name: "Rajender Pal",
      phone: "+91 98123 45678",
      alternate_phone: "+91 98120 77665",
      dob: "1980-11-20",
      blood_group: "O+ve",
      address: "Pocket 2, DDA Flats, Dwarka Sector 6, New Delhi - 110075",
      aadhaar_number: "6124-7781-3342",
      license_number: "DL-14-2016-HMV-3310",
      license_type: "HMV_COMMERCIAL",
      license_expiry: "2028-10-15",
      badge_number: "PSV-DEL-44109",
      experience_years: 12,
      assigned_bus: "DL-1PB-2849 (Bus #07)",
      route: "Dwarka Sector 6 - Janakpuri - Campus",
      police_verification: "VERIFIED",
      police_station: "Dwarka South Police Station",
      police_report_date: "2026-02-02",
      medical_fitness: "FIT",
      fitness_certificate_no: "CMO-SW-2026-3314",
      fitness_doctor: "Dr. P. S. Chauhan",
      status: "ACTIVE_DUTY",
      joining_date: "2019-07-15",
      notes: "Senior driver with excellent defensive driving skills. First-aid certified.",
    },
    {
      id: uuidv4(),
      institute_id: targetInstituteId,
      name: "Surendra Singh",
      phone: "+91 98450 11223",
      alternate_phone: "+91 98450 99882",
      dob: "1988-08-04",
      blood_group: "A+ve",
      address: "C-18, Kotla Mubarakpur, South Extension, New Delhi - 110003",
      aadhaar_number: "8821-3401-9902",
      license_number: "DL-14-2020-HMV-5541",
      license_type: "HMV_COMMERCIAL",
      license_expiry: "2030-05-30",
      badge_number: "PSV-DEL-90123",
      experience_years: 7,
      assigned_bus: "DL-1PB-9912 (Bus #04)",
      route: "South Extension - Lajpat Nagar - Campus",
      police_verification: "VERIFIED",
      police_station: "Defence Colony Police Station",
      police_report_date: "2026-03-10",
      medical_fitness: "FIT",
      fitness_certificate_no: "CMO-SE-2026-8821",
      fitness_doctor: "Dr. Meenakshi Sundaram",
      status: "STANDBY",
      joining_date: "2022-09-01",
      notes: "Relief and standby bus driver. Certified in fire-safety extinguisher handling.",
    },
  ]);
  console.log("Seeded 3 verified drivers successfully.");
}


export async function seedVehiclesIfEmpty(instId?: string): Promise<void> {
  const count = await db("vehicles").count("id as count").first();
  if (Number(count?.count || 0) > 0) return;

  const firstInst = await db("institutes").first();
  if (!firstInst) return;
  const targetInstituteId = instId || firstInst.id;

  console.log(`Seeding verified school fleet vehicles for institute: ${targetInstituteId}...`);

  await db("vehicles").insert([
    {
      id: uuidv4(),
      institute_id: targetInstituteId,
      vehicle_number: "DL-1PB-4521",
      vehicle_model: "Tata Marcopolo Starbus Ultra (42-Seater)",
      vehicle_type: "BUS",
      seating_capacity: 42,
      fuel_type: "DIESEL",
      chassis_number: "MAT4521098DEL88192",
      engine_number: "ENG497TC551029",
      rc_number: "DL-1PB-4521",
      rc_expiry: "2034-03-20",
      fitness_cert_no: "RTO-DL-FIT-9921",
      fitness_expiry: "2027-04-15",
      insurance_policy_no: "HDFC-COMM-8829102",
      insurance_company: "HDFC ERGO General Insurance",
      insurance_expiry: "2027-05-10",
      puc_cert_no: "PUC-DL-2026-4412",
      puc_expiry: "2026-11-20",
      permit_number: "DL-STAGE-CARRIAGE-8812",
      permit_expiry: "2029-08-14",
      speed_governor_fitted: true,
      speed_limit_kmh: 40,
      gps_device_imei: "864902048819201",
      cctv_installed: true,
      cctv_camera_count: 4,
      fire_extinguisher: true,
      emergency_exit: true,
      assigned_driver_name: "Mukesh Kumar",
      assigned_route_name: "Route #12 (Rohini - Pitampura - Vasant Vihar)",
      status: "ACTIVE",
      notes: "School safety certified. Equipped with child-check alarm and first aid kit.",
    },
    {
      id: uuidv4(),
      institute_id: targetInstituteId,
      vehicle_number: "DL-1PB-2849",
      vehicle_model: "Ashok Leyland Sunshine (38-Seater)",
      vehicle_type: "BUS",
      seating_capacity: 38,
      fuel_type: "CNG",
      chassis_number: "MB12849DEL7719002",
      engine_number: "HINO-CNG-882910",
      rc_number: "DL-1PB-2849",
      rc_expiry: "2033-09-12",
      fitness_cert_no: "RTO-DL-FIT-4412",
      fitness_expiry: "2027-02-18",
      insurance_policy_no: "ICICI-LOMB-7729101",
      insurance_company: "ICICI Lombard",
      insurance_expiry: "2027-03-15",
      puc_cert_no: "PUC-DL-2026-8819",
      puc_expiry: "2026-12-05",
      permit_number: "DL-STAGE-CARRIAGE-3310",
      permit_expiry: "2028-11-20",
      speed_governor_fitted: true,
      speed_limit_kmh: 40,
      gps_device_imei: "864902049912084",
      cctv_installed: true,
      cctv_camera_count: 4,
      fire_extinguisher: true,
      emergency_exit: true,
      assigned_driver_name: "Rajender Pal",
      assigned_route_name: "Route #07 (Dwarka Sector 6 - Janakpuri - Campus)",
      status: "ACTIVE",
      notes: "Anti-skid flooring, low step height for junior students.",
    },
    {
      id: uuidv4(),
      institute_id: targetInstituteId,
      vehicle_number: "DL-1PB-9912",
      vehicle_model: "Eicher Skyline Pro 3009 (34-Seater)",
      vehicle_type: "BUS",
      seating_capacity: 34,
      fuel_type: "DIESEL",
      chassis_number: "MC29912DEL3381920",
      engine_number: "E483-TCIC-902194",
      rc_number: "DL-1PB-9912",
      rc_expiry: "2035-01-10",
      fitness_cert_no: "RTO-DL-FIT-2201",
      fitness_expiry: "2027-06-30",
      insurance_policy_no: "TATA-AIG-9910291",
      insurance_company: "TATA AIG General Insurance",
      insurance_expiry: "2027-07-22",
      puc_cert_no: "PUC-DL-2026-7721",
      puc_expiry: "2026-10-28",
      permit_number: "DL-STAGE-CARRIAGE-5541",
      permit_expiry: "2030-01-15",
      speed_governor_fitted: true,
      speed_limit_kmh: 40,
      gps_device_imei: "864902043301928",
      cctv_installed: true,
      cctv_camera_count: 2,
      fire_extinguisher: true,
      emergency_exit: true,
      assigned_driver_name: "Surendra Singh",
      assigned_route_name: "Route #04 (South Extension - Lajpat Nagar - Campus)",
      status: "ACTIVE",
      notes: "Full air-conditioned bus. GPS & panic buttons operational.",
    },
    {
      id: uuidv4(),
      institute_id: targetInstituteId,
      vehicle_number: "DL-1VB-3319",
      vehicle_model: "Force Traveller 3700 Super (22-Seater)",
      vehicle_type: "MINI_BUS",
      seating_capacity: 22,
      fuel_type: "CNG",
      chassis_number: "FT3319DEL4410912",
      engine_number: "FM26CR-881920",
      rc_number: "DL-1VB-3319",
      rc_expiry: "2032-11-04",
      fitness_cert_no: "RTO-DL-FIT-1109",
      fitness_expiry: "2027-01-12",
      insurance_policy_no: "BAJAJ-ALLZ-4410928",
      insurance_company: "Bajaj Allianz",
      insurance_expiry: "2027-02-28",
      puc_cert_no: "PUC-DL-2026-3391",
      puc_expiry: "2026-11-15",
      permit_number: "DL-SPECIAL-PERMIT-4412",
      permit_expiry: "2029-05-18",
      speed_governor_fitted: true,
      speed_limit_kmh: 40,
      gps_device_imei: "864902047712301",
      cctv_installed: true,
      cctv_camera_count: 2,
      fire_extinguisher: true,
      emergency_exit: true,
      assigned_driver_name: "Relief Driver Pool",
      assigned_route_name: "Mayur Vihar - Preet Vihar (Special Route)",
      status: "STANDBY",
      notes: "Used for emergency breakdown support and teacher tours.",
    },
  ]);
  console.log("Seeded 4 verified school fleet vehicles successfully.");
}

async function seedCounsellorIfEmpty(): Promise<void> {
  const dpa = await db("institutes").where({ code: "DPA101" }).first();
  const targetInstituteId = dpa ? dpa.id : (await db("institutes").first())?.id;
  if (!targetInstituteId) return;

  // 1. Seed Counsellor User
  const existingCounsellor = await db("users").where({ username: "counsellor@radhix.com" }).first();
  if (!existingCounsellor) {
    await db("users").insert({
      id: uuidv4(),
      institute_id: targetInstituteId,
      username: "counsellor@radhix.com",
      email: "counsellor@radhix.com",
      phone: "9876501234",
      password_hash: bcrypt.hashSync("Counsellor@123", 10),
      role: "ADMISSION_COUNSELLOR",
      is_active: true,
      force_password_change: false,
    });
    console.log("Seeded Admission Counsellor user: counsellor@radhix.com / Counsellor@123");
  }

  // 2. Seed initial inquiries
  if (await db.schema.hasTable("admission_inquiries")) {
    const existingInquiries = await db("admission_inquiries").where({ institute_id: targetInstituteId }).count("id as count").first();
    if (!existingInquiries || Number(existingInquiries.count) === 0) {
      await db("admission_inquiries").insert([
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_name: "Reyansh Gupta",
          parent_name: "Amit Gupta",
          phone: "+91 98112 34567",
          email: "amit.gupta@gmail.com",
          class_applying: "Class 1",
          source: "WALK_IN",
          status: "CAMPUS_VISIT",
          counsellor_name: "Priya Sharma (Senior Counsellor)",
          follow_up_date: "2026-10-15",
          notes: "Parents visited campus, interested in CBSE curriculum, digital smart classes and school bus facility.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_name: "Ananya Saxena",
          parent_name: "Deepak Saxena",
          phone: "+91 98711 22334",
          email: "deepak.saxena@outlook.com",
          class_applying: "Class 6",
          source: "WEBSITE",
          status: "NEW_INQUIRY",
          counsellor_name: "Priya Sharma (Senior Counsellor)",
          follow_up_date: "2026-10-14",
          notes: "Inquiry submitted through website for mid-term transfer. Requires bus route information.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_name: "Kabir Malhotra",
          parent_name: "Sunil Malhotra",
          phone: "+91 98230 44556",
          email: "sunil.m@gmail.com",
          class_applying: "Pre-Primary (KG)",
          source: "PHONE",
          status: "FORM_SUBMITTED",
          counsellor_name: "Priya Sharma (Senior Counsellor)",
          follow_up_date: "2026-10-16",
          notes: "Fresher admission. Submitted birth certificate and Aadhaar. Fee discussion pending.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_name: "Myra Kapoor",
          parent_name: "Vikram Kapoor",
          phone: "+91 98450 66778",
          email: "vikram.kapoor@yahoo.com",
          class_applying: "Class 9",
          source: "REFERRAL",
          status: "ENROLLED",
          counsellor_name: "Priya Sharma (Senior Counsellor)",
          follow_up_date: "2026-10-10",
          notes: "Admission confirmed with TC from DPS Ghaziabad. Enrolled into Class 9-A.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_name: "Advait Singhal",
          parent_name: "Rajesh Singhal",
          phone: "+91 98101 88990",
          email: "rajesh.singhal@gmail.com",
          class_applying: "Class 10",
          source: "WALK_IN",
          status: "CAMPUS_VISIT",
          counsellor_name: "Priya Sharma (Senior Counsellor)",
          follow_up_date: "2026-10-18",
          notes: "Science stream query with laboratory tour completed.",
        },
      ]);
      console.log("Seeded 5 initial admission inquiries for Admission Counsellor.");
    }
  }
}

async function ensureTeachersExist(instituteId: string): Promise<any[]> {
  const demoTeachers = [
    {
      email: "teacher@school.com",
      first_name: "Sunita",
      last_name: "Sharma",
      emp_code: "TCH-101",
      designation: "Senior Mathematics PGT",
      department: "Academics",
    },
    {
      email: "ramesh.verma@school.com",
      first_name: "Ramesh",
      last_name: "Verma",
      emp_code: "TCH-102",
      designation: "Physics & Science HOD",
      department: "Science",
    },
    {
      email: "neha.gupta@school.com",
      first_name: "Neha",
      last_name: "Gupta",
      emp_code: "TCH-103",
      designation: "English TGT Faculty",
      department: "Languages",
    },
  ];

  for (const dt of demoTeachers) {
    const existing = await db("staff_profiles")
      .where({ institute_id: instituteId, first_name: dt.first_name, last_name: dt.last_name })
      .first();

    if (!existing) {
      const user = await db("users").where({ username: dt.email }).first();
      const userId = user ? user.id : uuidv4();
      if (!user) {
        await db("users").insert({
          id: userId,
          institute_id: instituteId,
          username: dt.email,
          email: dt.email,
          phone: "9811223344",
          password_hash: bcrypt.hashSync("Teacher@123", 10),
          role: "TEACHER",
          is_active: true,
        });
      }
      await db("staff_profiles").insert({
        id: uuidv4(),
        institute_id: instituteId,
        user_id: userId,
        employee_code: dt.emp_code,
        first_name: dt.first_name,
        last_name: dt.last_name,
        designation: dt.designation,
        department: dt.department,
        phone: "9811223344",
        joining_date: "2024-07-01",
        qualification: "M.Sc., B.Ed.",
      });
    }
  }

  return await db("staff_profiles").where({ institute_id: instituteId });
}

async function seedLeavesAndSubstitutionIfEmpty(): Promise<void> {
  const school = await db("institutes").where({ code: "DPA101" }).first();
  const targetInstituteId = school ? school.id : "1";

  if (await db.schema.hasTable("teacher_leaves")) {
    const existing = await db("teacher_leaves").where({ institute_id: targetInstituteId }).count("id as count").first();
    if (!existing || Number(existing.count) === 0) {
      const staffList = await ensureTeachersExist(targetInstituteId);
      const teacher1 = staffList[0];
      const teacher2 = staffList[1] || staffList[0];
      const teacher3 = staffList[2] || staffList[0];

      await db("teacher_leaves").insert([
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          staff_id: teacher1.id,
          leave_type: "MEDICAL",
          start_date: "2026-10-20",
          end_date: "2026-10-22",
          reason: "High viral fever and physician recommended complete bed rest.",
          status: "APPROVED",
          substitute_staff_id: teacher2.id,
          substitute_name: `${teacher2.first_name} ${teacher2.last_name || ""}`.trim(),
          substitution_notes: "Assigned to cover Class 10-A Mathematics Period 2 & Period 4, and Class 9-B Geometry.",
          admin_remarks: "Approved by Principal. Proxy duty assigned and substitute teacher notified.",
          approved_at: new Date().toISOString(),
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          staff_id: teacher3.id,
          leave_type: "CASUAL",
          start_date: "2026-10-24",
          end_date: "2026-10-25",
          reason: "Attending sister's wedding ceremony out of town.",
          status: "PENDING",
          substitute_staff_id: null,
          substitute_name: null,
          substitution_notes: null,
          admin_remarks: null,
          approved_at: null,
        },
      ]);
      console.log("Seeded initial teacher leaves and substitution proxy records.");
    }
  }
}

async function seedSalariesIfEmpty(): Promise<void> {
  const school = await db("institutes").where({ code: "DPA101" }).first();
  const targetInstituteId = school ? school.id : "1";

  if (await db.schema.hasTable("staff_salaries")) {
    const existing = await db("staff_salaries").where({ institute_id: targetInstituteId }).count("id as count").first();
    if (!existing || Number(existing.count) === 0) {
      const staffList = await ensureTeachersExist(targetInstituteId);
      const currentMonth = "October 2026";

      const salaryRecords = [
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          staff_id: staffList[0].id,
          staff_name: `${staffList[0].first_name} ${staffList[0].last_name || ""}`.trim(),
          designation: staffList[0].designation || "Senior Mathematics PGT",
          department: staffList[0].department || "Academics",
          month_year: currentMonth,
          basic_salary: 48000,
          allowance: 6000,
          deduction: 2500,
          net_salary: 51500,
          payment_status: "PAID",
          payment_mode: "BANK_TRANSFER",
          payment_date: "2026-10-05",
          transaction_ref: "NEFT-HDFC-99120",
          voucher_number: "PAY-2026-1001",
          remarks: "Monthly salary credited via HDFC corporate net banking.",
          disbursed_by: "Principal (Admin)",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          staff_id: staffList[1].id,
          staff_name: `${staffList[1].first_name} ${staffList[1].last_name || ""}`.trim(),
          designation: staffList[1].designation || "Physics & Science HOD",
          department: staffList[1].department || "Science",
          month_year: currentMonth,
          basic_salary: 45000,
          allowance: 5000,
          deduction: 2200,
          net_salary: 47800,
          payment_status: "PAID",
          payment_mode: "BANK_TRANSFER",
          payment_date: "2026-10-05",
          transaction_ref: "NEFT-SBI-44321",
          voucher_number: "PAY-2026-1002",
          remarks: "Salary credited successfully.",
          disbursed_by: "Principal (Admin)",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          staff_id: staffList[2].id,
          staff_name: `${staffList[2].first_name} ${staffList[2].last_name || ""}`.trim(),
          designation: staffList[2].designation || "English TGT Faculty",
          department: staffList[2].department || "Languages",
          month_year: currentMonth,
          basic_salary: 38000,
          allowance: 4000,
          deduction: 1800,
          net_salary: 40200,
          payment_status: "PENDING",
          payment_mode: null,
          payment_date: null,
          transaction_ref: null,
          voucher_number: null,
          remarks: "Pending monthly disbursement approval.",
          disbursed_by: null,
        },
      ];

      await db("staff_salaries").insert(salaryRecords);
      console.log("Seeded initial staff salary payroll records for October 2026.");
    }
  }
}

async function seedTransportExpensesIfEmpty(): Promise<void> {
  const school = await db("institutes").where({ code: "DPA101" }).first();
  const targetInstituteId = school ? school.id : "1";

  if (await db.schema.hasTable("transport_expenses")) {
    const existing = await db("transport_expenses").where({ institute_id: targetInstituteId }).count("id as count").first();
    if (!existing || Number(existing.count) === 0) {
      const currentMonth = "October 2026";

      await db("transport_expenses").insert([
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          vehicle_number: "Bus #12 (DL 01 AB 4321)",
          expense_type: "MONTHLY_CONTRACT",
          month_year: currentMonth,
          vendor_or_payee: "Rathore Travels & Fleet Agency (Contractor)",
          amount: 38000,
          payment_status: "PAID",
          payment_mode: "BANK_TRANSFER",
          payment_date: "2026-10-07",
          transaction_ref: "NEFT-CORP-98124",
          receipt_number: "TRP-2026-101",
          notes: "Monthly contracted fleet payout for Bus #12 (45 Seater) covering Rohini to Pitampura corridor.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          vehicle_number: "Bus #07 (DL 01 CD 8765)",
          expense_type: "MONTHLY_CONTRACT",
          month_year: currentMonth,
          vendor_or_payee: "Apex Fleet Roadways Pvt Ltd",
          amount: 35000,
          payment_status: "PAID",
          payment_mode: "BANK_TRANSFER",
          payment_date: "2026-10-07",
          transaction_ref: "NEFT-CORP-98125",
          receipt_number: "TRP-2026-102",
          notes: "Monthly contract hire charges for Bus #07 South Delhi route.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          vehicle_number: "Mini Bus #03 (DL 02 EF 1234)",
          expense_type: "FUEL",
          month_year: currentMonth,
          vendor_or_payee: "Indian Oil Petrol Pump Sector 14",
          amount: 18500,
          payment_status: "PAID",
          payment_mode: "UPI",
          payment_date: "2026-10-12",
          transaction_ref: "UPI-PETROL-88192",
          receipt_number: "TRP-2026-103",
          notes: "Bulk CNG and diesel fleet card fuel refill for October first fortnight.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          vehicle_number: "Bus #12 (DL 01 AB 4321)",
          expense_type: "MAINTENANCE",
          month_year: currentMonth,
          vendor_or_payee: "TATA Motors Commercial Workshop",
          amount: 6800,
          payment_status: "PAID",
          payment_mode: "CHEQUE",
          payment_date: "2026-10-14",
          transaction_ref: "CHQ-778219",
          receipt_number: "TRP-2026-104",
          notes: "Quarterly safety fitness test, CCTV camera inspection, and brake lining replacement.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          vehicle_number: "Van #05 (DL 03 GH 9988)",
          expense_type: "MONTHLY_CONTRACT",
          month_year: currentMonth,
          vendor_or_payee: "Shivam Tourist Bus Services",
          amount: 28000,
          payment_status: "PENDING",
          payment_mode: "BANK_TRANSFER",
          payment_date: "2026-10-25",
          transaction_ref: null,
          receipt_number: "TRP-2026-105",
          notes: "Monthly contractor bill submitted for October. Pending payment approval.",
        },
      ]);
      console.log("Seeded initial monthly vehicle transport expenses and contractor payouts.");
    }
  }
}

async function seedOnlineClassesIfEmpty(): Promise<void> {
  const school = await db("institutes").where({ code: "DPA101" }).first();
  const targetInstituteId = school ? school.id : "1";

  if (await db.schema.hasTable("online_classes")) {
    const existing = await db("online_classes").where({ institute_id: targetInstituteId }).count("id as count").first();
    if (!existing || Number(existing.count) === 0) {
      await db("online_classes").insert([
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          class_name: "Class 10",
          section_name: "Section A",
          subject_name: "Mathematics",
          teacher_name: "Sunita Sharma",
          topic: "Quadratic Equations: Finding Roots & Graphical Analysis",
          class_date: new Date().toISOString().split("T")[0],
          start_time: "04:30 PM",
          end_time: "05:30 PM",
          platform: "GOOGLE_MEET",
          meeting_link: "https://meet.google.com/dpa-math-10a",
          passcode: null,
          status: "LIVE",
          instructions: "Join with NCERT textbook and graph papers. Interactive numerical solving will be conducted.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          class_name: "Class 10",
          section_name: "Section A",
          subject_name: "Science & Physics",
          teacher_name: "Ramesh Verma",
          topic: "Light Reflection, Refraction & Lens Numerical",
          class_date: "2026-10-21",
          start_time: "10:00 AM",
          end_time: "11:00 AM",
          platform: "ZOOM",
          meeting_link: "https://zoom.us/j/9876543210",
          passcode: "DPA2026",
          status: "SCHEDULED",
          instructions: "Formula sheet uploaded in homework diary. Please review before joining.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          class_name: "Class 9",
          section_name: "Section B",
          subject_name: "English Literature",
          teacher_name: "Neha Gupta",
          topic: "The Road Not Taken by Robert Frost — Critical Appreciation",
          class_date: "2026-10-22",
          start_time: "11:30 AM",
          end_time: "12:30 PM",
          platform: "GOOGLE_MEET",
          meeting_link: "https://meet.google.com/dpa-eng-09b",
          passcode: null,
          status: "SCHEDULED",
          instructions: "Poetry reading followed by student Q&A round.",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          class_name: "Class 10",
          section_name: "Section A",
          subject_name: "Social Science",
          teacher_name: "Sunita Sharma",
          topic: "Nationalism in India: Civil Disobedience & Salt Satyagraha",
          class_date: "2026-10-18",
          start_time: "02:00 PM",
          end_time: "03:00 PM",
          platform: "GOOGLE_MEET",
          meeting_link: "https://meet.google.com/dpa-sst-10a",
          passcode: null,
          status: "COMPLETED",
          recording_url: "https://youtube.com/watch?v=dpa-sst-recorded",
          instructions: "Recorded classroom session available for self-study and revision.",
        },
      ]);
      console.log("Seeded initial online live classes for students & teachers.");
    }
  }
}

async function seedFeesIfEmpty(): Promise<void> {
  const school = await db("institutes").where({ code: "DPA101" }).first();
  const targetInstituteId = school ? school.id : "1";

  if (await db.schema.hasTable("fee_payments")) {
    const existing = await db("fee_payments").where({ institute_id: targetInstituteId }).count("id as count").first();
    if (!existing || Number(existing.count) === 0) {
      const student = await db("student_profiles").where({ institute_id: targetInstituteId }).first();
      const studentId = student ? student.id : uuidv4();

      await db("fee_payments").insert([
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_id: studentId,
          amount_paid: 125000,
          payment_mode: "ONLINE_RAZORPAY",
          transaction_id: "pay_rzp_oct_01928",
          receipt_number: "RCPT-2026-1001",
          remarks: "Class 10 Term 1 Composite Tuition & Laboratory Fee batch collection",
          collected_by: "Razorpay Gateway",
          paid_at: "2026-10-04 11:20:00",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_id: studentId,
          amount_paid: 95000,
          payment_mode: "BANK_TRANSFER",
          transaction_id: "NEFT-HDFC-882190",
          receipt_number: "RCPT-2026-1002",
          remarks: "Quarterly School Bus & Transport Facility dues collected",
          collected_by: "Accounts Office",
          paid_at: "2026-10-08 14:15:00",
        },
        {
          id: uuidv4(),
          institute_id: targetInstituteId,
          student_id: studentId,
          amount_paid: 68000,
          payment_mode: "UPI",
          transaction_id: "UPI-ICICI-293810",
          receipt_number: "RCPT-2026-1003",
          remarks: "Annual Examination & Activity Fund collection",
          collected_by: "Cashier Window",
          paid_at: "2026-10-15 10:45:00",
        },
      ]);
      console.log("Seeded initial fee collection payments for Delhi Public Academy.");
    }
  }
}

async function seedCleanlinessIfEmpty(): Promise<void> {
  const existingCount = await db("cleanliness_zones").count("id as count").first();
  const count = Number(existingCount?.count || 0);
  if (count > 0) return;

  const targetInst = await db("institutes").where({ code: "DPA101" }).first();
  const instId = targetInst ? targetInst.id : "3aea8ce8-a615-472e-b3ed-a555f44a2ed8";

  console.log("Seeding initial campus hygiene & cleanliness facility zones...");
  const zones = [
    {
      id: "zone-1",
      institute_id: instId,
      name: "Ground Floor Boys Washroom (Block A)",
      code: "WR-B-GF",
      category: "WASHROOM",
      location_block: "Academic Block A - Ground Floor",
      assigned_cleaner: "Ramesh Lal",
      cleaner_phone: "98765-43210",
      assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
      cleaning_frequency: "Twice Daily (Morning & Afternoon)",
      last_cleaned_at: "2026-10-22 08:30:00",
      last_cleaned_by: "Ramesh Lal",
      last_cleaned_tasks: JSON.stringify(["Mopping with Phenyl & Disinfectant", "Dustbins Emptied & Liners Replaced", "Liquid Soap Refilled", "Urinal Flush Checked"]),
      next_cleaning_scheduled_at: "2026-10-22 13:30:00",
      last_inspected_at: "2026-10-22 09:15:00",
      last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
      next_inspection_due_at: "2026-10-22 16:00:00",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.8,
      checklist_json: JSON.stringify([
        { title: "Floor Cleanliness & Disinfection", passed: true },
        { title: "No Foul Odor / Fresh Ventilation", passed: true },
        { title: "Running Tap Water & No Leaks", passed: true },
        { title: "Liquid Soap & Hand Wash Stocked", passed: true },
        { title: "Dustbin Cleared with Garbage Bag", passed: true }
      ]),
      latest_inspection_remarks: "All 6 cubicles cleaned and disinfected. Floor is dry and exhaust fan working properly.",
    },
    {
      id: "zone-2",
      institute_id: instId,
      name: "Ground Floor Girls Washroom (Block A)",
      code: "WR-G-GF",
      category: "WASHROOM",
      location_block: "Academic Block A - Ground Floor",
      assigned_cleaner: "Kamla Devi",
      cleaner_phone: "98765-43211",
      assigned_supervisor: "Smt. Sunita Sharma (Vice Principal)",
      cleaning_frequency: "Twice Daily (Morning & Afternoon)",
      last_cleaned_at: "2026-10-22 08:45:00",
      last_cleaned_by: "Kamla Devi",
      last_cleaned_tasks: JSON.stringify(["Floor Disinfection", "Sanitary Napkin Incinerator Checked", "Mirrors Cleaned", "Liquid Soap Refilled"]),
      next_cleaning_scheduled_at: "2026-10-22 13:45:00",
      last_inspected_at: "2026-10-22 09:30:00",
      last_inspected_by: "Smt. Sunita Sharma (Vice Principal)",
      next_inspection_due_at: "2026-10-22 16:30:00",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.9,
      checklist_json: JSON.stringify([
        { title: "Floor Cleanliness & Disinfection", passed: true },
        { title: "Sanitary Disposal Bin Cleared", passed: true },
        { title: "Running Tap Water & Basin Clean", passed: true },
        { title: "Handwash & Paper Towels Available", passed: true },
        { title: "Mirrors & Counters Spotless", passed: true }
      ]),
      latest_inspection_remarks: "Excellent hygiene maintained. Incinerator and sanitization unit functional.",
    },
    {
      id: "zone-3",
      institute_id: instId,
      name: "1st Floor Boys Washroom (Block B)",
      code: "WR-B-1F",
      category: "WASHROOM",
      location_block: "Secondary Wing Block B - 1st Floor",
      assigned_cleaner: "Suraj Pal",
      cleaner_phone: "98765-43212",
      assigned_supervisor: "Shri Mohan Lal (Supervisor)",
      cleaning_frequency: "Twice Daily",
      last_cleaned_at: "2026-10-22 07:45:00",
      last_cleaned_by: "Suraj Pal",
      last_cleaned_tasks: JSON.stringify(["Basic Sweeping", "Floor Mopping"]),
      next_cleaning_scheduled_at: "2026-10-22 12:00:00",
      last_inspected_at: "2026-10-21 16:00:00",
      last_inspected_by: "Shri Mohan Lal (Supervisor)",
      next_inspection_due_at: "2026-10-22 14:00:00",
      inspection_status: "NEEDS_ATTENTION",
      hygiene_rating: 3.5,
      checklist_json: JSON.stringify([
        { title: "Floor Cleanliness & Disinfection", passed: true },
        { title: "No Foul Odor / Fresh Ventilation", passed: false },
        { title: "Running Tap Water & No Leaks", passed: false },
        { title: "Liquid Soap & Hand Wash Stocked", passed: true },
        { title: "Dustbin Cleared with Garbage Bag", passed: true }
      ]),
      latest_inspection_remarks: "Slight leak in tap #2 reported. Cleaner notified to mop immediately before lunch break.",
    },
    {
      id: "zone-4",
      institute_id: instId,
      name: "Main Campus Garden & Central Green Lawn",
      code: "GDN-MAIN",
      category: "GARDEN_PARK",
      location_block: "Central Quadrangle & Front Gate Entrance",
      assigned_cleaner: "Mangat Ram (Head Gardener)",
      cleaner_phone: "98765-43214",
      assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
      cleaning_frequency: "Daily Morning & Regular Weeding",
      last_cleaned_at: "2026-10-22 07:15:00",
      last_cleaned_by: "Mangat Ram (Head Gardener)",
      last_cleaned_tasks: JSON.stringify(["Grass Mowing & Edge Trimming", "Fallen Leaves Swept & Composted", "Flowerbed Weeding & Soil Aeration", "Pathway Swept & Sprinkled"]),
      next_cleaning_scheduled_at: "2026-10-23 07:00:00",
      last_inspected_at: "2026-10-22 08:15:00",
      last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
      next_inspection_due_at: "2026-10-23 08:30:00",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 5.0,
      checklist_json: JSON.stringify([
        { title: "Lawn Mowed & Grass Height Maintained", passed: true },
        { title: "Fallen Leaves & Organic Waste Cleared", passed: true },
        { title: "No Plastic / Candy Wrappers on Lawn", passed: true },
        { title: "Garden Benches & Statues Clean", passed: true },
        { title: "Sprinklers & Watering Completed", passed: true }
      ]),
      latest_inspection_remarks: "Lawn freshly manicured for the morning assembly. Flower beds vibrant and weed-free.",
    },
    {
      id: "zone-5",
      institute_id: instId,
      name: "Kindergarten Play Park & Kids Garden",
      code: "PRK-KIDS",
      category: "GARDEN_PARK",
      location_block: "Junior Wing East Lawn",
      assigned_cleaner: "Shyam Singh",
      cleaner_phone: "98765-43215",
      assigned_supervisor: "Ms. Anjali Verma (Primary Head)",
      cleaning_frequency: "Daily (Before & After Playtime)",
      last_cleaned_at: "2026-10-22 08:00:00",
      last_cleaned_by: "Shyam Singh",
      last_cleaned_tasks: JSON.stringify(["Swings, Slides & Seesaws Sanitized", "Sandpit Checked for Stones & Sharp Debris", "Lawn Litter Cleared", "Safety Soft Mats Disinfected"]),
      next_cleaning_scheduled_at: "2026-10-22 14:30:00",
      last_inspected_at: "2026-10-22 08:30:00",
      last_inspected_by: "Ms. Anjali Verma (Primary Head)",
      next_inspection_due_at: "2026-10-22 15:00:00",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.9,
      checklist_json: JSON.stringify([
        { title: "Play Equipment Clean & Disinfected", passed: true },
        { title: "Sandpit Levelled & Foreign Objects Removed", passed: true },
        { title: "Soft Rubber Flooring Sanitized", passed: true },
        { title: "Fencing & Gate Latches Secure", passed: true },
        { title: "Litter Bins Emptied", passed: true }
      ]),
      latest_inspection_remarks: "Playground equipment sanitised. Safe for nursery and kindergarten students.",
    },
    {
      id: "zone-6",
      institute_id: instId,
      name: "RO Cold Drinking Water Station #1",
      code: "RO-COOL-1",
      category: "WATER_STATION",
      location_block: "Central Dining & Cafeteria Zone",
      assigned_cleaner: "Ramesh Lal",
      cleaner_phone: "98765-43210",
      assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
      cleaning_frequency: "Twice Daily & Weekly Filter Backwash",
      last_cleaned_at: "2026-10-22 08:15:00",
      last_cleaned_by: "Ramesh Lal",
      last_cleaned_tasks: JSON.stringify(["Stainless Steel Basin Polished", "Drain Trays Flushed & Cleared", "TDS Level Checked (115 ppm)", "Surrounding Floor Mopped"]),
      next_cleaning_scheduled_at: "2026-10-22 14:00:00",
      last_inspected_at: "2026-10-22 09:00:00",
      last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
      next_inspection_due_at: "2026-10-23 09:00:00",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.9,
      checklist_json: JSON.stringify([
        { title: "Water TDS Tested within 80-150 ppm", passed: true },
        { title: "Chiller Temperature 15°C Verified", passed: true },
        { title: "Stainless Steel Surface Cleaned", passed: true },
        { title: "No Water Clogging / Overflow in Drain", passed: true },
        { title: "UV Sterilizer Indicator Active", passed: true }
      ]),
      latest_inspection_remarks: "TDS 115 ppm. Safe drinking water standards verified. Drainage flowing freely.",
    },
    {
      id: "zone-7",
      institute_id: instId,
      name: "Main Sports Complex & Football Playground",
      code: "PLY-MAIN",
      category: "PLAYGROUND",
      location_block: "Outdoor Sports Field & Running Track",
      assigned_cleaner: "Mangat Ram & Team",
      cleaner_phone: "98765-43214",
      assigned_supervisor: "Coach Devendra Singh (Sports Director)",
      cleaning_frequency: "Daily Afternoon & Pre-Match",
      last_cleaned_at: "2026-10-21 18:00:00",
      last_cleaned_by: "Mangat Ram & Team",
      last_cleaned_tasks: JSON.stringify(["Running Track Debris Swept", "Football Pitch Rolling & Lining", "Boundary Dustbins Cleared"]),
      next_cleaning_scheduled_at: "2026-10-22 17:30:00",
      last_inspected_at: "2026-10-21 18:30:00",
      last_inspected_by: "Coach Devendra Singh",
      next_inspection_due_at: "2026-10-22 18:00:00",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.8,
      checklist_json: JSON.stringify([
        { title: "Track & Field Free from Stones & Glass", passed: true },
        { title: "Pitch Lines Marked & Grass Leveled", passed: true },
        { title: "Spectator Benches Clean", passed: true },
        { title: "Litter Cans Emptied Around Stadium", passed: true }
      ]),
      latest_inspection_remarks: "Field ready for evening sports practice and athletics drills.",
    },
    {
      id: "zone-8",
      institute_id: instId,
      name: "Senior Wing Classrooms (Rooms 101 to 110) & Corridors",
      code: "CLS-SR-101",
      category: "CLASSROOM",
      location_block: "Academic Block B - 1st Floor",
      assigned_cleaner: "Suraj Pal",
      cleaner_phone: "98765-43212",
      assigned_supervisor: "Shri Mohan Lal (Supervisor)",
      cleaning_frequency: "Daily Morning & Post-School",
      last_cleaned_at: "2026-10-22 06:30:00",
      last_cleaned_by: "Suraj Pal",
      last_cleaned_tasks: JSON.stringify(["Desks & Chairs Dusted", "Whiteboards Cleaned", "Floors Mopped", "Dustbins Emptied"]),
      next_cleaning_scheduled_at: "2026-10-22 14:45:00",
      last_inspected_at: "2026-10-22 07:45:00",
      last_inspected_by: "Shri Mohan Lal (Supervisor)",
      next_inspection_due_at: "2026-10-22 15:30:00",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.7,
      checklist_json: JSON.stringify([
        { title: "Floors Swept & Mopped", passed: true },
        { title: "Student Benches Wiped Down", passed: true },
        { title: "Window Panes & Fans Dust-Free", passed: true },
        { title: "Classroom Waste Bins Cleaned", passed: true }
      ]),
      latest_inspection_remarks: "Classrooms spotless before student arrival.",
    }
  ];

  await db("cleanliness_zones").insert(zones);

  const inspections = [
    {
      id: "insp-1",
      institute_id: instId,
      zone_id: "zone-1",
      zone_name: "Ground Floor Boys Washroom (Block A)",
      category: "WASHROOM",
      log_type: "INSPECTION",
      action_date: "2026-10-22 09:15:00",
      performed_by: "Dr. Sunil Verma (Estate Officer)",
      role: "SUPERVISOR",
      rating: 4.8,
      status: "VERIFIED_CLEAN",
      checklist_results: JSON.stringify(["Floor Cleanliness Passed", "No Foul Odor Passed", "Taps & Water Passed", "Soaps Refilled Passed", "Bins Cleared Passed"]),
      next_scheduled_date: "2026-10-22 16:00:00",
      remarks: "Thoroughly disinfected. All urinals and flush sensors working flawlessly."
    },
    {
      id: "insp-2",
      institute_id: instId,
      zone_id: "zone-4",
      zone_name: "Main Campus Garden & Central Green Lawn",
      category: "GARDEN_PARK",
      log_type: "INSPECTION",
      action_date: "2026-10-22 08:15:00",
      performed_by: "Dr. Sunil Verma (Estate Officer)",
      role: "SUPERVISOR",
      rating: 5.0,
      status: "VERIFIED_CLEAN",
      checklist_results: JSON.stringify(["Grass Trimmed Passed", "Leaves Cleared Passed", "No Plastic Passed", "Benches Clean Passed", "Plants Watered Passed"]),
      next_scheduled_date: "2026-10-23 08:30:00",
      remarks: "Garden is looking lush, neat and completely clean for assembly."
    },
    {
      id: "insp-3",
      institute_id: instId,
      zone_id: "zone-2",
      zone_name: "Ground Floor Girls Washroom (Block A)",
      category: "WASHROOM",
      log_type: "INSPECTION",
      action_date: "2026-10-22 09:30:00",
      performed_by: "Smt. Sunita Sharma (Vice Principal)",
      role: "SUPERVISOR",
      rating: 4.9,
      status: "VERIFIED_CLEAN",
      checklist_results: JSON.stringify(["Floors Disinfected Passed", "Incinerator Checked Passed", "Sanitizer Stocked Passed"]),
      next_scheduled_date: "2026-10-22 16:30:00",
      remarks: "Very clean and properly sanitised."
    },
    {
      id: "insp-4",
      institute_id: instId,
      zone_id: "zone-3",
      zone_name: "1st Floor Boys Washroom (Block B)",
      category: "WASHROOM",
      log_type: "INSPECTION",
      action_date: "2026-10-21 16:00:00",
      performed_by: "Shri Mohan Lal (Supervisor)",
      role: "SUPERVISOR",
      rating: 3.5,
      status: "NEEDS_ATTENTION",
      checklist_results: JSON.stringify(["Floor Damp", "Tap 2 Dripping"]),
      next_scheduled_date: "2026-10-22 14:00:00",
      remarks: "Plumber informed to repair leaking tap 2. Second mopping needed."
    }
  ];

  await db("cleanliness_inspections").insert(inspections);
  console.log("Seeded initial cleanliness facility zones and inspections for Delhi Public Academy.");
}



