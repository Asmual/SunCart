"use client";

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-sm bg-[#0e0c33] border-l border-white/10 text-white flex flex-col shadow-2xl">

          {/* Drawer Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-pink-500 text-base" />
              <h2 className="text-sm font-bold">Shopping Cart</h2>
              <span className="text-[10px] bg-pink-500/20 text-pink-400 font-bold px-1.5 py-0.2 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-3.5 py-2 bg-white/3 border-b border-white/5 text-[11px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/70">
                {diffForFree > 0 ? (
                  <>Add <span className="text-pink-400 font-bold">৳{diffForFree}</span> for <b>FREE Delivery</b> 🚚</>
                ) : (
                  <span className="text-emerald-400 font-bold">🎉 FREE Delivery Unlocked!</span>
                )}
              </span>
              <span className="text-white/40 text-[10px]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3 text-white/50">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-2xl">
                  🛒
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Your cart is empty</p>
                  <p className="text-[11px] text-white/40 mt-0.5">Explore our summer collection</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2.5 p-2 bg-white/4 border border-white/8 rounded-xl items-center"
                >
                  <div className="w-12 h-12 relative shrink-0 bg-[#0c0a2a] rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-[11px] text-pink-400 font-bold">৳{item.price}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center bg-white/5 border border-white/10 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-1.5 py-0.2 text-xs text-white/60 hover:text-white"
                        >
                          −
                        </button>
                        <span className="px-1.5 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-1.5 py-0.2 text-xs text-white/60 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-white/30 hover:text-rose-400 transition"
                    title="Remove item"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-3.5 border-t border-white/10 bg-[#0b0a29] space-y-2.5">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-white/60 text-[11px]">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/60 text-[11px]">
                  <span>Delivery</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `৳${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-white pt-1.5 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-pink-400 text-sm font-black">৳{grandTotal}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-2 text-center border border-white/20 hover:bg-white/5 rounded-xl text-xs font-bold text-white transition"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-2 flex items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl text-xs font-bold text-white transition shadow-sm"
                >
                  Checkout <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
