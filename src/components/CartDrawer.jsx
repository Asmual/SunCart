"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FiX, FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    grandTotal,
    totalItems,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diffForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop blur */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f0d3b] border-l border-white/10 text-white flex flex-col shadow-2xl">

          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-pink-500 text-xl" />
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <span className="text-xs bg-pink-500/20 text-pink-400 font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-white/3 border-b border-white/5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-white/70">
                {diffForFree > 0 ? (
                  <>Add <span className="text-pink-400 font-bold">৳{diffForFree}</span> for <b>FREE Delivery</b> 🚚</>
                ) : (
                  <span className="text-emerald-400 font-bold">🎉 You qualify for FREE Delivery!</span>
                )}
              </span>
              <span className="text-white/40">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4 text-white/50">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div>
                  <p className="text-base font-bold text-white">Your cart is empty</p>
                  <p className="text-xs text-white/40 mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow-lg shadow-pink-600/30"
                >
                  Explore Summer Essentials
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white/5 border border-white/8 rounded-2xl items-center"
                >
                  <div className="w-16 h-16 relative shrink-0 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-xs text-pink-400 font-bold mt-0.5">৳{item.price}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[11px] text-white/40">
                        = ৳{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-white/30 hover:text-rose-400 transition"
                    title="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#0d0b35] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Delivery Fee</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `৳${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-pink-400 text-base">৳{grandTotal}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-3 text-center border border-white/20 hover:bg-white/5 rounded-xl text-xs font-bold text-white transition"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-3 flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl text-xs font-bold text-white transition shadow-lg shadow-pink-600/30"
                >
                  Checkout <FiArrowRight />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
