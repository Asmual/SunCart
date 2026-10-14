"use client";

import { useState, useEffect } from "react";
import PopularProducts from "@/components/PopularProducts";
import staticProducts from "@/data/products.json";
import { FiSearch, FiFilter, FiSliders, FiRefreshCw } from "react-icons/fi";

const categories = ["All", "Accessories", "Shoes", "Bag", "Skincare"];

export default function ProductsPage() {
  const [products, setProducts] = useState(staticProducts);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch products from API with query params
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

      // Local fallback filter
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

    const timer = setTimeout(fetchCatalog, 200);
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
    <div className="min-h-screen bg-[#0f0d3b] text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Title Section */}
        <div className="text-center space-y-3">
          <p className="text-[#ff2d6b] font-bold uppercase tracking-widest text-xs">
            Summer Collection 2025
          </p>
          <h1 className="text-4xl md:text-5xl font-black">
            Explore All <span className="text-[#ff2d6b]">Summer</span> Gear
          </h1>
          <p className="text-white/50 max-w-lg mx-auto text-sm">
            Curated seasonal essentials designed for beat-the-heat comfort, outdoor protection and tropical lifestyle.
          </p>
        </div>

        {/* Filter and Search Control Bar */}
        <div className="bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6">

          {/* Row 1: Search & Sorting */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sunglasses, caps, sandals..."
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 outline-none focus:border-[#ff2d6b] transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Quick Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-2xl text-xs">
                <FiSliders className="text-pink-400" />
                <span className="text-white/60">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent text-white outline-none cursor-pointer font-medium"
                >
                  <option value="featured" className="bg-[#0f0d3b]">Featured</option>
                  <option value="price-low" className="bg-[#0f0d3b]">Price: Low to High</option>
                  <option value="price-high" className="bg-[#0f0d3b]">Price: High to Low</option>
                  <option value="rating" className="bg-[#0f0d3b]">Highest Rated</option>
                </select>
              </div>

              {(search || selectedCategory !== "All" || sortOption !== "featured" || maxPrice < 2000 || inStockOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-2xl text-xs font-semibold transition"
                  title="Reset all filters"
                >
                  <FiRefreshCw size={12} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category Tabs & Price Slider */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-2 border-t border-white/5">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#ff2d6b] text-white shadow-lg shadow-[#ff2d6b]/30"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Price Filter & Stock Toggle */}
            <div className="flex items-center gap-6 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/60">Max Price:</span>
                <input
                  type="range"
                  min="300"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-28 accent-[#ff2d6b] cursor-pointer"
                />
                <span className="text-xs font-bold text-pink-400 w-12 text-right">৳{maxPrice}</span>
              </div>

              <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded accent-[#ff2d6b]"
                />
                In Stock Only
              </label>
            </div>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-white/50 px-2">
          <span>
            Showing <b className="text-white">{products.length}</b> product(s)
          </span>
          {selectedCategory !== "All" && (
            <span className="text-pink-400 font-medium">Category: {selectedCategory}</span>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#ff2d6b] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/50 text-sm">Loading summer collection...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white/3 border border-white/10 rounded-3xl p-16 text-center space-y-4">
            <p className="text-6xl">🔍</p>
            <h3 className="text-2xl font-bold text-white">No products matched your search</h3>
            <p className="text-white/40 text-sm max-w-md mx-auto">
              Try adjusting your search terms, changing categories, or clearing active price filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#ff2d6b] text-white rounded-full text-xs font-bold hover:bg-[#e0255e] transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <PopularProducts key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}