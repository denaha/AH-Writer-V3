import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Templates table
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  details: json("details").notNull(),
  category: text("category").notNull(),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  description: true,
  details: true,
  category: true,
});

// Worksheets table
export const worksheets = pgTable("worksheets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: json("content").notNull(),
  category: text("category").notNull(),
});

export const insertWorksheetSchema = createInsertSchema(worksheets).pick({
  title: true,
  description: true,
  content: true,
  category: true,
});

// User summaries table
export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  originalText: text("original_text").notNull(),
  summary: text("summary").notNull(),
  analysis: json("analysis"),
  templateId: integer("template_id"),
  createdAt: text("created_at").notNull(),
});

export const insertSummarySchema = createInsertSchema(summaries).pick({
  originalText: true,
  summary: true,
  analysis: true,
  templateId: true,
  createdAt: true,
});

// Type exports
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type Worksheet = typeof worksheets.$inferSelect;
export type InsertWorksheet = z.infer<typeof insertWorksheetSchema>;

export type Summary = typeof summaries.$inferSelect;
export type InsertSummary = z.infer<typeof insertSummarySchema>;
