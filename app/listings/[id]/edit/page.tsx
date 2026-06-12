"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Upload, Check, ChevronRight, Home, Image, Star, MapPin, DollarSign, Settings, X, Plus, Minus, AlertCircle, Info } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { properties } from "@/lib/data";

// ─── Step Config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Property Info", icon: Home, description: "Basic details about your property" },
  { id: 2, label: "Photos", icon: Image, description: "Upload photos of your space" },
  { id: 3, label: "Amenities", icon: Star, description: "What you offer to guests" },
  { id: 4, label: "Pricing", icon: DollarSign, description: "Set your nightly rate" },
  { id: 5, label: "Location", icon: MapPin, description: "Where is your property?" },
];

const AMENITY_OPTIONS = [
  { icon: "📶", label: "WiFi" },
  { icon: "🅿️", label: "Free Parking" },
  { icon: "🏊", label: "Pool" },
  { icon: "❄️", label: "Air Conditioning" },
  { icon: "🍳", label: "Kitchen" },
  { icon: "🖥️", label: "Workspace" },
  { icon: "📺", label: "TV" },
  { icon: "🧺", label: "Washer" },
  { icon: "🌿", label: "Garden" },
  { icon: "🔥", label: "Fireplace" },
  { icon: "🐾", label: "Pet Friendly" },
  { icon: "🚿", label: "Hot Tub" },
  { icon: "🏋️", label: "Gym" },
  { icon: "🔒", label: "Safe" },
  { icon: "☕", label: "Coffee Maker" },
  { icon: "🎮", label: "Game Room" },
];

const PHOTO_SLOTS = [
  { id: 1, label: "Main Photo", required: true },
  { id: 2, label: "Living Area", required: false },
  { id: 3, label: "Bedroom", required: false },
  { id: 4, label: "Bathroom", required: false },
  { id: 5, label: "Kitchen", required: false },
  { id: 6, label: "Exterior", required: false },
];

// ─── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  title: string;
  type: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  pricePerNight: number;
  cleaningFee: number;
  weeklyDiscount: number;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  instantBook: boolean;
}

