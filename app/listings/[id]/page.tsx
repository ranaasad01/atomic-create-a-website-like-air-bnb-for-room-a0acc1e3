"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Share2, ChevronLeft, ChevronRight, X, MapPin, Users, Bed, Bath, Wifi, Car, Coffee, Tv, Wind, Utensils, Shield, Award, Calendar, Minus, Plus, Check, ArrowLeft, Home, Clock, AlertCircle } from 'lucide-react';
import { properties, Property } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRatingLabel(rating: number): string {
  if (rating >= 4.9) return "Exceptional";
  if (rating >= 4.7) return "Outstanding";
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  return "Good";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr ?? "";
  }
}

function getAmenityIcon(label: string) {
  const l = (label ?? "").toLowerCase();
  if (l.includes("wifi") || l.includes("internet")) return <Wifi className="w-5 h-5" />;
  if (l.includes("park") || l.includes("car")) return <Car className="w-5 h-5" />;
  if (l.includes("coffee") || l.includes("breakfast")) return <Coffee className="w-5 h-5" />;
  if (l.includes("tv") || l.includes("television")) return <Tv className="w-5 h-5" />;
  if (l.includes("air") || l.includes("ac") || l.includes("condition")) return <Wind className="w-5 h-5" />;
  if (l.includes("kitchen") || l.includes("cook")) return <Utensils className="w-5 h-5" />;
  if (l.includes("pool") || l.includes("swim")) return <span className="text-lg">🏊</span>;
  if (l.includes("gym") || l.includes("fitness")) return <span className="text-lg">🏋️</span>;
  if (l.includes("pet")) return <span className="text-lg">🐾</span>;
  if (l.includes("washer") || l.includes("laundry")) return <span className="text-lg">🧺</span>;
  if (l.includes("balcony") || l.includes("terrace")) return <span className="text-lg">🌅</span>;
  if (l.includes("garden") || l.includes("yard")) return <span className="text-lg">🌿</span>;
  return <Check className="w-5 h-5" />;
}

// ─── Fallback property for when ID not found ─────────────────────────────────

