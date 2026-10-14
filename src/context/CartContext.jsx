"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("suncart_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    }
    setMounted(true);

    const handleCustomUpdate = () => {
      try {
        const updated = localStorage.getItem("suncart_cart");
        if (updated) setCart(JSON.parse(updated));
      } catch (err) {
        console.error("Failed to sync cart event:", err);
      }
    };

    window.addEventListener("suncart_cart_updated", handleCustomUpdate);
    return () => window.removeEventListener("suncart_cart_updated", handleCustomUpdate);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("suncart_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart:", e);
      }
    }
  }, [cart, mounted]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => String(item.id) === String(product.id));
      if (idx > -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + quantity,
        };
        toast.success(`Updated ${product.name} quantity to ${next[idx].quantity}! 🛒`);
        return next;
      } else {
        toast.success(`Added ${product.name} to cart! 🛒`);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            category: product.category,
            stock: product.stock || 20,
            quantity: Number(quantity),
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const next = prev.filter((item) => String(item.id) !== String(id));
      toast("Item removed from cart", { icon: "🗑️" });
      return next;
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (String(item.id) === String(id)) {
          const clamped = Math.min(item.stock || 50, newQty);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("suncart_cart");
    } catch {}
  };

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const shippingFee = subtotal >= 1000 || subtotal === 0 ? 0 : 60;
  const grandTotal = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
