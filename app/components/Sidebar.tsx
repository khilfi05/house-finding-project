"use client";

import { useState, useMemo } from "react";

export default function Sidebar({ listings, onSelect }) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [furnishedFilter, setFurnishedFilter] = useState("all");

  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Search
    if (query) {
      result = result.filter((l) =>
        l.title?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter
    if (furnishedFilter !== "all") {
      result = result.filter(
        (l) => !!l.furnished === (furnishedFilter === "furnished")
      );
    }

    // Sort
    if (sort === "price") {
      result.sort((a, b) => {
        const getPriceValue = (val) => {
          if (!val) return 0;
          if (typeof val === "number") return val;
          const match = val.toString().match(/\d+(\.\d+)?/);
          return match ? parseFloat(match[0]) : 0;
        };
        return getPriceValue(a.price) - getPriceValue(b.price);
      });
    }

    return result;
  }, [listings, query, sort, furnishedFilter]);

  return (
    <div
      className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300
        ${open ? "w-80" : "w-12"} flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        className="p-2 text-sm bg-gray-100 hover:bg-gray-200"
        onClick={() => setOpen(!open)}
      >
        {open ? "←" : "→"}
      </button>

      {open && (
        <div className="p-3 overflow-y-auto flex-1">
          <input
            type="text"
            placeholder="Search house name..."
            className="w-full border px-2 py-1 mb-2 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex gap-2 mb-2">
            <select
              className="border text-sm p-1"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price">Price</option>
              <option value="monash">To Monash</option>
            </select>

            <select
              className="border text-sm p-1"
              value={furnishedFilter}
              onChange={(e) => setFurnishedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Listing List */}
          <ul>
            {filteredListings.map((house, i) => (
              <li
                key={i}
                onClick={() => onSelect(house)}
                className="p-2 border-b hover:bg-gray-100 cursor-pointer text-sm"
              >
                <div className="font-semibold">{house.title}</div>
                <div className="text-gray-600">{house.price}</div>
                <div className="text-xs text-gray-500">
                  🏫 {house.walkToMonash ?? "?"} mins • 🚌{" "}
                  {house.walkToBusStop ?? "?"} mins
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
