"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
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
    <div className="min-h-screen bg-[#0f0d3b] text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <FiHeart className="text-pink-500 fill-pink-500" /> My Wishlist
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Your saved summer favorites ({wishlist.length} items)
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs text-white/70 hover:text-white flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full transition"
          >
            <FiArrowLeft size={13} /> Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white/3 border border-white/10 rounded-3xl p-16 text-center space-y-4">
            <p className="text-7xl">🤍</p>
            <h2 className="text-2xl font-bold text-white">Your wishlist is empty!</h2>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              Save your favorite summer accessories, shoes and outfits here to easily purchase them later.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#ff2d6b] hover:bg-[#e0255e] text-white font-bold rounded-full transition shadow-lg shadow-[#ff2d6b]/30"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-4 flex flex-col justify-between hover:border-[#ff2d6b]/40 transition group"
              >
                <div>
                  <div className="h-48 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center p-4 mb-4 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-rose-600 text-white flex items-center justify-center transition"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  <span className="text-[10px] text-[#ff2d6b] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <Link href={`/products/${item.id}`}>
                    <h3 className="text-base font-bold text-white hover:text-pink-400 transition mt-1 truncate">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="text-lg font-black text-[#ff2d6b] mt-2">৳{item.price}</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 py-2.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-[#ff2d6b]/20"
                  >
                    <FiShoppingCart size={13} /> Move to Cart
                  </button>
                  <Link
                    href={`/products/${item.id}`}
                    className="px-3 py-2.5 border border-white/20 hover:bg-white/5 text-white/80 text-xs font-semibold rounded-xl transition text-center"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
