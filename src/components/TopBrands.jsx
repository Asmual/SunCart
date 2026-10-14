/* eslint-disable @next/next/no-img-element */
const brands = [
  { id: 1, name: "Aarong", category: "Fashion & Lifestyle", badge: "Popular", image: "/images/brands/aarong.png" },
  { id: 2, name: "Bata", category: "Footwear", badge: "Top Seller", image: "/images/brands/bata.png" },
  { id: 3, name: "Sailor", category: "Clothing", badge: "New Arrival", image: "/images/brands/sailor.png" },
  { id: 4, name: "Apex", category: "Footwear", badge: "Popular", image: "/images/brands/apex.png" },
];

const TopBrands = () => {
  // Double list for seamless marquee loop
  const marqueeBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="bg-theme-page py-10 px-4 md:px-6 overflow-hidden border-t border-theme-subtle transition-colors duration-300">
      <div className="max-w-6xl mx-auto mb-6 text-center">
        <p className="text-[#ff2d6b] text-[10px] font-bold uppercase tracking-[2px]">
          Trusted Partnerships
        </p>
        <h2 className="text-xl md:text-2xl font-black text-theme-main mt-0.5">
          Featured <span className="text-[#ff2d6b]">Bangladeshi</span> Brands
        </h2>
      </div>

      {/* Smooth Marquee Container */}
      <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Ambient fade edge overlays */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--bg-page)] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--bg-page)] to-transparent z-10" />

        <div className="animate-marquee flex items-center gap-4 py-2">
          {marqueeBrands.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="flex items-center gap-3.5 bg-theme-card hover:bg-theme-card-hover border border-theme hover:border-[#ff2d6b]/40 rounded-xl px-4 py-2.5 shrink-0 transition-all cursor-pointer theme-card-shadow group"
            >
              <div className="w-12 h-12 flex items-center justify-center p-1 bg-theme-subtle border border-theme rounded-lg group-hover:scale-105 transition-transform">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain filter brightness-105"
                />
              </div>

              <div className="text-left pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-theme-main font-bold text-xs group-hover:text-[#ff2d6b] transition-colors">
                    {brand.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#ff2d6b]/10 text-[#ff2d6b] font-semibold border border-[#ff2d6b]/20">
                    {brand.badge}
                  </span>
                </div>
                <p className="text-theme-dim text-[10px] uppercase tracking-wider mt-0.5">
                  {brand.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopBrands;