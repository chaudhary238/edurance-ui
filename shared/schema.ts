import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  membershipType: text("membership_type").notNull().default("basic"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  policyNumber: text("policy_number").notNull().unique(),
  policyName: text("policy_name").notNull(),
  insurerName: text("insurer_name").notNull(),
  premiumAmount: decimal("premium_amount", { precision: 10, scale: 2 }).notNull(),
  coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }),
  full_summary: text("full_summary"),
  status: text("status").notNull().default("active"),
  lastAnalyzed: timestamp("last_analyzed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const policyAnalyses = pgTable("policy_analyses", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id").references(() => policies.id).notNull(),
  analysisData: text("analysis_data"), // JSON string containing analysis results
  riskScore: integer("risk_score"),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPolicyAnalysisSchema = createInsertSchema(policyAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicyAnalysis = z.infer<typeof insertPolicyAnalysisSchema>;
export type PolicyAnalysis = typeof policyAnalyses.$inferSelect;

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive?: boolean;
  category?: "main" | "support";
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: string;
}
