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
    <div className="min-h-screen bg-[#0f0d3b] text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <FiShoppingBag className="text-pink-500" /> Shopping Cart
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Review your items and proceed to checkout
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition"
            >
              <FiTrash2 size={13} /> Clear Entire Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/3 border border-white/10 rounded-3xl p-16 text-center space-y-4">
            <p className="text-7xl">🏖️</p>
            <h2 className="text-2xl font-bold text-white">Your cart is currently empty!</h2>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              You haven&apos;t added any summer items to your cart yet. Explore our bestsellers today.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-[#ff2d6b] hover:bg-[#e0255e] text-white font-bold rounded-full transition shadow-lg shadow-[#ff2d6b]/30"
            >
              Browse Summer Essentials
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 flex items-center gap-4 transition hover:border-white/20"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#ff2d6b] uppercase font-bold tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white truncate">{item.name}</h3>
                    <p className="text-sm font-semibold text-pink-400 mt-1">৳{item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 text-sm text-white/60 hover:text-white"
                      >
                        −
                      </button>
                      <span className="px-2 text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 text-sm text-white/60 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <span className="hidden sm:inline text-sm font-bold text-white w-20 text-right">
                      ৳{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-white/40 hover:text-rose-400 transition"
                      title="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/products"
                  className="text-xs text-white/60 hover:text-white flex items-center gap-1 font-semibold"
                >
                  ← Continue Shopping Summer Gear
                </Link>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-white font-medium">৳{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <FiTag size={13} /> Discount ({appliedCoupon.code})
                    </span>
                    <span className="font-bold">-৳{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-white/70">
                  <span>Standard Shipping</span>
                  <span className="text-white font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="h-px bg-white/10 my-2" />

                <div className="flex justify-between text-base font-bold text-white pt-1">
                  <span>Total Payable</span>
                  <span className="text-2xl font-black text-[#ff2d6b]">৳{finalTotal}</span>
                </div>
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
                <label className="text-xs text-white/60 font-semibold block">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. SUMMER50"
                    disabled={!!appliedCoupon}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#ff2d6b] uppercase"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-3 py-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-xl text-xs font-bold transition"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#ff2d6b] hover:bg-[#e0255e] text-white rounded-xl text-xs font-bold transition"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <FiCheckCircle size={12} /> {appliedCoupon.discount * 100}% discount applied to order!
                  </p>
                )}
                <p className="text-[10px] text-white/30">Available coupon: SUMMER50 (50% OFF) or SUN20</p>
              </form>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-pink-600/30 hover:-translate-y-0.5 text-sm"
              >
                Proceed to Checkout <FiArrowRight />
              </Link>

              <div className="text-center text-[11px] text-white/40 space-y-1">
                <p>🔒 256-Bit SSL Encrypted & Secure Checkout</p>
                <p>🚚 Cash on Delivery & bKash available</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
