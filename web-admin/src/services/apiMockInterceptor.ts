// Automatic Mock & Network Fallback Interceptor for Netlify / Static Deployments
// Ensures 100% of the School ERP features work live without errors on Netlify

const STORAGE_KEY = "radhix_erp_offline_db";

interface DBState {
  institutes: any[];
  plans: any[];
  students: any[];
  staff: any[];
  teacherLeaves: any[];
  salaries: any[];
  transportExpenses: any[];
  vehicles: any[];
  drivers: any[];
  onlineClasses: any[];
  notices: any[];
  fees: {
    allocations: any[];
    structures: any[];
  };
  homework: any[];
  cleanlinessZones: any[];
  cleanlinessInspections: any[];
}

const defaultState: DBState = {
  institutes: [
    {
      id: "3aea8ce8-a615-472e-b3ed-a555f44a2ed8",
      name: "Delhi Public Academy",
      code: "DPA101",
      type: "SCHOOL",
      status: "ACTIVE",
      planName: "Enterprise Tier",
      studentCount: 1248,
      createdAt: "2026-01-15",
    },
    {
      id: "inst-2",
      name: "St. Xavier International School",
      code: "SXIS202",
      type: "SCHOOL",
      status: "ACTIVE",
      planName: "Standard Plan",
      studentCount: 890,
      createdAt: "2026-03-10",
    },
    {
      id: "inst-3",
      name: "Global City Institute of Higher Studies",
      code: "GCI303",
      type: "COLLEGE",
      status: "ACTIVE",
      planName: "Enterprise Tier",
      studentCount: 2450,
      createdAt: "2025-11-20",
    },
  ],
  plans: [
    { id: "plan-1", name: "Starter", price: 4999, maxStudents: 500, features: ["attendance", "homework", "notices"] },
    { id: "plan-2", name: "Standard Plan", price: 9999, maxStudents: 1500, features: ["attendance", "homework", "fees", "exams", "notices", "transport"] },
    { id: "plan-3", name: "Enterprise Tier", price: 19999, maxStudents: 5000, features: ["all", "online-classes", "finance", "custom-domain"] },
  ],
  students: [
    { id: "std-1", full_name: "Aarav Kumar", enrollment_number: "DPS-2026-001", roll_number: "101", class_name: "10", section_name: "A", father_name: "Ramesh Kumar", phone: "9876543210" },
    { id: "std-2", full_name: "Ananya Sharma", enrollment_number: "DPS-2026-002", roll_number: "102", class_name: "10", section_name: "A", father_name: "Vikram Sharma", phone: "9876543211" },
    { id: "std-3", full_name: "Rohan Verma", enrollment_number: "DPS-2026-003", roll_number: "103", class_name: "10", section_name: "B", father_name: "Suresh Verma", phone: "9876543212" },
    { id: "std-4", full_name: "Diya Patel", enrollment_number: "DPS-2026-004", roll_number: "104", class_name: "9", section_name: "A", father_name: "Kirit Patel", phone: "9876543213" },
  ],
  staff: [
    { id: "TCH-101", full_name: "Sunita Sharma", email: "sunita.sharma@radhix.com", employee_code: "EMP-101", designation: "Science Faculty", department: "Academics", phone: "9812345671", status: "ACTIVE" },
    { id: "TCH-102", full_name: "Ramesh Verma", email: "ramesh.verma@radhix.com", employee_code: "EMP-102", designation: "Physics & Science HOD", department: "Academics", phone: "9812345672", status: "ACTIVE" },
    { id: "TCH-103", full_name: "Priya Singh", email: "priya.singh@radhix.com", employee_code: "EMP-103", designation: "Mathematics Senior Teacher", department: "Academics", phone: "9812345673", status: "ACTIVE" },
    { id: "TCH-104", full_name: "Rajesh Kumar", email: "rajesh.kumar@radhix.com", employee_code: "EMP-104", designation: "English Faculty", department: "Academics", phone: "9812345674", status: "ACTIVE" },
  ],
  teacherLeaves: [
    {
      id: "leave-1",
      staff_id: "TCH-101",
      staff_name: "Sunita Sharma",
      employee_code: "EMP-101",
      designation: "Science Faculty",
      leave_type: "SICK",
      start_date: "2026-10-20",
      end_date: "2026-10-22",
      total_days: 3,
      reason: "Viral fever and throat infection, advised bed rest.",
      status: "PENDING",
      substitute_staff_id: null,
      substitute_name: null,
      substitution_notes: null,
      admin_remarks: null,
      applied_at: "2026-10-18 10:15",
    },
    {
      id: "leave-2",
      staff_id: "TCH-104",
      staff_name: "Rajesh Kumar",
      employee_code: "EMP-104",
      designation: "English Faculty",
      leave_type: "CASUAL",
      start_date: "2026-10-18",
      end_date: "2026-10-18",
      total_days: 1,
      reason: "Personal family function.",
      status: "APPROVED",
      substitute_staff_id: "TCH-102",
      substitute_name: "Ramesh Verma",
      substitution_notes: "Covering Period 2 (Class 10-A English) and Period 5 (Class 9-B English Literature).",
      admin_remarks: "Approved. Substitution confirmed with Mr. Ramesh.",
      applied_at: "2026-10-15 09:30",
    },
  ],
  salaries: [
    {
      id: "sal-1",
      staff_id: "TCH-101",
      staff_name: "Sunita Sharma",
      designation: "Class Teacher (10-A) & Science Faculty",
      department: "Academics",
      month_year: "October 2026",
      basic_salary: 45000,
      allowance: 8500,
      deduction: 2000,
      net_salary: 51500,
      payment_status: "PAID",
      payment_mode: "BANK_TRANSFER",
      payment_date: "2026-10-05",
      transaction_ref: "NEFT-SBI-98214371",
      voucher_number: "PAY-2026-1001",
      remarks: "Monthly remuneration credited to salary account.",
    },
    {
      id: "sal-2",
      staff_id: "TCH-102",
      staff_name: "Ramesh Verma",
      designation: "Physics & Science HOD",
      department: "Academics",
      month_year: "October 2026",
      basic_salary: 42000,
      allowance: 7500,
      deduction: 1700,
      net_salary: 47800,
      payment_status: "PAID",
      payment_mode: "BANK_TRANSFER",
      payment_date: "2026-10-05",
      transaction_ref: "NEFT-HDFC-64219803",
      voucher_number: "PAY-2026-1002",
      remarks: "Monthly salary credited.",
    },
    {
      id: "sal-3",
      staff_id: "TCH-103",
      staff_name: "Priya Singh",
      designation: "Mathematics Senior Faculty",
      department: "Academics",
      month_year: "October 2026",
      basic_salary: 36000,
      allowance: 5500,
      deduction: 1300,
      net_salary: 40200,
      payment_status: "PENDING",
      payment_mode: "BANK_TRANSFER",
      payment_date: null,
      transaction_ref: null,
      voucher_number: "PAY-2026-1003",
      remarks: "Approval pending in accounts desk.",
    },
  ],
  transportExpenses: [
    {
      id: "trp-1",
      vehicle_id: "v-1",
      vehicle_number: "DL 01 AB 4321",
      expense_type: "MONTHLY_CONTRACT",
      month_year: "October 2026",
      vendor_or_payee: "Rathore Travels & Fleet Agency (Contractor)",
      amount: 38000,
      payment_status: "PAID",
      payment_mode: "BANK_TRANSFER",
      payment_date: "2026-10-07",
      transaction_ref: "TXN-RTH-882194",
      receipt_number: "TRP-2026-101",
      notes: "Contract Bus #12 monthly hiring fee (Sector 12 to School route).",
    },
    {
      id: "trp-2",
      vehicle_id: "v-2",
      vehicle_number: "DL 01 CD 8765",
      expense_type: "MONTHLY_CONTRACT",
      month_year: "October 2026",
      vendor_or_payee: "Apex Fleet Roadways Pvt Ltd",
      amount: 35000,
      payment_status: "PAID",
      payment_mode: "BANK_TRANSFER",
      payment_date: "2026-10-07",
      transaction_ref: "TXN-APX-410924",
      receipt_number: "TRP-2026-102",
      notes: "Contract Bus #07 monthly hiring fee (Civil Lines to School route).",
    },
    {
      id: "trp-3",
      vehicle_id: "v-3",
      vehicle_number: "DL 02 EF 1234",
      expense_type: "MONTHLY_CONTRACT",
      month_year: "October 2026",
      vendor_or_payee: "Royal Bus Services",
      amount: 28000,
      payment_status: "PENDING",
      payment_mode: "BANK_TRANSFER",
      payment_date: null,
      transaction_ref: null,
      receipt_number: "TRP-2026-105",
      notes: "Mini Bus #03 monthly contractor hire fee for October 2026.",
    },
    {
      id: "trp-4",
      vehicle_id: "v-3",
      vehicle_number: "DL 02 EF 1234",
      expense_type: "FUEL",
      month_year: "October 2026",
      vendor_or_payee: "Indian Oil Petrol Pump Sector 14",
      amount: 18500,
      payment_status: "PAID",
      payment_mode: "UPI",
      payment_date: "2026-10-12",
      transaction_ref: "UPI-IOCL-9812401",
      receipt_number: "TRP-2026-103",
      notes: "Monthly diesel refill fleet quota.",
    },
    {
      id: "trp-5",
      vehicle_id: "v-1",
      vehicle_number: "DL 01 AB 4321",
      expense_type: "MAINTENANCE",
      month_year: "October 2026",
      vendor_or_payee: "TATA Motors Commercial Workshop",
      amount: 6800,
      payment_status: "PAID",
      payment_mode: "CHEQUE",
      payment_date: "2026-10-14",
      transaction_ref: "CHQ-SBIN-041928",
      receipt_number: "TRP-2026-104",
      notes: "Brake pads replacement and wheel alignment servicing.",
    },
  ],
  vehicles: [
    { id: "v-1", vehicle_number: "DL 01 AB 4321", vehicle_type: "BUS", capacity: 45, status: "ACTIVE", route_name: "Route 1 - North Campus", driver_name: "Gurpreet Singh", driver_phone: "9811122334" },
    { id: "v-2", vehicle_number: "DL 01 CD 8765", vehicle_type: "BUS", capacity: 40, status: "ACTIVE", route_name: "Route 2 - East Enclave", driver_name: "Manoj Yadav", driver_phone: "9822233445" },
    { id: "v-3", vehicle_number: "DL 02 EF 1234", vehicle_type: "VAN", capacity: 20, status: "ACTIVE", route_name: "Route 3 - South Extension", driver_name: "Baljeet Sharma", driver_phone: "9833344556" },
  ],
  drivers: [
    { id: "drv-1", full_name: "Gurpreet Singh", phone: "9811122334", license_number: "DL-042019-8821", status: "ACTIVE", assigned_vehicle_id: "v-1" },
    { id: "drv-2", full_name: "Manoj Yadav", phone: "9822233445", license_number: "DL-042018-9124", status: "ACTIVE", assigned_vehicle_id: "v-2" },
    { id: "drv-3", full_name: "Baljeet Sharma", phone: "9833344556", license_number: "DL-042021-1209", status: "ACTIVE", assigned_vehicle_id: "v-3" },
  ],
  onlineClasses: [
    {
      id: "cls-1",
      class_name: "Class 10",
      section_name: "A",
      subject_name: "English Literature",
      teacher_name: "Sunita Sharma",
      topic: "The Road Not Taken by Robert Frost — Critical Appreciation",
      class_date: "2026-10-20",
      start_time: "10:00 AM",
      end_time: "10:45 AM",
      platform: "Google Meet",
      meeting_link: "https://meet.google.com/abc-dpa-xyz",
      passcode: "dpa2026",
      status: "SCHEDULED",
      instructions: "Keep your English textbook ready and cameras turned on.",
    },
    {
      id: "cls-2",
      class_name: "Class 10",
      section_name: "A",
      subject_name: "Science (Physics)",
      teacher_name: "Ramesh Verma",
      topic: "Ray Optics: Reflection and Refraction Through Curved Lenses",
      class_date: "2026-10-19",
      start_time: "11:30 AM",
      end_time: "12:15 PM",
      platform: "Google Meet",
      meeting_link: "https://meet.google.com/optics-ray-dpa",
      passcode: "optics10",
      status: "LIVE",
      instructions: "Active interactive numerical practice session with Ray diagram simulation.",
    },
    {
      id: "cls-3",
      class_name: "Class 9",
      section_name: "B",
      subject_name: "Mathematics",
      teacher_name: "Priya Singh",
      topic: "Polynomials: Remainder Theorem and Factorization Techniques",
      class_date: "2026-10-21",
      start_time: "09:00 AM",
      end_time: "09:45 AM",
      platform: "Zoom",
      meeting_link: "https://zoom.us/j/98765432100",
      passcode: "math987",
      status: "SCHEDULED",
      instructions: "Download the practice worksheet from homework tab before joining.",
    },
    {
      id: "cls-4",
      class_name: "Class 11",
      section_name: "A",
      subject_name: "Physics",
      teacher_name: "Ramesh Verma",
      topic: "Universal Law of Gravitation & Kepler's Planetary Laws",
      class_date: "2026-10-17",
      start_time: "02:00 PM",
      end_time: "03:00 PM",
      platform: "Google Meet",
      meeting_link: "https://meet.google.com/grav-orbit-dpa",
      passcode: "orbit11",
      status: "COMPLETED",
      instructions: "Session recording uploaded to resource library.",
    },
  ],
  notices: [
    {
      id: "ntc-1",
      title: "🚨 Urgent Alert: Unscheduled Heavy Rainfall School Closure Advisory",
      content: "Due to meteorological red alerts and excessive waterlogging across city transit routes, school campus will remain closed on Friday, 24th Oct 2026 for Nursery to Class 12. Online synchronous doubt-clearing sessions will proceed via Google Meet as scheduled.",
      target_audience: "ALL",
      category: "URGENT",
      priority: "HIGH",
      attachment_url: "Circular_Advisory_Weather_Closure.pdf",
      created_by: "Office of the Principal",
      published_at: "2026-10-22T06:30:00.000Z",
    },
    {
      id: "ntc-2",
      title: "Mid-Term Examination 2026-27 Date Sheet & Admit Card Release",
      content: "The official datesheet for Mid-Term Examination (Classes 6th to 12th) is now published. Students must download and verify their digital admit cards from the student portal before 28th October. Late entry to exam hall without stamped admit card is strictly prohibited.",
      target_audience: "STUDENTS",
      category: "EXAM",
      priority: "NORMAL",
      attachment_url: "MidTerm_Datesheet_2026_Final.pdf",
      created_by: "Controller of Examinations",
      published_at: "2026-10-21T10:15:00.000Z",
    },
    {
      id: "ntc-3",
      title: "Parent-Teacher Interaction Meet (PTM) for Term-1 Academic Review",
      content: "All parents and guardians are cordially invited to attend the physical PTM on Saturday, 26th October between 08:30 AM and 01:30 PM. Respective slot timings have been notified to student registered WhatsApp contact numbers. Valet and campus parking is open at Gate #2.",
      target_audience: "PARENTS",
      category: "PTM",
      priority: "NORMAL",
      attachment_url: "PTM_Schedule_SlotWise_Term1.pdf",
      created_by: "Vice Principal (Academics)",
      published_at: "2026-10-20T14:40:00.000Z",
    },
    {
      id: "ntc-4",
      title: "Annual Inter-School Athletics Championship & Sports Day Registrations",
      content: "Registrations are open for the 18th Annual Inter-School Sports Meet. Events include 100m/400m sprint, relay, long jump, football and lawn tennis. Interested students may register their names with Coach Devendra Singh at the Sports Complex by 25th October.",
      target_audience: "STUDENTS",
      category: "SPORTS",
      priority: "NORMAL",
      attachment_url: "Sports_Meet_Entry_Form_2026.pdf",
      created_by: "Sports Department",
      published_at: "2026-10-19T09:00:00.000Z",
    },
    {
      id: "ntc-5",
      title: "Mandatory Staff Faculty Meeting & CBSE Curriculum Workshop",
      content: "A mandatory workshop on 'Experiential Pedagogy & NEP 2020 Compliance' will be conducted by CBSE master trainers in Auditorium Hall on Monday at 02:45 PM. All PGT, TGT and PRT teachers are required to bring lesson plans and digital attendance logs.",
      target_audience: "STAFF",
      category: "ACADEMIC",
      priority: "NORMAL",
      attachment_url: "NEP_Curriculum_Guidelines_2026.pdf",
      created_by: "Academic Dean",
      published_at: "2026-10-18T16:20:00.000Z",
    },
    {
      id: "ntc-6",
      title: "Term-2 Tuition & Transport Fee Payment Reminders & Portal Link",
      content: "Parents who have not cleared the Term-2 tuition and transport fee are kindly requested to settle dues before 31st October 2026 to avoid late penalty charges. Online payments can be made conveniently via UPI, Net Banking, or Debit Card through the Parent Portal.",
      target_audience: "PARENTS",
      category: "GENERAL",
      priority: "NORMAL",
      attachment_url: null,
      created_by: "Accounts Office",
      published_at: "2026-10-17T11:00:00.000Z",
    },
  ],
  fees: {
    allocations: [
      {
        id: "fa-1",
        student_id: "std-1",
        first_name: "Aarav",
        last_name: "Kumar",
        admission_number: "DPS-2026-001",
        roll_number: "12",
        class_name: "Class 10",
        section_name: "A",
        parent_name: "Rajesh Kumar",
        parent_phone: "+91 98111-22334",
        fee_head: "Secondary Tuition & Lab Fee (Term-1)",
        frequency: "QUARTERLY",
        original_amount: 45000,
        net_amount: 45000,
        paid_amount: 45000,
        status: "PAID",
        due_date: "2026-09-30",
        paid_date: "2026-09-28",
        payment_mode: "UPI (Google Pay)",
        receipt_number: "REC-2026-DPS-1001",
        last_reminder_sent_at: null,
      },
      {
        id: "fa-2",
        student_id: "std-2",
        first_name: "Ananya",
        last_name: "Sharma",
        admission_number: "DPS-2026-002",
        roll_number: "15",
        class_name: "Class 10",
        section_name: "A",
        parent_name: "Sunil Sharma",
        parent_phone: "+91 98222-33445",
        fee_head: "Secondary Tuition & Lab Fee (Term-1)",
        frequency: "QUARTERLY",
        original_amount: 45000,
        net_amount: 45000,
        paid_amount: 30000,
        status: "PARTIAL",
        due_date: "2026-10-15",
        paid_date: "2026-10-10",
        payment_mode: "COUNTER CASH",
        receipt_number: "REC-2026-DPS-1002",
        last_reminder_sent_at: "2026-10-21T09:30:00.000Z",
      },
      {
        id: "fa-3",
        student_id: "std-3",
        first_name: "Rohan",
        last_name: "Verma",
        admission_number: "DPS-2026-003",
        roll_number: "22",
        class_name: "Class 10",
        section_name: "B",
        parent_name: "Dr. Anil Verma",
        parent_phone: "+91 98333-44556",
        fee_head: "Secondary Wing Composite Fee",
        frequency: "QUARTERLY",
        original_amount: 42000,
        net_amount: 42000,
        paid_amount: 0,
        status: "OVERDUE",
        due_date: "2026-09-30",
        paid_date: null,
        payment_mode: null,
        receipt_number: null,
        last_reminder_sent_at: "2026-10-21T14:15:00.000Z",
      },
      {
        id: "fa-4",
        student_id: "std-4",
        first_name: "Diya",
        last_name: "Patel",
        admission_number: "DPS-2026-004",
        roll_number: "08",
        class_name: "Class 9",
        section_name: "A",
        parent_name: "Bhavin Patel",
        parent_phone: "+91 98444-55667",
        fee_head: "Tuition & Science Lab Fee",
        frequency: "QUARTERLY",
        original_amount: 38000,
        net_amount: 38000,
        paid_amount: 38000,
        status: "PAID",
        due_date: "2026-09-30",
        paid_date: "2026-09-29",
        payment_mode: "NET BANKING",
        receipt_number: "REC-2026-DPS-1003",
        last_reminder_sent_at: null,
      },
      {
        id: "fa-5",
        student_id: "std-5",
        first_name: "Kabir",
        last_name: "Singh Mehra",
        admission_number: "DPS-2026-005",
        roll_number: "05",
        class_name: "Class 11",
        section_name: "A",
        parent_name: "Harvinder Mehra",
        parent_phone: "+91 98555-66778",
        fee_head: "Senior Secondary Science Fee",
        frequency: "QUARTERLY",
        original_amount: 55000,
        net_amount: 55000,
        paid_amount: 0,
        status: "OVERDUE",
        due_date: "2026-10-05",
        paid_date: null,
        payment_mode: null,
        receipt_number: null,
        last_reminder_sent_at: null,
      },
      {
        id: "fa-6",
        student_id: "std-6",
        first_name: "Isha",
        last_name: "Malhotra",
        admission_number: "DPS-2026-006",
        roll_number: "11",
        class_name: "Class 12",
        section_name: "A",
        parent_name: "Deepak Malhotra",
        parent_phone: "+91 98666-77889",
        fee_head: "Senior Secondary PCM Fee",
        frequency: "QUARTERLY",
        original_amount: 55000,
        net_amount: 55000,
        paid_amount: 55000,
        status: "PAID",
        due_date: "2026-10-05",
        paid_date: "2026-10-01",
        payment_mode: "DEMAND DRAFT",
        receipt_number: "REC-2026-DPS-1004",
        last_reminder_sent_at: null,
      },
      {
        id: "fa-7",
        student_id: "std-7",
        first_name: "Reyansh",
        last_name: "Gupta",
        admission_number: "DPS-2026-007",
        roll_number: "19",
        class_name: "Class 8",
        section_name: "A",
        parent_name: "Mohit Gupta",
        parent_phone: "+91 98777-88990",
        fee_head: "Middle Wing Tuition Fee",
        frequency: "QUARTERLY",
        original_amount: 32000,
        net_amount: 32000,
        paid_amount: 20000,
        status: "PARTIAL",
        due_date: "2026-10-20",
        paid_date: "2026-10-18",
        payment_mode: "UPI (Paytm)",
        receipt_number: "REC-2026-DPS-1005",
        last_reminder_sent_at: "2026-10-21T18:00:00.000Z",
      },
      {
        id: "fa-8",
        student_id: "std-8",
        first_name: "Tanvi",
        last_name: "Joshi",
        admission_number: "DPS-2026-008",
        roll_number: "24",
        class_name: "Class 6",
        section_name: "B",
        parent_name: "Alok Joshi",
        parent_phone: "+91 98888-99001",
        fee_head: "Primary & Middle Composite Fee",
        frequency: "QUARTERLY",
        original_amount: 28000,
        net_amount: 28000,
        paid_amount: 28000,
        status: "PAID",
        due_date: "2026-10-10",
        paid_date: "2026-10-02",
        payment_mode: "ONLINE (Razorpay)",
        receipt_number: "REC-2026-DPS-1006",
        last_reminder_sent_at: null,
      },
    ],
    structures: [
      { id: "fs-1", name: "Primary Wing Tuition Fee", fee_head: "Primary Wing Tuition Fee", amount: 28000, frequency: "QUARTERLY", late_fine_per_day: 10 },
      { id: "fs-2", name: "Middle Wing Tuition Fee", fee_head: "Middle Wing Tuition Fee", amount: 32000, frequency: "QUARTERLY", late_fine_per_day: 10 },
      { id: "fs-3", name: "Secondary Wing (9-10) Fee", fee_head: "Secondary Wing (9-10) Fee", amount: 45000, frequency: "QUARTERLY", late_fine_per_day: 15 },
      { id: "fs-4", name: "Senior Secondary (11-12) Science", fee_head: "Senior Secondary (11-12) Science", amount: 55000, frequency: "QUARTERLY", late_fine_per_day: 20 },
    ],
  },
  homework: [
    {
      id: "hw-1",
      title: "English Chapter 4 - Summary & Character Sketch",
      subject_name: "English",
      class_name: "10",
      section_name: "A",
      due_date: "2026-10-22",
      submissions_count: 32,
      total_students: 35,
    },
  ],
  cleanlinessZones: [
    {
      id: "zone-1",
      name: "Ground Floor Boys Washroom (Block A)",
      code: "WR-B-GF",
      category: "WASHROOM",
      location_block: "Academic Block A - Ground Floor",
      assigned_cleaner: "Ramesh Lal",
      cleaner_phone: "98765-43210",
      assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
      cleaning_frequency: "Twice Daily (Morning & Afternoon)",
      last_cleaned_at: "2026-10-22T08:30:00.000Z",
      last_cleaned_by: "Ramesh Lal",
      last_cleaned_tasks: ["Mopping with Phenyl & Disinfectant", "Dustbins Emptied & Liners Replaced", "Liquid Soap Refilled", "Urinal Flush Checked"],
      next_cleaning_scheduled_at: "2026-10-22T13:30:00.000Z",
      last_inspected_at: "2026-10-22T09:15:00.000Z",
      last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
      next_inspection_due_at: "2026-10-22T16:00:00.000Z",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.8,
      checklist_json: [
        { title: "Floor Cleanliness & Disinfection", passed: true },
        { title: "No Foul Odor / Fresh Ventilation", passed: true },
        { title: "Running Tap Water & No Leaks", passed: true },
        { title: "Liquid Soap & Hand Wash Stocked", passed: true },
        { title: "Dustbin Cleared with Garbage Bag", passed: true }
      ],
      latest_inspection_remarks: "All 6 cubicles cleaned and disinfected. Floor is dry and exhaust fan working properly.",
    },
    {
      id: "zone-2",
      name: "Ground Floor Girls Washroom (Block A)",
      code: "WR-G-GF",
      category: "WASHROOM",
      location_block: "Academic Block A - Ground Floor",
      assigned_cleaner: "Kamla Devi",
      cleaner_phone: "98765-43211",
      assigned_supervisor: "Smt. Sunita Sharma (Vice Principal)",
      cleaning_frequency: "Twice Daily (Morning & Afternoon)",
      last_cleaned_at: "2026-10-22T08:45:00.000Z",
      last_cleaned_by: "Kamla Devi",
      last_cleaned_tasks: ["Floor Disinfection", "Sanitary Napkin Incinerator Checked", "Mirrors Cleaned", "Liquid Soap Refilled"],
      next_cleaning_scheduled_at: "2026-10-22T13:45:00.000Z",
      last_inspected_at: "2026-10-22T09:30:00.000Z",
      last_inspected_by: "Smt. Sunita Sharma (Vice Principal)",
      next_inspection_due_at: "2026-10-22T16:30:00.000Z",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.9,
      checklist_json: [
        { title: "Floor Cleanliness & Disinfection", passed: true },
        { title: "Sanitary Disposal Bin Cleared", passed: true },
        { title: "Running Tap Water & Basin Clean", passed: true },
        { title: "Handwash & Paper Towels Available", passed: true },
        { title: "Mirrors & Counters Spotless", passed: true }
      ],
      latest_inspection_remarks: "Excellent hygiene maintained. Incinerator and sanitization unit functional.",
    },
    {
      id: "zone-3",
      name: "1st Floor Boys Washroom (Block B)",
      code: "WR-B-1F",
      category: "WASHROOM",
      location_block: "Secondary Wing Block B - 1st Floor",
      assigned_cleaner: "Suraj Pal",
      cleaner_phone: "98765-43212",
      assigned_supervisor: "Shri Mohan Lal (Supervisor)",
      cleaning_frequency: "Twice Daily",
      last_cleaned_at: "2026-10-22T07:45:00.000Z",
      last_cleaned_by: "Suraj Pal",
      last_cleaned_tasks: ["Basic Sweeping", "Floor Mopping"],
      next_cleaning_scheduled_at: "2026-10-22T12:00:00.000Z",
      last_inspected_at: "2026-10-21T16:00:00.000Z",
      last_inspected_by: "Shri Mohan Lal (Supervisor)",
      next_inspection_due_at: "2026-10-22T14:00:00.000Z",
      inspection_status: "NEEDS_ATTENTION",
      hygiene_rating: 3.5,
      checklist_json: [
        { title: "Floor Cleanliness & Disinfection", passed: true },
        { title: "No Foul Odor / Fresh Ventilation", passed: false },
        { title: "Running Tap Water & No Leaks", passed: false },
        { title: "Liquid Soap & Hand Wash Stocked", passed: true },
        { title: "Dustbin Cleared with Garbage Bag", passed: true }
      ],
      latest_inspection_remarks: "Slight leak in tap #2 reported. Cleaner notified to mop immediately before lunch break.",
    },
    {
      id: "zone-4",
      name: "Main Campus Garden & Central Green Lawn",
      code: "GDN-MAIN",
      category: "GARDEN_PARK",
      location_block: "Central Quadrangle & Front Gate Entrance",
      assigned_cleaner: "Mangat Ram (Head Gardener)",
      cleaner_phone: "98765-43214",
      assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
      cleaning_frequency: "Daily Morning & Regular Weeding",
      last_cleaned_at: "2026-10-22T07:15:00.000Z",
      last_cleaned_by: "Mangat Ram (Head Gardener)",
      last_cleaned_tasks: ["Grass Mowing & Edge Trimming", "Fallen Leaves Swept & Composted", "Flowerbed Weeding & Soil Aeration", "Pathway Swept & Sprinkled"],
      next_cleaning_scheduled_at: "2026-10-23T07:00:00.000Z",
      last_inspected_at: "2026-10-22T08:15:00.000Z",
      last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
      next_inspection_due_at: "2026-10-23T08:30:00.000Z",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 5.0,
      checklist_json: [
        { title: "Lawn Mowed & Grass Height Maintained", passed: true },
        { title: "Fallen Leaves & Organic Waste Cleared", passed: true },
        { title: "No Plastic / Candy Wrappers on Lawn", passed: true },
        { title: "Garden Benches & Statues Clean", passed: true },
        { title: "Sprinklers & Watering Completed", passed: true }
      ],
      latest_inspection_remarks: "Lawn freshly manicured for the morning assembly. Flower beds vibrant and weed-free.",
    },
    {
      id: "zone-5",
      name: "Kindergarten Play Park & Kids Garden",
      code: "PRK-KIDS",
      category: "GARDEN_PARK",
      location_block: "Junior Wing East Lawn",
      assigned_cleaner: "Shyam Singh",
      cleaner_phone: "98765-43215",
      assigned_supervisor: "Ms. Anjali Verma (Primary Head)",
      cleaning_frequency: "Daily (Before & After Playtime)",
      last_cleaned_at: "2026-10-22T08:00:00.000Z",
      last_cleaned_by: "Shyam Singh",
      last_cleaned_tasks: ["Swings, Slides & Seesaws Sanitized", "Sandpit Checked for Stones & Sharp Debris", "Lawn Litter Cleared", "Safety Soft Mats Disinfected"],
      next_cleaning_scheduled_at: "2026-10-22T14:30:00.000Z",
      last_inspected_at: "2026-10-22T08:30:00.000Z",
      last_inspected_by: "Ms. Anjali Verma (Primary Head)",
      next_inspection_due_at: "2026-10-22T15:00:00.000Z",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.9,
      checklist_json: [
        { title: "Play Equipment Clean & Disinfected", passed: true },
        { title: "Sandpit Levelled & Foreign Objects Removed", passed: true },
        { title: "Soft Rubber Flooring Sanitized", passed: true },
        { title: "Fencing & Gate Latches Secure", passed: true },
        { title: "Litter Bins Emptied", passed: true }
      ],
      latest_inspection_remarks: "Playground equipment sanitised. Safe for nursery and kindergarten students.",
    },
    {
      id: "zone-6",
      name: "RO Cold Drinking Water Station #1",
      code: "RO-COOL-1",
      category: "WATER_STATION",
      location_block: "Central Dining & Cafeteria Zone",
      assigned_cleaner: "Ramesh Lal",
      cleaner_phone: "98765-43210",
      assigned_supervisor: "Dr. Sunil Verma (Estate Officer)",
      cleaning_frequency: "Twice Daily & Weekly Filter Backwash",
      last_cleaned_at: "2026-10-22T08:15:00.000Z",
      last_cleaned_by: "Ramesh Lal",
      last_cleaned_tasks: ["Stainless Steel Basin Polished", "Drain Trays Flushed & Cleared", "TDS Level Checked (115 ppm)", "Surrounding Floor Mopped"],
      next_cleaning_scheduled_at: "2026-10-22T14:00:00.000Z",
      last_inspected_at: "2026-10-22T09:00:00.000Z",
      last_inspected_by: "Dr. Sunil Verma (Estate Officer)",
      next_inspection_due_at: "2026-10-23T09:00:00.000Z",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.9,
      checklist_json: [
        { title: "Water TDS Tested within 80-150 ppm", passed: true },
        { title: "Chiller Temperature 15°C Verified", passed: true },
        { title: "Stainless Steel Surface Cleaned", passed: true },
        { title: "No Water Clogging / Overflow in Drain", passed: true },
        { title: "UV Sterilizer Indicator Active", passed: true }
      ],
      latest_inspection_remarks: "TDS 115 ppm. Safe drinking water standards verified. Drainage flowing freely.",
    },
    {
      id: "zone-7",
      name: "Main Sports Complex & Football Playground",
      code: "PLY-MAIN",
      category: "PLAYGROUND",
      location_block: "Outdoor Sports Field & Running Track",
      assigned_cleaner: "Mangat Ram & Team",
      cleaner_phone: "98765-43214",
      assigned_supervisor: "Coach Devendra Singh (Sports Director)",
      cleaning_frequency: "Daily Afternoon & Pre-Match",
      last_cleaned_at: "2026-10-21T18:00:00.000Z",
      last_cleaned_by: "Mangat Ram & Team",
      last_cleaned_tasks: ["Running Track Debris Swept", "Football Pitch Rolling & Lining", "Boundary Dustbins Cleared"],
      next_cleaning_scheduled_at: "2026-10-22T17:30:00.000Z",
      last_inspected_at: "2026-10-21T18:30:00.000Z",
      last_inspected_by: "Coach Devendra Singh",
      next_inspection_due_at: "2026-10-22T18:00:00.000Z",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.8,
      checklist_json: [
        { title: "Track & Field Free from Stones & Glass", passed: true },
        { title: "Pitch Lines Marked & Grass Leveled", passed: true },
        { title: "Spectator Benches Clean", passed: true },
        { title: "Litter Cans Emptied Around Stadium", passed: true }
      ],
      latest_inspection_remarks: "Field ready for evening sports practice and athletics drills.",
    },
    {
      id: "zone-8",
      name: "Senior Wing Classrooms (Rooms 101 to 110) & Corridors",
      code: "CLS-SR-101",
      category: "CLASSROOM",
      location_block: "Academic Block B - 1st Floor",
      assigned_cleaner: "Suraj Pal",
      cleaner_phone: "98765-43212",
      assigned_supervisor: "Shri Mohan Lal (Supervisor)",
      cleaning_frequency: "Daily Morning & Post-School",
      last_cleaned_at: "2026-10-22T06:30:00.000Z",
      last_cleaned_by: "Suraj Pal",
      last_cleaned_tasks: ["Desks & Chairs Dusted", "Whiteboards Cleaned", "Floors Mopped", "Dustbins Emptied"],
      next_cleaning_scheduled_at: "2026-10-22T14:45:00.000Z",
      last_inspected_at: "2026-10-22T07:45:00.000Z",
      last_inspected_by: "Shri Mohan Lal (Supervisor)",
      next_inspection_due_at: "2026-10-22T15:30:00.000Z",
      inspection_status: "VERIFIED_CLEAN",
      hygiene_rating: 4.7,
      checklist_json: [
        { title: "Floors Swept & Mopped", passed: true },
        { title: "Student Benches Wiped Down", passed: true },
        { title: "Window Panes & Fans Dust-Free", passed: true },
        { title: "Classroom Waste Bins Cleaned", passed: true }
      ],
      latest_inspection_remarks: "Classrooms spotless before student arrival.",
    }
  ],
  cleanlinessInspections: [
    {
      id: "insp-1",
      zone_id: "zone-1",
      zone_name: "Ground Floor Boys Washroom (Block A)",
      category: "WASHROOM",
      log_type: "INSPECTION",
      action_date: "2026-10-22T09:15:00.000Z",
      performed_by: "Dr. Sunil Verma (Estate Officer)",
      role: "SUPERVISOR",
      rating: 4.8,
      status: "VERIFIED_CLEAN",
      checklist_results: ["Floor Cleanliness Passed", "No Foul Odor Passed", "Taps & Water Passed", "Soaps Refilled Passed", "Bins Cleared Passed"],
      next_scheduled_date: "2026-10-22T16:00:00.000Z",
      remarks: "Thoroughly disinfected. All urinals and flush sensors working flawlessly."
    },
    {
      id: "insp-2",
      zone_id: "zone-4",
      zone_name: "Main Campus Garden & Central Green Lawn",
      category: "GARDEN_PARK",
      log_type: "INSPECTION",
      action_date: "2026-10-22T08:15:00.000Z",
      performed_by: "Dr. Sunil Verma (Estate Officer)",
      role: "SUPERVISOR",
      rating: 5.0,
      status: "VERIFIED_CLEAN",
      checklist_results: ["Grass Trimmed Passed", "Leaves Cleared Passed", "No Plastic Passed", "Benches Clean Passed", "Plants Watered Passed"],
      next_scheduled_date: "2026-10-23T08:30:00.000Z",
      remarks: "Garden is looking lush, neat and completely clean for assembly."
    },
    {
      id: "insp-3",
      zone_id: "zone-2",
      zone_name: "Ground Floor Girls Washroom (Block A)",
      category: "WASHROOM",
      log_type: "INSPECTION",
      action_date: "2026-10-22T09:30:00.000Z",
      performed_by: "Smt. Sunita Sharma (Vice Principal)",
      role: "SUPERVISOR",
      rating: 4.9,
      status: "VERIFIED_CLEAN",
      checklist_results: ["Floors Disinfected Passed", "Incinerator Checked Passed", "Sanitizer Stocked Passed"],
      next_scheduled_date: "2026-10-22T16:30:00.000Z",
      remarks: "Very clean and properly sanitised."
    },
    {
      id: "insp-4",
      zone_id: "zone-3",
      zone_name: "1st Floor Boys Washroom (Block B)",
      category: "WASHROOM",
      log_type: "INSPECTION",
      action_date: "2026-10-21T16:00:00.000Z",
      performed_by: "Shri Mohan Lal (Supervisor)",
      role: "SUPERVISOR",
      rating: 3.5,
      status: "NEEDS_ATTENTION",
      checklist_results: ["Floor Damp", "Tap 2 Dripping"],
      next_scheduled_date: "2026-10-22T14:00:00.000Z",
      remarks: "Plumber informed to repair leaking tap 2. Second mopping needed."
    }
  ],
};