const fallbackProperty: Property = {
  id: "fallback",
  title: "Charming Studio in the Heart of the City",
  type: "room",
  location: "Downtown Manhattan, New York",
  city: "New York",
  country: "USA",
  lat: 40.7128,
  lng: -74.006,
  pricePerNight: 129,
  rating: 4.87,
  reviewCount: 94,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  image: "https://media.vrbo.com/lodging/112000000/111620000/111613800/111613712/6b977c04.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
  images: [
    "https://media.vrbo.com/lodging/112000000/111620000/111613800/111613712/6b977c04.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    "/images/bright-living-room-city-view.jpg",
    "/images/modern-kitchen-studio.jpg",
    "/images/comfortable-bedroom-studio.jpg",
    "/images/rooftop-terrace-city.jpg",
  ],
  description:
    "Wake up to stunning skyline views in this beautifully designed studio nestled in the heart of Manhattan. Thoughtfully furnished with premium linens, a fully equipped kitchen, and high-speed WiFi — everything you need for a seamless stay. Steps away from world-class dining, iconic landmarks, and vibrant nightlife. Whether you're here for business or leisure, this space offers the perfect blend of comfort and convenience.",
  amenities: [
    { icon: "wifi", label: "High-Speed WiFi" },
    { icon: "tv", label: "Smart TV" },
    { icon: "kitchen", label: "Full Kitchen" },
    { icon: "ac", label: "Air Conditioning" },
    { icon: "washer", label: "Washer & Dryer" },
    { icon: "coffee", label: "Coffee Maker" },
    { icon: "park", label: "Street Parking" },
    { icon: "balcony", label: "City View Balcony" },
  ],
  host: {
    id: "h1",
    name: "Sarah Mitchell",
    avatar: "https://www.velaw.com/wp-content/uploads/2022/01/103014_Mitchell_4x5_web-465x581.jpg",
    joinedYear: 2018,
    reviewCount: 142,
    isSuperhost: true,
    bio: "Hi! I'm Sarah, a travel enthusiast who loves sharing my beautiful spaces with guests from around the world. I'm always available to help make your stay perfect.",
  },
  reviews: [
    {
      id: "r1",
      author: "Alex Thompson",
      avatar: "https://images.axios.com/wZmh_V1Pe2kMhEz9n5vfuIaDVDA=/328x0/smart/2024/07/05/1720212563666.jpg",
      rating: 5,
      date: "2024-11-15",
      comment:
        "Absolutely stunning place! The views were incredible and Sarah was the most attentive host. Everything was spotless and exactly as described. Will definitely be back!",
    },
    {
      id: "r2",
      author: "Priya Sharma",
      avatar: "https://audiobooksoul.com/_next/image?url=%2Fimages%2Fcurators%2Fpriya-sharma.jpg&w=1920&q=75",
      rating: 5,
      date: "2024-10-28",
      comment:
        "Perfect location, beautiful space. The kitchen was well-stocked and the bed was incredibly comfortable. Sarah responded to every message within minutes. Highly recommend!",
    },
    {
      id: "r3",
      author: "Marco Bianchi",
      avatar: "https://www.gaggia.com/app/uploads/2026/02/cover.jpg",
      rating: 4,
      date: "2024-10-10",
      comment:
        "Great studio with an amazing city view. Very clean and modern. The only minor thing was street noise at night, but that's Manhattan for you! Overall a fantastic stay.",
    },
    {
      id: "r4",
      author: "Yuki Tanaka",
      avatar: "https://images.squarespace-cdn.com/content/v1/61a285a258cbd07dda341f1e/de052afa-6929-4e4c-87b2-701ab5deda66/Yuki+Tanaka.jpeg",
      rating: 5,
      date: "2024-09-22",
      comment:
        "One of the best Airbnb experiences I've had. The space is even more beautiful in person. Sarah left a lovely welcome basket with local treats. Felt right at home!",
    },
  ],
  isFeatured: true,
  isWishlisted: false,
  category: "city",
  instantBook: true,
};

