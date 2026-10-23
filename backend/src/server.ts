import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { config } from "./config";
import { runSeed } from "./database/seed";

// Route imports
import authRoutes from "./modules/auth/auth.routes";
import superAdminRoutes from "./modules/super-admin/super-admin.routes";
import tenantAdminRoutes from "./modules/tenant-admin/tenant-admin.routes";
import academicRoutes from "./modules/academic/academic.routes";
import staffRoutes from "./modules/staff/staff.routes";
import studentRoutes from "./modules/student/student.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes";
import noticeRoutes from "./modules/notice/notice.routes";
import feeRoutes from "./modules/fee/fee.routes";
import homeworkRoutes from "./modules/homework/homework.routes";
import schoolFeaturesRoutes from "./modules/school-features/school-features.routes";

const app = express();

// Ensure public uploads directory exists
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(uploadsDir));

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "Radhix Multi-Vendor School ERP SaaS Platform API",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/super-admin", superAdminRoutes);
app.use("/api/v1/tenant-admin", tenantAdminRoutes);
app.use("/api/v1/academic", academicRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/fees", feeRoutes);
app.use("/api/v1/homework", homeworkRoutes);
app.use("/api/v1/school-features", schoolFeaturesRoutes);
app.use("/api/v1", schoolFeaturesRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Boot Sequence
async function startServer() {
  try {
    console.log("Initializing database and seeding demo data...");
    await runSeed();

    app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(` Radhix Multi-Vendor School ERP SaaS Backend`);
      console.log(` Running on: http://localhost:${config.port}`);
      console.log(` Health check: http://localhost:${config.port}/api/health`);
      console.log(` Static Uploads: http://localhost:${config.port}/uploads`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
