import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import Listing from "../../../models/Listing"
import { ObjectId } from "mongodb";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const listing = await db.collection("house").findOne({ _id: new ObjectId(id)})
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    return NextResponse.json(listing, { status: 200 });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params
    const body = await req.json()
    const update = await db.collection("house").findOneAndUpdate({ _id: new ObjectId(id) }, { $set: body }, { returnDocument: "after"})
    if (!update) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    return NextResponse.json(update, { status: 200 });
}