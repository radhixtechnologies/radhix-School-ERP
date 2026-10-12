import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../database/connection";
import { authenticateJWT, requireRole } from "../../middleware/auth";
import { requireActiveTenant } from "../../middleware/tenant";

const router = Router();

router.use(authenticateJWT);
router.use(requireActiveTenant);

// List Students
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, class_id, section_id, course_id, department_id, semester_id } = req.query;

    let query = db("student_profiles")
      .join("users", "student_profiles.user_id", "=", "users.id")
      .where("student_profiles.institute_id", req.tenantId!)
      .select(
        "student_profiles.*",
        "users.email",
        "users.username",
        "users.is_active"
      );

    if (search) {
      query = query.where((builder) => {
        builder
          .where("student_profiles.first_name", "like", `%${search}%`)
          .orWhere("student_profiles.last_name", "like", `%${search}%`)
          .orWhere("student_profiles.admission_number", "like", `%${search}%`)
          .orWhere("student_profiles.roll_number", "like", `%${search}%`);
      });
    }

    if (class_id) query = query.where({ "student_profiles.class_id": class_id });
    if (section_id) query = query.where({ "student_profiles.section_id": section_id });
    if (course_id) query = query.where({ "student_profiles.course_id": course_id });
    if (department_id) query = query.where({ "student_profiles.department_id": department_id });
    if (semester_id) query = query.where({ "student_profiles.semester_id": semester_id });

    const students = await query.orderBy("student_profiles.first_name", "asc");

    // Enrich with class/course names
    const enriched = await Promise.all(
      students.map(async (s) => {
        let academicContext = "";
        if (s.class_id) {
          const cls = await db("school_classes").where({ id: s.class_id }).first();
          const sec = s.section_id ? await db("sections").where({ id: s.section_id }).first() : null;
          academicContext = `${cls?.name || ""} ${sec ? "- " + sec.name : ""}`.trim();
        } else if (s.course_id) {
          const crs = await db("college_courses").where({ id: s.course_id }).first();
          const sem = s.semester_id ? await db("college_semesters").where({ id: s.semester_id }).first() : null;
          academicContext = `${crs?.code || ""} (${sem?.name || ""})`.trim();
        }
        return {
          ...s,
          academicContext,
        };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Admission
router.post("/admit", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      dob,
      gender,
      blood_group,
      admission_number,
      roll_number,
      class_id,
      section_id,
      course_id,
      department_id,
      semester_id,
      parent_name,
      parent_phone,
      parent_email,
      address,
      admission_date,
      student_email,
      student_password,
    } = req.body;

    if (!first_name) {
      res.status(400).json({ success: false, message: "First name is required" });
      return;
    }

    // Check plan student limit
    const inst = await db("institutes").where({ id: req.tenantId! }).first();
    const currentCount = await db("student_profiles").where({ institute_id: req.tenantId! }).count("id as count").first();
    if (inst && inst.student_limit && Number(currentCount?.count || 0) >= inst.student_limit) {
      res.status(403).json({
        success: false,
        message: `Student limit reached for this institute plan (${inst.student_limit}). Please upgrade the plan.`,
      });
      return;
    }

    // Generate admission number if not provided
    const prefix = inst ? inst.code : "STU";
    const year = new Date().getFullYear();
    const finalAdmNo = (admission_number || `${prefix}-${year}-${Math.floor(100 + Math.random() * 900)}`).trim();

    // Check admission number uniqueness
    const existingAdm = await db("student_profiles").where({ admission_number: finalAdmNo }).first();
    if (existingAdm) {
      res.status(400).json({ success: false, message: `Admission number '${finalAdmNo}' is already taken.` });
      return;
    }

    const defaultUsername = (student_email || finalAdmNo).toLowerCase().trim();
    const existingUser = await db("users").where({ username: defaultUsername }).first();
    if (existingUser) {
      res.status(400).json({ success: false, message: `Username/Email '${defaultUsername}' is already registered.` });
      return;
    }

    const finalPassword = student_password && student_password.trim() ? student_password.trim() : "Student@" + Math.floor(1000 + Math.random() * 9000);

    // Create user login account for student
    const studentUserId = uuidv4();
    await db("users").insert({
      id: studentUserId,
      institute_id: req.tenantId!,
      username: defaultUsername,
      email: student_email || null,
      phone: parent_phone || null,
      password_hash: bcrypt.hashSync(finalPassword, 10),
      role: "STUDENT",
      is_active: true,
      force_password_change: false,
    });

    const studentProfileId = uuidv4();
    await db("student_profiles").insert({
      id: studentProfileId,
      institute_id: req.tenantId!,
      user_id: studentUserId,
      admission_number: finalAdmNo,
      roll_number: roll_number || null,
      first_name,
      last_name: last_name || "",
      dob: dob || null,
      gender: gender || "MALE",
      blood_group: blood_group || null,
      class_id: class_id || null,
      section_id: section_id || null,
      course_id: course_id || null,
      department_id: department_id || null,
      semester_id: semester_id || null,
      parent_name: parent_name || "",
      parent_phone: parent_phone || "",
      address: address || "",
      admission_date: admission_date || new Date().toISOString().split("T")[0],
    });

    res.status(201).json({
      success: true,
      message: "Student admission completed successfully",
      data: {
        studentId: studentProfileId,
        admissionNumber: finalAdmNo,
        name: `${first_name} ${last_name || ""}`.trim(),
        loginCredentials: {
          username: defaultUsername,
          password: finalPassword,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reset or Change Student Password
router.post("/:id/reset-password", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { custom_password } = req.body;

    const student = await db("student_profiles").where({ id, institute_id: req.tenantId! }).first();
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found" });
      return;
    }

    const user = await db("users").where({ id: student.user_id }).first();
    if (!user) {
      res.status(404).json({ success: false, message: "User account for this student not found" });
      return;
    }

    const newPassword = custom_password && custom_password.trim() ? custom_password.trim() : "Student@" + Math.floor(1000 + Math.random() * 9000);

    await db("users").where({ id: user.id }).update({
      password_hash: bcrypt.hashSync(newPassword, 10),
    });

    res.json({
      success: true,
      message: "Student password updated successfully",
      studentName: `${student.first_name} ${student.last_name || ""}`.trim(),
      admissionNumber: student.admission_number,
      username: user.username,
      newPassword,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

