"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  
  // Fetch session dynamic properties directly from the authentic client object context
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Navigate unauthorized sessions systematically toward login portal entrypoint
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Render a responsive global loader frame pending standard protocol processing
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-page text-theme-main transition-colors duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff2d6b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-theme-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Validate security credentials completely prior to rendering nested client trees
  return session?.user ? children : null;
};

export default ProtectedRoute;