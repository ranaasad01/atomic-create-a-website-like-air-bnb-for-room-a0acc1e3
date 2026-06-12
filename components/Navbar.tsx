"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, Heart, Home } from 'lucide-react';
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-[#FF385C] rounded-lg flex items-center justify-center shadow-md">
                  <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className={`text-xl font-bold tracking-tight transition-colors ${
                    isScrolled || !isHome ? "text-[#222222]" : "text-white"
                  }`}
                >
                  Stay<span className="text-[#FF385C]">Ease</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Search Bar */}
            <Link href="/search" className="hidden md:flex">
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-full border cursor-pointer transition-all ${
                  isScrolled || !isHome
                    ? "border-gray-200 bg-white shadow-sm hover:shadow-md"
                    : "border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isScrolled || !isHome ? "text-gray-700" : "text-white"
                  }`}
                >
                  Anywhere
                </span>
                <span className={`w-px h-4 ${isScrolled || !isHome ? "bg-gray-300" : "bg-white/40"}`} />
                <span
                  className={`text-sm font-medium ${
                    isScrolled || !isHome ? "text-gray-700" : "text-white"
                  }`}
                >
                  Any week
                </span>
                <span className={`w-px h-4 ${isScrolled || !isHome ? "bg-gray-300" : "bg-white/40"}`} />
                <span
                  className={`text-sm ${
                    isScrolled || !isHome ? "text-gray-400" : "text-white/70"
                  }`}
                >
                  Add guests
                </span>
                <div className="w-8 h-8 bg-[#FF385C] rounded-full flex items-center justify-center ml-1">
                  <Search className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "/search", label: "Explore", icon: <Search className="w-4 h-4" /> },
                { href: "/wishlist", label: "Wishlist", icon: <Heart className="w-4 h-4" /> },
                { href: "/dashboard", label: "Host", icon: null },
              ].map((item) => (
                <motion.div key={item.href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-[#FF385C]/10 text-[#FF385C]"
                        : isScrolled || !isHome
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white/90 hover:bg-white/20"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Auth Buttons */}
              <div className="flex items-center gap-2 ml-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isScrolled || !isHome
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Log in
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-[#FF385C] text-white rounded-full text-sm font-semibold hover:bg-[#e0314f] transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/profile"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isScrolled || !isHome
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/search">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isScrolled || !isHome
                      ? "bg-gray-100 text-gray-700"
                      : "bg-white/20 text-white"
                  }`}
                >
                  <Search className="w-4 h-4" />
                </motion.div>
              </Link>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isScrolled || !isHome
                    ? "bg-gray-100 text-gray-700"
                    : "bg-white/20 text-white"
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 bg-white shadow-xl border-b border-gray-100 md:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#FF385C]/10 text-[#FF385C]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-3 flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 text-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center px-4 py-2.5 bg-[#FF385C] text-white rounded-xl text-sm font-semibold hover:bg-[#e0314f] transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-lg">
        <nav className="flex items-center justify-around px-2 py-2">
          {[
            { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
            { href: "/search", label: "Search", icon: <Search className="w-5 h-5" /> },
            { href: "/wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
            { href: "/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                pathname === item.href
                  ? "text-[#FF385C]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}