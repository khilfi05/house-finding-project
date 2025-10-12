"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Listing from "./models/Listing";

const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("./components/Sidebar"), {
  ssr: false,
});


export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then(setListings);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        listings={listings}
        onSelect={setSelected}
      />

      {/* Map */}
      <div className="flex-1 relative">
        <MapComponent
          listings={listings}
          selected={selected}
        />
      </div>
      <Link
        href="/add"
        className="absolute bottom-6 right-6 z-[1000] bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
      >
        + Contribute
      </Link>
    </div>
  );
}
