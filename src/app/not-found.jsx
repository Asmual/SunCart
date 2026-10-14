import Link from "next/link";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-theme-page text-theme-main flex items-center justify-center px-4 py-16 transition-colors duration-300">
      <div className="text-center max-w-md bg-theme-card border border-theme rounded-3xl p-10 space-y-5">
        <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-amber-400">
          404
        </p>
        <h1 className="text-2xl font-bold text-theme-main">Oops! Summer Page Not Found</h1>
        <p className="text-theme-muted text-sm">
          The page or product you were looking for seems to have drifted away in the summer breeze.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ff2d6b] hover:bg-[#e0255e] text-white text-xs font-bold rounded-2xl transition shadow-lg shadow-[#ff2d6b]/30"
          >
            <FiHome /> Back to Home
          </Link>
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-theme-subtle hover:bg-theme-card border border-theme text-theme-main text-xs font-bold rounded-2xl transition"
          >
            Explore Summer Store
          </Link>
        </div>
      </div>
    </div>
  );
}
