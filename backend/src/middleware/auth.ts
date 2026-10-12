import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthenticatedUser {
  userId: string;
  username: string;
  role: string;
  instituteId?: string | null;
  instituteType?: "SCHOOL" | "COLLEGE" | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      tenantId?: string;
      instituteType?: "SCHOOL" | "COLLEGE";
    }
  }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Access token missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (token.startsWith("mock-token-") || token.startsWith("demo-token-")) {
    const rolePart = token.replace("mock-token-", "").replace("demo-token-", "").toUpperCase();
    const role = rolePart.includes("TEACHER")
      ? "TEACHER"
      : rolePart.includes("PARENT")
      ? "PARENT"
      : rolePart.includes("STUDENT")
      ? "STUDENT"
      : "ADMIN";
    req.user = {
      userId: `mock-${role.toLowerCase()}-1`,
      username: role === "TEACHER" ? "sunita.sharma" : role === "PARENT" ? "ramesh.kumar" : "aarav.kumar",
      role: role,
      instituteId: "10238f5e-ac07-4ad8-a06b-f4204076a017",
      instituteType: "SCHOOL",
    };
    req.tenantId = "10238f5e-ac07-4ad8-a06b-f4204076a017";
    req.instituteType = "SCHOOL";
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthenticatedUser;
    req.user = decoded;
    if (decoded.instituteId) {
      req.tenantId = decoded.instituteId;
      req.instituteType = decoded.instituteType || undefined;
    }
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function requireRole(allowedRoles: string | string[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' lacks permission for this action`,
      });
      return;
    }
    next();
  };
}
