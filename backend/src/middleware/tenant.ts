import { Request, Response, NextFunction } from "express";
import { db } from "../database/connection";

export async function requireActiveTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
  // If Super Admin, they don't belong to a specific tenant
  if (req.user?.role === "SUPER_ADMIN") {
    next();
    return;
  }

  const tenantId = req.user?.instituteId;
  if (!tenantId) {
    res.status(403).json({ success: false, message: "No institute assigned to this user" });
    return;
  }

  try {
    const institute = await db("institutes").where({ id: tenantId }).first();
    if (!institute) {
      res.status(404).json({ success: false, message: "Associated institute not found" });
      return;
    }

    if (institute.status !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message: "Your institute's subscription has been suspended. Please contact your administration or Radhix Technology support.",
        instituteStatus: institute.status,
      });
      return;
    }

    // Attach verified details
    req.tenantId = institute.id;
    req.instituteType = institute.institute_type;
    next();
  } catch (err) {
    console.error("Tenant validation error:", err);
    res.status(500).json({ success: false, message: "Error validating institute status" });
  }
}
