"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiDollarSign, FiShoppingBag, FiTruck, FiBox, FiPlus, FiCheck, FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Accessories",
    price: "",
    stock: "30",
    image: "/images/sunglasses.jpg",
    description: "",
    brand: "SunCart",
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load orders
      const orderRes = await fetch("/api/orders");
      const orderData = await orderRes.json();
      if (orderData.success) {
        setOrders(orderData.orders || []);
      }

      // Load products
      const prodRes = await fetch("/api/products");
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order #${orderId} marked as ${newStatus}!`);
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Order status update exception:", err);
      toast.error("Network error while updating status.");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      toast.error("Please provide name and price.");
      return;
    }

    setSubmittingProduct(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("New product published to store! 🌟");
        setShowAddModal(false);
        setProductForm({
          name: "",
          category: "Accessories",
          price: "",
          stock: "30",
          image: "/images/sunglasses.jpg",
          description: "",
          brand: "SunCart",
        });
        loadData();
      } else {
        toast.error(data.error || "Failed to add product.");
      }
    } catch (err) {
      console.error("Add product error:", err);
      toast.error("Network error adding product.");
    } finally {
      setSubmittingProduct(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="min-h-screen bg-[#0a082b] text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dashboard Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase">
                Admin Console
              </span>
              <span className="text-white/40 text-xs">Live Database Management</span>
            </div>
            <h1 className="text-3xl font-black text-white mt-1">SunCart Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition"
              title="Refresh dataset"
            >
              <FiRefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-xs font-bold rounded-xl transition shadow-lg shadow-[#ff2d6b]/30 flex items-center gap-1.5"
            >
              <FiPlus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 text-xl">
              <FiDollarSign />
            </div>
            <p className="text-xs text-white/50 uppercase font-semibold">Total Revenue</p>
            <p className="text-2xl font-black text-white mt-1">৳{totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 text-xl">
              <FiShoppingBag />
            </div>
            <p className="text-xs text-white/50 uppercase font-semibold">Total Orders</p>
            <p className="text-2xl font-black text-white mt-1">{orders.length}</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4 text-xl">
              <FiTruck />
            </div>
            <p className="text-xs text-white/50 uppercase font-semibold">Pending Deliveries</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{pendingOrders}</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 text-xl">
              <FiBox />
            </div>
            <p className="text-xs text-white/50 uppercase font-semibold">Active Products</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{products.length}</p>
          </div>
        </div>

        {/* Orders Management Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiShoppingBag className="text-pink-500" /> Customer Orders Management
            </h2>
            <span className="text-xs text-white/40">{orders.length} total orders recorded</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-white/40 text-xs">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading database records...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-xs">
              No orders placed yet in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((ord) => (
                    <tr key={ord.orderId || ord._id} className="hover:bg-white/3 transition">
                      <td className="py-3 px-4 font-mono font-bold text-pink-400">
                        #{ord.orderId}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{ord.customer?.name}</p>
                        <p className="text-white/40 text-[11px]">{ord.customer?.phone}</p>
                        <p className="text-white/40 text-[10px] truncate max-w-xs">{ord.customer?.address}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/80">{ord.items?.length || 0} product(s)</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        ৳{ord.totalAmount}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/70">{ord.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.status || "Pending"}
                          onChange={(e) => handleUpdateStatus(ord.orderId, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-[#0b0b30] border border-white/20 text-white font-medium text-xs outline-none focus:border-pink-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add New Product */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0f0d3b] border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">Add New Summer Product</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <div>
                  <label className="text-white/60 block mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. UV Beach Sunscreen"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff2d6b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 font-semibold">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0b0b30] border border-white/10 rounded-xl text-white outline-none focus:border-[#ff2d6b]"
                    >
                      <option value="Accessories">Accessories</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Bag">Bag</option>
                      <option value="Skincare">Skincare</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 font-semibold">Price (৳) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. 850"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff2d6b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 block mb-1 font-semibold">Stock Quantity</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff2d6b]"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 block mb-1 font-semibold">Brand</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff2d6b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/60 block mb-1 font-semibold">Image URL or Path</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff2d6b]"
                  />
                </div>

                <div>
                  <label className="text-white/60 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Short product overview..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#ff2d6b]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProduct}
                    className="flex-1 py-2.5 bg-[#ff2d6b] hover:bg-[#e0255e] text-white rounded-xl font-bold transition shadow-lg shadow-[#ff2d6b]/30"
                  >
                    {submittingProduct ? "Saving..." : "Publish Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
