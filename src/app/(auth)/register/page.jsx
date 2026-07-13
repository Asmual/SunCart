/* eslint-disable react-hooks/static-components */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const RegisterPage = () => {
  // Input form states configuration without photoUrl
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);
  const router = useRouter();

  // Track state alterations dynamically
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit handler for processing email credentials signup
  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.repeatPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }

      toast.success("Registration successful! Please login.");
      router.push("/");
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Google integration authentication execution block
  const handleGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-[#080818] flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />

      {/* Main card panel interface layout */}
      <div className="w-full max-w-md bg-[#0f0f28] border border-white/8 rounded-2xl px-8 py-10">
        <div className="flex justify-center mb-8">
          <span className="text-white font-extrabold text-3xl">
            Sun<span className="text-[#ff4d6d]">Cart</span>
          </span>
        </div>

        <h1 className="text-white text-2xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-white/40 text-sm text-center mb-8">
          Join SunCart and shop the summer
        </p>

        {/* Input credentials interaction grid framework */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name input block wrapper */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Your Full Name"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 outline-none focus:border-[#ff4d6d] focus:bg-[#ff4d6d]/5 transition-all"
            />
          </div>

          {/* Email verification field row wrapper */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 outline-none focus:border-[#ff4d6d] focus:bg-[#ff4d6d]/5 transition-all"
            />
          </div>

          {/* Password secure encryption string handler */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
            <input
              type={showPass ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Create a Password"
              className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 outline-none focus:border-[#ff4d6d] focus:bg-[#ff4d6d]/5 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Duplicate protection confirm validation loop */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
            <input
              type={showRepeatPass ? "text" : "password"}
              name="repeatPassword"
              required
              value={form.repeatPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 outline-none focus:border-[#ff4d6d] focus:bg-[#ff4d6d]/5 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowRepeatPass(!showRepeatPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
            >
              {showRepeatPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Action trigger button structure */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff4d6d] hover:bg-[#ff2952] text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Dynamic section bridge divider structure */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/25 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social account integration action trigger panel */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2.5 border border-white/10 rounded-xl py-3 text-white/70 text-sm hover:bg-white/5 transition-all"
        >
          <FcGoogle className="text-xl shrink-0" />
          Continue with Google
        </button>

        {/* Redirect toggle path string link reference wrapper */}
        <p className="text-center text-white/35 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#ff4d6d] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;