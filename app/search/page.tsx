"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, MapPin, Star, Heart, Users, Bed, Bath, Wifi, Car, Coffee, Tv, Wind, ChevronDown, ChevronRight, List, Map, Filter, Check, Home, Building2, DoorOpen } from 'lucide-react';
import { properties, categories, Property } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Filters {
  propertyTypes: string[];
  priceMin: number;
  priceMax: number;
  guests: number;
  bedrooms: number;
  amenities: string[];
  category: string;
}

const DEFAULT_FILTERS: Filters = {
  propertyTypes: [],
  priceMin: 0,
  priceMax: 1000,
  guests: 1,
  bedrooms: 0,
  amenities: [],
  category: "",
};

const PROPERTY_TYPES = [
  { id: "room", label: "Private Room", icon: <DoorOpen className="w-4 h-4" /> },
  { id: "house", label: "Entire House", icon: <Home className="w-4 h-4" /> },
  { id: "hostel", label: "Hostel", icon: <Bed className="w-4 h-4" /> },
  { id: "apartment", label: "Apartment", icon: <Building2 className="w-4 h-4" /> },
  { id: "villa", label: "Villa", icon: <Star className="w-4 h-4" /> },
];

const AMENITY_OPTIONS = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="w-4 h-4" /> },
  { id: "parking", label: "Free Parking", icon: <Car className="w-4 h-4" /> },
  { id: "kitchen", label: "Kitchen", icon: <Coffee className="w-4 h-4" /> },
  { id: "tv", label: "TV", icon: <Tv className="w-4 h-4" /> },
  { id: "ac", label: "Air Conditioning", icon: <Wind className="w-4 h-4" /> },
  { id: "pool", label: "Pool", icon: <Star className="w-4 h-4" /> },
];

// ─── Mock Map Destinations ────────────────────────────────────────────────────
const MAP_PINS = [
  { id: "p1", label: "Bali Villa", price: 189, top: "38%", left: "72%" },
  { id: "p2", label: "Paris Apt", price: 145, top: "22%", left: "45%" },
  { id: "p3", label: "NYC Room", price: 95, top: "30%", left: "28%" },
  { id: "p4", label: "Tokyo Hostel", price: 42, top: "35%", left: "80%" },
  { id: "p5", label: "London House", price: 220, top: "18%", left: "42%" },
  { id: "p6", label: "Sydney Apt", price: 175, top: "68%", left: "82%" },
  { id: "p7", label: "Rome Villa", price: 310, top: "32%", left: "50%" },
  { id: "p8", label: "Dubai Room", price: 130, top: "42%", left: "60%" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>${value[0]}</span>
        <span>${value[1]}+</span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-[#FF385C] rounded-full"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < value[1]) onChange([v, value[1]]);
          }}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > value[0]) onChange([value[0], v]);
          }}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>
      <p className="text-xs text-gray-500">Nightly price (USD)</p>
    </div>
  );
}

