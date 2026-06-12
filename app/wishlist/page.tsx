"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Star, Users, Bed, Bath, Zap, Search, SlidersHorizontal, X, Share2, Eye } from 'lucide-react';
import { properties, type Property } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const PROPERTY_TYPE_COLORS: Record<string, string> = {
  room: "bg-blue-100 text-blue-700",
  house: "bg-green-100 text-green-700",
  hostel: "bg-orange-100 text-orange-700",
  apartment: "bg-purple-100 text-purple-700",
  villa: "bg-rose-100 text-rose-700",
};

// ─── Property Card ─────────────────────────────────────────────────────────────
function WishlistCard({
  property,
  onRemove,
}: {
  property: Property;
  onRemove: (id: string) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  const handleRemove = () => {
    setHeartPulse(true);
    setTimeout(() => {
      setIsRemoving(true);
      setTimeout(() => onRemove(property.id), 350);
    }, 200);
  };

  return (
    <motion.div
      layout
      variants={scaleIn}
      animate={isRemoving ? { opacity: 0, scale: 0.85 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image ?? "/images/property-placeholder.jpg"}
          alt={property.title ?? "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/property-placeholder.jpg";
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Heart button */}
        <motion.button
          onClick={handleRemove}
          whileTap={{ scale: 0.85 }}
          animate={heartPulse ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow z-10"
          aria-label="Remove from wishlist"
        >
          <Heart className="w-4 h-4 text-[#FF385C] fill-[#FF385C]" />
        </motion.button>

        {/* Instant Book badge */}
        {property.instantBook && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-400" />
            Instant Book
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full capitalize",
              PROPERTY_TYPE_COLORS[property.type ?? "room"] ?? "bg-gray-100 text-gray-700"
            )}
          >
            {property.type ?? "room"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {property.title ?? "Untitled Property"}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-gray-800">
              {(property.rating ?? 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {property.city ?? ""}{property.city && property.country ? ", " : ""}{property.country ?? ""}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {property.maxGuests ?? 1} guests
          </span>
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {property.bedrooms ?? 1} bed{(property.bedrooms ?? 1) !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {property.bathrooms ?? 1} bath{(property.bathrooms ?? 1) !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${(property.pricePerNight ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 ml-1">/ night</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </motion.button>
            <Link href={`/property/${property.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 bg-[#FF385C] hover:bg-[#e0314f] text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-colors"
              >
                <Eye className="w-3 h-3" />
                View
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyWishlist() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6"
      >
        <Heart className="w-10 h-10 text-[#FF385C]" strokeWidth={1.5} />
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
        Start exploring and tap the heart icon on any property to save it here. Your dream stay is just a search away.
      </p>
      <Link href="/search">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#e0314f] text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-md hover:shadow-lg"
        >
          <Search className="w-4 h-4" />
          Explore Stays
        </motion.button>
      </Link>
    </motion.div>
  );
}

// ─── Filter Bar ────────────────────────────────────────────────────────────────
const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "room", label: "Rooms" },
  { id: "house", label: "Houses" },
  { id: "hostel", label: "Hostels" },
  { id: "apartment", label: "Apartments" },
  { id: "villa", label: "Villas" },
];

const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function WishlistPage() {
  // Seed wishlist with properties that have isWishlisted = true, fallback to first 6
  const initialWishlisted = properties.filter((p) => p.isWishlisted);
  const seedList = initialWishlisted.length > 0 ? initialWishlisted : (properties ?? []).slice(0, 6);

  const [wishlist, setWishlist] = useState<Property[]>(seedList);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("default");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  // Filter
  let filtered = wishlist.filter((p) => {
    const matchesType = activeFilter === "all" || p.type === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (p.title ?? "").toLowerCase().includes(q) ||
      (p.city ?? "").toLowerCase().includes(q) ||
      (p.country ?? "").toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  // Sort
  if (activeSort === "price-asc") {
    filtered = [...filtered].sort((a, b) => (a.pricePerNight ?? 0) - (b.pricePerNight ?? 0));
  } else if (activeSort === "price-desc") {
    filtered = [...filtered].sort((a, b) => (b.pricePerNight ?? 0) - (a.pricePerNight ?? 0));
  } else if (activeSort === "rating") {
    filtered = [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  const totalNights = 3; // illustrative
  const estimatedTotal = filtered.reduce((sum, p) => sum + (p.pricePerNight ?? 0) * totalNights, 0);

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-16">
      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#FF385C] via-[#e0314f] to-[#c0273f] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 17 + 5) % 100}%`,
                top: `${(i * 23 + 10) % 100}%`,
              }}
              animate={{ y: [0, -12, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-white fill-white" />
              <span className="text-white/80 text-sm font-medium uppercase tracking-widest">
                Your Wishlist
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
            >
              Saved Stays &amp; Dream Destinations
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl"
            >
              Every property you've hearted lives here. Compare, plan, and book your next adventure — all in one place.
            </motion.p>

            {/* Stats row */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6">
              {[
                { label: "Saved Properties", value: wishlist.length },
                {
                  label: "Countries",
                  value: new Set(wishlist.map((p) => p.country ?? "")).size,
                },
                {
                  label: "Avg. per Night",
                  value:
                    wishlist.length > 0
                      ? `$${Math.round(
                          wishlist.reduce((s, p) => s + (p.pricePerNight ?? 0), 0) /
                            wishlist.length
                        ).toLocaleString()}`
                      : "$0",
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Controls Bar ────────────────────────────────────────────────────── */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved stays…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] bg-gray-50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 flex-1">
              {FILTER_OPTIONS.map((f) => (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(f.id)}
                  className={cn(
                    "shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all",
                    activeFilter === f.id
                      ? "bg-[#FF385C] text-white border-[#FF385C] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  )}
                >
                  {f.label}
                </motion.button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSortMenu((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-full px-4 py-2.5 hover:border-gray-400 bg-white transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Sort
              </motion.button>
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveSort(s.id);
                          setShowSortMenu(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm transition-colors",
                          activeSort === s.id
                            ? "bg-rose-50 text-[#FF385C] font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid Section ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 && wishlist.length > 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center py-20 text-center"
          >
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h3>
            <p className="text-gray-400 text-sm mb-6">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className="text-[#FF385C] font-semibold text-sm hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        ) : wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between mb-6"
            >
              <p className="text-gray-600 text-sm">
                Showing{" "}
                <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
                saved {filtered.length === 1 ? "property" : "properties"}
              </p>
              {filtered.length > 0 && (
                <p className="text-xs text-gray-400">
                  Est. 3-night total:{" "}
                  <span className="font-semibold text-gray-700">
                    ${estimatedTotal.toLocaleString()}
                  </span>
                </p>
              )}
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((property) => (
                  <WishlistCard
                    key={property.id}
                    property={property}
                    onRemove={handleRemove}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>

      {/* ── Inspiration Section ─────────────────────────────────────────────── */}
      {wishlist.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-rose-100"
          >
            <motion.div variants={fadeInUp} className="max-w-xl mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Ready to make it official?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                You've saved some incredible places. Don't let them slip away — check availability and lock in your dates before someone else does.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              {[
                {
                  icon: "🗓️",
                  title: "Flexible Dates",
                  desc: "Most saved properties offer flexible check-in windows. Find what works for you.",
                },
                {
                  icon: "💳",
                  title: "Secure Booking",
                  desc: "All payments are protected. Cancel for free up to 48 hours before check-in on most stays.",
                },
                {
                  icon: "🏆",
                  title: "Best Price Guarantee",
                  desc: "We match any lower price you find for the same property within 24 hours of booking.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={scaleIn}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-rose-100"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <Link href="/search">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#FF385C] hover:bg-[#e0314f] text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-md hover:shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  Discover More Stays
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-7 py-3.5 rounded-full border border-gray-200 hover:border-gray-400 transition-all"
                >
                  View My Bookings
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* ── Tips Section ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl font-bold text-gray-900 mb-6"
          >
            Tips for Planning Your Stay
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              {
                emoji: "📅",
                title: "Book Early for Best Rates",
                body: "Properties in popular destinations fill up fast. Booking 3–6 weeks in advance typically saves 15–25% compared to last-minute rates.",
              },
              {
                emoji: "💬",
                title: "Message Your Host First",
                body: "A quick message before booking builds trust and lets you confirm details like parking, check-in times, and local recommendations.",
              },
              {
                emoji: "🔍",
                title: "Read Recent Reviews",
                body: "Focus on reviews from the past 3 months — they reflect the current state of the property and the host's responsiveness.",
              },
              {
                emoji: "🛡️",
                title: "Check the Cancellation Policy",
                body: "Each property has its own policy. Look for 'Flexible' or 'Moderate' cancellation options if your plans might change.",
              },
            ].map((tip) => (
              <motion.div
                key={tip.title}
                variants={fadeInUp}
                whileHover={{ x: 4 }}
                className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl shrink-0">{tip.emoji}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tip.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}