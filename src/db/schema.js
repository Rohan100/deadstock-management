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
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const itemConditionEnum = pgEnum("item_condition_enum", [
  "New",
  "Good",
  "Used",
  "Damaged",
]);
export const itemStatusEnum = pgEnum("item_status_enum", [
  "Active",
  "Low Stock",
  "Out of Stock",
]);


export const categories = pgTable("categories", {
  categoryId: serial("category_id").primaryKey(),
  categoryName: varchar("category_name", { length: 100 }).notNull(),
  description: text("description"),
  status: text("status").notNull().default("Active"),
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
  vendorType: varchar("vendorType", { length: 50 }),
  contactPerson: varchar("contact_person", { length: 100 }),
  email: varchar("email", { length: 100 }),
  phone: varchar("phone", { length: 15 }),
  address: text("address"),
  gstin: varchar("gstin", { length: 15 }),
  createdAt: timestamp("created_at").defaultNow(),
});


export const departments = pgTable("departments", {
  departmentId: serial("department_id").primaryKey(),
  departmentName: varchar("department_name", { length: 150 }).notNull(),
  head: varchar("head", { length: 100 }),
  location: varchar("location", { length: 100 }),
  status: text("status").notNull().default("Active"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const buildings = pgTable("buildings", {
  buildingId: serial("building_id").primaryKey(),
  buildingName: varchar("building_name", { length: 100 }).notNull(),
  address: text("address"),
});

export const labs = pgTable("labs", {
  labId: serial("lab_id").primaryKey(),
  buildingId: integer("building_id")
    .references(() => buildings.buildingId, { onDelete: "cascade" }),
  departmentId: integer("department_id")
    .references(() => departments.departmentId, { onDelete: "restrict" }),
  labName: varchar("lab_name", { length: 100 }).notNull(),
  labCode: varchar("lab_code", { length: 50 }).unique(),
  floorNumber: integer("floor_number"),
  labType: varchar("lab_type", { length: 50 }), 
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
  department: one(departments, {
    fields: [labs.departmentId],
    references: [departments.departmentId],
  }),
}));

export const items = pgTable(
  "items",
  {
    itemId: serial("item_id").primaryKey(),

   
    itemName: varchar("item_name", { length: 200 }).notNull(),
    sku: varchar("sku", { length: 100 }).notNull(),

   
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.categoryId, { onDelete: "restrict" }),

    subCategoryId: integer("sub_category_id")
      .references(() => subCategories.subCategoryId, { onDelete: "set null" }),

    
    quantity: integer("quantity").notNull().default(0),
    minStock: integer("min_stock").notNull().default(0),

    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),

    status: itemStatusEnum("status").notNull().default("Active"),

   
    departmentId: integer("department_id")
      .references(() => departments.departmentId, { onDelete: "set null" }),

    supplierId: integer("supplier_id")
      .references(() => vendors.vendorId, { onDelete: "set null" }),

    location: varchar("location", { length: 150 }).notNull(),

   
    condition: itemConditionEnum("condition")
      .notNull()
      .default("New"),

    isConsumable: boolean("is_consumable").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),

   
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: false })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: false })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueSku: unique("unique_sku").on(table.sku),
  })
);

export const departmentsRelations = relations(departments, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.categoryId],
  }),

  subCategory: one(subCategories, {
    fields: [items.subCategoryId],
    references: [subCategories.subCategoryId],
  }),

  supplier: one(vendors, {
    fields: [items.supplierId],
    references: [vendors.vendorId],
  }),

  department: one(departments, {
    fields: [items.departmentId],
    references: [departments.departmentId],
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

export const conditionStatusEnum = pgEnum("condition_status_enum", [
  "New",
  "Good",
  "Fair",
  "Poor",
  "Damaged",
]);

export const labStock = pgTable("lab_stock", {
  labStockId: serial("lab_stock_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.itemId, { onDelete: "cascade" }),
  labId: integer("lab_id")
    .notNull()
    .references(() => labs.labId, { onDelete: "cascade" }),
  quantity: integer("quantity").default(1),
  conditionStatus: conditionStatusEnum("condition_status").default("New"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: false })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// 🔹 Relationships
export const labStockRelations = relations(labStock, ({ one }) => ({
  item: one(items, {
    fields: [labStock.itemId],
    references: [items.itemId],
  }),
  lab: one(labs, {
    fields: [labStock.labId],
    references: [labs.labId],
  }),
}));

export const transferTypeEnum = pgEnum("transfer_type_enum", [
  "Warehouse to Lab",
  "Lab to Lab",
  "Lab to Warehouse",
]);


export const stockTransfers = pgTable("stock_transfers", {
  transferId: serial("transfer_id").primaryKey(),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.itemId, { onDelete: "cascade" }),
  transferType: transferTypeEnum("transfer_type").notNull(),
  fromLabId: integer("from_lab_id").references(() => labs.labId),
  toLabId: integer("to_lab_id").references(() => labs.labId),
  quantity: integer("quantity").notNull(),
  transferDate: timestamp("transfer_date", { withTimezone: false }).defaultNow(),
  performedBy: integer("performed_by")
    .notNull()
    .references(() => usersTable.id),
  remarks: text("remarks"),
});

export const stockTransfersRelations = relations(stockTransfers, ({ one }) => ({
  item: one(items, {
    fields: [stockTransfers.itemId],
    references: [items.itemId],
  }),
  fromLab: one(labs, {
    fields: [stockTransfers.fromLabId],
    references: [labs.labId],
  }),
  toLab: one(labs, {
    fields: [stockTransfers.toLabId],
    references: [labs.labId],
  }),
  performedByUser: one(usersTable, {
    fields: [stockTransfers.performedBy],
    references: [usersTable.id],
  }),

}));


export const disposalMethodEnum = pgEnum("disposal_method_enum", [
  "Sale",
  "Donation",
  "Scrap",
  "E-Waste",
  "Other",
]);

// 🔹 Table Definition
export const disposalRecords = pgTable("disposal_records", {
  disposalId: serial("disposal_id").primaryKey(),
  labId: integer("lab_id")
    .references(() => labs.labId, { onDelete: "cascade" }),
  itemId: integer("item_id")
    .references(() => items.itemId, { onDelete: "cascade" }),
  disposalDate: date("disposal_date").notNull().defaultNow(),
  disposalMethod: disposalMethodEnum("disposal_method").notNull(),
  disposalReason: text("disposal_reason"),
  disposalQuantity: integer("disposal_quantity"),
  remarks: text("remarks"),
});


export const disposalRecordsRelations = relations(disposalRecords, ({ one }) => ({
  lab: one(labs, {
    fields: [disposalRecords.labId],
    references: [labs.labId],
  }),
  item: one(items, {
    fields: [disposalRecords.itemId],
    references: [items.itemId],
  }),
}));
