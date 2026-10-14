import HeroSection from "@/components/HeroSection";
import FlashDeals from "@/components/FlashDeals";
import PopularProducts from "@/components/PopularProducts";
import CuratedCollections from "@/components/CuratedCollections";
import products from "@/data/products.json";
import SummerTips from "@/components/SummerTips";
import TopBrands from "@/components/TopBrands";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function HomePage() {
  // Show 8 products for two balanced 4-column rows
  const popularProducts = products.slice(0, 8);

  return (
    <main>
      <HeroSection />

      {/* 1. Flash Deals with Live Countdown */}
      <FlashDeals />

      {/* 2. Popular Products Showcase (4-Column Grid) */}
      <section className="bg-theme-page py-10 px-4 md:px-6 border-t border-theme-subtle transition-colors duration-300">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#ff2d6b] text-[10px] font-bold uppercase tracking-widest">
                Seasonal Top Picks
              </p>
              <h2 className="text-xl md:text-2xl font-black text-theme-main mt-0.5">
                Popular <span className="text-[#ff2d6b]">Summer Essentials</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-theme-muted hover:text-theme-main flex items-center gap-1 group transition"
            >
              Explore All 26 Items{" "}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4-column optimized responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
            {popularProducts.map((product) => (
              <PopularProducts key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Curated Summer Category Collections */}
      <CuratedCollections />

      {/* 4. Summer Health & Care Tips */}
      <SummerTips />

      {/* 5. Trusted Brands Infinite Marquee */}
      <TopBrands />
    </main>
  );
}