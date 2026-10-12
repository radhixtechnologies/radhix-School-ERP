import { Router, Request, Response } from "express";
import { db } from "../../database/connection";
import { authenticateJWT, requireRole } from "../../middleware/auth";
import { requireActiveTenant } from "../../middleware/tenant";

const router = Router();

router.use(authenticateJWT);
router.use(requireActiveTenant);

// Dashboard Statistics for Institute Admin
router.get("/dashboard-stats", async (req: Request, res: Response): Promise<void> => {
  try {
    const tenantId = req.tenantId!;
    const isSchool = req.instituteType === "SCHOOL";

    const totalStudents = await db("student_profiles").where({ institute_id: tenantId }).count("id as count").first();
    const totalStaff = await db("staff_profiles").where({ institute_id: tenantId }).count("id as count").first();

    // Academic structure count
    let academicCount = 0;
    if (isSchool) {
      const classes = await db("school_classes").where({ institute_id: tenantId }).count("id as count").first();
      academicCount = Number(classes?.count || 0);
    } else {
      const courses = await db("college_courses").where({ institute_id: tenantId }).count("id as count").first();
      academicCount = Number(courses?.count || 0);
    }

    // Today's attendance stats
    const today = new Date().toISOString().split("T")[0];
    const presentCount = await db("attendance")
      .where({ institute_id: tenantId, date: today, status: "PRESENT" })
      .count("id as count")
      .first();
    const absentCount = await db("attendance")
      .where({ institute_id: tenantId, date: today, status: "ABSENT" })
      .count("id as count")
      .first();

    const totalMarked = Number(presentCount?.count || 0) + Number(absentCount?.count || 0);
    const attendancePercentage = totalMarked > 0 ? Math.round((Number(presentCount?.count || 0) / totalMarked) * 100) : 100;

    // Recent 5 admissions
    const recentAdmissions = await db("student_profiles")
      .where({ institute_id: tenantId })
      .orderBy("created_at", "desc")
      .limit(5);

    // Latest notices
    const recentNotices = await db("notices")
      .where({ institute_id: tenantId })
      .orderBy("published_at", "desc")
      .limit(4);

    res.json({
      success: true,
      data: {
        totalStudents: Number(totalStudents?.count || 0),
        totalStaff: Number(totalStaff?.count || 0),
        academicCount,
        academicLabel: isSchool ? "Total Classes" : "Total Courses",
        attendanceToday: {
          present: Number(presentCount?.count || 0),
          absent: Number(absentCount?.count || 0),
          percentage: attendancePercentage,
        },
        recentAdmissions,
        recentNotices,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Institute Profile
router.get("/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const institute = await db("institutes").where({ id: req.tenantId! }).first();
    if (!institute) {
      res.status(404).json({ success: false, message: "Institute not found" });
      return;
    }

    res.json({ success: true, data: institute });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Settings
router.put("/profile", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, address, city, state, logo_url } = req.body;
    await db("institutes").where({ id: req.tenantId! }).update({
      name,
      phone,
      address,
      city,
      state,
      logo_url,
      updated_at: db.fn.now(),
    });

    res.json({ success: true, message: "Institute details updated successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
