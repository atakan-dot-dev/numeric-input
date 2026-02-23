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
  incrementStart: z.number().optional(),
  validationTimeout: z.number().optional(),
  valueAlgebra: z.string().optional(),
  percentage: z.boolean().optional(),
  percentagePrefix: z.boolean().optional(),
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

// Example Control Types
export const exampleControlSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('select'),
    key: z.string(),
    label: z.string(),
    options: z.array(z.object({ label: z.string(), value: z.string() })),
  }),
  z.object({
    type: z.literal('input'),
    key: z.string(),
    label: z.string(),
    inputType: z.enum(['text', 'number']).default('text'),
    placeholder: z.string().optional(),
  }),
  z.object({
    type: z.literal('toggle'),
    key: z.string(),
    label: z.string(),
  }),
]);

export type ExampleControl = z.infer<typeof exampleControlSchema>;

// Example Configuration Schema
export const exampleConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  config: numericInputConfigSchema,
  code: z.string().optional(),
  configurable: z.boolean().optional(),
  controls: z.array(exampleControlSchema).optional(),
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
