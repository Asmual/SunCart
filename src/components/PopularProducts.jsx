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
  const [imgSrc, setImgSrc] = useState(image);

  useEffect(() => {
    setImgSrc(image);
  }, [image]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="group relative bg-[#131138]/80 hover:bg-[#181545] border border-white/8 hover:border-[#ff2d6b]/40 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-[0_8px_25px_rgba(255,45,107,0.12)]">

      {/* Floating Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-2 right-2 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
          isWishlisted
            ? "bg-[#ff2d6b] text-white shadow-md"
            : "bg-black/50 text-white/70 hover:text-white hover:bg-black/80"
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <FiHeart className={isWishlisted ? "fill-white text-white" : ""} size={13} />
      </button>

      {/* Edge-to-Edge Image Header with No Excessive Padding */}
      <Link href={`/products/${id}`} className="relative block w-full aspect-[4/3] bg-[#0c0a2a] overflow-hidden">
        <Image
          src={imgSrc || "/images/bottle.jpg"}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => {
            setImgSrc("/images/bottle.jpg");
          }}
        />
        {/* Subtle category badge on top-left of image */}
        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[#ff4d6d] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
          {category}
        </span>
      </Link>

      {/* Product Content Body */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
            <span className="text-amber-400 font-semibold flex items-center gap-0.5">
              ★ {rating}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">In Stock</span>
          </div>

          <Link href={`/products/${id}`} className="block">
            <h2 className="text-white font-semibold text-xs sm:text-sm hover:text-[#ff2d6b] transition line-clamp-1" title={name}>
              {name}
            </h2>
          </Link>
        </div>

        <div>
          {/* Price Line */}
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-[#ff2d6b] font-bold text-base">৳{price}</span>
            <span className="text-white/30 text-[11px] line-through">৳{Math.round(price * 1.25)}</span>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1 bg-[#ff2d6b] hover:bg-[#e0255e] text-white py-1.5 px-2 rounded-lg text-[11px] font-bold transition shadow-sm hover:shadow-[#ff2d6b]/30 active:scale-95"
            >
              <FiShoppingCart size={12} /> Add to Cart
            </button>
            <Link
              href={`/products/${id}`}
              className="px-2.5 py-1.5 border border-white/15 hover:border-white/30 text-white/80 hover:text-white rounded-lg text-[11px] font-medium text-center transition hover:bg-white/5"
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