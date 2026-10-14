"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { authClient } from "@/lib/auth-client";
import { FiCheckCircle, FiTruck, FiDollarSign, FiCreditCard, FiLock, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    district: "Dhaka",
    notes: "",
  });

  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [trxId, setTrxId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pre-populate if user is logged in
  useEffect(() => {
    async function loadUser() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          const u = session.data.user;
          setForm((prev) => ({
            ...prev,
            name: u.name || prev.name,
            email: u.email || prev.email,
          }));
        }
      } catch (err) {
        console.warn("Could not retrieve session:", err);
      }
    }
    loadUser();
  }, []);

  const shippingCost = deliveryType === "express" ? 120 : subtotal >= 1000 || subtotal === 0 ? 0 : 60;
  const finalTotal = subtotal + shippingCost;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all required shipping fields!");
      return;
    }

    if (paymentMethod === "bKash / Nagad" && !trxId.trim()) {
      toast.error("Please enter your bKash / Nagad Transaction ID (TrxID)!");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Processing your order...");

    try {
      const payload = {
        customer: {
          ...form,
          trxId: trxId || undefined,
        },
        items: cart,
        paymentMethod,
        subtotal,
        shippingFee: shippingCost,
        totalAmount: finalTotal,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.orderId) {
        clearCart();
        toast.success("Order placed successfully! 🎉", { id: toastId });
        router.push(`/order-success/${data.orderId}`);
      } else {
        toast.error(data.error || "Order placement failed.", { id: toastId });
        setSubmitting(false);
      }
    } catch (err) {
      console.error("Order submit exception:", err);
      toast.error("Network error while submitting order.", { id: toastId });
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-theme-page text-theme-main flex items-center justify-center p-6 transition-colors duration-300">
        <div className="text-center space-y-4 max-w-md bg-theme-card border border-theme p-10 rounded-3xl">
          <p className="text-6xl">🛒</p>
          <h2 className="text-2xl font-bold text-theme-main">Your cart is empty</h2>
          <p className="text-sm text-theme-muted">Add some products before proceeding to checkout.</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-[#ff2d6b] text-white font-bold rounded-full text-xs hover:bg-[#e0255e] transition shadow-md shadow-[#ff2d6b]/30"
          >
            ← Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-page text-theme-main py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-theme-subtle pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-theme-main flex items-center gap-3">
              <FiCheckCircle className="text-[#ff2d6b]" /> Secure Checkout
            </h1>
            <p className="text-xs text-theme-muted mt-1">
              Enter your shipping information and choose payment method
            </p>
          </div>

          <Link
            href="/cart"
            className="text-xs text-theme-muted hover:text-theme-main flex items-center gap-1.5 bg-theme-card border border-theme px-4 py-2 rounded-full transition"
          >
            <FiArrowLeft size={13} /> Back to Cart
          </Link>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Customer Shipping Details */}
            <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 space-y-5">
              <h2 className="text-lg font-bold text-theme-main flex items-center gap-2 border-b border-theme-subtle pb-3">
                <span className="w-6 h-6 rounded-full bg-[#ff2d6b] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-theme-muted font-semibold block mb-1.5">
                    Full Name <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Asmual Obaidul Hoque"
                    className="w-full px-4 py-3 bg-theme-input border border-theme rounded-xl text-sm text-theme-main outline-none focus:border-[#ff2d6b]"
                  />
                </div>

                <div>
                  <label className="text-xs text-theme-muted font-semibold block mb-1.5">
                    Phone Number <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-4 py-3 bg-theme-input border border-theme rounded-xl text-sm text-theme-main outline-none focus:border-[#ff2d6b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-theme-muted font-semibold block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-theme-input border border-theme rounded-xl text-sm text-theme-main outline-none focus:border-[#ff2d6b]"
                  />
                </div>

                <div>
                  <label className="text-xs text-theme-muted font-semibold block mb-1.5">
                    City / District <span className="text-pink-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-theme-input border border-theme rounded-xl text-sm text-theme-main outline-none focus:border-[#ff2d6b]"
                  >
                    <option value="Dhaka">Dhaka Division</option>
                    <option value="Chittagong">Chittagong Division</option>
                    <option value="Sylhet">Sylhet Division</option>
                    <option value="Rajshahi">Rajshahi Division</option>
                    <option value="Khulna">Khulna Division</option>
                    <option value="Barisal">Barisal Division</option>
                    <option value="Rangpur">Rangpur Division</option>
                    <option value="Mymensingh">Mymensingh Division</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-theme-muted font-semibold block mb-1.5">
                  Complete Delivery Address <span className="text-pink-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House/Apartment #, Road #, Area / Thana, Post Code"
                  className="w-full px-4 py-3 bg-theme-input border border-theme rounded-xl text-sm text-theme-main outline-none focus:border-[#ff2d6b]"
                />
              </div>

              <div>
                <label className="text-xs text-theme-muted font-semibold block mb-1.5">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="e.g. Call before delivery, deliver in afternoon"
                  className="w-full px-4 py-2.5 bg-theme-input border border-theme rounded-xl text-xs text-theme-main outline-none focus:border-[#ff2d6b]"
                />
              </div>
            </div>

            {/* 2. Delivery Options */}
            <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 space-y-4">
              <h2 className="text-lg font-bold text-theme-main flex items-center gap-2 border-b border-theme-subtle pb-3">
                <span className="w-6 h-6 rounded-full bg-[#ff2d6b] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Delivery Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setDeliveryType("standard")}
                  className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition ${
                    deliveryType === "standard"
                      ? "border-[#ff2d6b] bg-[#ff2d6b]/10"
                      : "border-theme bg-theme-subtle hover:border-pink-500/30"
                  }`}
                >
                  <FiTruck className="text-2xl text-pink-500" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-theme-main">Standard Delivery</p>
                    <p className="text-xs text-theme-muted">2-3 Business Days</p>
                  </div>
                  <span className="text-xs font-bold text-theme-main">
                    {subtotal >= 1000 ? <span className="text-emerald-500">FREE</span> : "৳60"}
                  </span>
                </label>

                <label
                  onClick={() => setDeliveryType("express")}
                  className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition ${
                    deliveryType === "express"
                      ? "border-[#ff2d6b] bg-[#ff2d6b]/10"
                      : "border-theme bg-theme-subtle hover:border-pink-500/30"
                  }`}
                >
                  <FiTruck className="text-2xl text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-theme-main">Express Delivery</p>
                    <p className="text-xs text-theme-muted">Within 24 Hours</p>
                  </div>
                  <span className="text-xs font-bold text-theme-main">৳120</span>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 space-y-4">
              <h2 className="text-lg font-bold text-theme-main flex items-center gap-2 border-b border-theme-subtle pb-3">
                <span className="w-6 h-6 rounded-full bg-[#ff2d6b] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Payment Options
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer transition ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-[#ff2d6b] bg-[#ff2d6b]/10"
                      : "border-theme bg-theme-subtle hover:border-pink-500/30"
                  }`}
                >
                  <FiDollarSign className="text-2xl text-emerald-500" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-theme-main">Cash on Delivery (COD)</p>
                    <p className="text-xs text-theme-muted">Pay cash in hand when your parcel arrives</p>
                  </div>
                  <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    Recommended
                  </span>
                </label>

                <label
                  onClick={() => setPaymentMethod("bKash / Nagad")}
                  className={`p-4 rounded-2xl border flex flex-col gap-3 cursor-pointer transition ${
                    paymentMethod === "bKash / Nagad"
                      ? "border-[#ff2d6b] bg-[#ff2d6b]/10"
                      : "border-theme bg-theme-subtle hover:border-pink-500/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <FiCreditCard className="text-2xl text-[#ff2d6b]" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-theme-main">bKash / Nagad Mobile Banking</p>
                      <p className="text-xs text-theme-muted">Instant digital wallet payment</p>
                    </div>
                  </div>

                  {paymentMethod === "bKash / Nagad" && (
                    <div className="pt-3 border-t border-theme-subtle text-xs space-y-2 text-theme-main">
                      <p>
                        📱 Please send <b>৳{finalTotal}</b> (Send Money) to Merchant Number:{" "}
                        <span className="text-[#ff2d6b] font-mono font-bold">01700-000000</span>
                      </p>
                      <div>
                        <label className="text-[11px] text-theme-muted block mb-1">
                          Enter bKash / Nagad TrxID:
                        </label>
                        <input
                          type="text"
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="e.g. 9B8X281Z"
                          className="w-full px-3 py-2 bg-theme-input border border-theme rounded-xl text-theme-main font-mono uppercase outline-none focus:border-[#ff2d6b]"
                        />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Review Sidebar */}
          <div className="space-y-6">
            <div className="bg-theme-card border border-theme rounded-3xl p-6 sticky top-24 space-y-5">
              <h2 className="text-base font-bold text-theme-main border-b border-theme-subtle pb-3">
                Order Review ({cart.length} items)
              </h2>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="w-12 h-12 bg-theme-subtle border border-theme rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-theme-main font-medium truncate">{item.name}</p>
                      <p className="text-theme-muted">
                        Qty: {item.quantity} × ৳{item.price}
                      </p>
                    </div>
                    <span className="font-bold text-theme-main">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-theme-subtle">
                <div className="flex justify-between text-theme-muted">
                  <span>Subtotal</span>
                  <span className="text-theme-main font-medium">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-theme-muted">
                  <span>Shipping Fee</span>
                  <span className="text-theme-main font-medium">
                    {shippingCost === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `৳${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-theme-main pt-2 border-t border-theme-subtle">
                  <span>Total Amount</span>
                  <span className="text-[#ff2d6b] text-xl font-black">৳{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-lg shadow-pink-600/30 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FiLock size={15} /> Confirm & Place Order (৳{finalTotal})
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-theme-muted space-y-1">
                <p>By placing order you agree to SunCart Terms of Service.</p>
                <p className="text-emerald-500 font-medium">✓ Guaranteed Safe & Fast Delivery</p>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
