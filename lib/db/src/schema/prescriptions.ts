import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const prescriptionsTable = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  referenceId: text("reference_id").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  preferredArea: text("preferred_area").notNull(),
  preferredTimeSlot: text("preferred_time_slot").notNull(),
  fileNames: jsonb("file_names").$type<string[]>().default([]),
  notes: text("notes"),
  status: text("status").notNull().default("received"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPrescriptionSchema = createInsertSchema(prescriptionsTable).omit({ id: true, createdAt: true });
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptionsTable.$inferSelect;
