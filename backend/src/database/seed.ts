import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "./connection";
import { createTables } from "./schema";

export async function runSeed(): Promise<void> {
  console.log("Creating database tables if not existing...");
  await createTables(db);

  const existingSuperAdmin = await db("users").where({ username: "superadmin@radhix.com" }).first();
  if (existingSuperAdmin) {
    console.log("Seed data already present. Checking drivers, vehicles, and counsellor tables...");
    await seedDriversIfEmpty();
    await seedVehiclesIfEmpty();
    await seedCounsellorIfEmpty();
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



