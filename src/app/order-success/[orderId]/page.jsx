"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { FiCheckCircle, FiPackage, FiTruck, FiPrinter, FiHome, FiClock } from "react-icons/fi";

export default function OrderSuccessPage({ params }) {
  const unwrappedParams = use(params);
  const { orderId } = unwrappedParams;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.order) {
            setOrder(data.order);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Order fetch error:", err);
      }
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0d3b] text-white py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Success Splash Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-4 backdrop-blur-md relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl shadow-emerald-500/10 animate-bounce">
            <FiCheckCircle />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white">
            Order Confirmed! 🎉
          </h1>

          <p className="text-white/60 text-sm max-w-md mx-auto">
            Thank you for shopping with SunCart! Your summer order has been received and is currently being processed.
          </p>

          <div className="inline-block bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl text-xs font-mono font-bold text-pink-400 mt-2">
            Order ID: #{orderId}
          </div>
        </div>

        {/* Order Details / Receipt */}
        {loading ? (
          <div className="py-8 text-center text-white/50 text-sm">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading invoice details...
          </div>
        ) : order ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">

            {/* Delivery Progress Bar */}
            <div className="space-y-3 border-b border-white/10 pb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Delivery Status
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-pink-600/20 border border-pink-500 text-pink-300 font-bold">
                  ✓ Confirmed
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50">
                  Processing
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50">
                  Shipped
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50">
                  Delivered
                </div>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-white/70 border-b border-white/10 pb-6">
              <div>
                <p className="font-bold text-white uppercase text-[10px] mb-2 tracking-wider">
                  Deliver To
                </p>
                <p className="font-bold text-sm text-white">{order.customer?.name}</p>
                <p className="mt-1">{order.customer?.phone}</p>
                <p>{order.customer?.email}</p>
                <p className="mt-1 text-white/90 font-medium">{order.customer?.address}, {order.customer?.city}</p>
              </div>

              <div>
                <p className="font-bold text-white uppercase text-[10px] mb-2 tracking-wider">
                  Order Info
                </p>
                <p><span className="text-white/40">Placed:</span> {new Date(order.createdAt).toLocaleString()}</p>
                <p><span className="text-white/40">Payment:</span> {order.paymentMethod}</p>
                <p className="text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <FiClock size={12} /> Estimated Delivery: {order.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Items Purchased List */}
            <div className="space-y-3 border-b border-white/10 pb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Purchased Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/5 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-white/40">Qty: {item.quantity} × ৳{item.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? "FREE" : `৳${order.shippingFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>Grand Total</span>
                <span className="text-pink-400 text-xl">৳{order.totalAmount}</span>
              </div>
            </div>

          </div>
        ) : null}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-2xl transition border border-white/10"
          >
            <FiPrinter /> Print Receipt / Invoice
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-xs font-bold rounded-2xl transition shadow-lg shadow-[#ff2d6b]/30"
          >
            <FiHome /> Back to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
}
