import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../database/connection";
import { config } from "../../config";
import { authenticateJWT } from "../../middleware/auth";

const router = Router();

// Universal Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: "Please provide both identifier and password" });
      return;
    }

    const trimmed = identifier.trim();

    // 1. Direct match on users table
    let user = await db("users")
      .where({ username: trimmed })
      .orWhere({ email: trimmed })
      .orWhere({ phone: trimmed })
      .first();

    // 2. If not found, check student admission number
    if (!user) {
      const student = await db("student_profiles").where({ admission_number: trimmed }).first();
      if (student) {
        user = await db("users").where({ id: student.user_id }).first();
      }
    }

    // 3. If not found, check staff employee code
    if (!user) {
      const staff = await db("staff_profiles").where({ employee_code: trimmed }).first();
      if (staff) {
        user = await db("users").where({ id: staff.user_id }).first();
      }
    }

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials or account not found" });
      return;
    }

    if (!user.is_active) {
      res.status(403).json({ success: false, message: "Your user account is deactivated" });
      return;
    }

    // Password verification
    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Incorrect password" });
      return;
    }

    let institute = null;
    let studentProfile = null;
    let staffProfile = null;

    if (user.institute_id) {
      institute = await db("institutes").where({ id: user.institute_id }).first();
      if (!institute) {
        res.status(404).json({ success: false, message: "Assigned institute does not exist" });
        return;
      }

      if (institute.status !== "ACTIVE") {
        res.status(403).json({
          success: false,
          message: "Your institute's subscription has been suspended. Please contact your administration or Radhix Technology.",
          instituteStatus: institute.status,
        });
        return;
      }

      // Parse JSON enabled_modules if string
      if (typeof institute.enabled_modules === "string") {
        try {
          institute.enabled_modules = JSON.parse(institute.enabled_modules);
        } catch {
          institute.enabled_modules = [];
        }
      }

      // Fetch student profile if student
      if (user.role === "STUDENT") {
        studentProfile = await db("student_profiles").where({ user_id: user.id }).first();
      } else if (user.role === "PARENT") {
        studentProfile = await db("student_profiles").where({ parent_phone: user.phone }).orWhere({ institute_id: user.institute_id }).first();
      }

      // Fetch staff profile if teacher or staff
      if (["TEACHER", "STAFF", "INSTITUTE_ADMIN"].includes(user.role)) {
        staffProfile = await db("staff_profiles").where({ user_id: user.id }).first();
      }
    }

    // Generate JWT
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      instituteId: user.institute_id,
      instituteType: institute ? institute.institute_type : null,
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: (config.jwt.expiresIn as any),
    });

    // Update last_login
    await db("users").where({ id: user.id }).update({ last_login: db.fn.now() });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        forcePasswordChange: !!user.force_password_change,
      },
      institute: institute
        ? {
            id: institute.id,
            name: institute.name,
            code: institute.code,
            type: institute.institute_type, // "SCHOOL" or "COLLEGE"
            logoUrl: institute.logo_url,
            planName: institute.plan_name,
            enabledModules: institute.enabled_modules,
          }
        : null,
      studentProfile,
      staffProfile,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error during authentication" });
  }
});

