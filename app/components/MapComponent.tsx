"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function FlyToMarker({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected?.lat && selected?.lon) {
      map.flyTo([selected.lat, selected.lon], 15, { duration: 1.2 });
    }
  }, [selected, map]);

  return null;
}

export default function MapComponent({ listings, selected }) {
  const markerRefs = useRef({});

  // Whenever selected changes, open its popup if available
  useEffect(() => {
    if (selected && markerRefs.current[selected._id]) {
      const marker = markerRefs.current[selected._id];
      marker.openPopup();
    }
  }, [selected]);

  return (
    <MapContainer
      center={[3.139, 101.6869]}
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
                {house?.image ? (
                <img
                    src={house.image}
                    alt={house.title || "Listing image"}
                    className="w-full h-32 object-cover rounded-md mb-2"
                />
                ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md mb-2 text-gray-500 text-xs">
                    No image
                </div>
                )}

                {/* Title & Price */}
                <div className="popup-title font-semibold text-base mb-1">
                {house?.title || "Untitled Listing"}
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
                    {house?.walkToMonash != null ? `${house.walkToMonash} mins` : "N/A"}
                </div>
                <div>
                    <strong>To Bus Stop:</strong>{" "}
                    {house?.walkToBusStop != null ? `${house.walkToBusStop} mins` : "N/A"}
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
