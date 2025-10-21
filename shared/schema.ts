import { z } from "zod";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Existing user schema (placeholder for template)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Library Configuration Schema
export const numericInputConfigSchema = z.object({
  validIncrement: z.number().optional(),
  keyIncrement: z.number().optional(),
  integer: z.boolean().optional(),
  sign: z.enum(['negative', 'positive', 'any']).optional(),
  showPlus: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  base: z.number().min(2).max(36).optional(),
  radix: z.number().min(2).max(36).optional(),
  letterCase: z.enum(['upper', 'lower']).optional(),
  separators: z.string().optional(),
  decimal: z.string().optional(),
  prefix: z.string().optional(),
  postfix: z.string().optional(),
  locale: z.string().optional(),
});

export type NumericInputConfig = z.infer<typeof numericInputConfigSchema>;

// Test Suite Schema
export const testCaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  testFn: z.function().optional(),
  status: z.enum(['pending', 'running', 'passed', 'failed']).default('pending'),
  error: z.string().optional(),
  duration: z.number().optional(),
});

export type TestCase = z.infer<typeof testCaseSchema>;

export const testSuiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tests: z.array(testCaseSchema),
});

export type TestSuite = z.infer<typeof testSuiteSchema>;

// Example Configuration Schema
export const exampleConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  config: numericInputConfigSchema,
  code: z.string(),
});

export type ExampleConfig = z.infer<typeof exampleConfigSchema>;

// Attribute Definition Schema
export const attributeDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  defaultValue: z.any().optional(),
  possibleValues: z.array(z.string()).optional(),
  example: z.string().optional(),
});

export type AttributeDefinition = z.infer<typeof attributeDefinitionSchema>;