// Profile / Current User
router.get("/me", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await db("users").where({ id: req.user!.userId }).first();
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    let institute = null;
    let studentProfile = null;
    let staffProfile = null;

    if (user.institute_id) {
      institute = await db("institutes").where({ id: user.institute_id }).first();
      if (user.role === "STUDENT") {
        studentProfile = await db("student_profiles").where({ user_id: user.id }).first();
      } else if (user.role === "PARENT") {
        studentProfile = await db("student_profiles").where({ parent_phone: user.phone }).orWhere({ institute_id: user.institute_id }).first();
      }
      if (["TEACHER", "STAFF", "INSTITUTE_ADMIN"].includes(user.role)) {
        staffProfile = await db("staff_profiles").where({ user_id: user.id }).first();
      }
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        forcePasswordChange: !!user.force_password_change,
      },
      institute: institute
        ? {
            ...institute,
            type: institute.institute_type,
          }
        : null,
      studentProfile,
      staffProfile,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Force Password Change
router.post("/change-password", authenticateJWT, async (req: Request, res: Response): Promise<void> => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      return;
    }

    const hashed = bcrypt.hashSync(newPassword, 10);
    await db("users").where({ id: req.user!.userId }).update({
      password_hash: hashed,
      force_password_change: false,
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public Self-Registration for Schools & Colleges (Customer SaaS Portal)
router.post("/register-school", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      code,
      institute_type = "SCHOOL",
      email,
      phone,
      address,
      city,
      state,
      logo_url,
      plan_name = "Solution (Targeted)",
      billing_cycle = "ANNUAL",
      student_limit,
      staff_limit,
      admin_name,
      admin_email,
      admin_password,
      admin_phone,
      payment_id,
      payment_method,
      amount_paid,
      affiliation_board,
    } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: "School / Institute name is required" });
      return;
    }

    const effectiveAdminEmail = (admin_email && admin_email.trim()) || (email && email.trim());
    if (!effectiveAdminEmail) {
      res.status(400).json({ success: false, message: "Administrator email (Login ID) is required" });
      return;
    }

    const effectiveAdminPassword = (admin_password && admin_password.trim()) || "School@123";

    // Auto-generate clean Institute Code if not provided
    let instituteCode = code && code.trim() ? code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
    if (!instituteCode) {
      const prefix = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase() || "SCH";
      instituteCode = `${prefix}${Math.floor(100 + Math.random() * 900)}`;
    }

    // Check code collision
    const existingInst = await db("institutes").where({ code: instituteCode }).first();
    if (existingInst) {
      instituteCode = `${instituteCode}${Math.floor(10 + Math.random() * 89)}`;
    }

    // Check user email collision
    const existingUser = await db("users")
      .where({ username: effectiveAdminEmail })
      .orWhere({ email: effectiveAdminEmail })
      .first();

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: `Account with email '${effectiveAdminEmail}' already exists. Please use another email or login.`,
      });
      return;
    }

    const instituteId = uuidv4();
    const adminUserId = uuidv4();
    const finalPassword = effectiveAdminPassword;

    // Determine limits based on plan
    let calculatedStudentLimit = student_limit ? Number(student_limit) : 1500;
    let calculatedStaffLimit = staff_limit ? Number(staff_limit) : 80;

    if (plan_name.toLowerCase().includes("basic") || plan_name.toLowerCase().includes("foundation")) {
      calculatedStudentLimit = 300;
      calculatedStaffLimit = 30;
    } else if (
      plan_name.toLowerCase().includes("full") ||
      plan_name.toLowerCase().includes("digit-all") ||
      plan_name.toLowerCase().includes("enterprise")
    ) {
      calculatedStudentLimit = 5000;
      calculatedStaffLimit = 250;
    }

    // 1. Insert Institute
    await db("institutes").insert({
      id: instituteId,
      name: name.trim(),
      code: instituteCode,
      institute_type: ["SCHOOL", "COLLEGE"].includes(institute_type) ? institute_type : "SCHOOL",
      email: email ? email.trim() : effectiveAdminEmail,
      phone: phone || admin_phone || "",
      address: address || "",
      city: city || "",
      state: state || "",
      logo_url: logo_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",
      status: "ACTIVE",
      plan_name: plan_name,
      student_limit: calculatedStudentLimit,
      staff_limit: calculatedStaffLimit,
      validity_start: new Date().toISOString().split("T")[0],
      validity_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      enabled_modules: JSON.stringify([
        "admissions",
        "attendance",
        "fees",
        "exams",
        "homework",
        "notices",
        "transport",
        "counsellor",
        "finance",
        "cleanliness",
      ]),
    });

    // 2. Insert Institute Admin User
    await db("users").insert({
      id: adminUserId,
      institute_id: instituteId,
      username: effectiveAdminEmail,
      email: effectiveAdminEmail,
      phone: admin_phone || phone || "",
      password_hash: bcrypt.hashSync(finalPassword, 10),
      role: "INSTITUTE_ADMIN",
      is_active: true,
      force_password_change: false,
    });

    // 3. Create initial Academic Year
    const currentYear = new Date().getFullYear();
    await db("academic_years").insert({
      id: uuidv4(),
      institute_id: instituteId,
      name: `${currentYear}-${currentYear + 1}`,
      start_date: `${currentYear}-04-01`,
      end_date: `${currentYear + 1}-03-31`,
      is_current: true,
    });

    // 4. Create default classes & sections
    const defaultClasses = ["Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
    for (let i = 0; i < defaultClasses.length; i++) {
      const classId = uuidv4();
      await db("school_classes").insert({
        id: classId,
        institute_id: instituteId,
        name: defaultClasses[i],
        numeric_order: i + 1,
      });
      await db("sections").insert([
        {
          id: uuidv4(),
          institute_id: instituteId,
          class_id: classId,
          name: "A",
          room_number: `R-${101 + i}`,
        },
        {
          id: uuidv4(),
          institute_id: instituteId,
          class_id: classId,
          name: "B",
          room_number: `R-${201 + i}`,
        },
      ]);
    }

    // 5. Create Principal staff profile
    await db("staff_profiles").insert({
      id: uuidv4(),
      institute_id: instituteId,
      user_id: adminUserId,
      employee_code: `${instituteCode}-ADMIN`,
      first_name: admin_name ? admin_name.split(" ")[0] : "Principal",
      last_name: admin_name && admin_name.includes(" ") ? admin_name.split(" ").slice(1).join(" ") : "In-Charge",
      designation: "Principal & Head of School",
      department: "Administration",
      phone: admin_phone || phone || "",
      joining_date: new Date().toISOString().split("T")[0],
      qualification: "M.Ed, Ph.D Education Administration",
    });

    // 6. Generate immediate JWT auth token so user can login in 1-click
    const tokenPayload = {
      userId: adminUserId,
      username: effectiveAdminEmail,
      role: "INSTITUTE_ADMIN",
      instituteId: instituteId,
      instituteType: institute_type || "SCHOOL",
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    const instituteData = {
      id: instituteId,
      name: name.trim(),
      code: instituteCode,
      type: institute_type || "SCHOOL",
      logo_url: logo_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",
      logoUrl: logo_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=128&q=80",
      address: address || "Campus Block A, Institutional Area",
      city: city || "New Delhi",
      state: state || "Delhi",
      phone: phone || "011-87654321",
      email: effectiveAdminEmail,
      affiliation_board: affiliation_board || "CBSE Affiliated",
      planName: plan_name,
      studentLimit: calculatedStudentLimit,
    };

    const adminUserData = {
      id: adminUserId,
      username: effectiveAdminEmail,
      email: effectiveAdminEmail,
      role: "INSTITUTE_ADMIN",
      forcePasswordChange: false,
    };

    res.status(201).json({
      success: true,
      message: "School registered and provisioned successfully!",
      token,
      user: adminUserData,
      institute: instituteData,
      data: {
        instituteId,
        schoolName: name.trim(),
        schoolCode: instituteCode,
        logoUrl: logo_url,
        dedicatedUrl: `http://localhost:5174/admin?tenant=${instituteCode}`,
        portalUrl: `http://localhost:5174/admin`,
        adminCredentials: {
          username: effectiveAdminEmail,
          email: effectiveAdminEmail,
          password: finalPassword,
          role: "INSTITUTE_ADMIN",
        },
        plan: {
          name: plan_name,
          billingCycle: billing_cycle,
          studentLimit: calculatedStudentLimit,
          staffLimit: calculatedStaffLimit,
          paymentId: payment_id || `PAY_${Date.now()}`,
          paymentMethod: payment_method || "UPI / Online Gateway",
          amountPaid: amount_paid || 0,
        },
      },
    });
  } catch (err: any) {
    console.error("Error in /register-school:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to register school" });
  }
});

export default router;

