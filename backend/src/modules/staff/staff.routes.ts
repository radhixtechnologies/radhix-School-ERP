import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../database/connection";
import { authenticateJWT, requireRole } from "../../middleware/auth";
import { requireActiveTenant } from "../../middleware/tenant";

const router = Router();

router.use(authenticateJWT);
router.use(requireActiveTenant);

// List Staff
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await db("staff_profiles")
      .join("users", "staff_profiles.user_id", "=", "users.id")
      .where("staff_profiles.institute_id", req.tenantId!)
      .select(
        "staff_profiles.*",
        "users.email",
        "users.username",
        "users.role",
        "users.is_active"
      )
      .orderBy("staff_profiles.first_name", "asc");

    res.json({ success: true, data: staff });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Staff
router.post("/", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      designation,
      department,
      qualification,
      joining_date,
      role, // "TEACHER" or "STAFF"
      password,
    } = req.body;

    if (!first_name || !email || !designation) {
      res.status(400).json({ success: false, message: "first_name, email, and designation are required" });
      return;
    }

    // Check staff count limit for plan
    const inst = await db("institutes").where({ id: req.tenantId! }).first();
    const currentStaffCount = await db("staff_profiles").where({ institute_id: req.tenantId! }).count("id as count").first();
    if (inst && inst.staff_limit && Number(currentStaffCount?.count || 0) >= inst.staff_limit) {
      res.status(403).json({
        success: false,
        message: `Staff limit reached for your plan (${inst.staff_limit}). Please contact Super Admin to upgrade.`,
      });
      return;
    }

    // Check username/email collision
    const existingUser = await db("users").where({ username: email.trim() }).orWhere({ email: email.trim() }).first();
    if (existingUser) {
      res.status(400).json({ success: false, message: `Email '${email}' is already registered.` });
      return;
    }

    const employeeCode = "EMP-" + Math.floor(1000 + Math.random() * 9000);
    const initialPassword = password && password.trim() ? password.trim() : "Staff@" + Math.floor(1000 + Math.random() * 9000);

    const userId = uuidv4();
    await db("users").insert({
      id: userId,
      institute_id: req.tenantId!,
      username: email.trim(),
      email: email.trim(),
      phone: phone || "",
      password_hash: bcrypt.hashSync(initialPassword, 10),
      role: role === "STAFF" ? "STAFF" : "TEACHER",
      is_active: true,
      force_password_change: true,
    });

    const staffProfileId = uuidv4();
    await db("staff_profiles").insert({
      id: staffProfileId,
      institute_id: req.tenantId!,
      user_id: userId,
      employee_code: employeeCode,
      first_name,
      last_name: last_name || "",
      designation,
      department: department || "",
      phone: phone || "",
      qualification: qualification || "",
      joining_date: joining_date || new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      data: {
        staffId: staffProfileId,
        employeeCode,
        fullName: `${first_name} ${last_name || ""}`.trim(),
        credentials: {
          username: email.trim(),
          temporaryPassword: initialPassword,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