function getDB(): DBState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.cleanlinessZones || parsed.cleanlinessZones.length === 0) {
        parsed.cleanlinessZones = defaultState.cleanlinessZones;
        parsed.cleanlinessInspections = defaultState.cleanlinessInspections;
        saveDB(parsed);
      }
      if (!parsed.notices || parsed.notices.length === 0 || !parsed.notices.some((n: any) => n.category === "URGENT")) {
        parsed.notices = defaultState.notices;
        saveDB(parsed);
      }
      if (!parsed.fees || !parsed.fees.allocations || parsed.fees.allocations.length < 5 || !parsed.fees.allocations[0].first_name) {
        parsed.fees = defaultState.fees;
        saveDB(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.warn("Error reading offline DB:", e);
  }
  saveDB(defaultState);
  return defaultState;
}

function saveDB(data: DBState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Error saving offline DB:", e);
  }
}

let activeRequestsCount = 0;

export function notifyGlobalLoader(isLoading: boolean) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("radhix_erp_loading", {
        detail: { isLoading, count: activeRequestsCount },
      })
    );
  }
}

export function triggerGlobalLoader(durationMs: number = 350) {
  activeRequestsCount++;
  notifyGlobalLoader(true);
  setTimeout(() => {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    if (activeRequestsCount === 0) {
      notifyGlobalLoader(false);
    }
  }, durationMs);
}

