import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";

export async function GET() {
  const listings = await db.collection("house").find({}).toArray();
  return NextResponse.json(listings);
}

export async function POST(req: Request) {
  const data = await req.json();
  const result = await db.collection("house").insertOne(data);
  return NextResponse.json(result, { status: 201 });
}

