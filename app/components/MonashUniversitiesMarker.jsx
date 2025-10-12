"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css"

// Purple icon for Monash
const MonashIcon = L.icon({
  iconUrl: "/leaflet/purple-marker-icon.png",
  iconRetinaUrl: "/leaflet/purple-marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MonashUniversitiesMarker() {
  const campuses = [
    {
      name: "Monash University, Clayton",
      position: [-37.9110995, 145.1366624],
      image:
        "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npWYEBmG3ZDfDAaLlzxqVofmZ3eLXpT8B9G8mnv_SSmHyoBp1YsOC5LIfa1QZtIDXL58W6I9vm3WUFpsKCOw8RdG-9b8GD1oGMIxqtcxzG4G6-5ADUkwxFVqP48WkIYwqL-GNQ=s680-w680-h510-rw",
      link: "https://www.google.com/maps/place/Monash+University+Clayton+Campus/@-37.9110952,145.1317915,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad66acbf64673b9:0xfaf9b169a587104!8m2!3d-37.9110995!4d145.1366624!16zL20vMDEzNzE5",
      description:
        "We will begin our class here in January 2026 until around 2029.",
    },
    {
      name: "Monash University, Caulfield",
      position: [-37.87725921775779, 145.04503248374513],
      image:
        "https://www.2construct.com.au/hubfs/Project%20Images/15282%20-%20Monash%20University%20Caufield%20Campus%20Green/2Construct%20-%20Monash%20Campus%20Green%2001.jpg",
      link: "https://www.google.com/maps/place/Monash+University+Caulfield+Campus/@-37.8773481,145.0424254,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad6698cb33e0ac1:0x63f9134ad6bf7a0a!8m2!3d-37.8773524!4d145.0450003!16zL20vMGI4ZHNo",
      description:
        "We will begin our class here in November 2025 until February 2026.",
    },
  ];

  return (
    <>
      {campuses.map((campus) => (
        <Marker
          key={campus.name}
          position={campus.position}
          icon={MonashIcon}
        >
          <Popup>
            <div className="popup-content">
              <Link href={campus.link} target="_blank">
                <img
                  src={campus.image}
                  alt={campus.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              </Link>

              {/* Title */}
              <div className="popup-title font-semibold text-base mb-1 text-blue-500 hover:underline">
                <Link href={campus.link} target="_blank">
                  {campus.name}
                </Link>
              </div>

              {/* Description */}
              <div className="text-xs text-gray-700 mb-2">
                {campus.description}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}