export default function EditListingPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params?.id) ?? properties[0];

  const [currentStep, setCurrentStep] = useState(1);
  const [savedStep, setSavedStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: property?.title ?? "",
    type: property?.type ?? "room",
    description: property?.description ?? "",
    maxGuests: property?.maxGuests ?? 2,
    bedrooms: property?.bedrooms ?? 1,
    bathrooms: property?.bathrooms ?? 1,
    amenities: (property?.amenities ?? []).map((a) => a.label),
    pricePerNight: property?.pricePerNight ?? 80,
    cleaningFee: 25,
    weeklyDiscount: 10,
    address: "123 Main Street",
    city: property?.city ?? "",
    country: property?.country ?? "",
    zipCode: "10001",
    instantBook: property?.instantBook ?? false,
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<number, string>>({
    1: property?.image ?? "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(label)
        ? prev.amenities.filter((a) => a !== label)
        : [...prev.amenities, label],
    }));
  };

  const handleSave = () => {
    setSavedStep(currentStep);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const goNext = () => {
    if (currentStep < STEPS.length) {
      setSavedStep(currentStep);
      setCurrentStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const counterField = (
    label: string,
    subLabel: string,
    key: "maxGuests" | "bedrooms" | "bathrooms",
    min = 1,
    max = 20
  ) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{subLabel}</p>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => updateField(key, Math.max(min, (formData[key] as number) - 1))}
          className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors disabled:opacity-40"
          disabled={(formData[key] as number) <= min}
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        <span className="w-8 text-center font-semibold text-gray-800 text-lg">
          {formData[key] as number}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => updateField(key, Math.min(max, (formData[key] as number) + 1))}
          className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors disabled:opacity-40"
          disabled={(formData[key] as number) >= max}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );

  // ─── Step Panels ──────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Property Details</h2>
              <p className="text-gray-500 text-sm">
                Tell guests what makes your place special. A great title and description help you stand out.
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Listing Title <span className="text-[#FF385C]">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Cozy Studio in the Heart of Downtown"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 transition-all"
              />
              <p className="text-xs text-gray-400 mt-1.5">{formData.title.length}/80 characters</p>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Property Type <span className="text-[#FF385C]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { value: "room", label: "Private Room", icon: "🚪" },
                  { value: "house", label: "Entire House", icon: "🏠" },
                  { value: "hostel", label: "Hostel", icon: "🛏️" },
                  { value: "apartment", label: "Apartment", icon: "🏢" },
                  { value: "villa", label: "Villa", icon: "🏡" },
                ].map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => updateField("type", type.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      formData.type === type.value
                        ? "border-[#FF385C] bg-[#FF385C]/5 text-[#FF385C]"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-[#FF385C]">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={5}
                placeholder="Describe your space — what makes it unique, nearby attractions, house rules, and anything guests should know before booking..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-1.5">{formData.description.length}/1000 characters</p>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Capacity</label>
              <div className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
                {counterField("Guests", "Maximum number of guests", "maxGuests", 1, 20)}
                {counterField("Bedrooms", "Number of bedrooms", "bedrooms", 0, 15)}
                {counterField("Bathrooms", "Number of bathrooms", "bathrooms", 1, 10)}
              </div>
            </div>

            {/* Instant Book */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-800">Instant Book</p>
                <p className="text-sm text-gray-500">Guests can book without waiting for approval</p>
              </div>
              <button
                onClick={() => updateField("instantBook", !formData.instantBook)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.instantBook ? "bg-[#FF385C]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formData.instantBook ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Photos</h2>
              <p className="text-gray-500 text-sm">
                High-quality photos are the #1 factor in booking decisions. Add at least one main photo to get started.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Photo Tips</p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Use natural lighting, shoot in landscape orientation, and showcase your best features first. Listings with 6+ photos get 3× more bookings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PHOTO_SLOTS.map((slot) => (
                <motion.div
                  key={slot.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative aspect-[4/3] rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all ${
                    uploadedPhotos[slot.id]
                      ? "border-transparent"
                      : "border-gray-300 hover:border-[#FF385C] bg-gray-50"
                  }`}
                  onClick={() => {
                    const slugs = [
                      "cozy-bedroom-interior",
                      "bright-living-room",
                      "modern-bedroom-design",
                      "clean-bathroom-tiles",
                      "kitchen-countertop-appliances",
                      "house-exterior-garden",
                    ];
                    setUploadedPhotos((prev) => ({
                      ...prev,
                      [slot.id]: `/images/${slugs[slot.id - 1] ?? "cozy-bedroom-interior"}.jpg`,
                    }));
                  }}
                >
                  {uploadedPhotos[slot.id] ? (
                    <>
                      <img
                        src={uploadedPhotos[slot.id]}
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedPhotos((prev) => {
                              const next = { ...prev };
                              delete next[slot.id];
                              return next;
                            });
                          }}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <X className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                        {slot.label}
                      </div>
                      {slot.required && (
                        <div className="absolute top-2 left-2 bg-[#FF385C] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          Main
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 p-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-xs font-medium text-gray-500 text-center">{slot.label}</p>
                      {slot.required && (
                        <span className="text-xs text-[#FF385C] font-medium">Required</span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center">
              Click any slot to simulate uploading a photo. Supported formats: JPG, PNG, WEBP (max 10MB each).
            </p>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Amenities</h2>
              <p className="text-gray-500 text-sm">
                Select all the amenities your property offers. Guests filter by these — more amenities means more bookings.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              <Check className="w-4 h-4 text-[#FF385C]" />
              <span>
                <strong className="text-gray-800">{formData.amenities.length}</strong> amenities selected
              </span>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {AMENITY_OPTIONS.map((amenity) => {
                const selected = formData.amenities.includes(amenity.label);
                return (
                  <motion.button
                    key={amenity.label}
                    variants={scaleIn}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleAmenity(amenity.label)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      selected
                        ? "border-[#FF385C] bg-[#FF385C]/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-xl">{amenity.icon}</span>
                    <span
                      className={`text-sm font-medium ${
                        selected ? "text-[#FF385C]" : "text-gray-700"
                      }`}
                    >
                      {amenity.label}
                    </span>
                    {selected && (
                      <Check className="w-4 h-4 text-[#FF385C] ml-auto shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Pricing</h2>
              <p className="text-gray-500 text-sm">
                Set competitive pricing to attract guests. You can always adjust later based on demand and seasonality.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">Pricing Insight</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  Similar properties in {formData.city || "your area"} charge between{" "}
                  <strong>${(formData.pricePerNight * 0.8).toFixed(0)}</strong> –{" "}
                  <strong>${(formData.pricePerNight * 1.3).toFixed(0)}</strong> per night. You're currently{" "}
                  {formData.pricePerNight > 100 ? "above" : "below"} average.
                </p>
              </div>
            </div>

            {/* Nightly Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nightly Rate (USD) <span className="text-[#FF385C]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">$</span>
                <input
                  type="number"
                  value={formData.pricePerNight}
                  onChange={(e) => updateField("pricePerNight", Number(e.target.value ?? 0))}
                  min={10}
                  max={10000}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 text-lg font-semibold transition-all"
                />
              </div>
            </div>

            {/* Cleaning Fee */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cleaning Fee (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                <input
                  type="number"
                  value={formData.cleaningFee}
                  onChange={(e) => updateField("cleaningFee", Number(e.target.value ?? 0))}
                  min={0}
                  max={500}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">One-time fee charged per booking</p>
            </div>

            {/* Weekly Discount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weekly Discount (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.weeklyDiscount}
                  onChange={(e) => updateField("weeklyDiscount", Number(e.target.value ?? 0))}
                  min={0}
                  max={50}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Discount applied for stays of 7+ nights</p>
            </div>

            {/* Earnings Preview */}
            <div className="bg-gray-50 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Earnings Preview</p>
              <div className="space-y-2">
                {[
                  { label: "1 night", nights: 1 },
                  { label: "3 nights", nights: 3 },
                  { label: "7 nights (weekly discount)", nights: 7 },
                  { label: "30 nights", nights: 30 },
                ].map((row) => {
                  const discount = row.nights >= 7 ? formData.weeklyDiscount / 100 : 0;
                  const base = formData.pricePerNight * row.nights;
                  const total = base * (1 - discount) + formData.cleaningFee;
                  return (
                    <div key={row.label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{row.label}</span>
                      <span className="font-semibold text-gray-800">${(total ?? 0).toFixed(0)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * StayEase service fee (3%) deducted at payout
              </p>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Location</h2>
              <p className="text-gray-500 text-sm">
                Your exact address is only shared with guests after they book. We show an approximate location on the map.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address <span className="text-[#FF385C]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City <span className="text-[#FF385C]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="New York"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => updateField("zipCode", e.target.value)}
                  placeholder="10001"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country <span className="text-[#FF385C]">*</span>
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 transition-all bg-white"
                >
                  <option value="">Select a country</option>
                  {[
                    "United States",
                    "United Kingdom",
                    "France",
                    "Germany",
                    "Spain",
                    "Italy",
                    "Japan",
                    "Australia",
                    "Canada",
                    "Brazil",
                    "India",
                    "Thailand",
                    "Mexico",
                    "Portugal",
                    "Netherlands",
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative rounded-xl overflow-hidden border border-gray-200 h-56 bg-gray-100">
              <img
                src="http://static1.squarespace.com/static/544097e1e4b02c9e7d3761d0/t/63b6b598767a8650a549a56c/1672920492481/?format=1500w"
                alt="Property location map"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF385C]" />
                  <span className="text-sm font-medium text-gray-700">
                    {formData.city || "Your City"}, {formData.country || "Country"}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800">Your privacy is protected</p>
                <p className="text-sm text-green-700 mt-0.5">
                  We only show an approximate location on public listings. Your exact address is revealed only to confirmed guests.
                </p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-1">Ready to publish?</h3>
              <p className="text-white/80 text-sm mb-4">
                Review all your details, then publish your listing to start receiving bookings. You can always edit later.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="bg-white text-[#FF385C] font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
              >
                Publish Listing
              </motion.button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
              </motion.button>
            </Link>
            <span className="text-gray-300">|</span>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                Edit Listing
              </h1>
              <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs">
                {property?.title ?? "Your Property"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-1.5 text-green-600 text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  Saved!
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#FF385C] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#E31C5F] transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ─── Sidebar Step Navigator ─────────────────────────────────────── */}
          <motion.aside
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-36">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Edit Sections
              </p>
              <nav className="space-y-1">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isDone = savedStep >= step.id;
                  return (
                    <motion.button
                      key={step.id}
                      whileHover={{ x: 3 }}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        isActive
                          ? "bg-[#FF385C]/10 text-[#FF385C]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-[#FF385C] text-white"
                            : isDone
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {isDone && !isActive ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isActive ? "text-[#FF385C]" : ""}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400 truncate hidden lg:block">
                          {step.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Progress Bar */}
              <div className="mt-5 px-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Progress</span>
                  <span>{Math.round((savedStep / STEPS.length) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(savedStep / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ─── Main Form Panel ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {/* Step Progress (mobile) */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {STEPS.map((step, idx) => (
                  <div key={step.id} className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        currentStep === step.id
                          ? "bg-[#FF385C] text-white"
                          : savedStep >= step.id
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {savedStep >= step.id && currentStep !== step.id ? (
                        <Check className="w-3 h-3" />
                      ) : null}
                      {step.label}
                    </button>
                    {idx < STEPS.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-gray-300 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goPrev}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </motion.button>

                <div className="flex items-center gap-2">
                  {STEPS.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentStep === step.id
                          ? "bg-[#FF385C] w-5"
                          : savedStep >= step.id
                          ? "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>

                {currentStep < STEPS.length ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={goNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF385C] text-white font-semibold text-sm hover:bg-[#E31C5F] transition-colors shadow-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF385C] text-white font-semibold text-sm hover:bg-[#E31C5F] transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save & Publish
                  </motion.button>
                )}
              </div>
            </div>

            {/* Help Card */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#FF385C] rounded-xl flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">Need help with your listing?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">
                    Our hosting team is available 24/7 to help you optimize your listing, set competitive pricing, and attract more guests.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="#"
                      className="text-xs font-semibold text-[#FF385C] bg-[#FF385C]/10 px-3 py-1.5 rounded-lg hover:bg-[#FF385C]/20 transition-colors"
                    >
                      Hosting Guide
                    </a>
                    <a
                      href="#"
                      className="text-xs font-semibold text-gray-300 bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>