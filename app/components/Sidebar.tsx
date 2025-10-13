"use client";

import { useState, useMemo } from "react";
import Listing from "../models/Listing";

export default function Sidebar({
  listings,
  onSelect,
}: {
  listings: Listing[];
  onSelect: any;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [furnishedFilter, setFurnishedFilter] = useState("all");

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (query) {
      result = result.filter((l) =>
        l.title?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (furnishedFilter !== "all") {
      result = result.filter(
        (l) => !!l.furnished === (furnishedFilter === "furnished")
      );
    }

    if (sort === "price") {
      result.sort((a, b) => {
        const getPriceValue = (val: any) => {
          if (!val) return 0;
          if (typeof val === "number") return val;
          const match = val.toString().match(/\d+(\.\d+)?/);
          return match ? parseFloat(match[0]) : 0;
        };
        return getPriceValue(a.price) - getPriceValue(b.price);
      });
    } else if (sort === "monash") {
      result.sort((a, b) => a.walkingToMonash - b.walkingToMonash);
    }

    return result;
  }, [listings, query, sort, furnishedFilter]);

  return (
    <>
      {/* Toggle Button (Always Visible) */}
      <button
        className="fixed top-4 left-4 z-[10001] p-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md w-12 h-12"
        onClick={() => setOpen(!open)}
      >
        {open ? "≪" : "≫"}
      </button>

      {/* Sidebar (Slides In/Out) */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-[10001]
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Toggle Button */}
        <button
          className="p-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 transition w-full"
          onClick={() => setOpen(!open)}
        >
          {open ? "≪" : "≫"}
        </button>
        <div className="p-3 overflow-y-auto flex-1 w-80">
          <input
            type="text"
            placeholder="Search house name..."
            className="border placeholder-gray-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2 mb-2 w-full text-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex gap-2 mb-2">
            <select
              className="border text-sm placeholder-gray-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2 mb-2 w-full text-blue-400"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price">Price</option>
              <option value="monash">To Monash</option>
            </select>

            <select
              className="border text-sm placeholder-gray-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2 mb-2 w-full text-blue-400"
              value={furnishedFilter}
              onChange={(e) => setFurnishedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          <ul>
            {filteredListings.map((house, i) => (
              <li
                key={i}
                onClick={() => onSelect(house)}
                className="p-2 border-b hover:bg-gray-200 cursor-pointer text-sm bg-white text-gray-800 px-4 py-2"
              >
                <div className="font-semibold">{house.title}</div>
                <div className="text-green-700">{`$ ${house.price} / week`}</div>
                <div className="text-xs text-gray-500">
                  🏫 {house.walkingToMonash ?? "?"} mins • 🚌{" "}
                  {house.walkingToBusStop ?? "?"} mins
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
