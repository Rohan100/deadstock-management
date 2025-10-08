import {
  pgTable,
  varchar,
  integer,
  bigint,
  booleanType,
  timestamp,
  date,
  text,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: serial('id').primaryKey(), 
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  email: varchar({ length: 255 }).notNull().unique(),
  isAdmin: boolean().notNull().default(false),
  resetPasswordToken: varchar({ length: 255 }),
  resetPasswordExpires: timestamp(),
  isEnabled: boolean().notNull().default(true),
});


export const vendor = pgTable("Vendor", {
  id: bigint("id").primaryKey().autoIncrement(),
  name: varchar("name", { length: 255 }).notNull(),
  vendorType: varchar("vendorType", { length: 100 }),
  contactNo: varchar("contactNo", { length: 50 }), // e.g. +91-xxx-xxx-xxxx
  address: varchar("address", { length: 500 }),
  createdByUserId: bigint("createdByUserId").references(() => users.id).default(null),
});

export const department = pgTable("Department", {
  id: bigint("id").primaryKey().autoIncrement(),
  name: varchar("name", { length: 255 }).notNull(),
  headUserId: bigint("headUserId").references(() => users.id).default(null),
});

export const lab = pgTable("Lab", {
  id: bigint("id").primaryKey().autoIncrement(),
  labName: varchar("labName", { length: 255 }).notNull(),
  labNo: varchar("labNo", { length: 100 }), // e.g. "L101"
  deptId: bigint("deptId").references(() => department.id).notNull(),
});

export const items = pgTable("Items", {
  id: bigint("id").primaryKey().autoIncrement(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }),
  modelId: varchar("modelId", { length: 200 }),
  quantity: integer("quantity").default(0),
  availableQuantity: integer("availableQuantity").default(0), // updated on distribution
  purchaseDate: date("purchaseDate"),
  totalPrice: bigint("totalPrice"),
  unitPrice: bigint("unitPrice"),
  deadstockId: varchar("deadstockId", { length: 255 }).unique(),
  condition: varchar("condition", { length: 50 }),
  status: varchar("status", { length: 100 }).default("in stock"),
  vendorId: bigint("vendorId").references(() => vendor.id).notNull(),
});

export const distribution = pgTable("Distribution", {
  id: bigint("id").primaryKey().autoIncrement(),
  itemId: bigint("itemId").references(() => items.id).notNull(),
  transferQuantity: integer("transferQuantity").notNull(),
  departmentId: bigint("departmentId").references(() => department.id).notNull(),
  labId: bigint("labId").references(() => lab.id).default(null),
  createdAt: timestamp("createdAt").defaultNow(),
  transferDate: date("transferDate").notNull(),
  transferredByUserId: bigint("transferredByUserId").references(() => users.id).notNull(),
});

export const report = pgTable("Report", {
  id: bigint("id").primaryKey().autoIncrement(),
  reportName: varchar("reportName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  generatedByUserId: bigint("generatedByUserId").references(() => users.id).notNull(),
  departmentId: bigint("departmentId").references(() => department.id).default(null),
});