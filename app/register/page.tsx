"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check, AlertCircle, Home, Code2 as Github } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Auth Context (inline) ────────────────────────────────────────────────
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
  general?: string;
}

// ─── Validation ────────────────────────────────────────────────────────────────
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

// ─── Password Strength ─────────────────────────────────────────────────────────
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

// ─── Input Field Component (inline) ───────────────────────────────────────────
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
          className={`w-full pl-10 pr-${rightElement ? "10" : "4"} py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 ${
            error
              ? "border-red-400 focus:ring-red-200"
              : "border-gray-200 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
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

// ─── Social Button (inline) ────────────────────────────────────────────────────
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
      className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
    >
      {icon}
      {label}
    </motion.button>
  );
}

// ─── Google SVG Icon ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Feature Bullet ───────────────────────────────────────────────────────────
function FeatureBullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </div>
      <span className="text-white/90 text-sm">{text}</span>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [mode, setMode] = useState<AuthMode>("register");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  function setField(field: keyof FormState) {
    return (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  function handleSocialLogin(provider: string) {
    // UI-only mock
    alert(`${provider} login is a UI demo — no real OAuth configured.`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(mode, form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (mode === "register" && !agreeTerms) {
      setErrors({ general: "Please agree to the Terms of Service and Privacy Policy." });
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    // Mock async auth
    await new Promise((res) => setTimeout(res, 1400));
    setIsSubmitting(false);
    setIsSuccess(true);
  }

  function switchMode(newMode: AuthMode) {
    setMode(newMode);
    setErrors({});
    setIsSuccess(false);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setAgreeTerms(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FF385C] to-[#E31C5F] py-16 md:py-20">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Home className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">StayEase</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
            >
              {mode === "register" ? "Join StayEase Today" : "Welcome Back"}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-white/85 text-lg max-w-xl mx-auto mb-8">
              {mode === "register"
                ? "Create your free account and start discovering unique rooms, houses, and hostels around the world."
                : "Sign in to access your bookings, wishlists, and host dashboard."}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-6 mt-2"
            >
              {[
                "10,000+ verified listings",
                "Instant booking available",
                "24/7 guest support",
                "Secure payments",
              ].map((feat) => (
                <FeatureBullet key={feat} text={feat} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Mode Toggle */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex bg-gray-100 rounded-2xl p-1 mb-8"
          >
            {(["register", "login"] as AuthMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-white text-[#FF385C] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "register" ? "Create Account" : "Sign In"}
              </button>
            ))}
          </motion.div>

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8"
            >
              {/* Success State */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {mode === "register" ? "Account Created!" : "Signed In!"}
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">
                      {mode === "register"
                        ? "Welcome to StayEase! Your account is ready. Start exploring amazing stays."
                        : "Welcome back! Redirecting you to your dashboard…"}
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 bg-[#FF385C] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#E31C5F] transition-colors"
                    >
                      Go to Homepage <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isSuccess && (
                <>
                  {/* Social Logins */}
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-3 mb-6"
                  >
                    <motion.div variants={fadeInUp}>
                      <SocialButton
                        icon={<GoogleIcon />}
                        label={mode === "register" ? "Continue with Google" : "Sign in with Google"}
                        onClick={() => handleSocialLogin("Google")}
                      />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <SocialButton
                        icon={<Github className="w-4.5 h-4.5 text-gray-700" />}
                        label={mode === "register" ? "Continue with GitHub" : "Sign in with GitHub"}
                        onClick={() => handleSocialLogin("GitHub")}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-3 mb-6"
                  >
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </motion.div>

                  {/* General Error */}
                  <AnimatePresence>
                    {errors.general && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-600">{errors.general}</p>
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
                            transition={{ duration: 0.25 }}
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
                        placeholder="Min. 8 characters"
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
                            transition={{ duration: 0.2 }}
                            className="-mt-2"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: passwordStrength.width.replace("w-", "").replace("1/4", "25%").replace("2/4", "50%").replace("3/4", "75%").replace("full", "100%") }}
                                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                  style={{
                                    width:
                                      passwordStrength.score === 1
                                        ? "25%"
                                        : passwordStrength.score === 2
                                        ? "50%"
                                        : passwordStrength.score === 3
                                        ? "75%"
                                        : passwordStrength.score === 4
                                        ? "100%"
                                        : "0%",
                                  }}
                                />
                              </div>
                              <span
                                className={`text-xs font-medium ${
                                  passwordStrength.score <= 1
                                    ? "text-red-500"
                                    : passwordStrength.score === 2
                                    ? "text-yellow-500"
                                    : passwordStrength.score === 3
                                    ? "text-blue-500"
                                    : "text-green-500"
                                }`}
                              >
                                {passwordStrength.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400">
                              Use uppercase, numbers, and symbols for a stronger password.
                            </p>
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
                            transition={{ duration: 0.25 }}
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
                      <AnimatePresence>
                        {mode === "login" && (
                          <motion.div
                            key="forgot"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="-mt-2 text-right"
                          >
                            <button
                              type="button"
                              className="text-xs text-[#FF385C] hover:underline font-medium"
                            >
                              Forgot your password?
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Terms (register only) */}
                      <AnimatePresence>
                        {mode === "register" && (
                          <motion.div
                            key="terms"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-3"
                          >
                            <button
                              type="button"
                              onClick={() => setAgreeTerms((v) => !v)}
                              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                agreeTerms
                                  ? "bg-[#FF385C] border-[#FF385C]"
                                  : "border-gray-300 bg-white hover:border-[#FF385C]"
                              }`}
                              aria-label="Agree to terms"
                            >
                              {agreeTerms && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </button>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              I agree to StayEase&apos;s{" "}
                              <Link href="#" className="text-[#FF385C] hover:underline font-medium">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="#" className="text-[#FF385C] hover:underline font-medium">
                                Privacy Policy
                              </Link>
                              . I understand my data will be used to personalise my experience.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <motion.div variants={fadeInUp}>
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                          className={`w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 ${
                            isSubmitting
                              ? "bg-[#FF385C]/60 cursor-not-allowed"
                              : "bg-[#FF385C] hover:bg-[#E31C5F] shadow-md hover:shadow-lg shadow-rose-200"
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin w-4 h-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                />
                              </svg>
                              {mode === "register" ? "Creating Account…" : "Signing In…"}
                            </>
                          ) : (
                            <>
                              {mode === "register" ? "Create My Account" : "Sign In to StayEase"}
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </form>

                  {/* Switch Mode Link */}
                  <motion.p
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="text-center text-sm text-gray-500 mt-6"
                  >
                    {mode === "register" ? (
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
                    ) : (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("register")}
                          className="text-[#FF385C] font-semibold hover:underline"
                        >
                          Create one free
                        </button>
                      </>
                    )}
                  </motion.p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Trust Badges */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            {[
              { icon: "🔒", title: "Secure", desc: "256-bit SSL encryption" },
              { icon: "🛡️", title: "Private", desc: "GDPR compliant data" },
              { icon: "✅", title: "Verified", desc: "Identity-checked hosts" },
            ].map((badge) => (
              <motion.div
                key={badge.title}
                variants={fadeInUp}
                className="flex flex-col items-center text-center bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <span className="text-2xl mb-1.5">{badge.icon}</span>
                <p className="text-xs font-semibold text-gray-700">{badge.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{badge.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Join Section ── */}
      <section className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Why millions choose StayEase
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Whether you&apos;re a traveller looking for the perfect stay or a host wanting to earn extra income, StayEase has everything you need.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  emoji: "🏠",
                  title: "10,000+ Unique Stays",
                  desc: "From cozy private rooms and budget hostels to entire homes and luxury villas — find the perfect space for every trip and budget.",
                },
                {
                  emoji: "💳",
                  title: "Secure & Easy Payments",
                  desc: "Book with confidence using our encrypted payment system. Pay in your local currency with no hidden fees — what you see is what you pay.",
                },
                {
                  emoji: "⭐",
                  title: "Verified Reviews",
                  desc: "Every review is from a real guest who stayed at the property. Honest, unfiltered feedback so you always know what to expect.",
                },
                {
                  emoji: "🤝",
                  title: "Superhost Network",
                  desc: "Our Superhost badge recognises exceptional hosts with consistently high ratings, fast responses, and outstanding hospitality.",
                },
                {
                  emoji: "📱",
                  title: "Manage on the Go",
                  desc: "Access your bookings, messages, and listings from any device. Our responsive platform works seamlessly on mobile and desktop.",
                },
                {
                  emoji: "🌍",
                  title: "Global Community",
                  desc: "Join over 2 million travellers and 150,000 hosts across 90+ countries. Wherever you go, StayEase has a home waiting for you.",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={scaleIn}
                  whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 transition-all duration-200 cursor-default"
                >
                  <span className="text-3xl mb-3 block">{item.emoji}</span>
                  <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Host CTA Section ── */}
      <section className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <motion.div variants={slideInLeft} className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Have a space to share?
              </h2>
              <p className="text-white/85 max-w-md">
                List your room, house, or hostel on StayEase and start earning. Setup takes less than 10 minutes and your first booking could arrive within 24 hours.
              </p>
            </motion.div>
            <motion.div variants={slideInRight} className="shrink-0">
              <Link href="/dashboard">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white text-[#FF385C] font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                >
                  Start Hosting <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}