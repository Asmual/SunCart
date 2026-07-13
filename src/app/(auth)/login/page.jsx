/* eslint-disable react-hooks/static-components */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Authentication pipeline configuration for handling registered users
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password!");
        return;
      }

      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/");
      }, 1500);
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

      {/* Main dashboard authentication window wrapper panel */}
      <div className="w-full max-w-md bg-[#0f0f28] border border-white/8 rounded-2xl px-8 py-10">
        <div className="flex justify-center mb-8">
          <span className="text-white font-extrabold text-3xl tracking-tight">
            Sun<span className="text-[#ff4d6d]">Cart</span>
          </span>
        </div>

        <h1 className="text-white text-2xl font-bold text-center mb-1">
          Welcome back!
        </h1>

        <p className="text-white/40 text-sm text-center mb-8">
          Sign in to your SunCart account
        </p>

        {/* Verification interactive workflow parameters grid */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Identity unique email path identifier logic segment */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-[#ff4d6d] focus:bg-[#ff4d6d]/5 transition-all"
            />
          </div>

          {/* Secure cipher key pattern encryption layout panel */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-[#ff4d6d] focus:bg-[#ff4d6d]/5 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all"
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Execution submission click trigger workflow router */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff4d6d] hover:bg-[#ff2952] text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Dynamic section bridge divider structure */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-white/25 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Social account integration action trigger panel */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2.5 border border-white/12 rounded-xl py-3 text-white/75 text-sm hover:border-white/25 hover:bg-white/5 transition-all"
        >
          <FcGoogle className="text-xl shrink-0" />
          Continue with Google
        </button>

        {/* Redirect toggle path string link reference wrapper */}
        <p className="text-center text-white/35 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#ff4d6d] font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;