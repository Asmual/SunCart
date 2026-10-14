"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiZap, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import products from "@/data/products.json";

export default function FlashDeals() {
  // Live countdown timer state (e.g. 5 hours, 45 mins, 20 secs)
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pick 4 hot deals from products
  const dealProducts = [
    { ...products[7], discount: "35% OFF", sold: 19, totalStock: 25 }, // Eco Bamboo Sunglasses
    { ...products[10], discount: "25% OFF", sold: 45, totalStock: 65 }, // SPF 50 Mineral Sunscreen
    { ...products[9], discount: "30% OFF", sold: 22, totalStock: 28 }, // Tropical Floral Linen Shirt
    { ...products[3], discount: "20% OFF", sold: 28, totalStock: 35 }, // Comfort Summer Sandals
  ];

  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("suncart_cart") || "[]");
      const idx = currentCart.findIndex((p) => String(p.id) === String(item.id));

      if (idx > -1) {
        currentCart[idx].quantity += 1;
      } else {
        currentCart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: 1,
          stock: item.stock || 20,
        });
      }

      localStorage.setItem("suncart_cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("suncart_cart_updated"));
      toast.success(`⚡ Flash deal! Added ${item.name} to cart!`);
    }
  };

  const formatDigit = (num) => String(num).padStart(2, "0");

  return (
    <section className="bg-[#0c0a2a] py-10 px-4 md:px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Section Header with Live Countdown Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-pink-600/20 via-purple-600/10 to-amber-500/10 border border-pink-500/30 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-white text-lg shadow-lg shadow-pink-600/40">
              <FiZap />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Limited Time
                </span>
                <span className="text-xs text-white/50 font-medium">Daily Summer Flash Sale</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white mt-0.5">
                Today&apos;s <span className="text-[#ff2d6b]">Flash Deals</span> 🔥
              </h2>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-white/50 flex items-center gap-1 font-semibold mr-1">
              <FiClock className="text-pink-400" /> Ends In:
            </span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
              <div className="bg-[#12103d] border border-white/15 px-2.5 py-1.5 rounded-lg text-white text-center">
                <span className="text-pink-400 font-extrabold">{formatDigit(timeLeft.hours)}</span>
                <p className="text-[8px] text-white/40 uppercase">Hours</p>
              </div>
              <span className="text-pink-400 font-bold">:</span>
              <div className="bg-[#12103d] border border-white/15 px-2.5 py-1.5 rounded-lg text-white text-center">
                <span className="text-pink-400 font-extrabold">{formatDigit(timeLeft.minutes)}</span>
                <p className="text-[8px] text-white/40 uppercase">Mins</p>
              </div>
              <span className="text-pink-400 font-bold">:</span>
              <div className="bg-[#12103d] border border-white/15 px-2.5 py-1.5 rounded-lg text-white text-center">
                <span className="text-pink-400 font-extrabold">{formatDigit(timeLeft.seconds)}</span>
                <p className="text-[8px] text-white/40 uppercase">Secs</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Flash Deal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
          {dealProducts.map((item) => {
            const soldPercent = Math.min(100, Math.round((item.sold / item.totalStock) * 100));

            return (
              <div
                key={item.id}
                className="group relative bg-[#131138]/90 hover:bg-[#181545] border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md"
              >
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow-md">
                  {item.discount}
                </div>

                {/* Product Image */}
                <Link href={`/products/${item.id}`} className="relative block w-full aspect-[4/3] bg-[#0c0a2a] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Card Body */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider block mb-0.5">
                      {item.category}
                    </span>
                    <Link href={`/products/${item.id}`}>
                      <h3 className="text-xs sm:text-sm font-semibold text-white hover:text-pink-400 transition line-clamp-1">
                        {item.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-white/50">
                      <span>Sold: <b className="text-white">{item.sold}</b></span>
                      <span className="text-pink-400 font-semibold">{item.totalStock - item.sold} left</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-500"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Price & Buy Button */}
                  <div className="pt-1">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-pink-400 font-black text-base">৳{item.price}</span>
                      <span className="text-white/30 text-[11px] line-through">
                        ৳{Math.round(item.price * 1.35)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="w-full flex items-center justify-center gap-1 bg-[#ff2d6b] hover:bg-[#e0255e] text-white py-1.5 rounded-lg text-[11px] font-bold transition shadow-sm"
                    >
                      <FiShoppingCart size={12} /> Claim Deal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
