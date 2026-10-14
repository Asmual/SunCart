"use client";

import { useState, useEffect } from "react";
import PopularProducts from "@/components/PopularProducts";
import staticProducts from "@/data/products.json";
import { FiSearch, FiSliders, FiRefreshCw } from "react-icons/fi";

const categories = ["All", "Accessories", "Shoes", "Bag", "Skincare", "Beachwear"];

export default function ProductsPage() {
  const [products, setProducts] = useState(staticProducts);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (selectedCategory !== "All") params.append("category", selectedCategory);
        if (sortOption !== "featured") params.append("sort", sortOption);
        if (maxPrice < 2000) params.append("maxPrice", String(maxPrice));

        const res = await fetch(`/api/products?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.products) {
            let list = data.products;
            if (inStockOnly) {
              list = list.filter((p) => (p.stock || 0) > 0);
            }
            setProducts(list);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("API products query failed, filtering locally:", err);
      }

      let filtered = staticProducts.filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase());
        const matchesCat =
          selectedCategory === "All" ||
          p.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesPrice = p.price <= maxPrice;
        const matchesStock = !inStockOnly || (p.stock || 0) > 0;
        return matchesSearch && matchesCat && matchesPrice && matchesStock;
      });

      if (sortOption === "price-low") filtered.sort((a, b) => a.price - b.price);
      if (sortOption === "price-high") filtered.sort((a, b) => b.price - a.price);
      if (sortOption === "rating") filtered.sort((a, b) => b.rating - a.rating);

      setProducts(filtered);
      setLoading(false);
    }

    const timer = setTimeout(fetchCatalog, 150);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, sortOption, maxPrice, inStockOnly]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortOption("featured");
    setMaxPrice(2000);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0a28] text-white py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* Compact Title Bar (Reduced Margin & Padding) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              Summer <span className="text-[#ff2d6b]">Collection</span>
            </h1>
            <p className="text-white/40 text-xs">
              Showing <b className="text-white">{products.length}</b> seasonal essentials
            </p>
          </div>

          {(search || selectedCategory !== "All" || sortOption !== "featured" || maxPrice < 2000 || inStockOnly) && (
            <button
              onClick={handleResetFilters}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition"
            >
              <FiRefreshCw size={11} /> Reset Filters
            </button>
          )}
        </div>

        {/* Streamlined Compact Search & Filter Toolbar */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-3 md:p-3.5 backdrop-blur-md space-y-3">

          {/* Row 1: Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Quick search sunglasses, caps, shoes..."
                className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-[#ff2d6b] transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <FiSliders size={12} className="text-pink-400" />
                <span className="text-white/50 text-[11px]">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent text-white text-xs outline-none cursor-pointer font-medium"
                >
                  <option value="featured" className="bg-[#0f0d3b]">Featured</option>
                  <option value="price-low" className="bg-[#0f0d3b]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#0f0d3b]">Price: High to Low</option>
                  <option value="rating" className="bg-[#0f0d3b]">Top Rated</option>
                </select>
              </div>

              {/* In-Stock Checkbox */}
              <label className="flex items-center gap-1.5 text-[11px] text-white/70 cursor-pointer select-none bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-xl">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-[#ff2d6b] w-3 h-3"
                />
                In Stock
              </label>
            </div>
          </div>

          {/* Row 2: Category Tabs & Compact Price Slider */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/5">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-0.5 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#ff2d6b] text-white shadow-sm"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Compact Price Slider */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end text-[11px]">
              <span className="text-white/50">Max:</span>
              <input
                type="range"
                min="300"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-[#ff2d6b] cursor-pointer"
              />
              <span className="font-bold text-pink-400 w-11 text-right">৳{maxPrice}</span>
            </div>
          </div>

        </div>

        {/* 4-Column Product Cards Grid (Above-the-fold Optimized) */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#ff2d6b] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/40 text-xs">Loading items...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-10 text-center space-y-3">
            <p className="text-4xl">🔍</p>
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-white/40 text-xs max-w-sm mx-auto">
              No summer gear matched your active filters. Try clearing or expanding your search.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 bg-[#ff2d6b] text-white rounded-full text-xs font-bold hover:bg-[#e0255e] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.map((product) => (
              <PopularProducts key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}