/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiCheckCircle, FiShield, FiTruck, FiRefreshCw, FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import staticProducts from "@/data/products.json";
import PopularProducts from "@/components/PopularProducts";

const defaultReviews = [
  {
    id: 1,
    name: "Tanvir Hasan",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent quality! Just what I needed for the summer heat. Fast delivery in Dhaka.",
    verified: true,
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    rating: 4,
    date: "1 week ago",
    comment: "Comfortable and looks just like the pictures. Highly recommended!",
    verified: true,
  },
];

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState(defaultReviews);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();

  if (!product) {
    return (
      <div className="min-h-screen bg-[#120B35] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-7xl mb-4">☀️</p>
          <h2 className="text-3xl font-bold text-white mb-3">Product Not Found</h2>
          <p className="text-white/50 mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link
            href="/products"
            className="px-6 py-3 bg-[#ff2d6b] text-white rounded-full font-bold hover:bg-[#e0255e] transition-all"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const { id, name, image, price, rating = 4.5, category, description, brand, stock = 25 } = product;

  // Add to cart handler with window dispatch for global cart sync
  const handleAddToCart = () => {
    if (typeof window !== "undefined") {
      const existingCart = JSON.parse(localStorage.getItem("suncart_cart") || "[]");
      const existingIndex = existingCart.findIndex((item) => String(item.id) === String(id));

      if (existingIndex > -1) {
        existingCart[existingIndex].quantity += quantity;
      } else {
        existingCart.push({
          id,
          name,
          price,
          image,
          category,
          quantity,
          stock,
        });
      }

      localStorage.setItem("suncart_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("suncart_cart_updated"));
      toast.success(`Added ${quantity} x ${name} to your cart! 🛒`);
    }
  };

  // Wishlist toggle handler
  const handleToggleWishlist = () => {
    if (typeof window !== "undefined") {
      const existingWishlist = JSON.parse(localStorage.getItem("suncart_wishlist") || "[]");
      const exists = existingWishlist.some((item) => String(item.id) === String(id));

      let updatedWishlist;
      if (exists) {
        updatedWishlist = existingWishlist.filter((item) => String(item.id) !== String(id));
        setIsWishlisted(false);
        toast("Removed from wishlist", { icon: "💔" });
      } else {
        updatedWishlist = [...existingWishlist, { id, name, price, image, category, rating }];
        setIsWishlisted(true);
        toast.success("Added to wishlist! ❤️");
      }

      localStorage.setItem("suncart_wishlist", JSON.stringify(updatedWishlist));
      window.dispatchEvent(new Event("suncart_wishlist_updated"));
    }
  };

  // Add customer review
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      toast.error("Please fill in your name and review comment.");
      return;
    }

    const newRev = {
      id: Date.now(),
      name: reviewForm.name,
      rating: Number(reviewForm.rating),
      date: "Just now",
      comment: reviewForm.comment,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setReviewForm({ name: "", rating: 5, comment: "" });
    toast.success("Thank you! Your review has been submitted.");
  };

  const relatedProducts = staticProducts
    .filter((item) => String(item.id) !== String(id))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0b0a28] text-white py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-white/50 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-white transition">Products</Link>
            <span>/</span>
            <span className="text-[#ff2d6b] font-medium truncate max-w-xs">{name}</span>
          </div>

          <button
            onClick={() => router.back()}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full transition"
          >
            ← Back
          </button>
        </div>

        {/* Product Showcase Viewport */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white/3 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md">

          {/* Product Image Area */}
          <div className="relative flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 min-h-[360px] border border-white/5">
            <img
              src={image}
              alt={name}
              className="max-h-[380px] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#ff2d6b] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {category}
              </span>
              {stock && stock <= 10 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                  🔥 Low Stock ({stock} left)
                </span>
              )}
            </div>
          </div>

          {/* Product Details Info Form */}
          <div className="flex flex-col justify-center gap-5">
            {brand && (
              <p className="text-[#ff2d6b] text-xs font-bold uppercase tracking-[0.25em]">
                ✦ {brand}
              </p>
            )}

            <h1 className="text-3xl md:text-4xl font-black leading-tight text-white">
              {name}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 px-3.5 py-1.5 rounded-full text-xs">
                <FiStar className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold">{rating}</span>
                <span className="text-yellow-400/60">({reviews.length} reviews)</span>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="text-emerald-400 font-semibold">{stock} Available in Stock</span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-4xl md:text-5xl font-black text-[#ff2d6b]">৳{price}</span>
              <span className="text-white/40 line-through text-lg">৳{Math.round(price * 1.25)}</span>
              <span className="bg-[#ff2d6b]/15 text-[#ff2d6b] text-xs font-bold px-2.5 py-1 rounded-full border border-[#ff2d6b]/30">
                20% OFF
              </span>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
              {description || "High quality seasonal essential crafted for maximum comfort, durability and summer style."}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm font-semibold text-white/70">Quantity:</span>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-lg font-bold text-white/60 hover:text-white px-2 transition"
                >
                  −
                </button>
                <span className="font-bold text-base w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  className="text-lg font-bold text-white/60 hover:text-white px-2 transition"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-white/40">Total: ৳{price * quantity}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-[#ff2d6b] hover:bg-[#e0255e] text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg shadow-[#ff2d6b]/30 hover:-translate-y-0.5"
              >
                <FiShoppingCart className="text-lg" /> Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`px-6 py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 border transition-all ${
                  isWishlisted
                    ? "bg-pink-600/20 border-pink-500 text-pink-400"
                    : "border-white/15 text-white hover:bg-white/5"
                }`}
              >
                <FiHeart className={isWishlisted ? "fill-pink-500 text-pink-500" : ""} />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center">
              <div className="p-3 bg-white/3 rounded-xl border border-white/5">
                <FiTruck className="mx-auto text-xl text-[#ff2d6b] mb-1" />
                <p className="text-[11px] font-semibold text-white/80">Express Shipping</p>
                <p className="text-[9px] text-white/40">2-3 days nationwide</p>
              </div>
              <div className="p-3 bg-white/3 rounded-xl border border-white/5">
                <FiRefreshCw className="mx-auto text-xl text-[#ff2d6b] mb-1" />
                <p className="text-[11px] font-semibold text-white/80">7 Days Return</p>
                <p className="text-[9px] text-white/40">Hassle-free guarantee</p>
              </div>
              <div className="p-3 bg-white/3 rounded-xl border border-white/5">
                <FiShield className="mx-auto text-xl text-[#ff2d6b] mb-1" />
                <p className="text-[11px] font-semibold text-white/80">100% Authentic</p>
                <p className="text-[9px] text-white/40">Genuine summer stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section: Description & Customer Reviews */}
        <div className="bg-white/3 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md space-y-6">
          <div className="flex items-center gap-6 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab("description")}
              className={`text-lg font-bold pb-2 transition-all border-b-2 ${
                activeTab === "description"
                  ? "text-[#ff2d6b] border-[#ff2d6b]"
                  : "text-white/50 border-transparent hover:text-white"
              }`}
            >
              Description & Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-lg font-bold pb-2 transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "reviews"
                  ? "text-[#ff2d6b] border-[#ff2d6b]"
                  : "text-white/50 border-transparent hover:text-white"
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="space-y-6 text-white/70 text-sm leading-relaxed">
              <p>
                {description || "Designed specifically for warm weather and summer outdoor adventures. Made with premium grade lightweight and breathable materials to keep you comfortable throughout the day."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase">Category</p>
                  <p className="text-base font-semibold text-white">{category}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase">Season</p>
                  <p className="text-base font-semibold text-white">Summer 2025</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/40 uppercase">Warranty</p>
                  <p className="text-base font-semibold text-white">6 Months Brand Guarantee</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Write Review Form */}
              <form onSubmit={handleAddReview} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Write a Review</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="e.g. Asmual Hoque"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-[#ff2d6b]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0d0b2e] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-[#ff2d6b]"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Amazing)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                      <option value="3">⭐⭐⭐ (3 Stars - Average)</option>
                      <option value="2">⭐⭐ (2 Stars - Below expectations)</option>
                      <option value="1">⭐ (1 Star - Poor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 block mb-1">Your Review</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your experience with this summer product..."
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-[#ff2d6b]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-sm font-bold rounded-xl transition-all"
                >
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white/3 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <FiCheckCircle size={10} /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/40">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>

                    <p className="text-sm text-white/70">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommended Related Products */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#ff2d6b] text-[10px] font-bold uppercase tracking-wider">
                Recommendations
              </p>
              <h2 className="text-lg md:text-xl font-bold text-white mt-0.5">
                You May Also <span className="text-[#ff2d6b]">Like</span>
              </h2>
            </div>
            <Link href="/products" className="text-xs text-[#ff2d6b] hover:underline font-semibold">
              View All Collection →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {relatedProducts.map((item) => (
              <PopularProducts key={item.id} product={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;