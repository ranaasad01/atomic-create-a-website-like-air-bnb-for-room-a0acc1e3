"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Home, Image, Star, Upload, MapPin, DollarSign, Wifi, Car, Coffee, Tv, Wind, Waves, ChevronDown, Plus, X, Info, AlertCircle } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FormData {
  // Step 1 – Property Info
  title: string;
  type: string;
  description: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  category: string;
  instantBook: boolean;
  // Step 2 – Photos
  photos: string[];
  // Step 3 – Amenities
  amenities: string[];
  // Step 4 – Pricing
  pricePerNight: number;
  cleaningFee: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  minNights: number;
  maxNights: number;
  // Step 5 – Location
  address: string;
  city: string;
  country: string;
  zipCode: string;
  lat: string;
  lng: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "Property Info",
    description: "Tell guests about your space",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Photos",
    description: "Show off your space",
    icon: <Image className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Amenities",
    description: "What do you offer?",
    icon: <Star className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Pricing",
    description: "Set your rates",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    id: 5,
    title: "Location",
    description: "Where is your place?",
    icon: <MapPin className="w-5 h-5" />,
  },
];

const PROPERTY_TYPES = [
  { value: "room", label: "Private Room", icon: "🚪", desc: "Guests have their own room in a shared home" },
  { value: "house", label: "Entire House", icon: "🏠", desc: "Guests have the whole place to themselves" },
  { value: "hostel", label: "Hostel", icon: "🛏️", desc: "Shared dormitory-style accommodation" },
  { value: "apartment", label: "Apartment", icon: "🏢", desc: "A self-contained apartment unit" },
  { value: "villa", label: "Villa", icon: "🏡", desc: "Luxury villa with premium amenities" },
];

const CATEGORIES = [
  "Trending", "Beach", "Mountains", "City", "Hostel",
  "Entire Home", "Private Room", "Villa", "Countryside", "Lakefront",
];

const AMENITIES_LIST = [
  { id: "wifi", label: "Wi-Fi", icon: <Wifi className="w-5 h-5" /> },
  { id: "parking", label: "Free Parking", icon: <Car className="w-5 h-5" /> },
  { id: "kitchen", label: "Kitchen", icon: <Coffee className="w-5 h-5" /> },
  { id: "tv", label: "Smart TV", icon: <Tv className="w-5 h-5" /> },
  { id: "ac", label: "Air Conditioning", icon: <Wind className="w-5 h-5" /> },
  { id: "pool", label: "Swimming Pool", icon: <Waves className="w-5 h-5" /> },
  { id: "washer", label: "Washer", icon: <Star className="w-5 h-5" /> },
  { id: "dryer", label: "Dryer", icon: <Star className="w-5 h-5" /> },
  { id: "gym", label: "Gym Access", icon: <Star className="w-5 h-5" /> },
  { id: "breakfast", label: "Breakfast Included", icon: <Coffee className="w-5 h-5" /> },
  { id: "pets", label: "Pet Friendly", icon: <Star className="w-5 h-5" /> },
  { id: "smoking", label: "Smoking Allowed", icon: <Star className="w-5 h-5" /> },
  { id: "workspace", label: "Dedicated Workspace", icon: <Star className="w-5 h-5" /> },
  { id: "bbq", label: "BBQ Grill", icon: <Star className="w-5 h-5" /> },
  { id: "fireplace", label: "Fireplace", icon: <Star className="w-5 h-5" /> },
  { id: "balcony", label: "Balcony / Patio", icon: <Star className="w-5 h-5" /> },
];

const MOCK_PHOTO_SLUGS = [
  "/images/listing-living-room-modern.jpg",
  "/images/listing-bedroom-cozy.jpg",
  "/images/listing-kitchen-bright.jpg",
  "/images/listing-bathroom-clean.jpg",
  "/images/listing-exterior-view.jpg",
];

