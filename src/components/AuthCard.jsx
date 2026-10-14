/* eslint-disable react-hooks/static-components */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthCard({ initialMode = "login" }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode); // "login" or "register"

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register states
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showRegPass, setShowRegPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: loginEmail,
        password: loginPass,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials! Please try again.");
        return;
      }

      toast.success("Welcome back! Login successful. ☀️");
      setTimeout(() => {
        router.push("/");
      }, 600);
    } catch {
      toast.error("Something went wrong with login.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();

    if (regForm.password !== regForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (regForm.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: regForm.email,
        password: regForm.password,
        name: regForm.name,
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }

      toast.success("Account created successfully! Welcome to SunCart. 🎉");
      setTimeout(() => {
        router.push("/");
      }, 600);
    } catch {
      toast.error("Something went wrong with registration.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google sign in failed!");
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative ambient glassmorphism lights */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-pink-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative bg-white/[0.04] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] text-white">

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <span className="font-black text-2xl tracking-tight">
              Sun<span className="text-[#ff2d6b]">Cart</span>
            </span>
          </Link>
          <p className="text-xs text-white/50 mt-1">
            {mode === "login" ? "Sign in to access your summer cart & orders" : "Create an account and start summer shopping"}
          </p>
        </div>

        {/* Smart Segmented Pill Tab Switcher */}
        <div className="relative flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              mode === "login"
                ? "bg-[#ff2d6b] text-white shadow-md shadow-[#ff2d6b]/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              mode === "register"
                ? "bg-[#ff2d6b] text-white shadow-md shadow-[#ff2d6b]/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none focus:border-[#ff2d6b] focus:bg-white/8 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input
                  type={showLoginPass ? "text" : "password"}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none focus:border-[#ff2d6b] focus:bg-white/8 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showLoginPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-pink-600/30 flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In to SunCart <FiArrowRight /></>
              )}
            </button>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="e.g. Asmual Hoque"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none focus:border-[#ff2d6b] focus:bg-white/8 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none focus:border-[#ff2d6b] focus:bg-white/8 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input
                  type={showRegPass ? "text" : "password"}
                  required
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none focus:border-[#ff2d6b] focus:bg-white/8 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass(!showRegPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showRegPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  required
                  value={regForm.confirmPassword}
                  onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/20 outline-none focus:border-[#ff2d6b] focus:bg-white/8 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showConfirmPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-pink-600/30 flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create SunCart Account <FiArrowRight /></>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-[10px] uppercase tracking-wider">or sign in with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2.5 text-xs text-white/80 hover:text-white transition active:scale-98"
        >
          <FcGoogle size={18} /> Continue with Google
        </button>

      </div>
    </div>
  );
}
