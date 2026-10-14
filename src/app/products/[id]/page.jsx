"use client";

import { use, useEffect, useState } from "react";
import staticProducts from "@/data/products.json";
import ProductDetails from "@/components/ProductDetails";

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.product) {
            setProduct(data.product);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Falling back to static products:", err);
      }

      // Fallback to static products
      const found = staticProducts.find((item) => String(item.id) === String(id));
      setProduct(found || null);
      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-page text-theme-main flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff2d6b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-theme-muted">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-theme-page text-theme-main transition-colors duration-300">
      <ProductDetails product={product} />
    </main>
  );
}