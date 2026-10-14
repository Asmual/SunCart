"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FiTrash2, FiArrowRight, FiShoppingBag, FiTag, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const VALID_COUPONS = {
  SUMMER50: 0.5,
  SUN20: 0.2,
  HOT10: 0.1,
};

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    totalItems,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const discountAmount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();

    if (!cleanCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (VALID_COUPONS[cleanCode]) {
      const discount = VALID_COUPONS[cleanCode];
      setAppliedCoupon({ code: cleanCode, discount });
      toast.success(`Coupon ${cleanCode} applied! You saved ${discount * 100}% 🎉`);
    } else {
      toast.error("Invalid coupon code! Try SUMMER50 or SUN20");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast("Coupon removed", { icon: "ℹ️" });
  };

  return (
    <div className="min-h-screen bg-[#0b0a28] text-white py-6 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Compact Page Title */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black flex items-center gap-2">
              <FiShoppingBag className="text-pink-500" /> Shopping Cart
            </h1>
            <p className="text-[11px] text-white/40">
              Review your items ({totalItems} total) and proceed to checkout
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <FiTrash2 size={12} /> Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-12 text-center space-y-3">
            <p className="text-5xl">🏖️</p>
            <h2 className="text-lg font-bold text-white">Your cart is currently empty</h2>
            <p className="text-white/40 text-xs max-w-xs mx-auto">
              You haven&apos;t added any summer items to your cart yet. Explore our bestsellers today.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#ff2d6b]/30"
            >
              Browse Summer Essentials
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/4 border border-white/8 rounded-xl p-3 flex items-center gap-3 transition hover:border-white/15"
                >
                  <div className="w-16 h-16 bg-[#0c0a2a] rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-[#ff2d6b] uppercase font-bold tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-xs font-bold text-pink-400 mt-0.5">৳{item.price}</p>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-1.5 text-xs text-white/60 hover:text-white"
                      >
                        −
                      </button>
                      <span className="px-1.5 text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-1.5 text-xs text-white/60 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-white w-16 text-right">
                      ৳{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-white/40 hover:text-rose-400 transition"
                      title="Remove item"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/products"
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1 font-medium"
                >
                  ← Continue Shopping Summer Gear
                </Link>
              </div>
            </div>

            {/* Compact Order Summary Card */}
            <div className="bg-white/4 border border-white/8 rounded-2xl p-4 md:p-5 h-fit space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-white/10 pb-2.5">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-white font-medium">৳{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <FiTag size={11} /> Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-bold">-৳{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/70">
                  <span>Shipping Fee</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="h-px bg-white/10 my-1" />

                <div className="flex justify-between text-xs font-bold text-white pt-1">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-[#ff2d6b]">৳{finalTotal}</span>
                </div>
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5 pt-1 border-t border-white/5">
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. SUMMER50"
                    disabled={!!appliedCoupon}
                    className="flex-1 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white outline-none focus:border-[#ff2d6b] uppercase"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-2.5 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg text-xs font-bold transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white rounded-lg text-xs font-bold transition"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <FiCheckCircle size={10} /> {appliedCoupon.discount * 100}% discount applied!
                  </p>
                )}
              </form>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm text-xs"
              >
                Proceed to Checkout <FiArrowRight size={13} />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