export function initOfflineMockEngine() {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

    // Only intercept requests destined for the ERP backend
    const isBackendReq = url.includes("localhost:5000") || url.startsWith("/api/v1") || url.includes("/api/v1");

    if (!isBackendReq) {
      return originalFetch.apply(window, [input as any, init]);
    }

    activeRequestsCount++;
    notifyGlobalLoader(true);

    const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    try {
      // If running on Netlify or remote domain, DO NOT try localhost:5000 (blocked by browser HTTPS mixed content)
      if (!isLocalhost) {
        return handleMockRequest(url, init);
      }

      // On localhost, attempt real fetch first; fallback to mock if backend is down
      try {
        const response = await originalFetch.apply(window, [input as any, init]);
        if (response.ok) {
          return response;
        }
      } catch {
        // Backend is not running or network failed -> fallback to mock
      }

      return handleMockRequest(url, init);
    } finally {
      activeRequestsCount = Math.max(0, activeRequestsCount - 1);
      if (activeRequestsCount === 0) {
        notifyGlobalLoader(false);
      }
    }
  };

  console.info("⚡ Radhix ERP: Netlify Offline Mock Engine initialized with full persistence.");
}


function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function handleMockRequest(url: string, init?: RequestInit): Response {
  const method = (init?.method || "GET").toUpperCase();
  const db = getDB();
  const path = url.replace(/https?:\/\/[^/]+/, "");
  let body: any = {};
  if (init?.body && typeof init.body === "string") {
    try { body = JSON.parse(init.body); } catch { /* ignore */ }
  }

  // 1. AUTH ME
  if (path.includes("/api/v1/auth/me")) {
    const authHeader = (init?.headers as any)?.Authorization || (init?.headers as any)?.authorization || "";
    const isSuper = authHeader?.toLowerCase().includes("superadmin") || window.location.pathname.toLowerCase().includes("super-admin");
    if (isSuper) {
      return jsonResponse({
        success: true,
        user: { id: "super-1", username: "superadmin@radhix.com", email: "superadmin@radhix.com", phone: "9811122233", role: "SUPER_ADMIN" },
        institute: null,
      });
    }

    return jsonResponse({
      success: true,
      user: { id: "admin-1", username: "schooladmin@radhix.com", email: "schooladmin@radhix.com", phone: "9811122233", role: "INSTITUTE_ADMIN" },
      institute: db.institutes[0],
    });
  }

  // 2. AUTH LOGIN
  if (path.includes("/api/v1/auth/login") && method === "POST") {
    const { identifier, password } = body;
    const isSuper = identifier?.toLowerCase().includes("super") || window.location.pathname.toLowerCase().includes("super-admin") || password === "Admin@123";
    if (isSuper) {
      return jsonResponse({
        success: true,
        token: "demo-token-superadmin",
        user: { id: "super-1", username: identifier || "superadmin@radhix.com", email: "superadmin@radhix.com", phone: "9811122233", role: "SUPER_ADMIN" },
        institute: null,
      });
    }

    // Default School Admin login
    return jsonResponse({
      success: true,
      token: "demo-token-schooladmin",
      user: { id: "admin-1", username: identifier || "schooladmin@radhix.com", email: "schooladmin@radhix.com", phone: "9811122233", role: "INSTITUTE_ADMIN" },
      institute: db.institutes[0],
    });
  }

  // 2. DASHBOARD STATS
  if (path.includes("/api/v1/tenant-admin/dashboard-stats")) {
    return jsonResponse({
      success: true,
      data: {
        studentsCount: 1248,
        teachersCount: db.staff.length,
        attendancePercentage: 94.2,
        feesCollected: 288000,
        defaultersCount: 18,
        activeClasses: 24,
        upcomingEvents: 3,
        recentActivities: [
          { title: "Salary Disbursed for Sunita Sharma", time: "2 hours ago", type: "FINANCE" },
          { title: "Proxy Assigned: Ramesh Verma for Class 10-A", time: "3 hours ago", type: "LEAVE" },
          { title: "Live Class: Ray Optics started on Google Meet", time: "4 hours ago", type: "ONLINE_CLASS" },
        ],
      },
    });
  }

  // 3. TEACHER LEAVES & PROXY SUBSTITUTION
  if (path.includes("/api/v1/school-features/teacher-leaves")) {
    if (method === "GET") {
      return jsonResponse({ success: true, data: db.teacherLeaves });
    }

    if (method === "POST") {
      const newLeave = {
        id: "leave-" + Date.now(),
        staff_id: body.staff_id || "TCH-101",
        staff_name: body.staff_name || "Sunita Sharma",
        employee_code: "EMP-101",
        designation: "Science Faculty",
        leave_type: body.leave_type || "CASUAL",
        start_date: body.start_date || "2026-10-25",
        end_date: body.end_date || "2026-10-26",
        total_days: body.total_days || 2,
        reason: body.reason || "Personal work",
        status: "PENDING",
        substitute_staff_id: null,
        substitute_name: null,
        substitution_notes: null,
        applied_at: new Date().toISOString().slice(0, 16).replace("T", " "),
      };
      db.teacherLeaves.unshift(newLeave);
      saveDB(db);
      return jsonResponse({ success: true, data: newLeave });
    }

    if (path.includes("/assign-substitute") && (method === "PUT" || method === "POST")) {
      const leaveId = path.split("/")[ path.split("/").indexOf("teacher-leaves") + 1 ];
      const leave = db.teacherLeaves.find((l) => l.id === leaveId);
      if (leave) {
        leave.status = body.status || "APPROVED";
        leave.substitute_staff_id = body.substitute_staff_id || null;
        leave.substitute_name = body.substitute_name || null;
        leave.substitution_notes = body.substitution_notes || "";
        leave.admin_remarks = body.admin_remarks || "";
        saveDB(db);
        return jsonResponse({ success: true, data: leave });
      }
    }
  }

  // 4. FINANCE OVERVIEW
  if (path.includes("/api/v1/school-features/finance/overview")) {
    const salariesPaid = db.salaries.filter((s) => s.payment_status === "PAID").reduce((a, b) => a + Number(b.net_salary), 0);
    const salariesPending = db.salaries.filter((s) => s.payment_status === "PENDING").reduce((a, b) => a + Number(b.net_salary), 0);
    const transportPaid = db.transportExpenses.filter((t) => t.payment_status === "PAID").reduce((a, b) => a + Number(b.amount), 0);
    const transportPending = db.transportExpenses.filter((t) => t.payment_status === "PENDING").reduce((a, b) => a + Number(b.amount), 0);
    const totalInflow = 288000;
    const totalOutflow = salariesPaid + transportPaid;
    const netCashflow = totalInflow - totalOutflow;

    const recentTransactions: any[] = [];
    db.salaries.filter((s) => s.payment_status === "PAID").forEach((s) => {
      recentTransactions.push({
        id: s.id,
        type: "EXPENSE",
        category: "Staff Salary Disbursal",
        title: `Salary Paid - ${s.staff_name} (${s.designation}) [${s.month_year}]`,
        amount: s.net_salary,
        date: s.payment_date || "2026-10-05",
        status: "PAID",
        payment_mode: s.payment_mode,
        reference: s.voucher_number,
      });
    });
    db.transportExpenses.filter((t) => t.payment_status === "PAID").forEach((t) => {
      recentTransactions.push({
        id: t.id,
        type: "EXPENSE",
        category: "Vehicle Transport Expense",
        title: `${t.expense_type} - ${t.vehicle_number} (${t.vendor_or_payee})`,
        amount: t.amount,
        date: t.payment_date || "2026-10-07",
        status: "PAID",
        payment_mode: t.payment_mode,
        reference: t.receipt_number,
      });
    });
    recentTransactions.push({
      id: "rcpt-fee-1",
      type: "INCOME",
      category: "Student Fee Collection",
      title: "Fee Collected - Aarav Kumar (DPS-2026-001)",
      amount: 68000,
      date: "2026-10-15 10:45:00",
      status: "RECEIVED",
      payment_mode: "UPI",
      reference: "RCPT-2026-1003",
    });

    return jsonResponse({
      success: true,
      data: {
        totalInflow,
        totalOutflow,
        netCashflow,
        feesToday: 0,
        totalSalariesPaid: salariesPaid,
        totalSalariesPending: salariesPending,
        totalTransportPaid: transportPaid,
        totalTransportPending: transportPending,
        pendingPayables: salariesPending + transportPending,
        salariesCount: db.salaries.length,
        transportCount: db.transportExpenses.length,
        recentTransactions,
      },
    });
  }

  // 5. FINANCE SALARIES
  if (path.includes("/api/v1/school-features/finance/salaries")) {
    if (path.includes("/disburse") && method === "POST") {
      const { staff_id, month_year, basic_salary, allowance, deduction, payment_mode, transaction_ref, remarks } = body;
      const net = (Number(basic_salary) || 0) + (Number(allowance) || 0) - (Number(deduction) || 0);
      const staffMember = db.staff.find((st) => st.id === staff_id) || { full_name: "Staff Member", designation: "Faculty", department: "Academics" };

      const existingIndex = db.salaries.findIndex((s) => s.staff_id === staff_id && s.month_year === month_year);
      const record = {
        id: "sal-" + Date.now(),
        staff_id,
        staff_name: staffMember.full_name,
        designation: staffMember.designation,
        department: staffMember.department,
        month_year: month_year || "October 2026",
        basic_salary: Number(basic_salary) || 45000,
        allowance: Number(allowance) || 5000,
        deduction: Number(deduction) || 1000,
        net_salary: net,
        payment_status: "PAID",
        payment_mode: payment_mode || "BANK_TRANSFER",
        payment_date: new Date().toISOString().slice(0, 10),
        transaction_ref: transaction_ref || `TXN-SAL-${Date.now().toString().slice(-6)}`,
        voucher_number: `PAY-2026-${Date.now().toString().slice(-4)}`,
        remarks: remarks || "Disbursed via web admin portal",
      };

      if (existingIndex >= 0) {
        db.salaries[existingIndex] = record;
      } else {
        db.salaries.unshift(record);
      }
      saveDB(db);
      return jsonResponse({ success: true, data: record });
    }

    if (method === "GET") {
      return jsonResponse({ success: true, data: db.salaries });
    }
  }

  // 6. FINANCE TRANSPORT EXPENSES
  if (path.includes("/api/v1/school-features/finance/transport-expenses")) {
    if (path.includes("/pay") && (method === "PUT" || method === "POST")) {
      const expId = path.split("/")[ path.split("/").indexOf("transport-expenses") + 1 ];
      const exp = db.transportExpenses.find((e) => e.id === expId);
      if (exp) {
        exp.payment_status = "PAID";
        exp.payment_mode = body.payment_mode || "BANK_TRANSFER";
        exp.transaction_ref = body.transaction_ref || `TXN-${Date.now().toString().slice(-6)}`;
        exp.payment_date = new Date().toISOString().slice(0, 10);
        saveDB(db);
        return jsonResponse({ success: true, data: exp });
      }
    }

    if (method === "POST") {
      const newExp = {
        id: "trp-" + Date.now(),
        vehicle_id: body.vehicle_id || "v-1",
        vehicle_number: body.vehicle_number || "DL 01 AB 4321",
        expense_type: body.expense_type || "MONTHLY_CONTRACT",
        month_year: body.month_year || "October 2026",
        vendor_or_payee: body.vendor_or_payee || "Transport Contractor",
        amount: Number(body.amount) || 35000,
        payment_status: body.payment_status || "PAID",
        payment_mode: body.payment_mode || "BANK_TRANSFER",
        payment_date: new Date().toISOString().slice(0, 10),
        transaction_ref: body.transaction_ref || `TXN-${Date.now().toString().slice(-6)}`,
        receipt_number: `TRP-2026-${Date.now().toString().slice(-3)}`,
        notes: body.notes || "Recorded via web admin",
      };
      db.transportExpenses.unshift(newExp);
      saveDB(db);
      return jsonResponse({ success: true, data: newExp });
    }

    if (method === "GET") {
      return jsonResponse({ success: true, data: db.transportExpenses });
    }
  }

  // 7. ONLINE CLASSES
  if (path.includes("/api/v1/school-features/online-classes")) {
    if (method === "GET") {
      return jsonResponse({ success: true, data: db.onlineClasses });
    }

    if (method === "POST") {
      const newClass = {
        id: "cls-" + Date.now(),
        class_name: body.class_name || "Class 10",
        section_name: body.section_name || "A",
        subject_name: body.subject_name || "General Subject",
        teacher_name: body.teacher_name || "Sunita Sharma",
        topic: body.topic || "Online Class Topic",
        class_date: body.class_date || new Date().toISOString().slice(0, 10),
        start_time: body.start_time || "10:00 AM",
        end_time: body.end_time || "10:45 AM",
        platform: body.platform || "Google Meet",
        meeting_link: body.meeting_link || "https://meet.google.com/new",
        passcode: body.passcode || "",
        status: body.status || "SCHEDULED",
        instructions: body.instructions || "",
      };
      db.onlineClasses.unshift(newClass);
      saveDB(db);
      return jsonResponse({ success: true, data: newClass });
    }

    if (method === "PUT") {
      const classId = path.split("/").pop();
      const cls = db.onlineClasses.find((c) => c.id === classId);
      if (cls) {
        Object.assign(cls, body);
        saveDB(db);
        return jsonResponse({ success: true, data: cls });
      }
    }

    if (method === "DELETE") {
      const classId = path.split("/").pop();
      db.onlineClasses = db.onlineClasses.filter((c) => c.id !== classId);
      saveDB(db);
      return jsonResponse({ success: true, message: "Class deleted successfully" });
    }
  }

  // 8. STAFF DIRECTORY
  if (path.includes("/api/v1/staff")) {
    if (method === "GET") return jsonResponse({ success: true, data: db.staff });
    if (method === "POST") {
      const newStaff = { id: "TCH-" + Date.now().toString().slice(-3), ...body, status: "ACTIVE" };
      db.staff.push(newStaff);
      saveDB(db);
      return jsonResponse({ success: true, data: newStaff });
    }
  }

  // 9. TRANSPORT VEHICLES & DRIVERS
  if (path.includes("/api/v1/school-features/transport/vehicles")) {
    if (method === "GET") return jsonResponse({ success: true, data: db.vehicles });
    if (method === "POST") {
      const newV = { id: "v-" + Date.now(), ...body };
      db.vehicles.push(newV);
      saveDB(db);
      return jsonResponse({ success: true, data: newV });
    }
  }
  if (path.includes("/api/v1/school-features/transport/drivers")) {
    if (method === "GET") return jsonResponse({ success: true, data: db.drivers });
    if (method === "POST") {
      const newD = { id: "drv-" + Date.now(), ...body };
      db.drivers.push(newD);
      saveDB(db);
      return jsonResponse({ success: true, data: newD });
    }
  }

  // 10. NOTICES
  if (path.includes("/api/v1/notices")) {
    if (method === "GET") return jsonResponse({ success: true, data: db.notices });
    if (method === "POST") {
      const newNotice = { id: "ntc-" + Date.now(), ...body, created_at: new Date().toISOString().slice(0, 10) };
      db.notices.unshift(newNotice);
      saveDB(db);
      return jsonResponse({ success: true, data: newNotice });
    }
  }

  // 11. FEES
  if (path.includes("/api/v1/fees/allocations")) {
    return jsonResponse({ success: true, data: db.fees.allocations });
  }
  if (path.includes("/api/v1/fees/structures")) {
    return jsonResponse({ success: true, data: db.fees.structures });
  }
  if (path.includes("/api/v1/fees/defaulters-summary")) {
    return jsonResponse({ success: true, data: { totalDefaulters: 18, totalOverdueAmount: 245000 } });
  }
  if (path.includes("/api/v1/fees/collect-offline")) {
    return jsonResponse({ success: true, data: { receiptNumber: `RCPT-2026-${Date.now().toString().slice(-4)}` } });
  }

  // 12. HOMEWORK
  if (path.includes("/api/v1/homework")) {
    return jsonResponse({ success: true, data: db.homework });
  }

  // 13. SUPER ADMIN INSTITUTES & PLANS
  if (path.includes("/api/v1/super-admin/institutes")) {
    if (path.includes("/status") && method === "PUT") {
      const instId = path.split("/")[ path.split("/").indexOf("institutes") + 1 ];
      const inst = db.institutes.find((i) => i.id === instId);
      if (inst) {
        inst.status = body.status || (inst.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
        saveDB(db);
        return jsonResponse({ success: true, data: inst });
      }
    }
    if (path.includes("/plan") && method === "PUT") {
      const instId = path.split("/")[ path.split("/").indexOf("institutes") + 1 ];
      const inst = db.institutes.find((i) => i.id === instId);
      if (inst) {
        inst.planName = body.planName || "Enterprise Tier";
        saveDB(db);
        return jsonResponse({ success: true, data: inst });
      }
    }
    if (path.includes("/details")) {
      const instId = path.split("/")[ path.split("/").indexOf("institutes") + 1 ];
      const inst = db.institutes.find((i) => i.id === instId) || db.institutes[0];
      return jsonResponse({
        success: true,
        data: {
          institute: inst,
          stats: { totalStudents: 1248, totalStaff: db.staff.length, totalRevenue: 288000 },
        },
      });
    }
    if (method === "GET") return jsonResponse({ success: true, data: db.institutes });
    if (method === "POST") {
      const newInst = { id: "inst-" + Date.now(), ...body, status: "ACTIVE", studentCount: 0, createdAt: new Date().toISOString().slice(0, 10) };
      db.institutes.push(newInst);
      saveDB(db);
      return jsonResponse({ success: true, data: newInst });
    }
  }
  if (path.includes("/api/v1/super-admin/plans")) {
    return jsonResponse({ success: true, data: db.plans });
  }

  // 14. ACADEMIC CLASSES & COURSES
  if (path.includes("/api/v1/academic/classes")) {
    return jsonResponse({
      success: true,
      data: [
        { id: "c-10", name: "Class 10", code: "10" },
        { id: "c-9", name: "Class 9", code: "9" },
        { id: "c-11", name: "Class 11", code: "11" },
        { id: "c-12", name: "Class 12", code: "12" },
      ],
    });
  }
  if (path.includes("/api/v1/academic/courses")) {
    return jsonResponse({
      success: true,
      data: [
        { id: "crs-1", name: "Science", code: "SCI" },
        { id: "crs-2", name: "Mathematics", code: "MATH" },
        { id: "crs-3", name: "English Literature", code: "ENG" },
        { id: "crs-4", name: "Physics", code: "PHY" },
      ],
    });
  }

  // 15. ATTENDANCE
  if (path.includes("/api/v1/attendance")) {
    return jsonResponse({
      success: true,
      data: [
        { id: "att-1", student_id: "std-1", student_name: "Aarav Kumar", roll_number: "101", status: "PRESENT" },
        { id: "att-2", student_id: "std-2", student_name: "Ananya Sharma", roll_number: "102", status: "PRESENT" },
        { id: "att-3", student_id: "std-3", student_name: "Rohan Verma", roll_number: "103", status: "ABSENT" },
        { id: "att-4", student_id: "std-4", student_name: "Diya Patel", roll_number: "104", status: "PRESENT" },
      ],
    });
  }

  // 16. CAMPUS CLEANLINESS & HYGIENE INSPECTION
  if (path.includes("/cleanliness/zones")) {
    if (method === "GET") {
      return jsonResponse({ success: true, data: db.cleanlinessZones || [] });
    }
    if (method === "POST") {
      const newZone = {
        id: "zone-" + Date.now(),
        ...body,
        last_cleaned_at: body.last_cleaned_at || new Date().toISOString(),
        last_cleaned_by: body.assigned_cleaner || "Staff Cleaner",
        last_cleaned_tasks: body.last_cleaned_tasks || ["Initial Sanitization"],
        next_cleaning_scheduled_at: body.next_cleaning_scheduled_at || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        last_inspected_at: null,
        last_inspected_by: null,
        next_inspection_due_at: body.next_inspection_due_at || new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        inspection_status: "VERIFIED_CLEAN",
        hygiene_rating: 5.0,
        checklist_json: body.checklist_json || [],
        latest_inspection_remarks: "Zone successfully registered & ready for regular monitoring.",
      };
      db.cleanlinessZones.unshift(newZone);
      saveDB(db);
      return jsonResponse({ success: true, data: newZone });
    }
    if (method === "DELETE") {
      const zId = path.split("/").pop();
      db.cleanlinessZones = db.cleanlinessZones.filter((z) => z.id !== zId);
      saveDB(db);
      return jsonResponse({ success: true, message: "Zone removed." });
    }
  }

  if (path.includes("/cleanliness/log-cleaning") && method === "POST") {
    const { zone_id, cleaned_by, tasks, next_cleaning_scheduled_at, remarks } = body;
    const zone = db.cleanlinessZones.find((z) => z.id === zone_id);
    const now = new Date().toISOString();
    if (zone) {
      zone.last_cleaned_at = now;
      zone.last_cleaned_by = cleaned_by || zone.assigned_cleaner;
      zone.last_cleaned_tasks = tasks || ["Mopping & Sanitization"];
      zone.next_cleaning_scheduled_at = next_cleaning_scheduled_at || new Date(Date.now() + 4 * 3600 * 1000).toISOString();
      zone.inspection_status = "PENDING_INSPECTION";
    }
    const newLog = {
      id: "log-" + Date.now(),
      zone_id,
      zone_name: zone ? zone.name : "Facility Zone",
      category: zone ? zone.category : "WASHROOM",
      log_type: "CLEANING_LOG",
      action_date: now,
      performed_by: cleaned_by || (zone ? zone.assigned_cleaner : "Cleaner"),
      role: "JANITOR",
      rating: null,
      status: "CLEANED",
      checklist_results: tasks || [],
      next_scheduled_date: next_cleaning_scheduled_at,
      remarks: remarks || "Regular scheduled cleaning executed.",
    };
    db.cleanlinessInspections = db.cleanlinessInspections || [];
    db.cleanlinessInspections.unshift(newLog);
    saveDB(db);
    return jsonResponse({ success: true, message: "Cleaning logged successfully", data: zone });
  }

  if (path.includes("/cleanliness/conduct-inspection") && method === "POST") {
    const { zone_id, inspector_name, rating, status, checklist, next_inspection_due_at, remarks } = body;
    const zone = db.cleanlinessZones.find((z) => z.id === zone_id);
    const now = new Date().toISOString();
    if (zone) {
      zone.last_inspected_at = now;
      zone.last_inspected_by = inspector_name || "Campus Supervisor";
      zone.next_inspection_due_at = next_inspection_due_at || new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      zone.inspection_status = status || "VERIFIED_CLEAN";
      zone.hygiene_rating = Number(rating) || 5.0;
      zone.checklist_json = checklist || zone.checklist_json || [];
      zone.latest_inspection_remarks = remarks || "Hygiene verified.";
    }
    const newInsp = {
      id: "insp-" + Date.now(),
      zone_id,
      zone_name: zone ? zone.name : "Facility Zone",
      category: zone ? zone.category : "WASHROOM",
      log_type: "INSPECTION",
      action_date: now,
      performed_by: inspector_name || "Campus Supervisor",
      role: "SUPERVISOR",
      rating: Number(rating) || 5.0,
      status: status || "VERIFIED_CLEAN",
      checklist_results: (checklist || []).map((c: any) => `${c.title}: ${c.passed ? "Passed" : "Needs Attention"}`),
      next_scheduled_date: next_inspection_due_at,
      remarks: remarks || "Hygiene verified.",
    };
    db.cleanlinessInspections = db.cleanlinessInspections || [];
    db.cleanlinessInspections.unshift(newInsp);
    saveDB(db);
    return jsonResponse({ success: true, message: "Inspection audit saved successfully", data: zone });
  }

  if (path.includes("/cleanliness/history")) {
    return jsonResponse({ success: true, data: db.cleanlinessInspections || [] });
  }

  // 17. NOTICES & CIRCULARS
  if (path.includes("/api/v1/notices")) {
    if (method === "GET") {
      return jsonResponse({ success: true, data: db.notices || [] });
    }
    if (method === "POST") {
      const newNotice = {
        id: "ntc-" + Date.now(),
        title: body.title || "School Notice",
        content: body.content || "",
        target_audience: body.target_audience || "ALL",
        category: body.category || "GENERAL",
        priority: body.priority || "NORMAL",
        attachment_url: body.attachment_url || null,
        created_by: body.created_by || "Office of the Principal",
        published_at: new Date().toISOString(),
      };
      db.notices = db.notices || [];
      db.notices.unshift(newNotice);
      saveDB(db);
      return jsonResponse({ success: true, data: newNotice, message: "Notice published successfully." });
    }
    if (method === "DELETE") {
      const parts = path.split("/");
      const ntcId = parts[parts.length - 1];
      db.notices = (db.notices || []).filter((n: any) => n.id !== ntcId);
      saveDB(db);
      return jsonResponse({ success: true, message: "Notice archived/deleted." });
    }
  }

  // 18. FEES MANAGEMENT & REMINDERS
  if (path.includes("/api/v1/fees")) {
    if (path.includes("/allocations")) {
      return jsonResponse({ success: true, data: db.fees.allocations || [] });
    }

    if (path.includes("/structures")) {
      if (method === "GET") return jsonResponse({ success: true, data: db.fees.structures || [] });
      if (method === "POST") {
        const newStruct = {
          id: "fs-" + Date.now(),
          fee_head: body.fee_head || "General Fee Head",
          name: body.fee_head || "General Fee Head",
          amount: Number(body.amount) || 10000,
          frequency: body.frequency || "QUARTERLY",
          late_fine_per_day: Number(body.late_fine_per_day) || 15,
        };
        db.fees.structures = db.fees.structures || [];
        db.fees.structures.push(newStruct);
        saveDB(db);
        return jsonResponse({ success: true, message: "Fee structure configured", data: newStruct });
      }
    }

    if (path.includes("/defaulters-summary")) {
      const pendingAllocations = (db.fees.allocations || []).filter((a: any) => a.status !== "PAID");
      const totalOutstanding = pendingAllocations.reduce((sum: number, a: any) => sum + (Number(a.net_amount) - Number(a.paid_amount)), 0);
      return jsonResponse({
        success: true,
        totalOutstanding,
        defaulterCount: pendingAllocations.length,
        defaulters: pendingAllocations,
      });
    }

    if (path.includes("/collect-offline") && method === "POST") {
      const { allocation_id, amount_paid, payment_mode, remarks } = body;
      const target = (db.fees.allocations || []).find((a: any) => a.id === allocation_id);
      if (target) {
        const numPaid = Number(amount_paid) || 0;
        const newPaidTotal = Number(target.paid_amount || 0) + numPaid;
        const netAmount = Number(target.net_amount || 0);
        target.paid_amount = newPaidTotal;
        target.status = newPaidTotal >= netAmount ? "PAID" : "PARTIAL";
        target.payment_mode = payment_mode || "COUNTER CASH";
        target.paid_date = new Date().toISOString().slice(0, 10);
        const receiptNumber = `REC-2026-DPS-${Math.floor(1000 + Math.random() * 9000)}`;
        target.receipt_number = receiptNumber;
        saveDB(db);
        return jsonResponse({
          success: true,
          message: "Payment successfully recorded.",
          receiptNumber,
          data: target,
        });
      }
    }

    if (path.includes("/send-reminder") && method === "POST") {
      const { allocation_id, channels } = body;
      const target = (db.fees.allocations || []).find((a: any) => a.id === allocation_id);
      if (target) {
        target.last_reminder_sent_at = new Date().toISOString();
        saveDB(db);
        return jsonResponse({
          success: true,
          message: `Fee reminder notification sent successfully to parent ${target.parent_name || ""} (${target.parent_phone || ""})`,
          sentAt: target.last_reminder_sent_at,
          channels: channels || ["WHATSAPP", "SMS"],
        });
      }
    }

    if (path.includes("/send-bulk-reminders") && method === "POST") {
      const now = new Date().toISOString();
      const count = (db.fees.allocations || []).filter((a: any) => a.status !== "PAID").length;
      (db.fees.allocations || []).forEach((a: any) => {
        if (a.status !== "PAID") {
          a.last_reminder_sent_at = now;
        }
      });
      saveDB(db);
      return jsonResponse({
        success: true,
        message: `Bulk fee reminders dispatched to ${count} parents via WhatsApp & SMS.`,
        dispatchedCount: count,
        sentAt: now,
      });
    }

    if (path.includes("/receipt/")) {
      const rNum = path.split("/").pop();
      const alloc = (db.fees.allocations || []).find((a: any) => a.receipt_number === rNum) || (db.fees.allocations || [])[0];
      return jsonResponse({
        success: true,
        data: {
          receiptNumber: alloc?.receipt_number || "REC-2026-DPS-1001",
          paymentDate: alloc?.paid_date || new Date().toISOString().slice(0, 10),
          paymentMode: alloc?.payment_mode || "UPI Online",
          amountPaid: alloc?.paid_amount || 45000,
          collectedBy: "Accounts Office Counter",
          institute: {
            name: "Delhi Public Academy",
            code: "DPS",
            address: "Sector 14, Institutional Area",
            city: "New Delhi",
            state: "Delhi",
            phone: "+91 98111-22334",
          },
          student: {
            name: `${alloc?.first_name || "Aarav"} ${alloc?.last_name || "Kumar"}`,
            admissionNumber: alloc?.admission_number || "DPS-2026-001",
            rollNumber: alloc?.roll_number || "12",
            parentName: alloc?.parent_name || "Rajesh Kumar",
          },
          feeDetails: {
            feeHead: alloc?.fee_head || "Tuition & Institutional Fee",
            frequency: alloc?.frequency || "QUARTERLY",
            dueAmountBeforePayment: alloc?.net_amount || 45000,
            remainingBalance: Math.max(0, Number(alloc?.net_amount || 0) - Number(alloc?.paid_amount || 0)),
          },
          copies: ["STUDENT COPY", "INSTITUTE / OFFICE COPY", "BANK / ACCOUNTS COPY"],
        },
      });
    }
  }

  // Fallback generic 200
  return jsonResponse({ success: true, message: "OK", data: [] });
}

