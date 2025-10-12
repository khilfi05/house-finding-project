"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Listing from "../models/Listing";
import Link from "next/link";

// TODO Change definition "To Monash" is shortest travel time (walking + bus)
// TODO Change definition "To Bus Stop" is shortest travel time to a bus stop (walking)

const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Red icon for Monash
const MonashIcon = L.icon({
  iconUrl: "/leaflet/purple-marker-icon.png",
  iconRetinaUrl: "/leaflet/purple-marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function FlyToMarker({ selected }: { selected: Listing | null }) {
  const map = useMap();

  useEffect(() => {
    if (selected?.lat && selected?.lon) {
      map.flyTo([selected.lat, selected.lon], 15, { duration: 1.2 });
    }
  }, [selected, map]);

  return null;
}

export default function MapComponent({ listings, selected }: { listings: Listing[], selected: Listing | null }) {
  const markerRefs: any = useRef({});

  // Whenever selected changes, open its popup if available
  useEffect(() => {
    if (selected && markerRefs.current[selected._id]) {
      const marker = markerRefs.current[selected._id];
      marker.openPopup();
    }
  }, [selected]);

  return (
    <MapContainer
      center={[-37.91087518572503, 145.13660875582238]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[-37.9110995, 145.1366624]} // Monash Clayton
        icon={MonashIcon}
      >
        <Popup>
        <div className="popup-content">
            <Link href="https://www.google.com/maps/place/Monash+University+Clayton+Campus/@-37.9110952,145.1317915,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad66acbf64673b9:0xfaf9b169a587104!8m2!3d-37.9110995!4d145.1366624!16zL20vMDEzNzE5?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D" target="_">
                <img
                    src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4npWYEBmG3ZDfDAaLlzxqVofmZ3eLXpT8B9G8mnv_SSmHyoBp1YsOC5LIfa1QZtIDXL58W6I9vm3WUFpsKCOw8RdG-9b8GD1oGMIxqtcxzG4G6-5ADUkwxFVqP48WkIYwqL-GNQ=s680-w680-h510-rw"
                    alt="Monash University, Clayton"
                    className="w-full h-32 object-cover rounded-md mb-2"
                />
            </Link>

            {/* Title & Price */}
            <div className="popup-title font-semibold text-base mb-1 text-blue-500 hover:underline">
                <Link href="https://www.google.com/maps/place/Monash+University+Clayton+Campus/@-37.9110952,145.1317915,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad66acbf64673b9:0xfaf9b169a587104!8m2!3d-37.9110995!4d145.1366624!16zL20vMDEzNzE5?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D" target="_">
                  Monash University, Clayton
                </Link>
            </div>

            {/* Description */}
            <div className="text-xs text-gray-700 mb-2">
              We will begin our class here in January 2026 until around 2029.
            </div>
        </div>
        </Popup>
      </Marker>
      
      <Marker
        position={[-37.87725921775779, 145.04503248374513]} // Monash Clayton
        icon={MonashIcon}
      >
        <Popup>
        <div className="popup-content">
            <Link href="https://www.google.com/maps/place/Monash+University+Caulfield+Campus/@-37.8773481,145.0424254,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad6698cb33e0ac1:0x63f9134ad6bf7a0a!8m2!3d-37.8773524!4d145.0450003!16zL20vMGI4ZHNo?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D" target="_">
                <img
                    src="https://www.2construct.com.au/hubfs/Project%20Images/15282%20-%20Monash%20University%20Caufield%20Campus%20Green/2Construct%20-%20Monash%20Campus%20Green%2001.jpg"
                    alt="Monash University, Caulfield"
                    className="w-full h-32 object-cover rounded-md mb-2"
                />
            </Link>

            {/* Title & Price */}
            <div className="popup-title font-semibold text-base mb-1 text-blue-500 hover:underline">
                <Link href="https://www.google.com/maps/place/Monash+University+Clayton+Campus/@-37.9110952,145.1317915,17z/data=!3m1!4b1!4m6!3m5!1s0x6ad66acbf64673b9:0xfaf9b169a587104!8m2!3d-37.9110995!4d145.1366624!16zL20vMDEzNzE5?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D" target="_">
                  Monash University, Caulfield
                </Link>
            </div>

            {/* Description */}
            <div className="text-xs text-gray-700 mb-2">
              We will begin our class here in November 2025 until February 2026.
            </div>
        </div>
        </Popup>
      </Marker>

      {listings.map((house) => (
        <Marker
          key={house._id || house.title} // use unique id
          position={[house.lat, house.lon]}
          ref={(ref) => {
            if (ref) markerRefs.current[house._id || house.title] = ref;
          }}
        >
            <Popup>
            <div className="popup-content">
                {/* Image (only render if exists) */}
                {house?.imageURL ? (
                <Link href={house.sourceURL} target="_">
                    <img
                        src={house.imageURL}
                        alt={house.title || "Listing image"}
                        className="w-full h-32 object-cover rounded-md mb-2"
                    />
                </Link>
                ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md mb-2 text-gray-500 text-xs">
                    No image
                </div>
                )}

                {/* Title & Price */}
                <div className="popup-title font-semibold text-base mb-1 text-blue-500 hover:underline">
                  {house?.title? (
                    <Link href={house.sourceURL || ""} target="_">
                      {house.title}
                    </Link>
                  ) : "Untitled Listing"}
                </div>
                <div className="popup-price text-sm text-gray-600 mb-2">
                {house?.price? `$ ${house.price} / week`: "Price not available"}
                </div>
                {/* Description */}
                <div className="text-xs text-gray-700 mb-2">
                {house?.description || "No description provided."}
                </div>
                {/* Extra details */}
                <div className="text-xs space-y-1">
                <div>
                    <strong>Furnished:</strong>{" "}
                    {house?.furnished === true
                    ? "Yes"
                    : house?.furnished === false
                    ? "No"
                    : "N/A"}
                </div>
                <div>
                    <strong>To Monash:</strong>{" "}
                    {house?.walkingToMonash != null ? `${house.walkingToMonash} mins` : "N/A"}
                </div>
                <div>
                    <strong>To Bus Stop:</strong>{" "}
                    {house?.walkingToBusStop != null ? `${house.walkingToBusStop} mins` : "N/A"}
                </div>
                </div>


            </div>
            </Popup>
        </Marker>
      ))}

      <FlyToMarker selected={selected} />
    </MapContainer>
  );
}
