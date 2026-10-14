import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import HeroImage from '../../public/images/summer-girl.png';
import 'animate.css';

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] bg-theme-page overflow-hidden flex items-center transition-colors duration-300">

      {/* Background effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-800 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900 opacity-25 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">

        {/* Left Side Content */}
        <div className="flex flex-col justify-center z-20 py-4 animate__animated animate__fadeInLeft">
          <p className="text-[#ff2d6b] font-bold uppercase tracking-widest text-[11px] md:text-xs mb-2">
            New Arrival 2025
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-theme-main leading-tight mb-1">
            SUMMER SALE
          </h1>

          <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            <span className="text-[#ff2d6b] inline-block animate__animated animate__pulse animate__infinite">
              50%
            </span>
            <span className="text-theme-main"> OFF</span>
          </h2>

          <div className="mb-4">
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-[#ff2d6b] px-6 py-2 font-bold text-xs md:text-sm text-theme-main transition-all duration-300 hover:bg-[#ff2d6b] hover:text-white"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                HOT SUMMER DEALS
                <span className="animate__animated animate__tada animate__infinite inline-block">🔥</span>
              </span>
              <div className="absolute inset-0 z-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
            </Link>
          </div>

          <p className="text-theme-muted text-xs md:text-sm leading-relaxed max-w-sm mb-5">
            Step into the heat with lightweight, breathable fabrics and UV-protecting gear crafted for true seasonal comfort.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="flex items-center gap-3 bg-[#ff2d6b] text-white text-sm font-bold px-7 py-3 rounded-full hover:bg-[#e0255e] transition-all shadow-lg shadow-[#ff2d6b]/30 transform hover:-translate-y-0.5"
            >
              SHOP NOW
              <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FiArrowRight className="text-white text-lg" />
              </span>
            </Link>

            <Link
              href="/products"
              className="flex items-center gap-2 border-2 border-theme hover:border-[#ff2d6b] text-theme-main text-sm font-bold px-7 py-3 rounded-full hover:bg-[#ff2d6b] hover:text-white transition-all transform hover:-translate-y-0.5"
            >
              EXPLORE PRODUCTS
            </Link>
          </div>
        </div>

        {/* Right Side Image Showcase (with 20px padding / margin clearance) */}
        <div className="relative flex justify-center items-center h-full min-h-[400px] lg:min-h-0 py-5 animate__animated animate__fadeInRight animate__delay-0.5s">
          <span className="absolute text-[160px] md:text-[240px] lg:text-[280px] font-black text-theme-main/5 select-none leading-none top-1/2 -translate-y-1/2 pointer-events-none">
            50
          </span>

          <div className="absolute top-2 sm:top-5 left-2 sm:left-4 lg:left-0 z-30 animate__animated animate__fadeInUp">
            <div className="relative bg-theme-card-solid/80 backdrop-blur-md border border-theme text-theme-main text-center px-4 py-2 sm:px-5 sm:py-3 rounded-2xl shadow-xl">
              <p className="text-2xl sm:text-3xl font-black text-[#ff2d6b]">250+</p>
              <p className="text-[9px] sm:text-[10px] text-theme-muted uppercase font-semibold tracking-wider">New Product</p>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-80 sm:h-80 bg-purple-600 opacity-20 rounded-full blur-[80px] pointer-events-none"></div>

          {/* Large Hero Lady Fashion Image fitting comfortably with 20px top & bottom margin */}
          <div className="relative z-10 w-full h-full flex justify-center items-center">
            <Image
              src={HeroImage}
              alt="Summer Sale Fashion"
              priority
              className="relative z-20 w-auto h-auto max-h-[440px] sm:max-h-[520px] lg:max-h-[min(620px,calc(100vh-128px))] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-4 z-20 animate__animated animate__fadeInUp animate__delay-1s">
        {[
          { icon: <FaFacebookF />, href: "#" },
          { icon: <FaTwitter />, href: "#" },
          { icon: <FaInstagram />, href: "#" },
        ].map((s, i) => (
          <a
            key={i}
            href={s.href}
            className="w-10 h-10 rounded-full border border-theme text-theme-muted flex items-center justify-center hover:border-[#ff2d6b] hover:text-[#ff2d6b] hover:bg-[#ff2d6b]/10 transition-all shadow-sm text-sm"
          >
            {s.icon}
          </a>
        ))}
      </div>

    </section>
  );
};

export default HeroSection;