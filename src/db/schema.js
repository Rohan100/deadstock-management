import {
  pgTable,
  varchar,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";




export const categories = pgTable("categories", {
  categoryId: serial("category_id").primaryKey(),
  categoryName: varchar("category_name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const subCategories = pgTable("sub_categories", {
  subCategoryId: serial("sub_category_id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.categoryId, { onDelete: "cascade" }),
  subCategoryName: varchar("sub_category_name", { length: 100 }).notNull(),
  description: text("description"),
});


export const categoriesRelations = relations(categories, ({ many }) => ({
  subCategories: many(subCategories),
}));

export const subCategoriesRelations = relations(subCategories, ({ one }) => ({
  category: one(categories, {
    fields: [subCategories.categoryId],
    references: [categories.categoryId],
  }),
}));


export const usersTable = pgTable("users", {
  id: serial('id').primaryKey(), 
  name: varchar({ length: 255 }).notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  email: varchar({ length: 255 }).notNull().unique(),
  isAdmin: boolean().notNull().default(false),
  isEnabled: boolean().notNull().default(true),
});

export const vendors = pgTable("vendors", {
  vendorId: serial("vendor_id").primaryKey(),
  vendorName: varchar("vendor_name", { length: 150 }).notNull(),
  contactPerson: varchar("contact_person", { length: 100 }),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 15 }),
  address: text("address"),
  gstin: varchar("gstin", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});


