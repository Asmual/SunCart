/* eslint-disable react-hooks/static-components */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiPackage, FiGrid } from "react-icons/fi";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();

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
      }, 500);
    } catch {
      toast.error("Something went wrong during logout.");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/cart", label: "Cart" },
    { href: "/track-order", label: "Track Order" },
  ];

  const ProfileAvatar = ({ size = "w-9 h-9", textSize = "text-sm" }) => (
    <div
      className={`${size} rounded-full border-2 border-pink-500 overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-all`}
    >
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
    <header className="sticky top-0 z-40 w-full shadow-lg">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide">
        ☀️ SUMMER MEGA SALE: UP TO 50% OFF! Free Nationwide Delivery on orders over ৳1,000 🔥
      </div>

      <nav className="w-full bg-[#0b0b30]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/SunCart-Logo.png"
              alt="SunCart Logo"
              width={34}
              height={34}
              className="object-contain"
            />
            <span className="font-black text-2xl text-white tracking-tight">
              Sun<span className="text-[#ff2d6b]">Cart</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href ? "text-[#ff2d6b]" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Icons (Wishlist, Cart, Profile) */}
          <div className="flex items-center gap-3">
            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 text-white/70 hover:text-white transition rounded-full hover:bg-white/5"
              title="View Wishlist"
            >
              <FiHeart size={20} />
              {totalWishlist > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white/70 hover:text-white transition rounded-full hover:bg-white/5"
              title="Open Cart"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff2d6b] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-[#ff2d6b]/50">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth / Profile Area */}
            <div className="hidden md:flex items-center ml-2">
              {user ? (
                <div className="relative flex items-center gap-2.5" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-white/5 transition"
                  >
                    <ProfileAvatar />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#121242] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs text-white/40">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      </div>

                      <Link
                        href="/my-profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/80 hover:text-white hover:bg-white/5 transition"
                      >
                        <FiUser className="text-pink-400" /> My Account
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/80 hover:text-white hover:bg-white/5 transition"
                      >
                        <FiHeart className="text-pink-400" /> Wishlist ({totalWishlist})
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-white/5 transition font-medium"
                      >
                        <FiGrid /> Admin Dashboard
                      </Link>

                      <div className="h-px bg-white/5 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition text-left font-medium"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white border border-white/15 hover:border-white/30 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 transition shadow-md shadow-pink-600/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white focus:outline-none"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="md:hidden bg-[#0d0d35] border-t border-white/5 px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-semibold py-1.5 ${
                  pathname === link.href ? "text-[#ff2d6b]" : "text-white/70"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-amber-400 py-1.5 flex items-center gap-2"
            >
              <FiGrid /> Admin Panel
            </Link>

            <div className="pt-3 border-t border-white/10">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ProfileAvatar />
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-white/40 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/my-profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-2 text-center text-xs font-semibold bg-white/5 border border-white/10 rounded-xl"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-2 text-center text-xs font-semibold text-pink-400 border border-pink-500/30 rounded-xl hover:bg-pink-500/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl text-xs font-semibold border border-white/20"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-[#ff2d6b] text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;