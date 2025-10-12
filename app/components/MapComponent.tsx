"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Listing from "../models/Listing";
import Link from "next/link";

const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
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
                <div className="popup-title font-semibold text-base mb-1">
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
