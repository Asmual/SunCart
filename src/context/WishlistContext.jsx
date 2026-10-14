"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("suncart_wishlist");
      if (saved) {
        setWishlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist:", e);
    }
    setMounted(true);

    const handleCustomUpdate = () => {
      try {
        const updated = localStorage.getItem("suncart_wishlist");
        if (updated) setWishlist(JSON.parse(updated));
      } catch (err) {
        console.error("Failed to sync wishlist event:", err);
      }
    };

    window.addEventListener("suncart_wishlist_updated", handleCustomUpdate);
    return () => window.removeEventListener("suncart_wishlist_updated", handleCustomUpdate);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("suncart_wishlist", JSON.stringify(wishlist));
      } catch (e) {
        console.error("Failed to save wishlist:", e);
      }
    }
  }, [wishlist, mounted]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(product.id));
      if (exists) {
        const next = prev.filter((item) => String(item.id) !== String(product.id));
        toast("Removed from wishlist", { icon: "💔" });
        return next;
      } else {
        toast.success(`Saved ${product.name} to wishlist! ❤️`);
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(id)));
    toast("Item removed from wishlist", { icon: "💔" });
  };

  const isInWishlist = (id) => {
    return wishlist.some((item) => String(item.id) === String(id));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        totalWishlist: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
