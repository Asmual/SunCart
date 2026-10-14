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
    <div className="min-h-screen bg-theme-page text-theme-main py-12 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Success Splash Card */}
        <div className="bg-theme-card border border-theme rounded-3xl p-8 md:p-12 text-center space-y-4 backdrop-blur-md relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-4xl shadow-xl shadow-emerald-500/10 animate-bounce">
            <FiCheckCircle />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-theme-main">
            Order Confirmed! 🎉
          </h1>

          <p className="text-theme-muted text-sm max-w-md mx-auto">
            Thank you for shopping with SunCart! Your summer order has been received and is currently being processed.
          </p>

          <div className="inline-block bg-theme-subtle border border-theme px-5 py-2.5 rounded-2xl text-xs font-mono font-bold text-[#ff2d6b] mt-2">
            Order ID: #{orderId}
          </div>
        </div>

        {/* Order Details / Receipt */}
        {loading ? (
          <div className="py-8 text-center text-theme-muted text-sm">
            <div className="w-8 h-8 border-4 border-[#ff2d6b] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading invoice details...
          </div>
        ) : order ? (
          <div className="bg-theme-card border border-theme rounded-3xl p-6 md:p-8 space-y-6">

            {/* Delivery Progress Bar */}
            <div className="space-y-3 border-b border-theme-subtle pb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                Delivery Status
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-pink-600/20 border border-[#ff2d6b] text-[#ff2d6b] font-bold">
                  ✓ Confirmed
                </div>
                <div className="p-2 rounded-xl bg-theme-subtle border border-theme text-theme-muted">
                  Processing
                </div>
                <div className="p-2 rounded-xl bg-theme-subtle border border-theme text-theme-muted">
                  Shipped
                </div>
                <div className="p-2 rounded-xl bg-theme-subtle border border-theme text-theme-muted">
                  Delivered
                </div>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-theme-muted border-b border-theme-subtle pb-6">
              <div>
                <p className="font-bold text-theme-main uppercase text-[10px] mb-2 tracking-wider">
                  Deliver To
                </p>
                <p className="font-bold text-sm text-theme-main">{order.customer?.name}</p>
                <p className="mt-1">{order.customer?.phone}</p>
                <p>{order.customer?.email}</p>
                <p className="mt-1 text-theme-main font-medium">{order.customer?.address}, {order.customer?.city}</p>
              </div>

              <div>
                <p className="font-bold text-theme-main uppercase text-[10px] mb-2 tracking-wider">
                  Order Info
                </p>
                <p><span className="text-theme-muted">Placed:</span> {new Date(order.createdAt).toLocaleString()}</p>
                <p><span className="text-theme-muted">Payment:</span> {order.paymentMethod}</p>
                <p className="text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                  <FiClock size={12} /> Estimated Delivery: {order.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Items Purchased List */}
            <div className="space-y-3 border-b border-theme-subtle pb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                Purchased Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-theme-subtle border border-theme rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-semibold text-theme-main">{item.name}</p>
                        <p className="text-theme-muted">Qty: {item.quantity} × ৳{item.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-theme-main">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-theme-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-theme-main font-medium">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-theme-main font-medium">{order.shippingFee === 0 ? "FREE" : `৳${order.shippingFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Discount</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-theme-main pt-2 border-t border-theme-subtle">
                <span>Grand Total</span>
                <span className="text-[#ff2d6b] text-xl">৳{order.totalAmount}</span>
              </div>
            </div>

          </div>
        ) : null}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-theme-card hover:bg-theme-subtle text-theme-main text-xs font-bold rounded-2xl transition border border-theme cursor-pointer"
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
