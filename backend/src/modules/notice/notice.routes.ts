import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../database/connection";
import { authenticateJWT, requireRole } from "../../middleware/auth";
import { requireActiveTenant } from "../../middleware/tenant";

const router = Router();

router.use(authenticateJWT);
router.use(requireActiveTenant);

// List Notices
const handleGetNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    let query = db("notices").where({ institute_id: req.tenantId! });

    if (role === "STUDENT") {
      query = query.whereIn("target_audience", ["ALL", "STUDENTS"]);
    } else if (role === "PARENT") {
      query = query.whereIn("target_audience", ["ALL", "PARENTS"]);
    } else if (role === "TEACHER" || role === "STAFF") {
      query = query.whereIn("target_audience", ["ALL", "STAFF"]);
    }

    const notices = await query.orderBy("published_at", "desc");
    res.json({ success: true, data: notices });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

router.get("/", handleGetNotices);
router.get("/public", handleGetNotices);

// Create Notice
router.post("/", requireRole(["INSTITUTE_ADMIN", "STAFF", "TEACHER"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, target_audience, category, attachment_url } = req.body;
    if (!title || !content) {
      res.status(400).json({ success: false, message: "Title and content are required" });
      return;
    }

    const id = uuidv4();
    await db("notices").insert({
      id,
      institute_id: req.tenantId!,
      title,
      content,
      target_audience: target_audience || "ALL",
      category: category || "GENERAL",
      attachment_url: attachment_url || null,
      created_by: req.user!.username,
    });

    res.status(201).json({ success: true, message: "Notice published successfully", id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Notice
router.delete("/:id", requireRole("INSTITUTE_ADMIN"), async (req: Request, res: Response): Promise<void> => {
  try {
    await db("notices").where({ id: req.params.id, institute_id: req.tenantId! }).delete();
    res.json({ success: true, message: "Notice deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
