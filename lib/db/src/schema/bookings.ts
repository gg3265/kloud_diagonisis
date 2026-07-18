import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull().unique(),
  patientName: text("patient_name").notNull(),
  patientAge: integer("patient_age"),
  patientGender: text("patient_gender"),
  phone: text("phone").notNull(),
  address: text("address"),
  pincode: text("pincode"),
  preferredDate: text("preferred_date"),
  preferredTimeSlot: text("preferred_time_slot"),
  collectionType: text("collection_type").notNull().default("home"),
  items: jsonb("items").notNull().$type<Array<{
    itemId: string;
    itemType: string;
    name: string;
    price: number;
    quantity: number;
  }>>(),
  totalAmount: integer("total_amount").notNull().default(0),
  homeCollectionFee: integer("home_collection_fee").notNull().default(0),
  status: text("status").notNull().default("pending"),
  reportUrl: text("report_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
