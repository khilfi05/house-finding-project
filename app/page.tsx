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