const INITIAL_FORM: FormData = {
  title: "",
  type: "",
  description: "",
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  category: "",
  instantBook: false,
  photos: [],
  amenities: [],
  pricePerNight: 0,
  cleaningFee: 0,
  weeklyDiscount: 0,
  monthlyDiscount: 0,
  minNights: 1,
  maxNights: 30,
  address: "",
  city: "",
  country: "",
  zipCode: "",
  lat: "",
  lng: "",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function InputField({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function StepperInput({
  value,
  onChange,
  min = 1,
  max = 50,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#FF385C] hover:text-[#FF385C] transition-colors"
      >
        <span className="text-lg leading-none">−</span>
      </motion.button>
      <span className="w-8 text-center font-semibold text-gray-800 text-lg">{value}</span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-[#FF385C] hover:text-[#FF385C] transition-colors"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ─── Step Components ────────────────────────────────────────────────────────────

function Step1PropertyInfo({
  form,
  setForm,
  errors,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your place</h2>
        <p className="text-gray-500 text-sm">
          Share the basics — guests will see this when browsing your listing.
        </p>
      </motion.div>

      {/* Property Type */}
      <motion.div variants={fadeInUp}>
        <InputField
          label="What type of property is it?"
          error={errors.type}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
            {PROPERTY_TYPES.map((pt) => (
              <motion.button
                key={pt.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setForm((f) => ({ ...f, type: pt.value }))}
                className={cn(
                  "flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all",
                  form.type === pt.value
                    ? "border-[#FF385C] bg-[#FF385C]/5"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
              >
                <span className="text-2xl">{pt.icon}</span>
                <span className="font-semibold text-gray-800 text-sm">{pt.label}</span>
                <span className="text-xs text-gray-400 leading-snug">{pt.desc}</span>
              </motion.button>
            ))}
          </div>
        </InputField>
      </motion.div>

      {/* Title */}
      <motion.div variants={fadeInUp}>
        <InputField
          label="Listing title"
          hint="A catchy title helps your listing stand out. Max 60 characters."
          error={errors.title}
        >
          <input
            type="text"
            maxLength={60}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Cozy Studio in the Heart of Barcelona"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm transition-all"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.title.length}/60</p>
        </InputField>
      </motion.div>

      {/* Description */}
      <motion.div variants={fadeInUp}>
        <InputField
          label="Description"
          hint="Describe what makes your place special. Be specific and welcoming."
          error={errors.description}
        >
          <textarea
            rows={5}
            maxLength={500}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Tell guests what they'll love about your space — the vibe, nearby attractions, unique features..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm resize-none transition-all"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.description.length}/500</p>
        </InputField>
      </motion.div>

      {/* Capacity */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {(
          [
            { key: "maxGuests", label: "Max Guests", max: 20 },
            { key: "bedrooms", label: "Bedrooms", max: 20 },
            { key: "bathrooms", label: "Bathrooms", max: 10 },
          ] as { key: keyof FormData; label: string; max: number }[]
        ).map(({ key, label, max }) => (
          <div key={key} className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700">{label}</span>
            <StepperInput
              value={form[key] as number}
              onChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
              max={max}
            />
          </div>
        ))}
      </motion.div>

      {/* Category */}
      <motion.div variants={fadeInUp}>
        <InputField label="Category" hint="Choose the best category for your listing.">
          <div className="relative">
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 text-sm appearance-none bg-white transition-all"
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c.toLowerCase()}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </InputField>
      </motion.div>

      {/* Instant Book */}
      <motion.div variants={fadeInUp}>
        <div
          className={cn(
            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
            form.instantBook ? "border-[#FF385C] bg-[#FF385C]/5" : "border-gray-200 bg-white"
          )}
          onClick={() => setForm((f) => ({ ...f, instantBook: !f.instantBook }))}
        >
          <div>
            <p className="font-semibold text-gray-800 text-sm">Enable Instant Book</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Guests can book without waiting for your approval — great for higher occupancy.
            </p>
          </div>
          <div
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative shrink-0 ml-4",
              form.instantBook ? "bg-[#FF385C]" : "bg-gray-200"
            )}
          >
            <div
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
                form.instantBook ? "translate-x-7" : "translate-x-1"
              )}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Step2Photos({
  form,
  setForm,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const addPhoto = (slug: string) => {
    if (!form.photos.includes(slug)) {
      setForm((f) => ({ ...f, photos: [...f.photos, slug] }));
    }
  };
  const removePhoto = (slug: string) => {
    setForm((f) => ({ ...f, photos: f.photos.filter((p) => p !== slug) }));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Add photos of your space</h2>
        <p className="text-gray-500 text-sm">
          Great photos are the #1 factor in booking success. Add at least 5 high-quality images.
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeInUp}>
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-gray-50 hover:border-[#FF385C] hover:bg-[#FF385C]/5 transition-all cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7 text-[#FF385C]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">Drag & drop photos here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse — JPG, PNG, WEBP up to 10MB each</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {MOCK_PHOTO_SLUGS.map((slug) => (
              <motion.button
                key={slug}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addPhoto(slug)}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#FF385C] hover:text-[#FF385C] transition-colors shadow-sm"
              >
                + {slug.split("/images/")[1]?.replace(".jpg", "").replace(/-/g, " ") ?? slug}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Photo Grid */}
      {form.photos.length > 0 && (
        <motion.div variants={fadeInUp}>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Added photos ({form.photos.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {form.photos.map((slug, idx) => (
              <motion.div
                key={slug}
                variants={scaleIn}
                className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100"
              >
                <img
                  src={slug}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <div className="absolute top-2 left-2 bg-[#FF385C] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    Cover
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(slug)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <motion.div variants={fadeInUp}>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Photo tips for more bookings</p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1 list-disc list-inside">
              <li>Use natural light — shoot during the day with curtains open</li>
              <li>Shoot from corners to make rooms look larger</li>
              <li>Include all key spaces: bedroom, bathroom, kitchen, living area</li>
              <li>Highlight unique features like a view, fireplace, or pool</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Step3Amenities({
  form,
  setForm,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const toggle = (id: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(id)
        ? f.amenities.filter((a) => a !== id)
        : [...f.amenities, id],
    }));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">What amenities do you offer?</h2>
        <p className="text-gray-500 text-sm">
          Select everything available at your property. Guests filter by amenities — more is better!
        </p>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {AMENITIES_LIST.map((amenity) => {
          const selected = form.amenities.includes(amenity.id);
          return (
            <motion.button
              key={amenity.id}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(amenity.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
                selected
                  ? "border-[#FF385C] bg-[#FF385C]/5 text-[#FF385C]"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
              )}
            >
              <span className={selected ? "text-[#FF385C]" : "text-gray-400"}>
                {amenity.icon}
              </span>
              <span className="text-xs font-semibold">{amenity.label}</span>
              {selected && (
                <div className="w-5 h-5 rounded-full bg-[#FF385C] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {form.amenities.length > 0 && (
        <motion.div variants={fadeInUp}>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[#FF385C]">{form.amenities.length}</span> amenities selected
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

function Step4Pricing({
  form,
  setForm,
  errors,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  const estimatedMonthly =
    (form.pricePerNight ?? 0) * 22 * (1 - (form.monthlyDiscount ?? 0) / 100);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Set your pricing</h2>
        <p className="text-gray-500 text-sm">
          Competitive pricing gets you more bookings. You can always adjust later.
        </p>
      </motion.div>

      {/* Base Price */}
      <motion.div variants={fadeInUp}>
        <InputField
          label="Nightly rate (USD)"
          hint="This is what guests pay per night before fees."
          error={errors.pricePerNight}
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
            <input
              type="number"
              min={1}
              value={form.pricePerNight || ""}
              onChange={(e) => setForm((f) => ({ ...f, pricePerNight: Number(e.target.value ?? 0) }))}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 text-sm transition-all"
            />
          </div>
        </InputField>
      </motion.div>

      {/* Cleaning Fee */}
      <motion.div variants={fadeInUp}>
        <InputField
          label="Cleaning fee (USD)"
          hint="One-time fee charged per booking. Leave 0 if included."
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
            <input
              type="number"
              min={0}
              value={form.cleaningFee || ""}
              onChange={(e) => setForm((f) => ({ ...f, cleaningFee: Number(e.target.value ?? 0) }))}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 text-sm transition-all"
            />
          </div>
        </InputField>
      </motion.div>

      {/* Discounts */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField label="Weekly discount (%)" hint="Applied when guests stay 7+ nights.">
          <div className="relative">
            <input
              type="number"
              min={0}
              max={80}
              value={form.weeklyDiscount || ""}
              onChange={(e) => setForm((f) => ({ ...f, weeklyDiscount: Number(e.target.value ?? 0) }))}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 text-sm transition-all pr-8"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </InputField>
        <InputField label="Monthly discount (%)" hint="Applied when guests stay 28+ nights.">
          <div className="relative">
            <input
              type="number"
              min={0}
              max={80}
              value={form.monthlyDiscount || ""}
              onChange={(e) => setForm((f) => ({ ...f, monthlyDiscount: Number(e.target.value ?? 0) }))}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 text-sm transition-all pr-8"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </InputField>
      </motion.div>

      {/* Min / Max Nights */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">Minimum nights</span>
          <StepperInput
            value={form.minNights}
            onChange={(v) => setForm((f) => ({ ...f, minNights: v }))}
            min={1}
            max={30}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700">Maximum nights</span>
          <StepperInput
            value={form.maxNights}
            onChange={(v) => setForm((f) => ({ ...f, maxNights: v }))}
            min={1}
            max={365}
          />
        </div>
      </motion.div>

      {/* Earnings Estimate */}
      {(form.pricePerNight ?? 0) > 0 && (
        <motion.div variants={scaleIn}>
          <div className="bg-gradient-to-r from-[#FF385C]/10 to-[#FF385C]/5 border border-[#FF385C]/20 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">Estimated earnings</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Per night",
                  value: `$${(form.pricePerNight ?? 0).toLocaleString()}`,
                },
                {
                  label: "Per week",
                  value: `$${(
                    (form.pricePerNight ?? 0) *
                    7 *
                    (1 - (form.weeklyDiscount ?? 0) / 100)
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                },
                {
                  label: "Per month",
                  value: `$${estimatedMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-xl font-bold text-[#FF385C]">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * Estimates based on 22 booked nights/month. Actual earnings vary.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Step5Location({
  form,
  setForm,
  errors,
}: {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Partial<Record<keyof FormData, string>>;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Where is your property?</h2>
        <p className="text-gray-500 text-sm">
          Your exact address is only shared with confirmed guests. We show an approximate location on the map.
        </p>
      </motion.div>

      {/* Address */}
      <motion.div variants={fadeInUp}>
        <InputField label="Street address" error={errors.address}>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="e.g. 42 Sunset Boulevard, Apt 3B"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm transition-all"
          />
        </InputField>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField label="City" error={errors.city}>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            placeholder="e.g. Barcelona"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm transition-all"
          />
        </InputField>
        <InputField label="Country" error={errors.country}>
          <input
            type="text"
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            placeholder="e.g. Spain"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm transition-all"
          />
        </InputField>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <InputField label="ZIP / Postal code">
          <input
            type="text"
            value={form.zipCode}
            onChange={(e) => setForm((f) => ({ ...f, zipCode: e.target.value }))}
            placeholder="e.g. 08001"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm transition-all"
          />
        </InputField>
      </motion.div>

      {/* Coordinates */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField label="Latitude (optional)" hint="For precise map pin placement.">
          <input
            type="text"
            value={form.lat}
            onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            placeholder="e.g. 41.3851"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm transition-all"
          />
        </InputField>
        <InputField label="Longitude (optional)" hint="For precise map pin placement.">
          <input
            type="text"
            value={form.lng}
            onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            placeholder="e.g. 2.1734"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] text-gray-800 placeholder-gray-400 text-sm transition-all"
          />
        </InputField>
      </motion.div>

      {/* Map Placeholder */}
      <motion.div variants={fadeInUp}>
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-56 flex items-center justify-center relative">
          <img
            src="https://developers.google.com/static/maps/images/cloud-customization/preview-map-controls.png"
            alt="Map preview"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FF385C] flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-700 bg-white/80 px-3 py-1 rounded-full">
              {form.city || "Your city"}, {form.country || "Country"}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Exact address is hidden from guests until booking is confirmed.
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Step Progress Bar ──────────────────────────────────────────────────────────
function StepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="w-full">
      {/* Mobile: simple bar */}
      <div className="flex items-center gap-2 mb-2 md:hidden">
        <span className="text-sm font-semibold text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-400">— {STEPS[currentStep - 1]?.title ?? ""}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden md:hidden">
        <motion.div
          className="h-full bg-[#FF385C] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Desktop: step dots */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-[#FF385C] z-0"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        {STEPS.map((step) => {
          const isDone = step.id < currentStep;
          const isActive = step.id === currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10">
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isDone ? "#FF385C" : isActive ? "#FF385C" : "#e5e7eb",
                }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={cn("text-sm font-bold", isActive ? "text-white" : "text-gray-400")}>
                    {step.id}
                  </span>
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs font-semibold whitespace-nowrap",
                  isActive ? "text-[#FF385C]" : isDone ? "text-gray-600" : "text-gray-400"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Validation ────────────────────────────────────────────────────────────────
function validateStep(step: number, form: FormData): Partial<Record<keyof FormData, string>> {
  const errs: Partial<Record<keyof FormData, string>> = {};
  if (step === 1) {
    if (!form.type) errs.type = "Please select a property type.";
    if (!form.title.trim()) errs.title = "Title is required.";
    if (form.title.trim().length < 10) errs.title = "Title must be at least 10 characters.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (form.description.trim().length < 30) errs.description = "Description must be at least 30 characters.";
  }
  if (step === 4) {
    if (!form.pricePerNight || form.pricePerNight < 1)
      errs.pricePerNight = "Please set a nightly rate.";
  }
  if (step === 5) {
    if (!form.address.trim()) errs.address = "Address is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.country.trim()) errs.country = "Country is required.";
  }
  return errs;
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function NewListingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = STEPS.length;

  const goNext = () => {
    const errs = validateStep(currentStep, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitted(true);
    }
  };

  const goBack = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0