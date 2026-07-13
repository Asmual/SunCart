"use client";

import { use } from "react";
import products from "@/data/products.json";
import ProductDetails from "@/components/ProductDetails";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page({ params }) {
  // Unwrap the async params wrapper safely in client environment
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  // Resolve target resource configuration criteria matching execution loop
  const product = products.find(
    (item) => item.id === Number(id)
  );

  return (
    <ProtectedRoute>
      {/* Target product context presentation layer interface framework */}
      <div>
        <ProductDetails product={product} />
      </div>
    </ProtectedRoute>
  );
}