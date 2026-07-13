/* eslint-disable react-hooks/static-components */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
// Import authClient instance directly
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Local state to safely manage the authenticated user details
  const [user, setUser] = useState(null);

  // Fetch session data safely on route changes or mounting
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setUser(session.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session fetch failed:", error);
        setUser(null);
      }
    };
    fetchUserSession();
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle User Logout Action
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setDropdownOpen(false);
      setMenuOpen(false);
      toast.success("Logout successful!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      toast.error("Something went wrong during logout.");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: user ? "/my-profile" : "/login", label: "My Profile" },
  ];

  // Profile Avatar Sub-Component
  const ProfileAvatar = ({ size = "w-10 h-10", textSize = "text-lg" }) => (
    <div className={`${size} rounded-full border-2 border-pink-500 overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-all`}>
      {user?.image ? (
        <img
          src={user.image}
          alt={user.name || "User"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-pink-500/20 flex items-center justify-center">
          <span className={`${textSize} text-pink-500 font-bold`}>
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <nav className="w-full bg-[#0b0b30] border-b border-white/5 sticky top-0 z-50">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* Brand Logo and Name Section */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/SunCart-Logo.png"
            alt="SunCart Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-extrabold text-xl text-white tracking-tight">
            Sun<span className="text-pink-500">Cart</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors ${pathname === link.href ? "text-pink-500" : "text-white/60 hover:text-white"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth and Profile Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
              <span className="text-white/80 text-sm font-medium">
                Hi, {user.name?.split(" ")[0]}
              </span>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="focus:outline-none"
              >
                <ProfileAvatar />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#121242] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/my-profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all"
                  >
                    👤 View Profile
                  </Link>
                  <div className="h-px bg-white/5 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 transition-all text-left font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:border-pink-500 hover:text-pink-500 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-linear-to-r from-[#ff4d6d] to-[#ff2952] text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white text-2xl focus:outline-none"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Sidebar Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d0d35] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-semibold transition-colors ${pathname === link.href ? "text-pink-500" : "text-white/60"
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile User Profile Section */}
          <div className="pt-2 border-t border-white/10">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 py-1">
                  <ProfileAvatar size="w-9 h-9" textSize="text-sm" />
                  <span className="text-white text-sm font-medium flex-1">
                    Hi, {user.name}
                  </span>
                </div>
                <Link
                  href="/my-profile"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium border border-white/10 text-white/80 bg-white/5"
                >
                  👤 View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-pink-500 text-sm font-semibold border border-pink-500/30 py-2 px-3 rounded-lg hover:bg-pink-500/10 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium bg-linear-to-r from-[#ff4d6d] to-[#ff2952] text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;