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
        <div className="w-screen max-w-sm bg-theme-card-solid border-l border-theme text-theme-main flex flex-col shadow-2xl transition-colors duration-300">

          {/* Drawer Header */}
          <div className="p-3.5 border-b border-theme-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-pink-500 text-base" />
              <h2 className="text-sm font-bold text-theme-main">Shopping Cart</h2>
              <span className="text-[10px] bg-pink-500/20 text-pink-500 font-bold px-1.5 py-0.2 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-theme-muted hover:text-theme-main rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-3.5 py-2 bg-theme-subtle border-b border-theme-subtle text-[11px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-theme-muted">
                {diffForFree > 0 ? (
                  <>Add <span className="text-pink-500 font-bold">৳{diffForFree}</span> for <b>FREE Delivery</b> 🚚</>
                ) : (
                  <span className="text-emerald-500 font-bold">🎉 FREE Delivery Unlocked!</span>
                )}
              </span>
              <span className="text-theme-dim text-[10px]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-theme-input rounded-full overflow-hidden border border-theme-subtle">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3 text-theme-dim">
                <div className="w-14 h-14 rounded-full bg-theme-subtle flex items-center justify-center text-2xl">
                  🛒
                </div>
                <div>
                  <p className="text-sm font-bold text-theme-main">Your cart is empty</p>
                  <p className="text-[11px] text-theme-dim mt-0.5">Explore our summer collection</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2.5 p-2 bg-theme-card border border-theme rounded-xl items-center"
                >
                  <div className="w-12 h-12 relative shrink-0 bg-theme-subtle rounded-lg overflow-hidden flex items-center justify-center p-0.5 border border-theme-subtle">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/bottle.jpg";
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-theme-main truncate">{item.name}</h3>
                    <p className="text-[11px] text-pink-500 font-bold">৳{item.price}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center bg-theme-input border border-theme rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-1.5 py-0.2 text-xs text-theme-muted hover:text-theme-main cursor-pointer"
                        >
                          −
                        </button>
                        <span className="px-1.5 text-xs font-bold text-theme-main">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-1.5 py-0.2 text-xs text-theme-muted hover:text-theme-main cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[10px] text-theme-dim font-mono">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-theme-dim hover:text-rose-500 transition cursor-pointer"
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
            <div className="p-3.5 border-t border-theme-subtle bg-theme-subtle space-y-2.5">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-theme-muted text-[11px]">
                  <span>Subtotal</span>
                  <span className="text-theme-main font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-theme-muted text-[11px]">
                  <span>Delivery</span>
                  <span className="text-theme-main font-medium">
                    {shippingFee === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `৳${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-theme-main pt-1.5 border-t border-theme-subtle">
                  <span>Total</span>
                  <span className="text-pink-500 text-sm font-black">৳{grandTotal}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 py-2 text-center border border-theme hover:border-[#ff2d6b]/40 rounded-xl text-xs font-bold text-theme-main hover:bg-black/5 dark:hover:bg-white/5 transition"
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
