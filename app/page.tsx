"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, Heart, Users, Shield, Sparkles, ArrowRight, ChevronRight, ChevronDown, Home, Calendar, Check } from 'lucide-react';
import {
  properties,
  categories,
  featuredDestinations,
  siteStats,
  hosts,
  type Property,
} from "@/lib/data";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property, index }: { property: Property; index: number }) {
  const [wishlisted, setWishlisted] = useState(property.isWishlisted ?? false);
  const [imgError, setImgError] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={scaleIn}
      whileHover={shouldReduce ? {} : { y: -6, transition: { duration: 0.25 } }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <Link href={`/property/${property.id}`} className="block">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={imgError ? "/images/cozy-room-interior.jpg" : (property.image ?? "/images/cozy-room-interior.jpg")}
            alt={property.title ?? "Property"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.isFeatured && (
              <span className="bg-white text-[#FF385C] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                ✨ Featured
              </span>
            )}
            {property.instantBook && (
              <span className="bg-[#FF385C] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                ⚡ Instant
              </span>
            )}
          </div>
          {/* Type badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize">
              {property.type ?? "stay"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-[#222222] text-sm leading-snug line-clamp-1 flex-1">
              {property.title ?? "Unnamed Property"}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
              <span className="text-xs font-semibold text-[#222222]">
                {(property.rating ?? 0).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">({property.reviewCount ?? 0})</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{property.city ?? ""}{property.country ? `, ${property.country}` : ""}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#222222] font-bold text-base">
                ${(property.pricePerNight ?? 0).toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs"> / night</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Users className="w-3 h-3" />
              <span>Up to {property.maxGuests ?? 1}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setWishlisted((w) => !w);
        }}
        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn("w-4 h-4 transition-colors", wishlisted ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-500")}
        />
      </button>
    </motion.div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function HeroSearchBar() {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(1);
  const [activeTab, setActiveTab] = useState<"stays" | "experiences">("stays");

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-2xl p-2 w-full max-w-3xl mx-auto"
    >
      {/* Tabs */}
      <div className="flex gap-1 mb-2 px-1 pt-1">
        {(["stays", "experiences"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize",
              activeTab === tab
                ? "bg-[#FF385C] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 p-1">
        {/* Location */}
        <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-[#FF385C] focus-within:ring-1 focus-within:ring-[#FF385C]/20 transition-all">
          <MapPin className="w-4 h-4 text-[#FF385C] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Where</p>
            <input
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none font-medium"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:border-[#FF385C] transition-all sm:w-36">
          <Calendar className="w-4 h-4 text-[#FF385C] shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">When</p>
            <p className="text-sm text-gray-400 font-medium">Any week</p>
          </div>
        </div>

        {/* Guests */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 sm:w-32">
          <Users className="w-4 h-4 text-[#FF385C] shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Guests</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition-colors"
              >
                −
              </button>
              <span className="text-sm font-semibold text-gray-800 w-4 text-center">{guests}</span>
              <button
                onClick={() => setGuests((g) => Math.min(16, g + 1))}
                className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Link href="/search">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto bg-[#FF385C] hover:bg-[#e0314f] text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#FF385C]/30"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Category Pills ───────────────────────────────────────────────────────────
function CategoryPills({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {(categories ?? []).map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all shrink-0",
              active === cat.id
                ? "bg-[#222222] text-white border-[#222222] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
            )}
          >
            <span className="text-base">{cat.icon ?? ""}</span>
            <span>{cat.label ?? ""}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: (siteStats as any)?.totalProperties ?? "50,000+", label: "Properties Listed" },
    { value: (siteStats as any)?.totalGuests ?? "2M+", label: "Happy Guests" },
    { value: (siteStats as any)?.totalCities ?? "150+", label: "Cities Worldwide" },
    { value: (siteStats as any)?.avgRating ?? "4.9★", label: "Average Rating" },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          variants={fadeInUp}
          className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <p className="text-3xl font-bold text-[#FF385C] mb-1">{String(stat.value ?? "")}</p>
          <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Value Props ──────────────────────────────────────────────────────────────
const valueProps = [
  {
    icon: "🏠",
    title: "Every Type of Stay",
    desc: "From budget-friendly hostel beds to entire luxury villas — we have the perfect space for every traveler and every budget.",
    color: "from-rose-50 to-pink-50",
    accent: "#FF385C",
  },
  {
    icon: "🔒",
    title: "Verified & Secure",
    desc: "Every listing is verified by our team. Secure payments, transparent pricing, and 24/7 guest support give you total peace of mind.",
    color: "from-blue-50 to-indigo-50",
    accent: "#3B82F6",
  },
  {
    icon: "⚡",
    title: "Instant Booking",
    desc: "Skip the wait — thousands of properties offer instant confirmation. Book in seconds and get your confirmation immediately.",
    color: "from-amber-50 to-yellow-50",
    accent: "#F59E0B",
  },
  {
    icon: "🌍",
    title: "Local Experiences",
    desc: "Our superhosts are locals who know their city best. Get insider tips, personalized recommendations, and a truly authentic stay.",
    color: "from-emerald-50 to-teal-50",
    accent: "#10B981",
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "https://directory.uthscsa.edu/sites/directory/files/sharma_priya.jpg",
    rating: 5,
    text: "StayEase completely changed how I travel. Found an incredible private room in Barcelona for half the price of a hotel — the host was amazing and gave us the best local restaurant tips!",
    stay: "Private Room · Barcelona",
  },
  {
    name: "Tom Eriksson",
    location: "Stockholm, Sweden",
    avatar: "https://files.eliteprospects.com/layout/players/2a02ed1a7fdfdacf528444874d7d44d2-cropped.jpeg",
    rating: 5,
    text: "Booked a cozy mountain cabin for our family of five. The whole process was seamless — instant booking, clear directions, and the property was exactly as described. Will use again!",
    stay: "Entire House · Swiss Alps",
  },
  {
    name: "Aisha Nkosi",
    location: "Cape Town, South Africa",
    avatar: "https://keotnuwbepptwudrvhjt.supabase.co/storage/v1/object/public/author-images//aisha-nkosi.png",
    rating: 5,
    text: "As a solo backpacker, the hostel listings on StayEase are a game-changer. Met incredible people, saved money, and the reviews helped me pick the safest and most social spots.",
    stay: "Hostel Bed · Amsterdam",
  },
];

// ─── How It Works ─────────────────────────────────────────────────────────────
const howItWorks = [
  {
    step: "01",
    title: "Search Your Destination",
    desc: "Enter your city, travel dates, and number of guests. Filter by property type — room, house, hostel, apartment, or villa.",
    icon: <Search className="w-6 h-6" />,
  },
  {
    step: "02",
    title: "Choose Your Perfect Stay",
    desc: "Browse verified listings with real photos, honest reviews, and transparent pricing. Save favorites to your wishlist.",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    step: "03",
    title: "Book Instantly & Securely",
    desc: "Confirm your booking in seconds with our secure payment system. Get instant confirmation and host contact details.",
    icon: <Check className="w-6 h-6" />,
  },
  {
    step: "04",
    title: "Enjoy Your Stay",
    desc: "Check in with ease, connect with your superhost, and experience your destination like a local. Leave a review after!",
    icon: <Sparkles className="w-6 h-6" />,
  },
];

// ─── Destination Card ─────────────────────────────────────────────────────────
function DestinationCard({ dest, index }: { dest: any; index: number }) {
  const [imgError, setImgError] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      variants={scaleIn}
      whileHover={shouldReduce ? {} : { y: -4, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
    >
      <Link href="/search">
        <div className="relative h-48 bg-gray-200">
          <img
            src={
              imgError
                ? "/images/city-travel-destination.jpg"
                : (dest?.image ?? dest?.imageUrl ?? "/images/city-travel-destination.jpg")
            }
            alt={dest?.city ?? dest?.name ?? "Destination"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg leading-tight">
              {dest?.city ?? dest?.name ?? "City"}
            </h3>
            <p className="text-white/80 text-sm">
              {dest?.propertyCount ?? dest?.listings ?? "100+"} stays available
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Host Card ────────────────────────────────────────────────────────────────
function HostCard({ host }: { host: any }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
    >
      <div className="relative w-20 h-20 mx-auto mb-4">
        <img
          src={imgError ? "/images/host-avatar-default.jpg" : (host?.avatar ?? "/images/host-avatar-default.jpg")}
          alt={host?.name ?? "Host"}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          onError={() => setImgError(true)}
        />
        {host?.isSuperhost && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF385C] rounded-full flex items-center justify-center shadow-sm">
            <Shield className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <h3 className="font-bold text-[#222222] text-base mb-0.5">{host?.name ?? "Host"}</h3>
      {host?.isSuperhost && (
        <span className="inline-block bg-rose-50 text-[#FF385C] text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
          Superhost
        </span>
      )}
      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{host?.bio ?? ""}</p>
      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="font-semibold">{host?.reviewCount ?? 0}</span>
        <span className="text-gray-400">reviews</span>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const shouldReduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("trending");
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredProperties = (properties ?? []).filter(
    (p) => activeCategory === "trending" || (p.category ?? "") === activeCategory || (p.type ?? "") === activeCategory
  );
  const displayedProperties = filteredProperties.slice(0, visibleCount);

  const destinations = (featuredDestinations ?? []).slice(0, 6);
  const featuredHosts = (hosts ?? []).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#F7F7F7]">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://www.travelandleisure.com/thmb/wsA6EXFuYkqtuJGLbQWw05-cwPs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/lake-como-MOSTBEAUTIFUL0921-cb08f3beff1041e4beefc67b5e956b23.jpg"
            alt="Beautiful travel destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/60" />
        </div>

        {/* Floating decorative blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF385C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Over 50,000 verified stays worldwide
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
            >
              Find Your Perfect
              <br />
              <span className="text-[#FF385C]">Home Away</span> From Home
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed"
            >
              Discover rooms, houses, hostels, and villas in 150+ cities. Book instantly, stay confidently, and travel like a local.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="pt-2">
              <HeroSearchBar />
            </motion.div>

            {/* Quick links */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 pt-2">
              {["🏠 Entire Home", "🚪 Private Room", "🛏️ Hostel Bed", "🏡 Luxury Villa"].map((tag) => (
                <Link key={tag} href="/search">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm px-4 py-2 rounded-full hover:bg-white/25 transition-colors cursor-pointer"
                  >
                    {tag}
                  </motion.span>
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={shouldReduce ? {} : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsBar />
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ───────────────────────────────────────────── */}
      <section className="py-16 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          >
            <motion.div variants={fadeInUp}>
              <p className="text-[#FF385C] font-semibold text-sm uppercase tracking-widest mb-2">
                Handpicked for You
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222222] leading-tight">
                Explore Top Stays
              </h2>
              <p className="text-gray-500 mt-2 max-w-lg">
                From cozy city rooms to sprawling countryside houses — browse our most-loved properties.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/search">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 text-[#FF385C] font-semibold border-2 border-[#FF385C] px-5 py-2.5 rounded-full hover:bg-[#FF385C] hover:text-white transition-all"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-8"
          >
            <CategoryPills active={activeCategory} onSelect={(id) => { setActiveCategory(id); setVisibleCount(8); }} />
          </motion.div>

          {/* Property Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayedProperties.length > 0 ? (
                displayedProperties.map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))
              ) : (
                // Fallback cards when no data matches
                Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3 mt-3" />
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Load More */}
          {filteredProperties.length > visibleCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisibleCount((c) => c + 8)}
                className="bg-white border-2 border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-full hover:border-[#FF385C] hover:text-[#FF385C] transition-all shadow-sm"
              >
                Show More Stays
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ─────────────────────────────────────────── */}
      {destinations.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.div variants={fadeInUp} className="text-center mb-10">
                <p className="text-[#FF385C] font-semibold text-sm uppercase tracking-widest mb-2">
                  Trending Now
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222222]">
                  Popular Destinations
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  Thousands of travelers are booking these cities right now. Where will you go next?
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
              >
                {destinations.map((dest, i) => (
                  <DestinationCard key={(dest as any)?.id ?? i} dest={dest} index={i} />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#FF385C]/5 via-white to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-[#FF385C] font-semibold text-sm uppercase tracking-widest mb-2">
                Simple & Fast
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222222]">
                How StayEase Works
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                From search to check-in in minutes. We've made finding and booking your perfect stay effortless.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="relative bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {/* Connector line */}
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-200 to-gray-100 z-10" />
                  )}
                  <div className="w-12 h-12 bg-[#FF385C]/10 rounded-xl flex items-center justify-center text-[#FF385C] mb-5">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-gray-100 absolute top-5 right-6 select-none">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-[#222222] text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VALUE PROPS ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-[#FF385C] font-semibold text-sm uppercase tracking-widest mb-2">
                Why Choose Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222222]">
                The StayEase Difference
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                We're not just another booking platform. We're your travel companion — built for real travelers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valueProps.map((vp, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={cn(
                    "rounded-2xl p-7 bg-gradient-to-br border border-white/80 shadow-sm hover:shadow-lg transition-shadow",
                    vp.color
                  )}
                >
                  <div className="text-4xl mb-5">{vp.icon}</div>
                  <h3 className="font-bold text-[#222222] text-lg mb-2">{vp.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{vp.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-14">
              <p className="text-[#FF385C] font-semibold text-sm uppercase tracking-widest mb-2">
                Real Stories
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222222]">
                Loved by Travelers Worldwide
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Don't just take our word for it — here's what our guests have to say about their StayEase experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-[#F7F7F7] rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-shadow relative"
                >
                  {/* Quote mark */}
                  <div className="absolute top-5 right-6 text-5xl text-[#FF385C]/15 font-serif leading-none select-none">
                    "
                  </div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://static.wikia.nocookie.net/roblox/images/f/f2/Roblox_guest.png/revision/latest/scale-to-width-down/352?cb=20180914191123";
                      }}
                    />
                    <div>
                      <p className="font-bold text-[#222222] text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.location}</p>
                      <p className="text-[#FF385C] text-xs font-medium mt-0.5">{t.stay}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MEET THE HOSTS ────────────────────────────────────────────────── */}
      {featuredHosts.length > 0 && (
        <section className="py-20 bg-[#F7F7F7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.div variants={fadeInUp} className="text-center mb-12">
                <p className="text-[#FF385C] font-semibold text-sm uppercase tracking-widest mb-2">
                  Our Community
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#222222]">
                  Meet Our Superhosts
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  Our top-rated hosts go above and beyond to make every stay unforgettable. They're locals, storytellers, and your home-away-from-home experts.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredHosts.map((host) => (
                  <HostCard key={host.id} host={host} />
                ))}
              </div>

              <motion.div variants={fadeInUp} className="flex justify-center mt-10">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-[#222222] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#333333] transition-colors shadow-lg"
                  >
                    Become a Host
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-[#FF385C] via-[#e0314f] to-[#c9284a] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                🏠 List Your Space Today
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-5xl font-extrabold text-white leading-tight"
            >
              Have a Space to Share?
              <br />
              Start Earning Today.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-white/85 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Join over 200,000 hosts on StayEase. List your room, house, or hostel for free and start welcoming guests from around the world. Your first booking could be just days away.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-[#FF385C] font-bold px-8 py-4 rounded-full text-base hover:bg-gray-50 transition-colors shadow-xl"
                >
                  Start Hosting — It's Free
                </motion.button>
              </Link>
              <Link href="/search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full text-base hover:bg-white/10 transition-colors"
                >
                  Explore Stays
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-6 pt-4 text-white/80 text-sm"
            >
              {["✓ Free to list", "✓ No hidden fees", "✓ 24/7 host support", "✓ Secure payments"].map((item) => (
                <span key={item} className="font-medium">{item}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── APP DOWNLOAD TEASER ───────────────────────────────────────────── */}
      <section className="py-16 bg-[#222222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col lg:flex-row items-center gap-10"
          >
            <motion.div variants={slideInLeft} className="flex-1 text-center lg:text-left">
              <p className="text-[#FF385C] font-semibold text-sm uppercase tracking-widest mb-3">
                Mobile App
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Book on the Go with
                <br />
                <span className="text-[#FF385C]">StayEase Mobile</span>
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
                Get instant booking confirmations, real-time host messaging, and exclusive app-only deals. Your next adventure is one tap away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-white text-[#222222] font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Download on the</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 bg-white text-[#222222] font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Get it on</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              variants={slideInRight}
              className="flex-1 flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-[#FF385C]/30 to-purple-500/20 rounded-full blur-3xl absolute inset-0 m-auto pointer-events-none" />
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700 w-56 mx-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-[#FF385C] rounded-md flex items-center justify-center">
                      <Home className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm">StayEase</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-700/60 rounded-xl h-24 flex items-center justify-center">
                      <span className="text-3xl">🏠</span>
                    </div>
                    <div className="bg-gray-700/40 rounded-lg h-3 w-3/4" />
                    <div className="bg-gray-700/40 rounded-lg h-3 w-1/2" />
                    <div className="bg-[#FF385C] rounded-lg h-8 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Book Now — $89/night</span>
                    </div>
                  </div>
                  <div className="flex justify-around mt-4 pt-3 border-t border-gray-700">
                    {["🏠", "🔍", "❤️", "👤"].map((icon, i) => (
                      <span key={i} className="text-lg">{icon}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}