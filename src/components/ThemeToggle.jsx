"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative p-2 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer shadow-sm ${
        isDark
          ? "border-white/15 text-amber-400 hover:text-amber-300 hover:bg-white/10 bg-white/5"
          : "border-slate-300 text-indigo-600 hover:text-indigo-700 hover:bg-slate-100 bg-white"
      }`}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <FiSun className="transition-transform duration-300 hover:rotate-45" size={18} />
      ) : (
        <FiMoon className="transition-transform duration-300 hover:-rotate-12" size={18} />
      )}
    </button>
  );
}
