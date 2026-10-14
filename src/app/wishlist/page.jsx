"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item.id);
    toast.success(`Moved ${item.name} to cart! 🛒`);
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-theme-page text-theme-main py-6 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Compact Page Header */}
        <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <FiHeart className="text-[#ff2d6b] fill-[#ff2d6b]" /> My Wishlist
              <span className="text-xs bg-[#ff2d6b]/15 text-[#ff2d6b] font-bold px-2 py-0.5 rounded-full ml-1">
                {wishlist.length}
              </span>
            </h1>
            <p className="text-[11px] text-theme-dim mt-0.5">
              Saved items for your summer shopping collection
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs text-theme-muted hover:text-theme-main flex items-center gap-1.5 bg-theme-card border border-theme px-3.5 py-1.5 rounded-full hover:border-[#ff2d6b]/40 transition shadow-sm"
          >
            <FiArrowLeft size={12} /> Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="bg-theme-card border border-theme rounded-2xl p-8 sm:p-10 text-center space-y-3 max-w-md w-full theme-card-shadow">
              <div className="w-16 h-16 rounded-full bg-[#ff2d6b]/10 text-[#ff2d6b] flex items-center justify-center mx-auto text-2xl">
                <FiHeart />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-theme-main">Your Wishlist is Empty</h2>
              <p className="text-theme-muted text-xs leading-relaxed max-w-xs mx-auto">
                Explore our summer catalog and tap the heart icon on any product to save your favorites here.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#ff2d6b]/20"
                >
                  <FiShoppingBag size={14} /> Explore Products
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Compact 4-Column Responsive Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group relative bg-theme-card border border-theme hover:border-[#ff2d6b]/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between theme-card-shadow"
              >
                {/* Trash Remove Button */}
                <button
                  onClick={() => {
                    removeFromWishlist(item.id);
                    toast("Removed from wishlist", { icon: "💔" });
                  }}
                  className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-rose-600 text-white transition backdrop-blur-md cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <FiTrash2 size={12} />
                </button>

                {/* Product Image Link */}
                <Link href={`/products/${item.id}`} className="relative block w-full aspect-[4/3] bg-theme-subtle overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/bottle.jpg";
                    }}
                  />
                  {/* Category Pill */}
                  <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[#ff4d6d] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </Link>

                {/* Card Info */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-theme-dim mb-1">
                      <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                        ★ {item.rating || 4.5}
                      </span>
                      <span className="text-[10px] text-emerald-500 font-medium">Available</span>
                    </div>

                    <Link href={`/products/${item.id}`}>
                      <h2 className="text-theme-main font-semibold text-xs sm:text-sm hover:text-[#ff2d6b] transition line-clamp-1" title={item.name}>
                        {item.name}
                      </h2>
                    </Link>
                  </div>

                  <div>
                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-base sm:text-lg font-black text-[#ff2d6b]">
                        ৳{item.price}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 py-1.5 px-2 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
                      >
                        <FiShoppingCart size={12} /> Move to Cart
                      </button>
                      <Link
                        href={`/products/${item.id}`}
                        className="px-2.5 py-1.5 border border-theme hover:border-[#ff2d6b]/50 text-theme-muted hover:text-theme-main text-[11px] font-medium rounded-lg transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
