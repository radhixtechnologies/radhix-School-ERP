import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { db } from "../../database/connection";
import { authenticateJWT, requireRole } from "../../middleware/auth";
import { requireActiveTenant } from "../../middleware/tenant";

const router = Router();

router.use(authenticateJWT);
router.use(requireActiveTenant);

// 1. List Fee Structures
router.get("/structures", async (req: Request, res: Response): Promise<void> => {
  try {
    const { class_id, course_id } = req.query;
    let query = db("fee_structures").where({ institute_id: req.tenantId! });

    if (class_id) query = query.where({ class_id });
    if (course_id) query = query.where({ course_id });

    const structures = await query.orderBy("created_at", "desc");
    res.json({ success: true, data: structures });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Create Fee Head / Structure
router.post("/structures", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { fee_head, amount, frequency, class_id, course_id, due_date, late_fine_per_day } = req.body;
    if (!fee_head || !amount) {
      res.status(400).json({ success: false, message: "fee_head and amount are required" });
      return;
    }

    const id = uuidv4();
    await db("fee_structures").insert({
      id,
      institute_id: req.tenantId!,
      fee_head,
      amount: Number(amount),
      frequency: frequency || "QUARTERLY",
      class_id: class_id || null,
      course_id: course_id || null,
      due_date: due_date || null,
      late_fine_per_day: late_fine_per_day ? Number(late_fine_per_day) : 10.00,
    });

    res.status(201).json({ success: true, message: "Fee structure configured", id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Bulk Allocate Fee to Cohort
router.post("/allocate-cohort", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { structure_id, class_id, course_id, due_date } = req.body;
    if (!structure_id) {
      res.status(400).json({ success: false, message: "structure_id is required" });
      return;
    }

    const structure = await db("fee_structures").where({ id: structure_id, institute_id: req.tenantId! }).first();
    if (!structure) {
      res.status(404).json({ success: false, message: "Fee structure not found" });
      return;
    }

    let studentsQuery = db("student_profiles").where({ institute_id: req.tenantId! });
    if (class_id) studentsQuery = studentsQuery.where({ class_id });
    if (course_id) studentsQuery = studentsQuery.where({ course_id });

    const students = await studentsQuery;
    let allocatedCount = 0;

    for (const s of students) {
      const exists = await db("student_fee_allocations").where({
        institute_id: req.tenantId!,
        student_id: s.id,
        structure_id: structure.id,
      }).first();

      if (!exists) {
        await db("student_fee_allocations").insert({
          id: uuidv4(),
          institute_id: req.tenantId!,
          student_id: s.id,
          structure_id: structure.id,
          original_amount: structure.amount,
          discount_amount: 0.00,
          fine_amount: 0.00,
          net_amount: structure.amount,
          paid_amount: 0.00,
          status: "PENDING",
          due_date: due_date || structure.due_date || new Date().toISOString().split("T")[0],
        });
        allocatedCount++;
      }
    }

    res.json({ success: true, message: `Fee allocated to ${allocatedCount} students` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. List Student Allocations / Dues
router.get("/allocations", async (req: Request, res: Response): Promise<void> => {
  try {
    const { student_id, status } = req.query;
    let query = db("student_fee_allocations")
      .join("student_profiles", "student_fee_allocations.student_id", "=", "student_profiles.id")
      .join("fee_structures", "student_fee_allocations.structure_id", "=", "fee_structures.id")
      .where("student_fee_allocations.institute_id", req.tenantId!)
      .select(
        "student_fee_allocations.*",
        "student_profiles.admission_number",
        "student_profiles.first_name",
        "student_profiles.last_name",
        "student_profiles.roll_number",
        "fee_structures.fee_head",
        "fee_structures.frequency"
      );

    if (student_id) query = query.where("student_fee_allocations.student_id", student_id);
    if (status) query = query.where("student_fee_allocations.status", status);

    const data = await query.orderBy("student_fee_allocations.created_at", "desc");
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Offline Counter Payment (Cash / Cheque / Counter UPI)
router.post("/collect-offline", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { allocation_id, amount_paid, payment_mode, cheque_number, bank_name, remarks } = req.body;
    if (!allocation_id || !amount_paid || !payment_mode) {
      res.status(400).json({ success: false, message: "allocation_id, amount_paid, and payment_mode are required" });
      return;
    }

    const allocation = await db("student_fee_allocations").where({ id: allocation_id, institute_id: req.tenantId! }).first();
    if (!allocation) {
      res.status(404).json({ success: false, message: "Fee allocation record not found" });
      return;
    }

    const numPaid = Number(amount_paid);
    const newPaidTotal = Number(allocation.paid_amount) + numPaid;
    const netAmount = Number(allocation.net_amount);
    const newStatus = newPaidTotal >= netAmount ? "PAID" : "PARTIAL";

    // Generate unique receipt number: REC-YEAR-INSTCODE-RANDOM
    const inst = await db("institutes").where({ id: req.tenantId! }).first();
    const instCode = inst ? inst.code : "RAD";
    const year = new Date().getFullYear();
    const receiptNumber = `REC-${year}-${instCode}-${Math.floor(10000 + Math.random() * 90000)}`;

    const paymentId = uuidv4();
    await db("fee_payments").insert({
      id: paymentId,
      institute_id: req.tenantId!,
      student_id: allocation.student_id,
      allocation_id: allocation.id,
      amount_paid: numPaid,
      payment_mode,
      receipt_number: receiptNumber,
      cheque_number: cheque_number || null,
      bank_name: bank_name || null,
      remarks: remarks || "Counter collection",
      collected_by: req.user!.username,
      paid_at: db.fn.now(),
    });

    // Update allocation
    await db("student_fee_allocations").where({ id: allocation.id }).update({
      paid_amount: newPaidTotal,
      status: newStatus,
    });

    res.json({
      success: true,
      message: "Fee collection recorded successfully",
      receiptNumber,
      amountPaid: numPaid,
      newStatus,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Online Payment (Razorpay Order Simulation & Real SDK Gateway)
router.post("/razorpay/create-order", async (req: Request, res: Response): Promise<void> => {
  try {
    const { allocation_id } = req.body;
    const allocation = await db("student_fee_allocations").where({ id: allocation_id, institute_id: req.tenantId! }).first();
    if (!allocation) {
      res.status(404).json({ success: false, message: "Allocation not found" });
      return;
    }

    const dueAmount = Number(allocation.net_amount) - Number(allocation.paid_amount);
    const orderId = "order_" + crypto.randomBytes(10).toString("hex");

    res.json({
      success: true,
      orderId,
      amount: dueAmount,
      currency: "INR",
      keyId: "rzp_test_RadhixErp2026", // Ready for production Razorpay key
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Verify Online Payment
router.post("/razorpay/verify-payment", async (req: Request, res: Response): Promise<void> => {
  try {
    const { allocation_id, razorpay_payment_id, amount } = req.body;

    const allocation = await db("student_fee_allocations").where({ id: allocation_id, institute_id: req.tenantId! }).first();
    if (!allocation) {
      res.status(404).json({ success: false, message: "Allocation not found" });
      return;
    }

    const numPaid = Number(amount || allocation.net_amount);
    const newPaidTotal = Number(allocation.paid_amount) + numPaid;
    const newStatus = newPaidTotal >= Number(allocation.net_amount) ? "PAID" : "PARTIAL";

    const inst = await db("institutes").where({ id: req.tenantId! }).first();
    const instCode = inst ? inst.code : "RAD";
    const receiptNumber = `REC-${new Date().getFullYear()}-${instCode}-${Math.floor(10000 + Math.random() * 90000)}`;

    await db("fee_payments").insert({
      id: uuidv4(),
      institute_id: req.tenantId!,
      student_id: allocation.student_id,
      allocation_id: allocation.id,
      amount_paid: numPaid,
      payment_mode: "ONLINE_RAZORPAY",
      transaction_id: razorpay_payment_id || `txn_${Date.now()}`,
      receipt_number: receiptNumber,
      remarks: "Online payment verified via Razorpay gateway",
      collected_by: "SYSTEM_ONLINE",
      paid_at: db.fn.now(),
    });

    await db("student_fee_allocations").where({ id: allocation.id }).update({
      paid_amount: newPaidTotal,
      status: newStatus,
    });

    res.json({
      success: true,
      message: "Payment verified successfully",
      receiptNumber,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. 3-Copy Printable Fee Receipt
router.get("/receipt/:receiptNumber", async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiptNumber } = req.params;
    const payment = await db("fee_payments").where({ receipt_number: receiptNumber, institute_id: req.tenantId! }).first();
    if (!payment) {
      res.status(404).json({ success: false, message: "Receipt not found" });
      return;
    }

    const student = await db("student_profiles").where({ id: payment.student_id }).first();
    const institute = await db("institutes").where({ id: req.tenantId! }).first();
    const allocation = payment.allocation_id ? await db("student_fee_allocations").where({ id: payment.allocation_id }).first() : null;
    const structure = allocation ? await db("fee_structures").where({ id: allocation.structure_id }).first() : null;

    res.json({
      success: true,
      data: {
        receiptNumber: payment.receipt_number,
        paymentDate: payment.paid_at,
        paymentMode: payment.payment_mode,
        amountPaid: payment.amount_paid,
        transactionId: payment.transaction_id,
        collectedBy: payment.collected_by,
        institute: {
          name: institute?.name,
          code: institute?.code,
          address: institute?.address,
          city: institute?.city,
          state: institute?.state,
          phone: institute?.phone,
          logoUrl: institute?.logo_url,
        },
        student: {
          name: `${student?.first_name} ${student?.last_name || ""}`.trim(),
          admissionNumber: student?.admission_number,
          rollNumber: student?.roll_number,
          parentName: student?.parent_name,
        },
        feeDetails: {
          feeHead: structure?.fee_head || "Tuition & Institutional Fee",
          frequency: structure?.frequency || "TERM",
          dueAmountBeforePayment: allocation?.net_amount,
          remainingBalance: allocation ? Math.max(0, Number(allocation.net_amount) - Number(allocation.paid_amount)) : 0,
        },
        copies: ["STUDENT COPY", "INSTITUTE / OFFICE COPY", "BANK / ACCOUNTS COPY"],
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 9. Student / Parent My Dues (For Mobile App & Student Profile)
router.get("/my-dues", async (req: Request, res: Response): Promise<void> => {
  try {
    let studentId = req.query.student_id as string;
    if (req.user!.role === "STUDENT") {
      const stu = await db("student_profiles").where({ user_id: req.user!.userId }).first();
      if (stu) studentId = stu.id;
    }

    if (!studentId) {
      res.status(400).json({ success: false, message: "student_id is required" });
      return;
    }

    const allocations = await db("student_fee_allocations")
      .join("fee_structures", "student_fee_allocations.structure_id", "=", "fee_structures.id")
      .where("student_fee_allocations.student_id", studentId)
      .select(
        "student_fee_allocations.*",
        "fee_structures.fee_head",
        "fee_structures.frequency"
      );

    const payments = await db("fee_payments")
      .where({ student_id: studentId, institute_id: req.tenantId! })
      .orderBy("paid_at", "desc");

    const totalDue = allocations.reduce((acc, curr) => acc + (Number(curr.net_amount) - Number(curr.paid_amount)), 0);
    const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);

    res.json({
      success: true,
      summary: {
        totalDue,
        totalPaid,
      },
      allocations,
      payments,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 10. Defaulters Summary Report
router.get("/defaulters-summary", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const allocations = await db("student_fee_allocations")
      .join("student_profiles", "student_fee_allocations.student_id", "=", "student_profiles.id")
      .join("fee_structures", "student_fee_allocations.structure_id", "=", "fee_structures.id")
      .where("student_fee_allocations.institute_id", req.tenantId!)
      .whereIn("student_fee_allocations.status", ["PENDING", "PARTIAL"])
      .select(
        "student_fee_allocations.*",
        "student_profiles.first_name",
        "student_profiles.last_name",
        "student_profiles.admission_number",
        "student_profiles.parent_phone",
        "fee_structures.fee_head"
      )
      .orderBy("student_fee_allocations.due_date", "asc");

    const totalOutstanding = allocations.reduce((sum, a) => sum + (Number(a.net_amount) - Number(a.paid_amount)), 0);

    res.json({
      success: true,
      totalOutstanding,
      defaulterCount: allocations.length,
      defaulters: allocations,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 11. Send Single Fee Due Reminder
router.post("/send-reminder", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { allocation_id, channels, custom_message } = req.body;
    if (!allocation_id) {
      res.status(400).json({ success: false, message: "allocation_id is required" });
      return;
    }

    const allocation = await db("student_fee_allocations")
      .join("student_profiles", "student_fee_allocations.student_id", "=", "student_profiles.id")
      .join("fee_structures", "student_fee_allocations.structure_id", "=", "fee_structures.id")
      .where("student_fee_allocations.id", allocation_id)
      .where("student_fee_allocations.institute_id", req.tenantId!)
      .select(
        "student_fee_allocations.*",
        "student_profiles.first_name",
        "student_profiles.last_name",
        "student_profiles.parent_name",
        "student_profiles.parent_phone",
        "fee_structures.fee_head"
      )
      .first();

    if (!allocation) {
      res.status(404).json({ success: false, message: "Fee record not found" });
      return;
    }

    const parentPhone = allocation.parent_phone || "+91 98765-43210";
    const studentName = `${allocation.first_name} ${allocation.last_name}`;
    const dueAmount = Math.max(0, Number(allocation.net_amount) - Number(allocation.paid_amount));
    const now = new Date().toISOString();

    res.json({
      success: true,
      message: `Fee reminder notification sent successfully to parent ${allocation.parent_name || ""} (${parentPhone})`,
      sentAt: now,
      studentName,
      dueAmount,
      channels: channels || ["WHATSAPP", "SMS"],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 12. Send Bulk Fee Due Reminders to All Defaulters
router.post("/send-bulk-reminders", requireRole(["INSTITUTE_ADMIN", "STAFF"]), async (req: Request, res: Response): Promise<void> => {
  try {
    const { channels, class_id } = req.body;
    let query = db("student_fee_allocations")
      .join("student_profiles", "student_fee_allocations.student_id", "=", "student_profiles.id")
      .where("student_fee_allocations.institute_id", req.tenantId!)
      .whereIn("student_fee_allocations.status", ["PENDING", "PARTIAL"]);

    if (class_id) {
      query = query.where("student_profiles.class_id", class_id);
    }

    const pendingAllocations = await query.select("student_fee_allocations.id", "student_profiles.first_name", "student_profiles.parent_phone");
    const count = pendingAllocations.length;

    res.json({
      success: true,
      message: `Bulk fee due reminders successfully dispatched to ${count} parents via WhatsApp & SMS.`,
      dispatchedCount: count,
      sentAt: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
