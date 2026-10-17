# ☀️ SunCart — ummer Essentials & Lifestyle Store

> A modern, full-stack eCommerce platform where users can explore and purchase seasonal products like sunglasses, summer outfits, skincare, beach accessories, and footwear.

---

## 🌐 Live Site & Repository

* 🔗 **Live Site:** [https://assignment-8-woad-three.vercel.app/](https://assignment-8-woad-three.vercel.app/)
* 📦 **GitHub:** [https://github.com/Asmual/Assignment-8](https://github.com/Asmual/Assignment-8)

---

## 🛠️ Full-Stack Architecture

| Technology | Purpose |
|---|---|
| ⚡ **Next.js 16 (App Router)** | Full-stack React Framework (Server & Client Components) |
| ⚛️ **React 19** | Dynamic modern UI rendering |
| 🎨 **Tailwind CSS v4 & DaisyUI v5** | Contemporary Dark Mode styling & micro-animations |
| 🔐 **BetterAuth** | Secure Authentication (Credentials + Google OAuth) |
| 🍃 **MongoDB & Connection Pooling** | Persistent storage for users, products, reviews, and orders |
| 🛒 **Cart & Wishlist Contexts** | Reactive global state synchronized with LocalStorage |
| 🖼️ **Next/Image & ImgBB Proxy** | Optimized image rendering and server-side asset uploading |
| 🍞 **React Hot Toast** | Real-time user feedback notifications |

---

## ✨ Enterprise & Professional Features

### 🛒 1. Complete Cart & Wishlist System
* **Global Cart Context:** Add to cart with custom quantity from Home, Collection, and Product Details.
* **Slide-over Cart Drawer:** Instant preview drawer with item quantity modifiers (+ / -), item removal, and subtotal.
* **Free Delivery Tracker:** Dynamic progress indicator showing remaining amount needed for Free Shipping.
* **Persistent State:** Synchronized across browser tabs and refreshed sessions using LocalStorage.
* **Wishlist Page (`/wishlist`):** Bookmark favorite summer items, move them to cart with 1 click.

### 🛍️ 2. Dynamic MongoDB Catalog & Search Engine
* **REST APIs:** `/api/products` and `/api/products/[id]` with full-text search, category filtering, and sorting.
* **Auto-Seeding:** Automatically seeds summer essentials database if empty on initial launch.
* **Live Filter Suite:**
  * Real-time search query box.
  * Category pill filters (`Accessories`, `Shoes`, `Bag`, `Skincare`).
  * Price range slider (৳300 to ৳2000).
  * Sort dropdown (Featured, Price: Low-to-High, Price: High-to-Low, Rating).
  * In-stock toggle and reset filters button.

### 📦 3. Checkout, Coupons & Live Order Tracking
* **Coupon Code Engine:** Apply promo codes (`SUMMER50` for 50% OFF, `SUN20` for 20% OFF).
* **Multi-Method Checkout:**
  * Standard Delivery (2-3 days) & Express 24-Hour Delivery.
  * Cash on Delivery (COD) & bKash / Nagad Mobile Banking with TrxID verification.
* **Order Placement (`/api/orders`):** Generates unique order reference (e.g. `#SC-58392`) and automatically decrements stock.
* **Confirmation Receipt (`/order-success/[orderId]`):** Downloadable and printable invoice receipt.
* **Live Order Tracking (`/track-order`):** Public tracking stepper (`Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered`).

### 👑 4. Admin Management Dashboard (`/admin`)
* **Store Analytics:** Total Revenue, Order Volume, Active Products, and Pending Deliveries.
* **Status Controls:** Update live customer order status directly via MongoDB `PATCH` API.
* **Product Publisher:** Add new seasonal products directly with instant store sync.

### 👤 5. User Profile & Order History (`/my-profile`)
* **Secure Profile Management:** Update name, contact phone, and avatar via server-side ImgBB upload proxy.
* **My Orders Tab:** Authenticated customers can view their personal past orders and track parcels.

---

## 📋 Route Map

| Route | Access | Description |
|---|---|---|
| `/` | Public | Hero showcase, popular products, seasonal tips, and brands |
| `/products` | Public | Full collection with live search, filters, and sorting |
| `/products/[id]` | Public | Comprehensive product details, customer reviews & related items |
| `/cart` | Public | Full cart page with coupon discount calculation |
| `/wishlist` | Public | Saved items bookmarks |
| `/checkout` | Public / Auth | Shipping details and payment gateway |
| `/order-success/[id]`| Public | Order receipt and printable invoice |
| `/track-order` | Public | Real-time shipment status lookup |
| `/admin` | Admin | Store metrics, order processing, and product creation |
| `/my-profile` | Protected | User account details and order history |
| `/login` & `/register` | Public | Authentication portals |

---

## 👨‍💻 Author
* 👤 **Name:** Asmual Obaidul Hoque
* 📧 **Email:** Asmual01@gmail.com
