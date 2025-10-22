"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function AddListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    furnished: "yes",
    walkingToMonash: "",
    walkingToBusStop: "",
    sourceURL: "",
    imageURL: "",
    mapLink: "",
    latitude: "",
    longitude: "",
    additionalDetails: "",
    color: "blue"
  });

  const [submitButton, setSubmitButton] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractLatLon = (link: string) => {
    try {
      // Match formats:
      // 1️⃣ @-37.9110995,145.1366624
      // 2️⃣ center=-37.93252182,145.1267395
      // 3️⃣ query=lat,lon (some shared links use this)
      const regexes = [
        /@(-?\d+\.\d+),(-?\d+\.\d+)/,              // @lat,lon
        /center=(-?\d+\.\d+),(-?\d+\.\d+)/,        // center=lat,lon
        /query=(-?\d+\.\d+),(-?\d+\.\d+)/          // query=lat,lon
      ];

      for (const regex of regexes) {
        const match = link.match(regex);
        if (match) {
          return { lat: match[1], lon: match[2] };
        }
      }

      console.warn("No coordinates found in link:", link);
    } catch (err) {
      console.error("Invalid link:", err);
    }

    return null;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitButton(true);

    // Extract lat/lon
    const coords = extractLatLon(form.mapLink);
    if (!coords) {
      toast.error("Invalid Google Maps link. Please check the URL format.");
      setSubmitButton(false)
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
        setSubmitButton(false)
        return;
      }
    }

    const newListing = {
      title: form.title,
      mapLink: form.mapLink,
      price: Number(form.price),
      description: form.description,
      furnished: form.furnished === "yes",
      walkingToMonash: form.walkingToMonash,
      walkingToBusStop: form.walkingToBusStop,
      sourceURL: form.sourceURL,
      imageURL: form.imageURL,
      lat: Number(coords.lat),
      lon: Number(coords.lon),
      color: form.color
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
        setSubmitButton(false)
      }
    } catch (err) {
      toast.error("Something went wrong!");
      setSubmitButton(false)
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-600">
      <Toaster />
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">Add New Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium">House Title <label className="text-red-600">*</label></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Eg: 6 McMillan Street, Clayton South"
              required
            />
          </div>

          {/* Map Link */}
          <div>
            <label className="block font-medium">Google Maps Link <label className="text-red-600">*</label></label>
            <input
              name="mapLink"
              value={form.mapLink}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
              placeholder="Eg: https://www.google.com/maps/search/?api=1&query=..."
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium">Weekly Price ($)<label className="text-red-600">*</label></label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              min="0"
              placeholder="Eg: 630"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Short Description <label className="text-red-600">*</label></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={3}
              placeholder="Eg: Affordable apartment close to public transport."
              required
            />
          </div>

          {/* Furnished */}
          <div>
            <label className="block font-medium">Furnished <label className="text-red-600">*</label></label>
            <div className="flex gap-4 mt-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, furnished: "yes" })}
                className={`px-4 py-2 rounded-lg border hover:bg-gray-200 ${
                  form.furnished === "yes" ? "bg-green-500 text-white hover:bg-green-600" : ""
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, furnished: "no" })}
                className={`px-4 py-2 rounded-lg border hover:bg-gray-200 ${
                  form.furnished === "no" ? "bg-red-500 text-white hover:bg-red-600" : ""
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Distances */}
          <div>
            <label className="block font-medium">Travel Time to Monash (minute)<label className="text-red-600">*</label></label>
            <input
              name="walkingToMonash"
              value={form.walkingToMonash}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Eg: 6"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Travel Time to a Bus Stop (minute)<label className="text-red-600">*</label></label>
            <input
              name="walkingToBusStop"
              value={form.walkingToBusStop}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Eg: 7"
              required
            />
          </div>

          {/* URLs */}
          <div>
            <label className="block font-medium">House Source (URL) <label className="text-red-600">*</label></label>
            <input
              type="url"
              name="sourceURL"
              value={form.sourceURL}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Eg: https://www.tenantapp.com.au/Rentals/ViewListing/3338295"
              required
            />
          </div>

          <div>
            <label className="block font-medium">House Image (URL) <label className="text-red-600">*</label></label>
            <input
              type="url"
              name="imageURL"
              value={form.imageURL}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Eg: https://inspectre.blob.core.windows.net/images/normal/..."
              required
            />
          </div>
          
          {/* Color */}
          <div>
            <label className="block font-medium">Color <label className="text-red-600">*</label></label>
            <div className="flex gap-4 mt-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, color: "blue" })}
                className={`px-4 py-2 rounded-lg border hover:bg-gray-200 ${
                  form.color === "blue" ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                }`}
              >
                Blue
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, color: "yellow" })}
                className={`px-4 py-2 rounded-lg border hover:bg-gray-200 ${
                  form.color === "yellow" ? "bg-yellow-400 text-white hover:bg-yellow-500" : ""
                }`}
              >
                Yellow
              </button>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block font-medium">
              Additional Details <span className="text-gray-500 text-sm">(optional)</span>
            </label>
            <textarea
              name="additionalDetails"
              value={form.additionalDetails}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={4}
              placeholder={
`Eg:
Bedroom: 3
Shower: 2`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={submitButton? "w-full bg-gray-300 text-gray-600 p-3 rounded-lg font-medium transition" : "w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"}
            disabled={submitButton}
          >
            Add Listing
          </button>

          <Link href="/">
            <button
              type="button"
              className="w-full p-3 rounded-lg font-medium hover:text-gray-950 border-1 border-gray-600 hover:bg-gray-100 transition"
            >
              Back to Map
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
