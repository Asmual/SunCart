/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Handle missing resource state with fallback layout parameters
  if (!product) return (
    <div className="min-h-screen bg-[#120B35] flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl mb-6">😕</p>
        <h2 className="text-3xl font-bold text-white mb-3">Product Not Found</h2>
        <p className="text-white/40">The product you are looking for does not exist.</p>
      </div>
    </div>
  );

  const { name, image, price, rating, category, description, brand, stock } = product;

  return (
    <div className="min-h-screen bg-[#0f0d3b] relative overflow-hidden">
      {/* Decorative backdrop ambient light filter matrix */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-125 h-75 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-5">
       
        {/* Navigation router control anchor structure */}
        <div className="pt-5 pb-3 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 rounded-3xl text-sm font-medium transition-all"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2 text-white/30 text-sm">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="text-[#ff2d6b] font-medium">{name}</span>
          </div>
        </div>

        {/* Core product showcase viewport matrix */}
        <div className="grid md:grid-cols-2 bg-white/3 border border-white/10 mx-auto w-full rounded-3xl overflow-hidden backdrop-blur-md">
         
          {/* Asset visualization layer containing custom metrics badges */}
          <div className="relative bg-[#f3eae1] flex items-center justify-center p-8 min-h-100 rounded-3xl md:rounded-r-none">
            <img
              src={image}
              alt={name}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
              <span className="bg-[#ff2d6b] text-white text-[10px] font-bold px-4 py-1.5 rounded-3xl uppercase tracking-wider shadow-lg">
                {category}
              </span>
              {stock && stock <= 5 && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-3xl shadow-lg">
                  🔥 Only {stock} left!
                </span>
              )}
            </div>
          </div>

          {/* Product semantic records and data processing form fields */}
          <div className="p-8 md:p-12 flex flex-col gap-5 bg-[#120B35]/80 rounded-3xl md:rounded-l-none">
            {brand && (
              <p className="text-[#ff2d6b] text-xs font-bold uppercase tracking-[0.3em]">
                ✦ {brand}
              </p>
            )}

            <h1 className="text-4xl font-extrabold text-white leading-tight">
              {name}
            </h1>

            {/* Social validation metrics score indicators */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 px-4 py-2 rounded-3xl">
                <span>⭐</span>
                <span className="text-yellow-400 font-bold">{rating}</span>
                <span className="text-yellow-400/50 text-sm">/ 5.0</span>
              </div>
              {stock && (
                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-3xl">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
                  <span className="text-green-400 text-sm font-medium">{stock} in stock</span>
                </div>
              )}
            </div>

            <div className="h-px bg-linear-to-r from-[#ff2d6b]/30 via-white/10 to-transparent" />

            {/* Commercial transactions pricing grid calculations */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-black text-[#ff2d6b]">৳{price}</span>
              <span className="text-white/30 line-through text-xl">৳{Math.round(price * 1.2)}</span>
              <span className="bg-[#ff2d6b]/15 text-[#ff2d6b] text-sm font-bold px-3 py-1 rounded-3xl border border-[#ff2d6b]/25">
                20% OFF
              </span>
            </div>

            <div className="h-px bg-white/8" />

            {/* Volume modifier quantitative counter elements */}
            <div className="flex items-center gap-4">
              <span className="text-white/50 text-sm font-medium">Quantity:</span>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-3xl px-4 py-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-white/60 hover:text-white text-xl font-bold w-6 text-center transition"
                >
                  −
                </button>
                <span className="text-white font-bold text-lg w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(stock || 10, q + 1))}
                  className="text-white/60 hover:text-white text-xl font-bold w-6 text-center transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Interactive functional event submission CTA modules */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button className="flex-1 bg-[#ff2d6b] text-white py-4 rounded-3xl font-bold text-lg hover:bg-[#e0255e] transition-all duration-300">
                🛒 Add To Cart
              </button>
              <button className="flex-1 border border-white/15 text-white py-4 rounded-3xl font-bold text-lg hover:bg-white/5 transition-all">
                🤍 Wishlist
              </button>
            </div>

            {/* Transactional trust assurance markers component blocks */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/3 border border-white/8 rounded-3xl p-3 text-center">
                <p className="text-2xl mb-1">🚚</p>
                <p className="text-white/60 text-[10px]">Free Delivery</p>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-3xl p-3 text-center">
                <p className="text-2xl mb-1">🔄</p>
                <p className="text-white/60 text-[10px]">Easy Returns</p>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-3xl p-3 text-center">
                <p className="text-2xl mb-1">🔒</p>
                <p className="text-white/60 text-[10px]">Secure Pay</p>
              </div>
            </div>
          </div>
        </div>

        {/* Descriptive textual representation information segments */}
        <div className="py-14 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-[#ff2d6b] rounded-full" />
            <h2 className="text-2xl font-bold text-white">Product Description</h2>
          </div>

          <div className="bg-white/3 border border-white/10 rounded-3xl p-8">
            <p className="text-white/60 leading-relaxed text-base mb-6">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-[#ff2d6b] text-lg">📦</span>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider">Category</p>
                  <p className="text-white font-medium">{category}</p>
                </div>
              </div>
              {brand && (
                <div className="flex items-center gap-3">
                  <span className="text-[#ff2d6b] text-lg">🏷️</span>
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Brand</p>
                    <p className="text-white font-medium">{brand}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;