"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <footer className="bg-[#08071f] border-t border-white/5 text-white">
    
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-black mb-3">
            Sun<span className="text-[#ff2d6b]">Cart</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Your ultimate summer shopping destination. Fresh styles, hot deals, and fast delivery.
          </p>
          <div className="flex gap-3">
            {[
              { icon: <FaFacebookF />, href: "#" },
              { icon: <FaTwitter />, href: "#" },
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaYoutube />, href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:border-[#ff2d6b] hover:text-[#ff2d6b] transition-all text-sm"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: "My Profile", href: "/my-profile" },
              { label: "Login", href: "/login" },
              { label: "Register", href: "/register" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  href={link.href}
                  className="text-gray-400 text-sm hover:text-[#ff2d6b] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
            Categories
          </h3>
          <ul className="space-y-2.5">
            {["Accessories", "Shoes", "Bags", "Skincare", "Beachwear", "Sunglasses"].map((cat, i) => (
              <li key={i}>
                <Link
                  href="/products"
                  className="text-gray-400 text-sm hover:text-[#ff2d6b] transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
            Contact Us
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-400 text-sm">
              <MdLocationOn className="text-[#ff2d6b] mt-0.5 shrink-0 text-base" />
              123 Summer Street, Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <MdPhone className="text-[#ff2d6b] shrink-0 text-base" />
              +880 1700-000000
            </li>
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <MdEmail className="text-[#ff2d6b] shrink-0 text-base" />
              support@suncart.com
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © 2025 SunCart. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-500 text-xs hover:text-[#ff2d6b] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;