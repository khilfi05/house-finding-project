import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({ name: String });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export async function GET() {
  await connectToDatabase();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const data = await req.json();
  await connectToDatabase();
  const newUser = await User.create(data);
  return NextResponse.json(newUser);
}
