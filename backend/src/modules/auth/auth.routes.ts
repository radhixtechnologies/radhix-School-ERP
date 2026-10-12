import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

export default router;

