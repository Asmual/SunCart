"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

const collections = [
  {
    id: 1,
    title: "Beach & Resort Fits",
    subtitle: "Tropical linen shirts, shorts & towels",
    category: "Beachwear",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    badge: "Hot Styles",
  },
  {
    id: 2,
    title: "Sun Guard & Skincare",
    subtitle: "SPF 50+ mineral lotions & aloe mist",
    category: "Skincare",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    badge: "Dermatologist Pick",
  },
  {
    id: 3,
    title: "Summer Footwear",
    subtitle: "Coastal sandals, flip-flops & loafers",
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80",
    badge: "Breathable Soles",
  },
  {
    id: 4,
    title: "UV Shades & Caps",
    subtitle: "Polarized glasses, caps & dry bags",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    badge: "UV400 Protection",
  },
];

export default function CuratedCollections() {
  return (
    <section className="bg-[#0b0927] py-10 px-4 md:px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-[#ff2d6b] text-[10px] font-bold uppercase tracking-[2px]">
              Curated Seasonal Moods
            </p>
            <h2 className="text-xl md:text-2xl font-black text-white mt-0.5">
              Shop by <span className="text-[#ff2d6b]">Summer Category</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-white/60 hover:text-white flex items-center gap-1 group transition"
          >
            All 26 Products <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4-Column Showcase Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/products?category=${encodeURIComponent(col.category)}`}
              className="group relative h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-500 flex flex-col justify-end p-4 shadow-lg"
            >
              {/* Background Image with Dark Gradient Overlay */}
              <Image
                src={col.image}
                alt={col.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700 -z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090824] via-[#090824]/60 to-transparent -z-10" />

              {/* Top Tag */}
              <span className="absolute top-3 left-3 bg-[#ff2d6b]/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                {col.badge}
              </span>

              {/* Bottom Content */}
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white group-hover:text-pink-400 transition-colors">
                  {col.title}
                </h3>
                <p className="text-[11px] text-white/50 line-clamp-1">
                  {col.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] text-pink-400 font-bold group-hover:gap-2 transition-all">
                  <span>Explore Now</span>
                  <FiArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
