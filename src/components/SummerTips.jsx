const tips = [
  { id: 1, icon: "🧴", title: "SPF 50+ Daily", desc: "Protect your skin from intense tropical UV sun rays." },
  { id: 2, icon: "💧", title: "Hydration", desc: "Drink plenty of water and fresh coconut juice to stay cool." },
  { id: 3, icon: "👕", title: "Pure Cotton", desc: "Wear breathable lightweight fabrics to avoid heat rashes." },
  { id: 4, icon: "🕶️", title: "UV Sunglasses", desc: "Guard your eyes with UV400 polarized summer lenses." },
];

const SummerTips = () => {
  return (
    <section className="bg-[#0b0a26] py-10 px-4 md:px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-6">
          <p className="text-[#ff2d6b] text-[10px] font-bold uppercase tracking-[2px]">
            Summer Wellness
          </p>
          <h2 className="text-xl md:text-2xl font-black text-white mt-0.5">
            Quick <span className="text-[#ff2d6b]">Care</span> Tips
          </h2>
          <div className="w-10 h-0.5 bg-[#ff2d6b] mx-auto mt-2 rounded-full" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="relative group p-4 rounded-xl bg-white/4 border border-white/8 hover:border-[#ff2d6b]/30 transition-all duration-300 flex flex-col items-center text-center backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 group-hover:bg-[#ff2d6b]/15 transition-all">
                {tip.icon}
              </div>

              <h3 className="text-white font-bold text-xs sm:text-sm mb-1.5 group-hover:text-[#ff2d6b] transition-colors">
                {tip.title}
              </h3>

              <p className="text-white/40 text-[11px] leading-relaxed">
                {tip.desc}
              </p>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#ff2d6b] group-hover:w-1/3 transition-all duration-300 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SummerTips;