function PropertyCard({ property, index }: { property: Property; index: number }) {
  const [wishlisted, setWishlisted] = useState(property.isWishlisted ?? false);

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={property.image ?? `/images/property-${property.id}.jpg`}
            alt={property.title ?? "Property"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/images/cozy-room-interior.jpg`;
            }}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.instantBook && (
              <span className="bg-white text-[#FF385C] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                Instant Book
              </span>
            )}
            {property.isFeatured && (
              <span className="bg-[#FF385C] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                Featured
              </span>
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted((w) => !w);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={cn("w-4 h-4 transition-colors", wishlisted ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-500")}
            />
          </button>
          {/* Type badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {property.type ?? "room"}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/property/${property.id}`}>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 hover:text-[#FF385C] transition-colors">
              {property.title ?? "Untitled Property"}
            </h3>
          </Link>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
            <span className="text-sm font-medium text-gray-800">{(property.rating ?? 0).toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="line-clamp-1">{property.city ?? ""}{property.country ? `, ${property.country}` : ""}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {property.maxGuests ?? 1} guests
          </span>
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {property.bedrooms ?? 1} bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {property.bathrooms ?? 1} bath
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">${property.pricePerNight ?? 0}</span>
            <span className="text-xs text-gray-500"> / night</span>
          </div>
          <span className="text-xs text-gray-400">
            {property.reviewCount ?? 0} reviews
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function FilterSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  const toggleType = (id: string) => {
    const next = filters.propertyTypes.includes(id)
      ? filters.propertyTypes.filter((t) => t !== id)
      : [...filters.propertyTypes, id];
    onChange({ ...filters, propertyTypes: next });
  };

  const toggleAmenity = (id: string) => {
    const next = filters.amenities.includes(id)
      ? filters.amenities.filter((a) => a !== id)
      : [...filters.amenities, id];
    onChange({ ...filters, amenities: next });
  };

  return (
    <div className="space-y-6">
      {/* Property Type */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Property Type</h3>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((pt) => (
            <button
              key={pt.id}
              onClick={() => toggleType(pt.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                filters.propertyTypes.includes(pt.id)
                  ? "border-[#FF385C] bg-[#FF385C]/5 text-[#FF385C]"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <span className={cn(filters.propertyTypes.includes(pt.id) ? "text-[#FF385C]" : "text-gray-400")}>
                {pt.icon}
              </span>
              {pt.label}
              {filters.propertyTypes.includes(pt.id) && (
                <Check className="w-4 h-4 ml-auto text-[#FF385C]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
        <PriceRangeSlider
          min={0}
          max={1000}
          value={[filters.priceMin, filters.priceMax]}
          onChange={([min, max]) => onChange({ ...filters, priceMin: min, priceMax: max })}
        />
      </div>

      <div className="border-t border-gray-100" />

      {/* Guests */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Guests</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange({ ...filters, guests: Math.max(1, filters.guests - 1) })}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors"
          >
            −
          </button>
          <span className="text-sm font-semibold text-gray-900 w-8 text-center">{filters.guests}</span>
          <button
            onClick={() => onChange({ ...filters, guests: Math.min(16, filters.guests + 1) })}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 transition-colors"
          >
            +
          </button>
          <span className="text-xs text-gray-500 ml-1">guest{filters.guests !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Bedrooms */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Bedrooms</h3>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange({ ...filters, bedrooms: n })}
              className={cn(
                "px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
                filters.bedrooms === n
                  ? "border-[#FF385C] bg-[#FF385C] text-white"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              )}
            >
              {n === 0 ? "Any" : n === 5 ? "5+" : n}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Amenities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Amenities</h3>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map((am) => (
            <label key={am.id} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0",
                  filters.amenities.includes(am.id)
                    ? "border-[#FF385C] bg-[#FF385C]"
                    : "border-gray-300 group-hover:border-gray-400"
                )}
                onClick={() => toggleAmenity(am.id)}
              >
                {filters.amenities.includes(am.id) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={cn("text-gray-500", filters.amenities.includes(am.id) ? "text-[#FF385C]" : "")}>
                {am.icon}
              </span>
              <span className="text-sm text-gray-700">{am.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );
}

function MockMapPanel({ properties: props }: { properties: Property[] }) {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 rounded-2xl overflow-hidden border border-gray-200">
      {/* Map background pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Continent blobs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-3/4 h-1/2 bg-green-200/40 rounded-[60%_40%_50%_60%/50%_60%_40%_50%] blur-sm" />
      </div>
      <div className="absolute top-1/4 left-1/4 w-1/4 h-1/3 bg-green-300/30 rounded-[40%_60%_60%_40%/60%_40%_60%_40%] blur-sm pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-1/5 h-1/4 bg-green-200/30 rounded-full blur-sm pointer-events-none" />

      {/* Ocean areas */}
      <div className="absolute inset-0 bg-blue-100/30 pointer-events-none" />

      {/* Map pins */}
      {MAP_PINS.map((pin) => (
        <motion.button
          key={pin.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 * MAP_PINS.indexOf(pin), type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.15 }}
          onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ top: pin.top, left: pin.left }}
        >
          <div
            className={cn(
              "px-2.5 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all",
              activePin === pin.id
                ? "bg-[#FF385C] text-white scale-110"
                : "bg-white text-gray-900 hover:bg-[#FF385C] hover:text-white"
            )}
          >
            ${pin.price}
          </div>
          {activePin === pin.id && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-xl p-3 w-36 text-left z-10"
            >
              <p className="text-xs font-semibold text-gray-900 mb-0.5">{pin.label}</p>
              <p className="text-xs text-gray-500">${pin.price}/night</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-[#FF385C] text-[#FF385C]" />
                <span className="text-xs text-gray-600">4.8</span>
              </div>
            </motion.div>
          )}
        </motion.button>
      ))}

      {/* Map label */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
        <p className="text-xs font-medium text-gray-600">🗺️ Interactive Map Preview</p>
        <p className="text-xs text-gray-400">{props.length} properties in view</p>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg">
          +
        </button>
        <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg">
          −
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc" | "rating">("recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");

  const handleFilterChange = useCallback((f: Filters) => setFilters(f), []);
  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setActiveCategory("");
  }, []);

  const filtered = useMemo(() => {
    let list = [...(properties ?? [])];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          (p.title ?? "").toLowerCase().includes(q) ||
          (p.city ?? "").toLowerCase().includes(q) ||
          (p.country ?? "").toLowerCase().includes(q) ||
          (p.location ?? "").toLowerCase().includes(q)
      );
    }

    if (filters.propertyTypes.length > 0) {
      list = list.filter((p) => filters.propertyTypes.includes(p.type ?? ""));
    }

    list = list.filter(
      (p) => (p.pricePerNight ?? 0) >= filters.priceMin && (p.pricePerNight ?? 0) <= filters.priceMax
    );

    list = list.filter((p) => (p.maxGuests ?? 1) >= filters.guests);

    if (filters.bedrooms > 0) {
      list = list.filter((p) => (p.bedrooms ?? 0) >= filters.bedrooms);
    }

    if (activeCategory) {
      list = list.filter((p) => (p.category ?? "") === activeCategory);
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.pricePerNight ?? 0) - (b.pricePerNight ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.pricePerNight ?? 0) - (a.pricePerNight ?? 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [filters, searchQuery, sortBy, activeCategory]);

  const activeFilterCount =
    filters.propertyTypes.length +
    filters.amenities.length +
    (filters.priceMin > 0 || filters.priceMax < 1000 ? 1 : 0) +
    (filters.guests > 1 ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* ── Search Header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Search bar row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city, country, or property name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] transition-all bg-gray-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  viewMode === "map" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            {/* Mobile filter button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF385C] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                activeCategory === ""
                  ? "bg-[#FF385C] text-white border-[#FF385C]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              All Stays
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? "" : cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                  activeCategory === cat.id
                    ? "bg-[#FF385C] text-white border-[#FF385C]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* ── Desktop Filter Sidebar ─────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-48"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#FF385C]" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-[#FF385C] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
              </div>
              <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} />
            </motion.div>
          </aside>

          {/* ── Results Area ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between mb-5"
            >
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {filtered.length} stay{filtered.length !== 1 ? "s" : ""} available
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {searchQuery ? `Results for "${searchQuery}"` : "Explore rooms, houses, hostels & more"}
                </p>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleReset}
                  className="text-sm text-[#FF385C] font-medium hover:underline"
                >
                  Clear all
                </button>
              )}
            </motion.div>

            {/* List / Map view */}
            {viewMode === "list" ? (
              filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="text-5xl mb-4">🏠</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No stays found</h3>
                  <p className="text-gray-500 text-sm max-w-xs mb-6">
                    Try adjusting your filters or search for a different location to find your perfect stay.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-[#FF385C] text-white rounded-xl text-sm font-semibold hover:bg-[#e0314f] transition-colors"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filtered.map((property, i) => (
                    <PropertyCard key={property.id} property={property} index={i} />
                  ))}
                </motion.div>
              )
            ) : (
              /* Map view */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col lg:flex-row gap-5"
              >
                {/* Map panel */}
                <div className="flex-1 min-h-[500px]">
                  <MockMapPanel properties={filtered} />
                </div>

                {/* Side list in map view */}
                <div className="w-full lg:w-80 xl:w-96 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {filtered.length} properties in this area
                  </p>
                  {filtered.slice(0, 8).map((property) => (
                    <motion.div
                      key={property.id}
                      whileHover={{ x: 2 }}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex gap-3 p-3 hover:shadow-md transition-shadow"
                    >
                      <Link href={`/property/${property.id}`} className="shrink-0">
                        <img
                          src={property.image ?? `/images/property-${property.id}.jpg`}
                          alt={property.title ?? "Property"}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `/images/cozy-room-interior.jpg`;
                          }}
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/property/${property.id}`}>
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-[#FF385C] transition-colors">
                            {property.title ?? "Property"}
                          </h4>
                        </Link>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {property.city ?? ""}{property.country ? `, ${property.country}` : ""}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-bold text-gray-900">
                            ${property.pricePerNight ?? 0}
                            <span className="text-xs font-normal text-gray-500">/night</span>
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-[#FF385C] text-[#FF385C]" />
                            <span className="text-xs font-medium text-gray-700">
                              {(property.rating ?? 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filtered.length > 8 && (
                    <p className="text-xs text-center text-gray-400 py-2">
                      + {filtered.length - 8} more properties — switch to list view
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#FF385C]" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-[#FF385C] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="p-5">
                <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleReset} />
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-[#FF385C] text-white rounded-xl font-semibold text-sm hover:bg-[#e0314f] transition-colors"
                >
                  Show {filtered.length} stay{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}