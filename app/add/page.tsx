"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Double } from "mongodb";

export default function AddListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    furnished: "",
    walkingToMonash: "",
    walkingToBusStop: "",
    sourceURL: "",
    imageURL: "",
    mapLink: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractLatLon = (link: string) => {
    try {
      const match = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        return { lat: match[1], lon: match[2] };
      }
    } catch (err) {
      console.error("Invalid link");
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract lat/lon
    const coords = extractLatLon(form.mapLink);
    if (!coords) {
      toast.error("Invalid Google Maps link. Please check the URL format.");
      return;
    }

    // Check all required fields
    const requiredFields = [
      "title",
      "price",
      "description",
      "furnished",
      "walkingToMonash",
      "walkingToBusStop",
      "sourceURL",
      "imageURL",
    ];

    for (const field of requiredFields) {
      if (!form[field as keyof typeof form]) {
        toast.error(`Please fill in ${field}`);
        return;
      }
    }

    const newListing = {
      title: form.title,
      price: Number(form.price),
      description: form.description,
      furnished: form.furnished === "yes",
      walkingToMonash: form.walkingToMonash,
      walkingToBusStop: form.walkingToBusStop,
      sourceURL: form.sourceURL,
      imageURL: form.imageURL,
      lat: Number(coords.lat),
      lon: Number(coords.lon),
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newListing),
      });

      if (res.ok) {
        toast.success("Listing added successfully!");
        setTimeout(() => router.push("/"), 1500);
      } else {
        toast.error("Failed to add listing.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Add New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium">House Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Map Link */}
          <div>
            <label className="block font-medium">Google Maps Link *</label>
            <input
              name="mapLink"
              value={form.mapLink}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
              placeholder="Paste a Google Maps link here"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium">House Price (RM) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              min="0"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Short Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          {/* Furnished */}
          <div>
            <label className="block font-medium">Furnished *</label>
            <div className="flex gap-4 mt-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, furnished: "yes" })}
                className={`px-4 py-2 rounded-lg border ${
                  form.furnished === "yes" ? "bg-green-500 text-white" : ""
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, furnished: "no" })}
                className={`px-4 py-2 rounded-lg border ${
                  form.furnished === "no" ? "bg-red-500 text-white" : ""
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Distances */}
          <div>
            <label className="block font-medium">Walking distance to Monash *</label>
            <input
              name="walkingToMonash"
              value={form.walkingToMonash}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Walking distance to Bus Stop *</label>
            <input
              name="walkingToBusStop"
              value={form.walkingToBusStop}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* URLs */}
          <div>
            <label className="block font-medium">House Source (URL) *</label>
            <input
              type="url"
              name="sourceURL"
              value={form.sourceURL}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium">House Image (URL) *</label>
            <input
              type="url"
              name="imageURL"
              value={form.imageURL}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Add Listing
          </button>
        </form>
      </div>
    </div>
  );
}
