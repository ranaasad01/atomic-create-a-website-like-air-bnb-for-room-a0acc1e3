"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, XCircle, Star, MapPin, Calendar, Users, Moon, CreditCard, Download, Share2, ArrowLeft, Home, Phone, Mail, Shield, ChevronRight, QrCode, Printer } from 'lucide-react';
import { mockBookings, properties } from "@/lib/data";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Status helpers ────────────────────────────────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
  },
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock className="w-5 h-5 text-amber-600" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle className="w-5 h-5 text-red-600" />,
  },
  completed: {
    label: "Completed",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
  },
};

// ─── QR Code Placeholder ───────────────────────────────────────────────────────
function QRCodePlaceholder({ bookingId }: { bookingId: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-40 h-40 bg-white border-2 border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-inner">
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: 49 }).map((_, i) => {
            const corners = [0, 1, 2, 7, 8, 9, 14, 15, 16, 32, 33, 34, 39, 40, 41, 46, 47, 48];
            const isCorner = corners.includes(i);
            const isRandom = Math.sin(i * 137.5 + parseInt(bookingId.replace(/\D/g, "") || "42")) > 0.2;
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-sm ${
                  isCorner ? "bg-[#222222]" : isRandom ? "bg-[#222222]" : "bg-transparent"
                }`}
              />
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <QrCode className="w-3.5 h-3.5" />
        <span>Scan at check-in</span>
      </div>
      <p className="text-xs font-mono text-gray-400 tracking-widest uppercase">
        {bookingId.toUpperCase()}
      </p>
    </div>
  );
}

// ─── Timeline Step ─────────────────────────────────────────────────────────────
function TimelineStep({
  icon,
  title,
  description,
  active,
  done,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
            done
              ? "bg-emerald-500 border-emerald-500 text-white"
              : active
              ? "bg-[#FF385C] border-[#FF385C] text-white"
              : "bg-gray-100 border-gray-200 text-gray-400"
          }`}
        >
          {icon}
        </div>
        <div className="w-0.5 h-8 bg-gray-200 mt-1 last:hidden" />
      </div>
      <div className="pb-8">
        <p
          className={`font-semibold text-sm ${
            done || active ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BookingConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const bookingId = params?.id ?? "b1";
  const [copied, setCopied] = useState(false);

  // Find booking from mock data or fall back to first
  const booking =
    mockBookings.find((b) => b.id === bookingId) ?? mockBookings[0];

  // Find matching property for extra details
  const property = properties.find((p) => p.id === (booking?.propertyId ?? ""));

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-500 mb-6">We couldn't find this booking.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e0314f] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[booking.status] ?? statusConfig.confirmed;
  const checkInDate = new Date(booking.checkIn ?? Date.now());
  const checkOutDate = new Date(booking.checkOut ?? Date.now());
  const isUpcoming = checkInDate > new Date();

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.id?.toUpperCase() ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nights = booking.nights ?? 1;
  const pricePerNight = booking.pricePerNight ?? 0;
  const totalPrice = booking.totalPrice ?? 0;
  const serviceFee = Math.round(totalPrice * 0.12);
  const cleaningFee = Math.round(pricePerNight * 0.3);
  const subtotal = totalPrice - serviceFee - cleaningFee;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Back Navigation ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to My Bookings
          </Link>
        </motion.div>

        {/* ── Page Header ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Booking Confirmation
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Reference:{" "}
                <button
                  onClick={handleCopy}
                  className="font-mono font-semibold text-[#FF385C] hover:underline focus:outline-none"
                >
                  {(booking.id ?? "").toUpperCase()}
                </button>
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="ml-2 text-emerald-600 text-xs font-medium"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
            </div>

            {/* Status Badge */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${status.bg} ${status.color}`}
            >
              {status.icon}
              {status.label}
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* ── Section 1: Property Card ── */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="relative h-52 sm:h-64 overflow-hidden">
                <img
                  src={booking.propertyImage ?? "https://decormatters-blog-uploads.s3.amazonaws.com/Snapinsta_app_301418438_613445980452829_8758071715934323067_n_1080_b94940bc46.JPG"}
                  alt={booking.propertyTitle ?? "Property"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://decormatters-blog-uploads.s3.amazonaws.com/Snapinsta_app_301418438_613445980452829_8758071715934323067_n_1080_b94940bc46.JPG";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
                    Your Stay
                  </p>
                  <h2 className="text-white text-xl font-bold leading-tight">
                    {booking.propertyTitle ?? "Beautiful Property"}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-white/80" />
                    <span className="text-white/80 text-sm">
                      {booking.location ?? "Unknown Location"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stay Details Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      icon: <Calendar className="w-4 h-4 text-[#FF385C]" />,
                      label: "Check-in",
                      value: checkInDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                    },
                    {
                      icon: <Calendar className="w-4 h-4 text-[#FF385C]" />,
                      label: "Check-out",
                      value: checkOutDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                    },
                    {
                      icon: <Moon className="w-4 h-4 text-[#FF385C]" />,
                      label: "Duration",
                      value: `${nights} night${nights !== 1 ? "s" : ""}`,
                    },
                    {
                      icon: <Users className="w-4 h-4 text-[#FF385C]" />,
                      label: "Guests",
                      value: `${booking.guests ?? 1} guest${(booking.guests ?? 1) !== 1 ? "s" : ""}`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        {item.icon}
                        <span className="text-xs text-gray-500 font-medium">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Host Info */}
                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF385C] to-[#e0314f] flex items-center justify-center text-white font-bold text-sm">
                      {(booking.hostName ?? "H").charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hosted by</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.hostName ?? "Your Host"}
                      </p>
                    </div>
                  </div>
                  {property && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {(property.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({property.reviewCount ?? 0} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            {/* ── Section 2: Booking Timeline ── */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Booking Journey
              </h2>
              <div>
                <TimelineStep
                  icon={<CreditCard className="w-4 h-4" />}
                  title="Booking Requested"
                  description={`Submitted on ${new Date(booking.bookedOn ?? Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                  done
                />
                <TimelineStep
                  icon={<CheckCircle className="w-4 h-4" />}
                  title="Booking Confirmed"
                  description="Your reservation has been accepted by the host"
                  done={booking.status !== "pending"}
                  active={booking.status === "pending"}
                />
                <TimelineStep
                  icon={<Home className="w-4 h-4" />}
                  title="Check-in Day"
                  description={`Arrive on ${checkInDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
                  active={isUpcoming && booking.status === "confirmed"}
                  done={!isUpcoming && booking.status !== "cancelled"}
                />
                <TimelineStep
                  icon={<Star className="w-4 h-4" />}
                  title="Leave a Review"
                  description="Share your experience after check-out"
                  done={booking.status === "completed"}
                />
              </div>
            </motion.section>

            {/* ── Section 3: Important Info ── */}
            <motion.section
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Important Information
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <Clock className="w-4 h-4 text-[#FF385C]" />,
                    title: "Check-in & Check-out Times",
                    body: "Check-in is available from 3:00 PM. Check-out must be completed by 11:00 AM. Early check-in or late check-out may be available — contact your host in advance.",
                  },
                  {
                    icon: <Shield className="w-4 h-4 text-[#FF385C]" />,
                    title: "House Rules",
                    body: "No smoking inside the property. Pets are not allowed unless pre-approved. Please respect quiet hours between 10 PM and 8 AM. Maximum occupancy must not be exceeded.",
                  },
                  {
                    icon: <Phone className="w-4 h-4 text-[#FF385C]" />,
                    title: "Getting in Touch",
                    body: "Your host will send check-in instructions 48 hours before arrival. For urgent matters, StayEase support is available 24/7 via the Help Center.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">
            {/* ── QR Code Card ── */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 bg-[#FF385C]/10 rounded-xl flex items-center justify-center mb-3">
                <QrCode className="w-5 h-5 text-[#FF385C]" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Your Check-in Pass</h3>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                Show this QR code at the property for a seamless, contactless check-in experience.
              </p>
              <QRCodePlaceholder bookingId={booking.id ?? "b1"} />
              <button className="mt-5 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                <Download className="w-4 h-4" />
                Download Pass
              </button>
              <button className="mt-2 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                Print Confirmation
              </button>
            </motion.div>

            {/* ── Price Breakdown ── */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ${(pricePerNight ?? 0).toLocaleString()} × {nights} night
                    {nights !== 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span className="font-medium text-gray-900">
                    ${(cleaningFee ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium text-gray-900">
                    ${(serviceFee ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900 text-lg">
                    ${(totalPrice ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 font-medium">
                  Payment processed securely via StayEase Pay
                </p>
              </div>
            </motion.div>

            {/* ── Actions ── */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3"
            >
              <h3 className="font-bold text-gray-900 mb-1">Quick Actions</h3>
              {[
                {
                  icon: <Mail className="w-4 h-4" />,
                  label: "Message Host",
                  href: "#",
                  primary: true,
                },
                {
                  icon: <Share2 className="w-4 h-4" />,
                  label: "Share Booking",
                  href: "#",
                  primary: false,
                },
                {
                  icon: <MapPin className="w-4 h-4" />,
                  label: "Get Directions",
                  href: "#",
                  primary: false,
                },
              ].map((action) => (
                <motion.a
                  key={action.label}
                  href={action.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    action.primary
                      ? "bg-[#FF385C] text-white hover:bg-[#e0314f]"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {action.icon}
                    {action.label}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </motion.a>
              ))}

              {booking.status === "confirmed" && isUpcoming && (
                <button className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                  <span className="flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              )}
            </motion.div>

            {/* ── Support ── */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="bg-gradient-to-br from-[#FF385C]/5 to-[#FF385C]/10 border border-[#FF385C]/20 rounded-2xl p-5 text-center"
            >
              <Shield className="w-6 h-6 text-[#FF385C] mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900 mb-1">
                StayEase Protection
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your booking is covered by our Guest Guarantee. If anything goes wrong, we'll make it right.
              </p>
              <a
                href="#"
                className="inline-block mt-3 text-xs font-semibold text-[#FF385C] hover:underline"
              >
                Learn more →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}