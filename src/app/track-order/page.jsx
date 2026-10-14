"use client";

import { useState } from "react";
import Link from "next/link";
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

export default function TrackOrderPage() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim();

    if (!cleanId) {
      toast.error("Please enter a valid Order ID");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/${cleanId}`);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        toast.error("No order found with this ID.");
      }
    } catch (err) {
      console.error("Track order error:", err);
      toast.error("Network error while searching for order.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 1;
      case "confirmed":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 1;

  return (
    <div className="min-h-screen bg-[#0f0d3b] text-white py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Title */}
        <div className="text-center space-y-3">
          <p className="text-[#ff2d6b] font-bold uppercase tracking-widest text-xs">
            Live Delivery Tracking
          </p>
          <h1 className="text-3xl md:text-4xl font-black">
            Track Your <span className="text-[#ff2d6b]">Order</span>
          </h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Enter your SunCart Order ID (e.g. SC-12345) to view real-time delivery status and updates.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 p-2 md:p-3 rounded-2xl backdrop-blur-md">
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Enter Order ID (e.g. SC-58392)"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-[#ff2d6b] uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-xs font-bold rounded-xl transition shadow-lg shadow-[#ff2d6b]/30 shrink-0 flex items-center gap-2"
            >
              {loading ? "Searching..." : "Track Order"}
            </button>
          </form>
        </div>

        {/* Order Details Result */}
        {searched && (
          loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/50 text-xs">Fetching real-time shipment status...</p>
            </div>
          ) : order ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md">

              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xl font-bold text-pink-400">
                      #{order.orderId}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">
                      ● {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <p className="text-white/50">Estimated Arrival:</p>
                  <p className="text-white font-bold text-sm text-emerald-400">
                    {order.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Shipment Progression
                </h3>

                <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
                  {/* Step 1 */}
                  <div className={`p-4 rounded-2xl border transition ${
                    currentStep >= 1 ? "bg-pink-600/20 border-pink-500" : "bg-white/3 border-white/5 opacity-50"
                  }`}>
                    <FiClock className="mx-auto text-xl mb-1 text-pink-400" />
                    <p className="text-xs font-bold text-white">Order Placed</p>
                    <p className="text-[10px] text-white/40">Received in system</p>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-4 rounded-2xl border transition ${
                    currentStep >= 2 ? "bg-pink-600/20 border-pink-500" : "bg-white/3 border-white/5 opacity-50"
                  }`}>
                    <FiCheckCircle className="mx-auto text-xl mb-1 text-pink-400" />
                    <p className="text-xs font-bold text-white">Confirmed</p>
                    <p className="text-[10px] text-white/40">Verified & packed</p>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-4 rounded-2xl border transition ${
                    currentStep >= 3 ? "bg-pink-600/20 border-pink-500" : "bg-white/3 border-white/5 opacity-50"
                  }`}>
                    <FiTruck className="mx-auto text-xl mb-1 text-pink-400" />
                    <p className="text-xs font-bold text-white">On the Way</p>
                    <p className="text-[10px] text-white/40">Courier transit</p>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-4 rounded-2xl border transition ${
                    currentStep >= 4 ? "bg-emerald-600/20 border-emerald-500" : "bg-white/3 border-white/5 opacity-50"
                  }`}>
                    <FiPackage className="mx-auto text-xl mb-1 text-emerald-400" />
                    <p className="text-xs font-bold text-white">Delivered</p>
                    <p className="text-[10px] text-white/40">At your doorstep</p>
                  </div>
                </div>
              </div>

              {/* Order Info & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-white uppercase text-[10px] text-white/40 mb-2">
                    Delivery Address
                  </p>
                  <p className="font-bold text-sm text-white flex items-center gap-1.5">
                    <FiMapPin className="text-pink-400" /> {order.customer?.name}
                  </p>
                  <p className="text-white/70">{order.customer?.address}</p>
                  <p className="text-white/70">{order.customer?.city}, Bangladesh</p>
                  <p className="text-white/50">Phone: {order.customer?.phone}</p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-white uppercase text-[10px] text-white/40 mb-2">
                    Package Items ({order.items?.length || 0})
                  </p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-white/80">
                        <span className="truncate max-w-[200px]">{item.name} × {item.quantity}</span>
                        <span className="font-semibold text-white">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                    <span>Total Payable:</span>
                    <span className="text-pink-400">৳{order.totalAmount} ({order.paymentMethod})</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white/3 border border-white/10 rounded-3xl p-12 text-center space-y-3">
              <p className="text-5xl">📦</p>
              <h3 className="text-xl font-bold text-white">Order Not Found</h3>
              <p className="text-white/40 text-xs max-w-sm mx-auto">
                We couldn&apos;t find an order with ID &quot;{orderIdInput}&quot;. Please double check the order number sent to your email or receipt.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}
