// export const vendors = pgTable("vendors", {
//   vendorId: serial("vendor_id").primaryKey(),
//   vendorName: varchar("vendor_name", { length: 150 }).notNull(),
//   contactPerson: varchar("contact_person", { length: 100 }),
//   email: varchar("email", { length: 100 }),
//   phone: varchar("phone", { length: 15 }),
//   address: text("address"),
//   gstin: varchar("gstin", { length: 15 }),
//   createdAt: timestamp("created_at").defaultNow(),
// });

import db from "@/db";
import { vendors } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allVendors = await db.select().from(vendors);
    return NextResponse.json(allVendors, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const data = await request.json();
    const { vendorName, contactPerson, email, phone, address, gstin } = data;
    if (!vendorName) {
      return NextResponse.json(
        { message: "Vendor name is required" },
        { status: 400 }
      );
    }
    const newVendor = await db
      .insert(vendors)
      .values({ vendorName, contactPerson, email, phone, address, gstin })
      .returning();
    return NextResponse.json(newVendor[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vendor:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }     
}

