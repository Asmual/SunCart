export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-[#0b0b30] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-pink-500/20 border-t-[#ff2d6b] rounded-full animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-lg">☀️</span>
      </div>
      <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
        SunCart Loading...
      </p>
    </div>
  );
}
