import HeroSection from "@/components/HeroSection";
import PopularProducts from "@/components/PopularProducts";
import products from "@/data/products.json";
import SummerTips from "@/components/SummerTips";
import TopBrands from "@/components/TopBrands";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function HomePage() {
  const popularProducts = products.slice(0, 4);

  return (
    <main>
      <HeroSection />

      {/* Popular Products Showcase Section */}
      <section className="bg-[#0b0a26] py-12 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#ff2d6b] text-[11px] font-bold uppercase tracking-widest">
                Seasonal Top Picks
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5">
                Popular <span className="text-[#ff2d6b]">Products</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1 group transition"
            >
              View Full Collection{" "}
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

      <SummerTips />
      <TopBrands />
    </main>
  );
}