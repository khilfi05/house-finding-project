### This is the steps to setup Fullstack Next.js with MongoDB Project

1. Download **Node.js** and **npm**.
2. Register **MongoDB** and **Vercel**.
3. Open project folder and run:
```bash
npx create-next-app@latest my-app
```
4. After finish that, run:
```bash
npm i mongoose
```
5. Setup MongoDB connection in `/app/lib/mongodb.ts`:
```javascript
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cachead.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```
6. Copy MongoDB connection string from dashboard and paste in `.env.local`:
```python
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.aymryob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

#### Example Database Connection with API
Connecting to database and using it with API route in `/app/api/[collection_name]/route.ts`
```javascript
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
```
#### Example Frontend Calling API
Calling the API from the frontend in `/app/page.tsx`:
```javascript
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-2">Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </main>
  );
}
```

