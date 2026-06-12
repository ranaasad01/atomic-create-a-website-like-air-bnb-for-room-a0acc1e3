"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Star, Eye, Calendar, Home, Users, TrendingUp, DollarSign, CheckCircle, Clock, AlertCircle, ChevronRight, BarChart2, Settings, Heart, MapPin, Bed, Bath } from 'lucide-react';
import { properties, mockBookings } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const statCards = [
  {
    label: "Total Earnings",
    value: "$12,480",
    change: "+18% this month",
    positive: true,
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    label: "Active Listings",
    value: "6",
    change: "2 pending review",
    positive: true,
    icon: Home,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    label: "Total Bookings",
    value: "34",
    change: "+5 this week",
    positive: true,
    icon: Calendar,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    label: "Avg. Rating",
    value: "4.87",
    change: "Superhost status",
    positive: true,
    icon: Star,
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
];

// ─── Mock host listings ─────────────────────────────────────────────────────────
const hostListings = [
  {
    id: "p1",
    title: "Cozy Studio in Downtown Manhattan",
    type: "room",
    location: "New York, USA",
    pricePerNight: 120,
    rating: 4.9,
    reviewCount: 38,
    status: "active",
    bookings: 12,
    image: "https://a0.muscache.com/im/pictures/hosting/Hosting-49388478/original/5fcf43f6-4f1a-42b0-af6c-770508db8f6f.jpeg?im_w=720",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    earnings: 2880,
  },
  {
    id: "p2",
    title: "Beachfront Villa with Private Pool",
    type: "villa",
    location: "Bali, Indonesia",
    pricePerNight: 340,
    rating: 4.95,
    reviewCount: 61,
    status: "active",
    bookings: 9,
    image: "https://media.vrbo.com/lodging/72000000/71990000/71987300/71987247/6768d278.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    earnings: 5440,
  },
  {
    id: "p3",
    title: "Charming Hostel Dorm — City Center",
    type: "hostel",
    location: "Barcelona, Spain",
    pricePerNight: 28,
    rating: 4.7,
    reviewCount: 104,
    status: "active",
    bookings: 47,
    image: "https://images.trvl-media.com/lodging/112000000/111440000/111438000/111437994/8c474f10.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    bedrooms: 1,
    bathrooms: 2,
    maxGuests: 6,
    earnings: 1960,
  },
  {
    id: "p4",
    title: "Modern Apartment Near Eiffel Tower",
    type: "apartment",
    location: "Paris, France",
    pricePerNight: 195,
    rating: 4.82,
    reviewCount: 29,
    status: "pending",
    bookings: 0,
    image: "https://images.squarespace-cdn.com/content/v1/66d06a5c2541fc246b3b120b/5aa5b6eb-1ecf-421f-8d9e-8de54a93242c/paris-suffren-chambre1-vue.jpg",
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    earnings: 0,
  },
  {
    id: "p5",
    title: "Mountain Cabin Retreat",
    type: "house",
    location: "Aspen, Colorado",
    pricePerNight: 275,
    rating: 4.88,
    reviewCount: 17,
    status: "active",
    bookings: 6,
    image: "https://img.trackhs.com/1080x/https://track-pm.s3.amazonaws.com/soco/image/47f1dda9-ebd9-4cff-b052-9076ab3000c6",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    earnings: 2200,
  },
  {
    id: "p6",
    title: "Lakeside Private Room",
    type: "room",
    location: "Zurich, Switzerland",
    pricePerNight: 88,
    rating: 4.75,
    reviewCount: 22,
    status: "inactive",
    bookings: 3,
    image: "/images/lakeside-private-room-zurich.jpg",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    earnings: 528,
  },
];

// ─── Mock recent bookings ───────────────────────────────────────────────────────
const recentBookings = [
  {
    id: "b1",
    guest: "Amelia Johnson",
    avatar: "/images/guest-amelia-johnson.jpg",
    property: "Cozy Studio in Downtown Manhattan",
    checkIn: "Dec 18, 2024",
    checkOut: "Dec 22, 2024",
    nights: 4,
    total: 480,
    status: "confirmed",
  },
  {
    id: "b2",
    guest: "Luca Bianchi",
    avatar: "/images/guest-luca-bianchi.jpg",
    property: "Beachfront Villa with Private Pool",
    checkIn: "Jan 3, 2025",
    checkOut: "Jan 10, 2025",
    nights: 7,
    total: 2380,
    status: "confirmed",
  },
  {
    id: "b3",
    guest: "Priya Sharma",
    avatar: "https://directory.uthscsa.edu/sites/directory/files/sharma_priya.jpg",
    property: "Mountain Cabin Retreat",
    checkIn: "Dec 26, 2024",
    checkOut: "Dec 30, 2024",
    nights: 4,
    total: 1100,
    status: "pending",
  },
  {
    id: "b4",
    guest: "Tom Eriksen",
    avatar: "/images/guest-tom-eriksen.jpg",
    property: "Charming Hostel Dorm — City Center",
    checkIn: "Dec 15, 2024",
    checkOut: "Dec 17, 2024",
    nights: 2,
    total: 56,
    status: "completed",
  },
  {
    id: "b5",
    guest: "Yuki Tanaka",
    avatar: "/images/guest-yuki-tanaka.jpg",
    property: "Cozy Studio in Downtown Manhattan",
    checkIn: "Jan 8, 2025",
    checkOut: "Jan 12, 2025",
    nights: 4,
    total: 480,
    status: "cancelled",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-100 text-blue-700",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-600",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

// ─── Main Dashboard Page ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"listings" | "bookings" | "analytics">("listings");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => setDeletingId(null), 1500);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Host Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your listings, track bookings, and grow your hosting business.
            </p>
          </div>
          <Link href="/listings/new">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(255,56,92,0.25)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#FF385C] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:bg-[#e0314f] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Listing
            </motion.button>
          </Link>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={scaleIn}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-default"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.text}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                <p className={`text-xs mt-1 font-medium ${card.positive ? "text-emerald-600" : "text-red-500"}`}>
                  {card.change}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit mb-6"
        >
          {(["listings", "bookings", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-[#FF385C] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          {activeTab === "listings" && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {hostListings.map((listing, i) => {
                  const st = statusConfig[listing.status] ?? statusConfig["inactive"];
                  return (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.color}`}>
                            {st.icon}
                            {st.label}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold text-gray-800">{listing.rating}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <p className="text-xs text-[#FF385C] font-semibold uppercase tracking-wide mb-1 capitalize">
                          {listing.type}
                        </p>
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                          {listing.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                          <MapPin className="w-3 h-3" />
                          {listing.location}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5" />
                            {listing.bedrooms} bed
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5" />
                            {listing.bathrooms} bath
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {listing.maxGuests} guests
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-bold text-gray-900">${listing.pricePerNight}</span>
                            <span className="text-xs text-gray-400"> / night</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">{listing.bookings} bookings</p>
                            <p className="text-sm font-semibold text-emerald-600">
                              ${(listing.earnings ?? 0).toLocaleString()} earned
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-[#FF385C] hover:text-[#FF385C] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Preview
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleDelete(listing.id)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
                              deletingId === listing.id
                                ? "border-red-300 bg-red-50 text-red-500"
                                : "border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500"
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add New Card */}
                <Link href="/listings/new">
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(255,56,92,0.12)" }}
                    className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#FF385C] transition-colors h-full min-h-[320px] flex flex-col items-center justify-center gap-3 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#FF385C]/10 group-hover:bg-[#FF385C]/20 flex items-center justify-center transition-colors">
                      <Plus className="w-7 h-7 text-[#FF385C]" />
                    </div>
                    <p className="font-semibold text-gray-700 group-hover:text-[#FF385C] transition-colors">
                      Add New Listing
                    </p>
                    <p className="text-xs text-gray-400 text-center px-6">
                      List a room, house, hostel, or villa and start earning
                    </p>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "bookings" && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
                <span className="text-xs text-gray-400">{recentBookings.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Guest</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Property</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dates</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nights</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBookings.map((booking, i) => {
                      const st = statusConfig[booking.status] ?? statusConfig["pending"];
                      return (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={booking.avatar}
                                alt={booking.guest ?? "Guest"}
                                className="w-8 h-8 rounded-full object-cover bg-gray-100"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.guest ?? "G")}&background=FF385C&color=fff&size=64`;
                                }}
                              />
                              <span className="font-medium text-gray-800">{booking.guest ?? "—"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-600 max-w-[180px] truncate">{booking.property ?? "—"}</td>
                          <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                            {booking.checkIn ?? "—"} → {booking.checkOut ?? "—"}
                          </td>
                          <td className="px-5 py-4 text-gray-700 font-medium">{booking.nights ?? 0}</td>
                          <td className="px-5 py-4 font-semibold text-gray-900">
                            ${(booking.total ?? 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${st.color}`}>
                              {st.icon}
                              {st.label}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Earnings breakdown */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-[#FF385C]" />
                  Earnings by Property
                </h2>
                <div className="space-y-4">
                  {hostListings.map((listing, i) => {
                    const maxEarnings = Math.max(...hostListings.map((l) => l.earnings ?? 0), 1);
                    const pct = Math.round(((listing.earnings ?? 0) / maxEarnings) * 100);
                    return (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-gray-700 truncate max-w-[60%]">{listing.title}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            ${(listing.earnings ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#FF385C] to-[#ff6b85]"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Occupancy Rate", value: "72%", sub: "Last 30 days", icon: "📊" },
                  { label: "Avg. Stay Length", value: "3.8 nights", sub: "Per booking", icon: "🌙" },
                  { label: "Response Rate", value: "98%", sub: "Within 1 hour", icon: "⚡" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-[#FF385C]/5 to-[#ff6b85]/10 rounded-2xl border border-[#FF385C]/15 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span> Tips to Boost Your Earnings
                </h3>
                <ul className="space-y-2.5">
                  {[
                    "Add more high-quality photos — listings with 10+ photos get 3× more bookings.",
                    "Enable Instant Book to appear higher in search results.",
                    "Respond to inquiries within 1 hour to maintain your Superhost status.",
                    "Offer weekly discounts (10–15%) to attract longer stays.",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-[#FF385C] mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}