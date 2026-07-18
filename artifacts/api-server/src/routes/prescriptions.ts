import { Router } from "express";
import { db } from "@workspace/db";
import { prescriptionsTable } from "@workspace/db";
import { SubmitPrescriptionBody } from "@workspace/api-zod";

const router = Router();

function generateReferenceId(): string {
  const prefix = "RX";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// POST /api/prescriptions
router.post("/prescriptions", async (req, res): Promise<void> => {
  const parsed = SubmitPrescriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid prescription data", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;
  const referenceId = generateReferenceId();

  const [prescription] = await db.insert(prescriptionsTable).values({
    referenceId,
    name: data.name,
    phone: data.phone,
    preferredArea: data.preferredArea,
    preferredTimeSlot: data.preferredTimeSlot,
    fileNames: data.fileNames ?? [],
    notes: data.notes ?? null,
    status: "received",
  }).returning();

  res.status(201).json({
    id: prescription.id,
    referenceId: prescription.referenceId,
    message: "Prescription received! Our team will call you within 30 minutes with a quote and available slots.",
    createdAt: prescription.createdAt.toISOString(),
  });
});

export default router;
