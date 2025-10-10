import {
  pgTable,
  varchar,
  text,
  integer,
  unique,
  decimal,
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
  items: many(items),
}));

export const subCategoriesRelations = relations(subCategories, ({ one,many }) => ({
  category: one(categories, {
    fields: [subCategories.categoryId],
    references: [categories.categoryId],
  }),
  items: many(items),
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


export const buildings = pgTable("buildings", {
  buildingId: serial("building_id").primaryKey(),
  buildingName: varchar("building_name", { length: 100 }).notNull(),
  address: text("address"),
});

export const labs = pgTable("labs", {
  labId: serial("lab_id").primaryKey(),
  buildingId: integer("building_id")
    .notNull()
    .references(() => buildings.buildingId, { onDelete: "cascade" }),
  labName: varchar("lab_name", { length: 100 }).notNull(),
  labCode: varchar("lab_code", { length: 50 }).unique(),
  floorNumber: integer("floor_number"),
  labType: varchar("lab_type", { length: 50 }), // e.g., 'Computer Lab', 'IoT Lab'
  capacity: integer("capacity"),
  inChargeName: varchar("in_charge_name", { length: 100 }),
  inChargeContact: varchar("in_charge_contact", { length: 15 }),
});

export const buildingsRelations = relations(buildings, ({ many }) => ({
  labs: many(labs),
}));

export const labsRelations = relations(labs, ({ one }) => ({
  building: one(buildings, {
    fields: [labs.buildingId],
    references: [buildings.buildingId],
  }),
}));

export const items = pgTable(
  "items",
  {
    itemId: serial("item_id").primaryKey(),
    itemName: varchar("item_name", { length: 200 }).notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.categoryId),
    subCategoryId: integer("sub_category_id").references(() => subCategories.subCategoryId),
    brand: varchar("brand", { length: 100 }),
    modelNumber: varchar("model_number", { length: 100 }),
    specifications: text("specifications"), // can store JSON string
    unitOfMeasurement: varchar("unit_of_measurement", { length: 20 }), // e.g., 'piece', 'meter', 'set'
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: false })
      .defaultNow()
      .$onUpdate(() => new Date()), // mimic ON UPDATE CURRENT_TIMESTAMP
  },
  (table) => ({
    uniqueItem: unique("unique_item").on(
      table.itemName,
      table.brand,
      table.modelNumber
    ),
  })
);

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.categoryId],
  }),
  subCategory: one(subCategories, {
    fields: [items.subCategoryId],
    references: [subCategories.subCategoryId],
  }),
}));

export const purchaseHistory = pgTable("purchase_history", {
  purchaseId: serial("purchase_id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => items.itemId),
  vendorId: integer("vendor_id").references(() => vendors.vendorId),
  quantityPurchased: integer("quantity_purchased").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  purchaseDate: date("purchase_date").notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }),
  invoiceDate: date("invoice_date"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});

// ---------------------- Warehouse Stock ----------------------
export const warehouseStock = pgTable("warehouse_stock", {
  warehouseStockId: serial("warehouse_stock_id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => items.itemId),
  quantityAvailable: integer("quantity_available").notNull().default(0),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});


export const purchaseHistoryRelations = relations(purchaseHistory, ({ one }) => ({
  item: one(items, { fields: [purchaseHistory.itemId], references: [items.itemId] }),
  vendor: one(vendors, { fields: [purchaseHistory.vendorId], references: [vendors.vendorId] }),
}));


export const warehouseStockRelations = relations(warehouseStock, ({ one }) => ({
  item: one(items, { fields: [warehouseStock.itemId], references: [items.itemId] }),
}));