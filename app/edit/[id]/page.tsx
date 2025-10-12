"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = params.id

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
    additionalDetails: "",
  });

  const [submitButton, setSubmitButton] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🟦 Fetch existing listing when page loads
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;

      try {
        const res = await fetch(`/api/listings/${listingId}`);
        if (!res.ok) throw new Error("Failed to fetch listing");

        const data = await res.json();
        setForm({
          title: data.title || "",
          price: data.price?.toString() || "",
          description: data.description || "",
          furnished: data.furnished ? "yes" : "no",
          walkingToMonash: data.walkingToMonash?.toString() || "",
          walkingToBusStop: data.walkingToBusStop?.toString() || "",
          sourceURL: data.sourceURL || "",
          imageURL: data.imageURL || "",
          mapLink: data.mapLink || "",
          latitude: data.lat?.toString() || "",
          longitude: data.lon?.toString() || "",
          additionalDetails: data.additionalDetails || "",
        });
      } catch (err) {
        toast.error("Failed to load listing data");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractLatLon = (link: string) => {
    try {
      const regexes = [
        /@(-?\d+\.\d+),(-?\d+\.\d+)/,
        /center=(-?\d+\.\d+),(-?\d+\.\d+)/,
        /query=(-?\d+\.\d+),(-?\d+\.\d+)/,
      ];
      for (const regex of regexes) {
        const match = link.match(regex);
        if (match) return { lat: match[1], lon: match[2] };
      }
    } catch (err) {
      console.error("Invalid link:", err);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitButton(true);

    const coords = extractLatLon(form.mapLink);
    if (!coords) {
      toast.error("Invalid Google Maps link. Please check the URL format.");
      setSubmitButton(false);
      return;
    }

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
        setSubmitButton(false);
        return;
      }
    }

    const updatedListing = {
      title: form.title,
      price: Number(form.price),
      mapLink: form.mapLink,
      description: form.description,
      furnished: form.furnished === "yes",
      walkingToMonash: form.walkingToMonash,
      walkingToBusStop: form.walkingToBusStop,
      sourceURL: form.sourceURL,
      imageURL: form.imageURL,
      lat: Number(coords.lat),
      lon: Number(coords.lon),
      additionalDetails: form.additionalDetails,
    };

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedListing),
      });

      if (res.ok) {
        toast.success("Listing updated successfully!");
        setTimeout(() => router.push("/"), 1500);
      } else {
        toast.error("Failed to update listing.");
        setSubmitButton(false);
      }
    } catch (err) {
      toast.error("Something went wrong!");
      setSubmitButton(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 bg-white">
        Loading listing details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-600">
      <Toaster />
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Edit Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium">
              House Title <span className="text-red-600">*</span>
            </label>
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
            <label className="block font-medium">
              Google Maps Link <span className="text-red-600">*</span>
            </label>
            <input
              name="mapLink"
              value={form.mapLink}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium">
              Weekly Price ($)<span className="text-red-600">*</span>
            </label>
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
            <label className="block font-medium">
              Short Description <span className="text-red-600">*</span>
            </label>
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
            <label className="block font-medium">
              Furnished <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-4 mt-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, furnished: "yes" })}
                className={`px-4 py-2 rounded-lg border hover:bg-gray-200 ${
                  form.furnished === "yes"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : ""
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, furnished: "no" })}
                className={`px-4 py-2 rounded-lg border hover:bg-gray-200 ${
                  form.furnished === "no"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : ""
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Distances */}
          <div>
            <label className="block font-medium">
              Travel Time to Monash (minute)<span className="text-red-600">*</span>
            </label>
            <input
              name="walkingToMonash"
              value={form.walkingToMonash}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium">
              Travel Time to a Bus Stop (minute)
              <span className="text-red-600">*</span>
            </label>
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
            <label className="block font-medium">
              House Source (URL)<span className="text-red-600">*</span>
            </label>
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
            <label className="block font-medium">
              House Image (URL)<span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              name="imageURL"
              value={form.imageURL}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
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
Shower: 2`
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={
              submitButton
                ? "w-full bg-gray-300 text-gray-600 p-3 rounded-lg font-medium transition"
                : "w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition"
            }
            disabled={submitButton}
          >
            Save Changes
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
