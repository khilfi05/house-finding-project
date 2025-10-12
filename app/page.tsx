"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

export default function HomePage() {
  const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
    ssr: false, // ✅ Prevents Next.js from rendering this component on the server
  });

  return (
    <main style={{ height: "100vh", width: "100%" }}>
      <MapWithNoSSR />
    </main>
  );
}
