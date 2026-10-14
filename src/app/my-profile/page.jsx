"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FiLock, FiCamera, FiCheck, FiEdit2, FiShoppingBag, FiUser, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MyProfile() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Authentication and core data states
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Core profile fields state (Original Data from DB)
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    image: "",
  });

  // Fields currently being edited
  const [editFields, setEditFields] = useState({
    name: "",
    phone: "",
    image: "",
  });

  // Toggles to activate input fields
  const [editStates, setEditStates] = useState({
    name: false,
    phone: false,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        const currentUser = sessionData?.data?.user || sessionData?.user;

        if (!currentUser) {
          router.push("/login");
        } else {
          setSession(currentUser);
          const initialData = {
            name: currentUser.name || "Not Provided",
            phone: currentUser.phone || "Not Provided",
            image: currentUser.image || "",
          };
          setProfileData(initialData);
          setEditFields({
            name: currentUser.name || "",
            phone: currentUser.phone || "",
            image: currentUser.image || "",
          });
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // Fetch user orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && session?.email) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const res = await fetch(`/api/orders?email=${encodeURIComponent(session.email)}`);
          const data = await res.json();
          if (data.success) {
            setUserOrders(data.orders || []);
          }
        } catch (err) {
          console.error("Failed to fetch user orders:", err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, session]);

  // Handle local image selection and host through secure server proxy
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Uploading image...");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success && data.url) {
        setEditFields((prev) => ({ ...prev, image: data.url }));
        toast.success("Image uploaded! Click 'Save Changes' to apply.", { id: toastId });
      } else {
        toast.error(data.error || "Image upload failed.", { id: toastId });
      }
    } catch (error) {
      console.error("Image upload exception:", error);
      toast.error("Network error during image upload.", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  // Persist all edits onto MongoDB
  const handleSaveChanges = async () => {
    if (!session?.email) return;
    setUpdating(true);
    const toastId = toast.loading("Saving profile updates...");

    try {
      const response = await fetch("/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.email,
          name: editFields.name,
          phone: editFields.phone,
          image: editFields.image,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setProfileData({
          name: editFields.name || "Not Provided",
          phone: editFields.phone || "Not Provided",
          image: editFields.image,
        });
        setEditStates({ name: false, phone: false });
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        toast.error(data.error || "Profile update failed.", { id: toastId });
      }
    } catch (error) {
      console.error("Profile sync failure:", error);
      toast.error("Failed to save changes. Please try again.", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-page text-theme-main transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-[#ff2d6b] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-page text-theme-main py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-3 bg-theme-card border border-theme p-1.5 rounded-2xl max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "profile"
                ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <FiUser /> Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "orders"
                ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <FiShoppingBag /> My Orders
          </button>
        </div>

        {activeTab === "profile" ? (
          <div className="w-full max-w-2xl mx-auto bg-theme-card border border-theme rounded-3xl p-8 shadow-2xl space-y-8">
            <h2 className="text-3xl font-extrabold tracking-wide text-center bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              My Account Profile
            </h2>

            {/* Profile Image Workspace Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group w-32 h-32 rounded-full border-4 border-[#ff2d6b]/40 overflow-hidden shadow-xl bg-theme-subtle">
                {editFields.image ? (
                  <img
                    src={editFields.image}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-pink-400">
                    {editFields.name ? editFields.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                {/* Upload Overlay Trigger */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
                  title="Change avatar"
                >
                  {uploadingImage ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCamera className="text-white text-2xl" />
                  )}
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <p className="text-xs text-gray-400">Hover and click avatar to change photo</p>
            </div>

            {/* Editable Fields Grid */}
            <div className="space-y-5">
              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-theme-muted uppercase">
                  Full Name
                </label>
                <div className="relative flex items-center bg-theme-input rounded-xl border border-theme px-4 py-3">
                  {editStates.name ? (
                    <input
                      type="text"
                      value={editFields.name}
                      onChange={(e) => setEditFields((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-transparent outline-none pr-16 text-white text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">{profileData.name}</span>
                  )}

                  <div className="absolute right-4">
                    <button
                      onClick={() => setEditStates((prev) => ({ ...prev, name: !prev.name }))}
                      className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                    >
                      {editStates.name ? <><FiCheck /> Done</> : <><FiEdit2 /> Edit</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-theme-muted uppercase">
                  Phone Number
                </label>
                <div className="relative flex items-center bg-theme-input rounded-xl border border-theme px-4 py-3">
                  {editStates.phone ? (
                    <input
                      type="text"
                      value={editFields.phone}
                      onChange={(e) => setEditFields((prev) => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-transparent outline-none pr-16 text-white text-sm"
                      placeholder="+8801XXXXXXXXX"
                    />
                  ) : (
                    <span className="text-white font-medium text-sm">{profileData.phone}</span>
                  )}

                  <div className="absolute right-4">
                    <button
                      onClick={() => setEditStates((prev) => ({ ...prev, phone: !prev.phone }))}
                      className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                    >
                      {editStates.phone ? <><FiCheck /> Done</> : <><FiEdit2 /> Edit</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Address (Immutable) */}
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold tracking-wider text-theme-muted uppercase">
                  Email Address
                </label>
                <div className="flex items-center justify-between bg-theme-subtle rounded-xl border border-theme px-4 py-3 cursor-not-allowed select-none opacity-60">
                  <span className="text-theme-muted font-medium text-sm">{session?.email}</span>
                  <FiLock size={15} className="text-theme-muted" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                onClick={handleSaveChanges}
                disabled={updating || uploadingImage}
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold tracking-wide rounded-xl transition-all duration-300 shadow-lg shadow-pink-600/30 disabled:cursor-not-allowed"
              >
                {updating ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          /* User Orders Tab */
          <div className="w-full bg-theme-card border border-theme rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-theme-main flex items-center gap-2">
              <FiShoppingBag className="text-[#ff2d6b]" /> My Orders History
            </h2>

            {ordersLoading ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="text-center py-12 text-white/50 space-y-4">
                <p className="text-5xl">🛍️</p>
                <p className="text-lg text-white/70">No orders placed yet!</p>
                <p className="text-sm text-white/40">Explore our summer collection and find your favorites.</p>
                <Link
                  href="/products"
                  className="inline-block mt-2 px-6 py-2.5 rounded-full bg-pink-600 text-white text-sm font-bold hover:bg-pink-500 transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order.orderId || order._id}
                    className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-pink-400">#{order.orderId}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 uppercase font-semibold">
                          {order.status || "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-white/80 mt-2">
                        {order.items?.length || 0} item(s) • Total:{" "}
                        <span className="text-pink-400 font-bold">৳{order.totalAmount}</span>
                      </p>
                    </div>

                    <Link
                      href={`/order-success/${order.orderId}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white text-center transition-all"
                    >
                      View Receipt & Track
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}