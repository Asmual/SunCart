import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SunCart — Summer Essentials & Trendy Seasonal Outfits",
  description: "Explore the hottest summer essentials, beachwear, sunglasses, sandals, and seasonal accessories at SunCart. Best deals with fast delivery across Bangladesh.",
  icons: {
    icon: "/images/SunCart-Logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-theme-page text-theme-main transition-colors duration-300">
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#121242",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontSize: "14px",
                borderRadius: "12px",
              },
            }}
          />
          <Navbar />
          <CartDrawer />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
