"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

const PopularProducts = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && product) {
      const saved = JSON.parse(localStorage.getItem("suncart_wishlist") || "[]");
      setIsWishlisted(saved.some((item) => String(item.id) === String(product.id)));
    }
  }, [product]);

  if (!product) return null;

  const { id, name, price, image, category, rating, stock = 20 } = product;

  const handleAddToCart = () => {
    if (typeof window !== "undefined") {
      const currentCart = JSON.parse(localStorage.getItem("suncart_cart") || "[]");
      const idx = currentCart.findIndex((item) => String(item.id) === String(id));

      if (idx > -1) {
        currentCart[idx].quantity += 1;
      } else {
        currentCart.push({
          id,
          name,
          price,
          image,
          category,
          quantity: 1,
          stock,
        });
      }

      localStorage.setItem("suncart_cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("suncart_cart_updated"));
      toast.success(`Added ${name} to cart! 🛒`);
    }
  };

  const handleToggleWishlist = () => {
    if (typeof window !== "undefined") {
      const currentWishlist = JSON.parse(localStorage.getItem("suncart_wishlist") || "[]");
      const exists = currentWishlist.some((item) => String(item.id) === String(id));

      let updated;
      if (exists) {
        updated = currentWishlist.filter((item) => String(item.id) !== String(id));
        setIsWishlisted(false);
        toast("Removed from wishlist", { icon: "💔" });
      } else {
        updated = [...currentWishlist, { id, name, price, image, category, rating }];
        setIsWishlisted(true);
        toast.success("Saved to wishlist! ❤️");
      }

      localStorage.setItem("suncart_wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("suncart_wishlist_updated"));
    }
  };

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#ff2d6b]/50 hover:shadow-[0_0_30px_rgba(255,45,107,0.15)] transition-all duration-300 flex flex-col justify-between">

      {/* Floating Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
          isWishlisted
            ? "bg-[#ff2d6b] text-white shadow-lg"
            : "bg-black/40 text-white/70 hover:text-white hover:bg-black/70"
        }`}
        title="Save to Wishlist"
      >
        <FiHeart className={isWishlisted ? "fill-white text-white" : ""} size={15} />
      </button>

      {/* Product Image */}
      <Link href={`/products/${id}`} className="h-56 overflow-hidden relative block bg-[#12103d]/40">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-108 transition duration-500"
          onError={(e) => {
            console.error(`Error loading image: ${image}`);
          }}
        />
      </Link>

      {/* Product Content */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] text-[#ff2d6b] font-bold uppercase tracking-wider">
              {category}
            </span>
            <span className="text-yellow-400 text-xs font-semibold flex items-center gap-1">
              ⭐ {rating}
            </span>
          </div>

          <Link href={`/products/${id}`}>
            <h2 className="text-white font-bold text-base hover:text-[#ff2d6b] transition line-clamp-1 mb-2">
              {name}
            </h2>
          </Link>
        </div>

        <div className="pt-2">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[#ff2d6b] font-black text-xl">৳{price}</span>
            <span className="text-white/30 text-xs line-through">৳{Math.round(price * 1.25)}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#ff2d6b]/20 hover:-translate-y-0.5"
            >
              <FiShoppingCart size={14} /> Add to Cart
            </button>
            <Link
              href={`/products/${id}`}
              className="px-3.5 border border-white/20 hover:border-white/40 text-white/90 py-2.5 rounded-xl text-xs font-semibold text-center hover:bg-white/5 transition flex items-center"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;