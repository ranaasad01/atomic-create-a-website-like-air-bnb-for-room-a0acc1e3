"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check, AlertCircle, Home, Code2 as Github } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Auth Context ──────────────────────────────────────────────────────────
type AuthMode = "login" | "register";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// ─── Validation ─────────────────────────────────────────────────────────────────
function validateForm(mode: AuthMode, form: FormState): FieldError {
  const errors: FieldError = {};
  if (mode === "register" && !form.name.trim()) {
    errors.name = "Full name is required.";
  }
  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (mode === "register") {
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  }
  return errors;
}

// ─── Password Strength ──────────────────────────────────────────────────────────
function getPasswordStrength(password: string): { label: string; color: string; width: string; score: number } {
  if (!password) return { label: "", color: "bg-gray-200", width: "w-0", score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "w-1/4", score };
  if (score === 2) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4", score };
  if (score === 3) return { label: "Good", color: "bg-blue-400", width: "w-3/4", score };
  return { label: "Strong", color: "bg-green-500", width: "w-full", score };
}

// ─── Input Field Component (inline) ────────────────────────────────────────────
function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  icon,
  rightElement,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeInUp} className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-${rightElement ? "10" : "4"} py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 bg-white transition-all outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] ${
            error ? "border-red-400 bg-red-50/40" : "border-gray-200 hover:border-gray-300"
          }`}
        />
        {rightElement && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</span>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-red-500 mt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Social Button (inline) ─────────────────────────────────────────────────────
function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
    >
      {icon}
      {label}
    </motion.button>
  );
}

// ─── Google SVG Icon ────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5832-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1027-1.17.2827-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Success Screen (inline) ────────────────────────────────────────────────────
function SuccessScreen({ mode, name }: { mode: AuthMode; name: string }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-10 text-center gap-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-green-500" strokeWidth={2.5} />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-2xl font-bold text-gray-900"
      >
        {mode === "login" ? "Welcome back!" : `Welcome, ${name ?? "traveler"}!`}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="text-gray-500 text-sm max-w-xs"
      >
        {mode === "login"
          ? "You've successfully signed in. Redirecting you to your dashboard…"
          : "Your account has been created. Start exploring amazing stays around the world!"}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 mt-2"
      >
        <Link
          href="/search"
          className="px-5 py-2.5 bg-[#FF385C] text-white text-sm font-semibold rounded-xl hover:bg-[#e0314f] transition-colors"
        >
          Explore Stays
        </Link>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Dashboard
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const strength = getPasswordStrength(form.password);

  function setField(field: keyof FormState) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
      if (globalError) setGlobalError("");
    };
  }

  function switchMode(next: AuthMode) {
    setMode(next);
    setErrors({});
    setGlobalError("");
    setIsSuccess(false);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validateForm(mode, form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    setGlobalError("");
    // Simulate async auth
    await new Promise((res) => setTimeout(res, 1400));
    // Mock: reject if email is "fail@test.com"
    if (form.email.toLowerCase() === "fail@test.com") {
      setGlobalError(
        mode === "login"
          ? "Invalid email or password. Please try again."
          : "An account with this email already exists."
      );
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setIsSuccess(true);
  }

  function handleSocialLogin(provider: string) {
    setGlobalError(`${provider} login is not connected in demo mode.`);
  }

  const benefits = [
    "Access thousands of rooms, houses & hostels worldwide",
    "Instant booking with secure payment protection",
    "24/7 guest support and host communication",
    "Save favourites to your personal wishlist",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex flex-col">
      {/* ── Hero Banner ── */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="w-full bg-gradient-to-r from-[#FF385C] to-[#e8174a] py-10 px-4 text-center"
      >
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">StayEase</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {mode === "login" ? "Welcome back, traveler" : "Join StayEase today"}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-white/80 text-base">
            {mode === "login"
              ? "Sign in to manage your bookings and discover new stays."
              : "Create your free account and start exploring unique stays worldwide."}
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ── Main Content ── */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ── Left: Benefits Panel ── */}
          <motion.aside
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="hidden lg:flex flex-col gap-6 pt-4"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Your perfect stay is one click away
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                StayEase connects travelers with verified hosts offering rooms, entire homes, and budget-friendly hostels in over 190 countries.
              </p>
            </motion.div>

            <motion.ul variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-3">
              {benefits.map((b, i) => (
                <motion.li
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm border border-gray-100"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FF385C]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#FF385C]" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm text-gray-700 leading-snug">{b}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Testimonial */}
            <motion.div
              variants={scaleIn}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-2"
            >
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 italic leading-relaxed mb-3">
                "StayEase made finding a cozy private room in Barcelona so easy. The host was wonderful and the booking process was seamless!"
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                  AM
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">Amara M.</p>
                  <p className="text-xs text-gray-400">Verified Guest · Barcelona</p>
                </div>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
              {[
                { value: "2M+", label: "Happy Guests" },
                { value: "190+", label: "Countries" },
                { value: "500K+", label: "Properties" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                  <p className="text-lg font-bold text-[#FF385C]">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.aside>

          {/* ── Right: Auth Card ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Tab Toggle */}
              <div className="flex border-b border-gray-100">
                {(["login", "register"] as AuthMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                      mode === m ? "text-[#FF385C]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {m === "login" ? "Sign In" : "Create Account"}
                    {mode === m && (
                      <motion.span
                        layoutId="auth-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF385C] rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <SuccessScreen key="success" mode={mode} name={form.name} />
                  ) : (
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      {/* Social Buttons */}
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col gap-3 mb-6"
                      >
                        <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
                          <SocialButton
                            icon={<GoogleIcon />}
                            label="Google"
                            onClick={() => handleSocialLogin("Google")}
                          />
                          <SocialButton
                            icon={<Github className="w-4 h-4 text-gray-700" />}
                            label="GitHub"
                            onClick={() => handleSocialLogin("GitHub")}
                          />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="flex items-center gap-3">
                          <span className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                          <span className="flex-1 h-px bg-gray-200" />
                        </motion.div>
                      </motion.div>

                      {/* Global Error */}
                      <AnimatePresence>
                        {globalError && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5"
                          >
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{globalError}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Form */}
                      <form onSubmit={handleSubmit} noValidate>
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          className="flex flex-col gap-4"
                        >
                          {/* Name (register only) */}
                          <AnimatePresence>
                            {mode === "register" && (
                              <motion.div
                                key="name-field"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <InputField
                                  id="name"
                                  label="Full Name"
                                  type="text"
                                  value={form.name}
                                  onChange={setField("name")}
                                  placeholder="Jane Doe"
                                  error={errors.name}
                                  icon={<User className="w-4 h-4" />}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Email */}
                          <InputField
                            id="email"
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={setField("email")}
                            placeholder="you@example.com"
                            error={errors.email}
                            icon={<Mail className="w-4 h-4" />}
                          />

                          {/* Password */}
                          <InputField
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={setField("password")}
                            placeholder={mode === "register" ? "Min. 8 characters" : "Enter your password"}
                            error={errors.password}
                            icon={<Lock className="w-4 h-4" />}
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            }
                          />

                          {/* Password Strength (register only) */}
                          <AnimatePresence>
                            {mode === "register" && form.password.length > 0 && (
                              <motion.div
                                key="strength"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-1.5 -mt-2"
                              >
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full rounded-full ${strength.color}`}
                                    initial={{ width: "0%" }}
                                    animate={{ width: strength.width.replace("w-", "").replace("1/4", "25%").replace("2/4", "50%").replace("3/4", "75%").replace("full", "100%") }}
                                    transition={{ duration: 0.35 }}
                                    style={{
                                      width:
                                        strength.score === 0 ? "0%" :
                                        strength.score === 1 ? "25%" :
                                        strength.score === 2 ? "50%" :
                                        strength.score === 3 ? "75%" : "100%",
                                    }}
                                  />
                                </div>
                                {strength.label && (
                                  <p className="text-xs text-gray-500">
                                    Password strength:{" "}
                                    <span className={`font-semibold ${
                                      strength.score <= 1 ? "text-red-500" :
                                      strength.score === 2 ? "text-yellow-500" :
                                      strength.score === 3 ? "text-blue-500" : "text-green-600"
                                    }`}>
                                      {strength.label}
                                    </span>
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Confirm Password (register only) */}
                          <AnimatePresence>
                            {mode === "register" && (
                              <motion.div
                                key="confirm-field"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <InputField
                                  id="confirmPassword"
                                  label="Confirm Password"
                                  type={showConfirm ? "text" : "password"}
                                  value={form.confirmPassword}
                                  onChange={setField("confirmPassword")}
                                  placeholder="Re-enter your password"
                                  error={errors.confirmPassword}
                                  icon={<Lock className="w-4 h-4" />}
                                  rightElement={
                                    <button
                                      type="button"
                                      onClick={() => setShowConfirm((v) => !v)}
                                      className="text-gray-400 hover:text-gray-600 transition-colors"
                                      aria-label={showConfirm ? "Hide password" : "Show password"}
                                    >
                                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  }
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Forgot Password (login only) */}
                          {mode === "login" && (
                            <motion.div variants={fadeInUp} className="flex justify-end -mt-2">
                              <button
                                type="button"
                                className="text-xs text-[#FF385C] hover:underline font-medium"
                              >
                                Forgot your password?
                              </button>
                            </motion.div>
                          )}

                          {/* Terms (register only) */}
                          <AnimatePresence>
                            {mode === "register" && (
                              <motion.p
                                key="terms"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs text-gray-400 leading-relaxed"
                              >
                                By creating an account, you agree to StayEase&apos;s{" "}
                                <span className="text-[#FF385C] hover:underline cursor-pointer">Terms of Service</span>{" "}
                                and{" "}
                                <span className="text-[#FF385C] hover:underline cursor-pointer">Privacy Policy</span>.
                              </motion.p>
                            )}
                          </AnimatePresence>

                          {/* Submit Button */}
                          <motion.div variants={fadeInUp}>
                            <motion.button
                              type="submit"
                              disabled={isLoading}
                              whileHover={isLoading ? {} : { scale: 1.02, boxShadow: "0 6px 24px rgba(255,56,92,0.35)" }}
                              whileTap={isLoading ? {} : { scale: 0.98 }}
                              className="w-full py-3.5 bg-[#FF385C] hover:bg-[#e0314f] disabled:bg-[#FF385C]/60 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 mt-1"
                            >
                              {isLoading ? (
                                <>
                                  <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full inline-block"
                                  />
                                  {mode === "login" ? "Signing in…" : "Creating account…"}
                                </>
                              ) : (
                                <>
                                  {mode === "login" ? "Sign In" : "Create Account"}
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      </form>

                      {/* Switch Mode */}
                      <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center text-sm text-gray-500 mt-6"
                      >
                        {mode === "login" ? (
                          <>
                            Don&apos;t have an account?{" "}
                            <button
                              type="button"
                              onClick={() => switchMode("register")}
                              className="text-[#FF385C] font-semibold hover:underline"
                            >
                              Sign up free
                            </button>
                          </>
                        ) : (
                          <>
                            Already have an account?{" "}
                            <button
                              type="button"
                              onClick={() => switchMode("login")}
                              className="text-[#FF385C] font-semibold hover:underline"
                            >
                              Sign in
                            </button>
                          </>
                        )}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Demo hint */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="text-center text-xs text-gray-400 mt-4"
            >
              Demo tip: use{" "}
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">fail@test.com</span>{" "}
              to trigger an error state.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── Trust Bar ── */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="bg-white border-t border-gray-100 py-8 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.p variants={fadeInUp} className="text-center text-xs text-gray-400 mb-6 uppercase tracking-widest font-medium">
            Trusted by travelers worldwide
          </motion.p>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🔒", title: "Secure Payments", desc: "256-bit SSL encryption on all transactions" },
              { icon: "✅", title: "Verified Hosts", desc: "Every host is identity-verified by our team" },
              { icon: "💬", title: "24/7 Support", desc: "Round-the-clock help whenever you need it" },
              { icon: "🛡️", title: "Guest Protection", desc: "Full refund guarantee on eligible bookings" },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={scaleIn}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
                className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border border-gray-100 bg-gray-50/60 transition-all"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400 leading-snug">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}