// ─── Star Rating Component ────────────────────────────────────────────────────

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "w-5 h-5" : size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating ?? 0)
              ? "fill-[#FF385C] text-[#FF385C]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeImages = (images ?? []).length > 0 ? images : ["https://media.vrbo.com/lodging/112000000/111620000/111613800/111613712/6b977c04.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill"];

  const prev = () => setCurrentIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setCurrentIndex((i) => (i + 1) % safeImages.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, safeImages.length]);

  return (
    <>
      {/* Grid Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] md:h-[500px] rounded-2xl overflow-hidden">
        {/* Main large image */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}
        >
          <img
            src={safeImages[0]}
            alt={`${title ?? "Property"} - main view`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://media.vrbo.com/lodging/112000000/111620000/111613800/111613712/6b977c04.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill"; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        {/* Secondary images */}
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="hidden md:block relative cursor-pointer group overflow-hidden"
            onClick={() => { setCurrentIndex(idx); setLightboxOpen(true); }}
          >
            <img
              src={safeImages[idx] ?? safeImages[0]}
              alt={`${title ?? "Property"} - view ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://media.vrbo.com/lodging/112000000/111620000/111613800/111613712/6b977c04.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill"; }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {idx === 4 && safeImages.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">+{safeImages.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
        {/* Show all photos button */}
        <button
          onClick={() => { setCurrentIndex(0); setLightboxOpen(true); }}
          className="absolute bottom-4 right-4 bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:bg-gray-50"
          style={{ position: "absolute" }}
        >
          Show all photos
        </button>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              src={safeImages[currentIndex] ?? safeImages[0]}
              alt={`${title ?? "Property"} - photo ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => { (e.target as HTMLImageElement).src = "https://media.vrbo.com/lodging/112000000/111620000/111613800/111613712/6b977c04.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill"; }}
            />
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 text-white/70 text-sm">
              {currentIndex + 1} / {safeImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Booking Widget ───────────────────────────────────────────────────────────

function BookingWidget({ property }: { property: Property }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(property?.isWishlisted ?? false);
  const [reserved, setReserved] = useState(false);

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const n = Math.round(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 0;
  })();

  const pricePerNight = property?.pricePerNight ?? 0;
  const subtotal = pricePerNight * nights;
  const cleaningFee = nights > 0 ? Math.round(pricePerNight * 0.15) : 0;
  const serviceFee = nights > 0 ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal + cleaningFee + serviceFee;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
      {/* Price Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-2xl font-bold text-gray-900">${pricePerNight.toLocaleString()}</span>
          <span className="text-gray-500 text-sm ml-1">/ night</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 fill-[#FF385C] text-[#FF385C]" />
          <span className="font-semibold text-sm text-gray-800">{(property?.rating ?? 0).toFixed(2)}</span>
          <span className="text-gray-400 text-sm">({property?.reviewCount ?? 0})</span>
        </div>
      </div>

      {/* Date Pickers */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-3">
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }}
              className="w-full text-sm text-gray-800 outline-none bg-transparent cursor-pointer"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-sm text-gray-800 outline-none bg-transparent cursor-pointer"
            />
          </div>
        </div>
        {/* Guests */}
        <div className="border-t border-gray-200 p-3">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Guests</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{guests} guest{guests !== 1 ? "s" : ""}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors disabled:opacity-40"
                disabled={guests <= 1}
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="text-sm font-semibold w-4 text-center">{guests}</span>
              <button
                onClick={() => setGuests((g) => Math.min(property?.maxGuests ?? 10, g + 1))}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors disabled:opacity-40"
                disabled={guests >= (property?.maxGuests ?? 10)}
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Max {property?.maxGuests ?? 10} guests</p>
        </div>
      </div>

      {/* Reserve Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => { if (checkIn && checkOut) setReserved(true); }}
        className={`w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all ${
          checkIn && checkOut
            ? "bg-gradient-to-r from-[#FF385C] to-[#E31C5F] hover:shadow-lg hover:shadow-rose-200"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {reserved ? (
          <span className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> Reserved!
          </span>
        ) : checkIn && checkOut ? (
          "Reserve"
        ) : (
          "Select dates to reserve"
        )}
      </motion.button>

      {!reserved && checkIn && checkOut && (
        <p className="text-center text-xs text-gray-400 mt-2">You won't be charged yet</p>
      )}

      {/* Price Breakdown */}
      {nights > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 space-y-3 border-t border-gray-100 pt-4"
        >
          <div className="flex justify-between text-sm text-gray-700">
            <span className="underline cursor-pointer hover:text-gray-900">
              ${pricePerNight.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span className="underline cursor-pointer hover:text-gray-900">Cleaning fee</span>
            <span>${cleaningFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span className="underline cursor-pointer hover:text-gray-900">StayEase service fee</span>
            <span>${serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-3">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </motion.div>
      )}

      {/* Instant Book Badge */}
      {property?.instantBook && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-4 h-4 text-[#FF385C]" />
          <span>Instant Book — confirm without waiting for host approval</span>
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setIsWishlisted((w) => !w)}
        className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-500"}`}
        />
        {isWishlisted ? "Saved to wishlist" : "Save to wishlist"}
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const property: Property =
    (properties ?? []).find((p) => p.id === id) ?? fallbackProperty;

  const [isWishlisted, setIsWishlisted] = useState(property?.isWishlisted ?? false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const amenities = property?.amenities ?? [];
  const reviews = property?.reviews ?? [];
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const ratingBreakdown = [
    { label: "Cleanliness", score: Math.min(5, (property?.rating ?? 4.5) + 0.1) },
    { label: "Accuracy", score: Math.min(5, (property?.rating ?? 4.5) - 0.05) },
    { label: "Communication", score: Math.min(5, (property?.rating ?? 4.5) + 0.15) },
    { label: "Location", score: Math.min(5, (property?.rating ?? 4.5) + 0.2) },
    { label: "Check-in", score: Math.min(5, (property?.rating ?? 4.5) + 0.05) },
    { label: "Value", score: Math.min(5, (property?.rating ?? 4.5) - 0.1) },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

        {/* ── Breadcrumb ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 text-sm text-gray-500 mb-4"
        >
          <Link href="/" className="hover:text-gray-800 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/search" className="hover:text-gray-800 transition-colors">Explore</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{property?.title ?? "Property"}</span>
        </motion.div>

        {/* ── Title Row ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
              {property?.title ?? "Beautiful Property"}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#FF385C] text-[#FF385C]" />
                <span className="font-semibold text-gray-800">{(property?.rating ?? 0).toFixed(2)}</span>
                <span className="text-gray-500">({property?.reviewCount ?? 0} reviews)</span>
              </div>
              {property?.host?.isSuperhost && (
                <div className="flex items-center gap-1 text-gray-700">
                  <Award className="w-4 h-4 text-[#FF385C]" />
                  <span className="font-medium">Superhost</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{property?.location ?? "Unknown location"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200"
            >
              <Share2 className="w-4 h-4" /> Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsWishlisted((w) => !w)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors border border-gray-200"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#FF385C] text-[#FF385C]" : ""}`}
              />
              {isWishlisted ? "Saved" : "Save"}
            </motion.button>
          </div>
        </motion.div>

        {/* ── Image Gallery ── */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="relative mb-10"
        >
          <ImageGallery images={property?.images ?? [property?.image ?? ""]} title={property?.title ?? "Property"} />
        </motion.div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Property Overview */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="flex items-start justify-between pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1 capitalize">
                    {property?.type === "room"
                      ? "Private Room"
                      : property?.type === "hostel"
                      ? "Hostel Bed"
                      : property?.type === "house"
                      ? "Entire House"
                      : property?.type === "villa"
                      ? "Luxury Villa"
                      : "Entire Apartment"}{" "}
                    hosted by {property?.host?.name ?? "Host"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-gray-400" />
                      {property?.maxGuests ?? 1} guest{(property?.maxGuests ?? 1) !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-gray-400" />
                      {property?.bedrooms ?? 1} bedroom{(property?.bedrooms ?? 1) !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-gray-400" />
                      {property?.bathrooms ?? 1} bathroom{(property?.bathrooms ?? 1) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} className="shrink-0">
                  <img
                    src={property?.host?.avatar ?? "https://www.velaw.com/wp-content/uploads/2022/01/103014_Mitchell_4x5_web-465x581.jpg"}
                    alt={property?.host?.name ?? "Host"}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://www.velaw.com/wp-content/uploads/2022/01/103014_Mitchell_4x5_web-465x581.jpg"; }}
                  />
                </motion.div>
              </div>

              {/* Highlights */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-gray-100"
              >
                {[
                  {
                    icon: <Award className="w-6 h-6 text-[#FF385C]" />,
                    title: property?.host?.isSuperhost ? "Superhost" : "Experienced Host",
                    desc: property?.host?.isSuperhost
                      ? "Superhosts are experienced, highly rated hosts"
                      : "Your host has great reviews from past guests",
                  },
                  {
                    icon: <MapPin className="w-6 h-6 text-[#FF385C]" />,
                    title: "Great location",
                    desc: "95% of recent guests gave the location 5 stars",
                  },
                  {
                    icon: property?.instantBook
                      ? <Clock className="w-6 h-6 text-[#FF385C]" />
                      : <Shield className="w-6 h-6 text-[#FF385C]" />,
                    title: property?.instantBook ? "Instant Book" : "Verified Property",
                    desc: property?.instantBook
                      ? "Book immediately without waiting for host approval"
                      : "This property has been verified by StayEase",
                  },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>

            {/* Description */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="border-b border-gray-100 pb-10"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this place</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                {property?.description ?? "A wonderful place to stay."}
              </p>
            </motion.section>

            {/* Amenities */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="border-b border-gray-100 pb-10"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">What this place offers</h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {visibleAmenities.map((amenity, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-gray-600 shrink-0">{getAmenityIcon(amenity?.label ?? "")}</div>
                    <span className="text-gray-700 text-sm font-medium">{amenity?.label ?? "Amenity"}</span>
                  </motion.div>
                ))}
              </motion.div>
              {amenities.length > 8 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllAmenities((v) => !v)}
                  className="mt-5 px-6 py-3 border border-gray-800 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  {showAllAmenities ? "Show less" : `Show all ${amenities.length} amenities`}
                </motion.button>
              )}
            </motion.section>

            {/* Host Info */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="border-b border-gray-100 pb-10"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Meet your host</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center sm:w-56 shrink-0"
                >
                  <img
                    src={property?.host?.avatar ?? "https://www.velaw.com/wp-content/uploads/2022/01/103014_Mitchell_4x5_web-465x581.jpg"}
                    alt={property?.host?.name ?? "Host"}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-3"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://www.velaw.com/wp-content/uploads/2022/01/103014_Mitchell_4x5_web-465x581.jpg"; }}
                  />
                  <h3 className="font-bold text-gray-900 text-lg">{property?.host?.name ?? "Host"}</h3>
                  {property?.host?.isSuperhost && (
                    <div className="flex items-center gap-1 mt-1">
                      <Award className="w-3.5 h-3.5 text-[#FF385C]" />
                      <span className="text-xs font-semibold text-[#FF385C]">Superhost</span>
                    </div>
                  )}
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
                      <span>{property?.host?.reviewCount ?? 0} reviews</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Hosting since {property?.host?.joinedYear ?? 2020}</span>
                    </div>
                  </div>
                </motion.div>
                <div className="flex-1">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {property?.host?.bio ?? "Your host is passionate about providing a great experience."}
                  </p>
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-[#FF385C]" />
                      <span>Identity verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-[#FF385C]" />
                      <span>Response rate: 98%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-[#FF385C]" />
                      <span>Responds within an hour</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-gray-800 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    Contact Host
                  </motion.button>
                  <p className="text-xs text-gray-400 mt-3 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    To protect your payment, never transfer money or communicate outside of StayEase.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Reviews Section */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-6 h-6 fill-[#FF385C] text-[#FF385C]" />
                    <span className="text-4xl font-bold text-gray-900">{(property?.rating ?? 0).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">{getRatingLabel(property?.rating ?? 4.5)}</p>
                  <p className="text-gray-400 text-xs">{property?.reviewCount ?? 0} reviews</p>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2">
                  {ratingBreakdown.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-24 shrink-0">{item.label}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.score / 5) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gray-800 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-6 text-right">
                        {item.score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {property?.reviewCount ?? 0} Reviews
              </h2>

              {/* Review Cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {visibleReviews.map((review) => (
                  <motion.div
                    key={review?.id ?? Math.random()}
                    variants={scaleIn}
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={review?.avatar ?? "https://images.axios.com/wZmh_V1Pe2kMhEz9n5vfuIaDVDA=/328x0/smart/2024/07/05/1720212563666.jpg"}
                        alt={review?.author ?? "Reviewer"}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.axios.com/wZmh_V1Pe2kMhEz9n5vfuIaDVDA=/328x0/smart/2024/07/05/1720212563666.jpg"; }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review?.author ?? "Guest"}</p>
                        <p className="text-gray-400 text-xs">{formatDate(review?.date ?? "")}</p>
                      </div>
                      <div className="ml-auto">
                        <StarRating rating={review?.rating ?? 5} />
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                      {review?.comment ?? "Great stay!"}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {reviews.length > 4 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAllReviews((v) => !v)}
                  className="mt