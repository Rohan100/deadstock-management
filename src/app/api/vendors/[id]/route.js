import db  from "@/db";
import { vendors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try{
    const { id } = await params;
    const vendor = await db.select().from(vendors).where(eq(vendors.vendorId, Number(id))).limit(1);
    if (vendor.length === 0) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json(vendor[0], { status: 200 });
    }catch(error){
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
export async function DELETE(request, { params }) {
    try{
    const { id } = await params;
    const vendor = await db.delete(vendors).where(eq(vendors.vendorId, Number(id))).returning();
    if (vendor.length === 0) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Vendor deleted successfully" }, { status: 200 });
    }catch(error){
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

export async function PATCH(request, { params }) {
    try{
    const { id } =await params;
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ message: "Vendor information is required" }, { status: 400 });
    }   
    if (body.hasOwnProperty("vendorName") && body.vendorName.trim() === "") {
      return NextResponse.json({ message: "Vendor name is required" }, { status: 400 });
    }
    const vendor = await db.update(vendors).set({
        ...body
    }).where(eq(vendors.vendorId, Number(id))).returning();
    
    if (vendor.length === 0) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json(vendor[0], { status: 200 });
    }catch(error){
      console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }  
}