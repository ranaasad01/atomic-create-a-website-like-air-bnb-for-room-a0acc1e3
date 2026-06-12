"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Calendar, Star, MapPin, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, Edit, Settings, LogOut, Home, Bed, Bath, Users, ArrowRight, Shield, Award } from 'lucide-react';
import { mockBookings, properties, type Booking, type Property } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function statusColor(status: Booking["status"]) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

function statusIcon(status: Booking["status"]) {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="w-3.5 h-3.5" />;
    case "pending":
      return <Clock className="w-3.5 h-3.5" />;
    case "cancelled":
      return <XCircle className="w-3.5 h-3.5" />;
    case "completed":
      return <CheckCircle className="w-3.5 h-3.5" />;
    default:
      return <AlertCircle className="w-3.5 h-3.5" />;
  }
}

// ─── Mock wishlist IDs ─────────────────────────────────────────────────────────
const INITIAL_WISHLIST_IDS = ["p1", "p2", "p3", "p4", "p5", "p6"];

// ─── Tab type ─────────────────────────────────────────────────────────────────
type Tab = "bookings" | "wishlist" | "settings";

// ─── Profile Stats ─────────────────────────────────────────────────────────────
const profileStats = [
  { label: "Total Stays", value: "12", icon: <Home className="w-5 h-5" /> },
  { label: "Countries Visited", value: "7", icon: <MapPin className="w-5 h-5" /> },
  { label: "Reviews Given", value: "9", icon: <Star className="w-5 h-5" /> },
  { label: "Saved Places", value: "24", icon: <Heart className="w-5 h-5" /> },
];

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking }: { booking: Booking }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-shadow"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-48 h-44 sm:h-auto shrink-0 overflow-hidden">
          <img
            src={booking.propertyImage || "https://decormatters-blog-uploads.s3.amazonaws.com/Snapinsta_app_301418438_613445980452829_8758071715934323067_n_1080_b94940bc46.JPG"}
            alt={booking.propertyTitle ?? "Property"}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://decormatters-blog-uploads.s3.amazonaws.com/Snapinsta_app_301418438_613445980452829_8758071715934323067_n_1080_b94940bc46.JPG";
            }}
          />
          <div
            className={cn(
              "absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
              statusColor(booking.status)
            )}
          >
            {statusIcon(booking.status)}
            <span className="capitalize">{booking.status}</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
                {booking.propertyTitle ?? "Unnamed Property"}
              </h3>
              <span className="text-[#FF385C] font-bold text-base whitespace-nowrap">
                ${(booking.totalPrice ?? 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
              <span>{booking.location ?? "Unknown location"}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  {booking.checkIn ?? "—"} → {booking.checkOut ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span>{booking.guests ?? 1} guest{(booking.guests ?? 1) > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{booking.nights ?? 1} night{(booking.nights ?? 1) > 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Hosted by <span className="text-gray-600 font-medium">{booking.hostName ?? "Host"}</span>
            </span>
            <Link
              href={`/bookings/${booking.id}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#FF385C] hover:text-[#e0314f] transition-colors"
            >
              View Details
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Wishlist Card ─────────────────────────────────────────────────────────────
function WishlistCard({
  property,
  isWishlisted,
  onToggle,
}: {
  property: Property;
  isWishlisted: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(0,0,0,0.12)" }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.image || "https://decormatters-blog-uploads.s3.amazonaws.com/Snapinsta_app_301418438_613445980452829_8758071715934323067_n_1080_b94940bc46.JPG"}
          alt={property.title ?? "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://decormatters-blog-uploads.s3.amazonaws.com/Snapinsta_app_301418438_613445980452829_8758071715934323067_n_1080_b94940bc46.JPG";
          }}
        />
        {/* Heart button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.15 }}
          onClick={() => onToggle(property.id)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div
            animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={cn(
                "w-4.5 h-4.5 transition-colors",
                isWishlisted ? "fill-[#FF385C] text-[#FF385C]" : "text-gray-500"
              )}
              style={{ width: "18px", height: "18px" }}
            />
          </motion.div>
        </motion.button>

        {/* Type badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 capitalize">
          {property.type ?? "stay"}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {property.title ?? "Unnamed Property"}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#FF385C] text-[#FF385C]" />
            <span className="text-sm font-semibold text-gray-800">
              {(property.rating ?? 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span>{property.city ?? ""}{property.country ? `, ${property.country}` : ""}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />
            {property.bedrooms ?? 1} bed{(property.bedrooms ?? 1) > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {property.bathrooms ?? 1} bath{(property.bathrooms ?? 1) > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {property.maxGuests ?? 2} guests
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-gray-900">
              ${(property.pricePerNight ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500"> / night</span>
          </div>
          <Link
            href={`/property/${property.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#FF385C] hover:text-[#e0314f] transition-colors"
          >
            View
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Settings Section ─────────────────────────────────────────────────────────
function SettingsSection() {
  const settingsGroups = [
    {
      title: "Personal Information",
      items: [
        { label: "Full Name", value: "Alex Johnson", icon: <User className="w-4 h-4" /> },
        { label: "Email Address", value: "alex.johnson@email.com", icon: <Settings className="w-4 h-4" /> },
        { label: "Phone Number", value: "+1 (555) 234-5678", icon: <Settings className="w-4 h-4" /> },
        { label: "Date of Birth", value: "March 15, 1990", icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      title: "Security & Privacy",
      items: [
        { label: "Password", value: "Last changed 3 months ago", icon: <Shield className="w-4 h-4" /> },
        { label: "Two-Factor Auth", value: "Enabled", icon: <Shield className="w-4 h-4" /> },
        { label: "Login Activity", value: "View recent sessions", icon: <Clock className="w-4 h-4" /> },
      ],
    },
    {
      title: "Preferences",
      items: [
        { label: "Language", value: "English (US)", icon: <Settings className="w-4 h-4" /> },
        { label: "Currency", value: "USD ($)", icon: <Settings className="w-4 h-4" /> },
        { label: "Notifications", value: "Email & Push enabled", icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {settingsGroups.map((group) => (
        <motion.div
          key={group.title}
          variants={fadeInUp}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">{group.title}</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {group.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 group-hover:text-[#FF385C] transition-colors">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.value}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Danger zone */}
      <motion.div
        variants={fadeInUp}
        className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-red-50">
          <h3 className="font-semibold text-red-600">Account Actions</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors text-left group">
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-600">Sign Out</span>
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors text-left group">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-600">Delete Account</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(
    new Set(INITIAL_WISHLIST_IDS)
  );
  const [bookingFilter, setBookingFilter] = useState<"all" | Booking["status"]>("all");

  const wishlisted = (properties ?? []).filter((p) => wishlistIds.has(p.id));

  const filteredBookings = (mockBookings ?? []).filter((b) =>
    bookingFilter === "all" ? true : b.status === bookingFilter
  );

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "bookings", label: "My Bookings", icon: <Calendar className="w-4 h-4" /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-16">
      {/* ── Hero / Profile Header ── */}
      <section className="relative bg-gradient-to-br from-[#FF385C] via-[#e0314f] to-[#c0273f] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10"
          >
            {/* Avatar */}
            <motion.div variants={scaleIn} className="relative shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src="https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/newscms/2020_03/3184046/alex-johnson-circle-byline-template.jpg"
                  alt="Alex Johnson"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://ui-avatars.com/api/?name=Alex+Johnson&background=FF385C&color=fff&size=144";
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100"
              >
                <Edit className="w-3.5 h-3.5 text-[#FF385C]" />
              </motion.button>
            </motion.div>

            {/* Name & info */}
            <motion.div variants={fadeInUp} className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Alex Johnson</h1>
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-white border border-white/30">
                  <Award className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Member since January 2021 · San Francisco, CA
              </p>
              <p className="text-white/70 text-sm max-w-md leading-relaxed">
                Avid traveler and remote worker. I love discovering hidden gems, cozy local stays, and meeting hosts who share their culture. Always planning the next adventure!
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full md:w-auto"
            >
              {profileStats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-center"
                >
                  <div className="text-white/70 flex justify-center mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all",
                  activeTab === tab.id
                    ? "border-[#FF385C] text-[#FF385C]"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200"
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "wishlist" && (
                  <span className="bg-[#FF385C] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistIds.size}
                  </span>
                )}
                {tab.id === "bookings" && (
                  <span className="bg-gray-100 text-gray-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {(mockBookings ?? []).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* ── BOOKINGS TAB ── */}
          {activeTab === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map(
                  (f) => (
                    <motion.button
                      key={f}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setBookingFilter(f)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize",
                        bookingFilter === f
                          ? "bg-[#FF385C] text-white border-[#FF385C] shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {f === "all" ? "All Bookings" : f}
                    </motion.button>
                  )
                )}
              </div>

              {filteredBookings.length === 0 ? (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-20"
                >
                  <Calendar className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings found</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    You don't have any {bookingFilter !== "all" ? bookingFilter : ""} bookings yet.
                  </p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#e0314f] transition-colors"
                  >
                    Explore Stays
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {filteredBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── WISHLIST TAB ── */}
          {activeTab === "wishlist" && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Saved Places</h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {wishlistIds.size} propert{wishlistIds.size === 1 ? "y" : "ies"} saved
                  </p>
                </div>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#FF385C] hover:text-[#e0314f] transition-colors"
                >
                  View Full Wishlist
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {wishlisted.length === 0 ? (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="text-center py-20"
                >
                  <Heart className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Start saving properties you love by tapping the heart icon.
                  </p>
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#e0314f] transition-colors"
                  >
                    Explore Stays
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {wishlisted.map((property) => (
                    <WishlistCard
                      key={property.id}
                      property={property}
                      isWishlisted={wishlistIds.has(property.id)}
                      onToggle={toggleWishlist}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  Manage your personal information, security, and preferences.
                </p>
              </div>
              <SettingsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}