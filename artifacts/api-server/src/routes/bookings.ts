import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import {
  CreateBookingBody,
  GetBookingParams,
  LookupBookingQueryParams,
} from "@workspace/api-zod";

const router = Router();

function generateBookingId(): string {
  const prefix = "KLD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function formatBooking(booking: typeof bookingsTable.$inferSelect) {
  return {
    id: booking.id,
    bookingId: booking.bookingId,
    patientName: booking.patientName,
    phone: booking.phone,
    address: booking.address,
    preferredDate: booking.preferredDate,
    preferredTimeSlot: booking.preferredTimeSlot,
    collectionType: booking.collectionType,
    status: booking.status,
    totalAmount: booking.totalAmount,
    homeCollectionFee: booking.homeCollectionFee,
    reportUrl: booking.reportUrl,
    items: booking.items || [],
    createdAt: booking.createdAt.toISOString(),
  };
}

// POST /api/bookings
router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking data", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;
  const bookingId = generateBookingId();

  const [booking] = await db.insert(bookingsTable).values({
    bookingId,
    patientName: data.patientName,
    patientAge: data.patientAge ?? null,
    patientGender: data.patientGender ?? null,
    phone: data.phone,
    address: data.address ?? null,
    pincode: data.pincode ?? null,
    preferredDate: data.preferredDate ? String(data.preferredDate) : null,
    preferredTimeSlot: data.preferredTimeSlot ?? null,
    collectionType: data.collectionType,
    items: (data.items ?? []) as Array<{ itemId: string; itemType: string; name: string; price: number; quantity: number }>,
    totalAmount: data.totalAmount ?? 0,
    homeCollectionFee: data.homeCollectionFee ?? 0,
    status: "confirmed",
    notes: data.notes ?? null,
  }).returning();

  res.status(201).json(formatBooking(booking));
});

// GET /api/bookings/lookup (must come before /:bookingId)
router.get("/bookings/lookup", async (req, res): Promise<void> => {
  const parsed = LookupBookingQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Provide mobile or bookingId" });
    return;
  }

  const { mobile, bookingId } = parsed.data;
  if (!mobile && !bookingId) {
    res.status(400).json({ error: "Provide at least mobile or bookingId" });
    return;
  }

  const conditions = [];
  if (bookingId) conditions.push(eq(bookingsTable.bookingId, bookingId));
  if (mobile) conditions.push(eq(bookingsTable.phone, mobile));

  const [booking] = await db.select()
    .from(bookingsTable)
    .where(or(...conditions))
    .limit(1);

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(formatBooking(booking));
});

// GET /api/bookings/:bookingId
router.get("/bookings/:bookingId", async (req, res): Promise<void> => {
  const parsed = GetBookingParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  const [booking] = await db.select()
    .from(bookingsTable)
    .where(eq(bookingsTable.bookingId, parsed.data.bookingId))
    .limit(1);

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(formatBooking(booking));
});

export default router;
