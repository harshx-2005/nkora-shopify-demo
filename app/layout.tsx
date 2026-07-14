import type { Metadata } from "next";
import { Poppins, Nunito, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import { CustomerProvider } from "@/context/CustomerContext";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import Loader from "@/components/layout/Loader";
import CartDrawer from "@/components/cart/CartDrawer";


// Import Google fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dmsans",
});

export const metadata: Metadata = {
  title: "NKORA KidsWear | Luxury & Premium Kids Fashion",
  description: "Explore premium and luxury clothing for boys and girls. Soft, elegant, and skin-friendly children's apparel made with love in Kolkata.",
  metadataBase: new URL("https://nkorakidswear.com"),
  openGraph: {
    title: "NKORA KidsWear | Premium & Luxury Kids Fashion",
    description: "Elegant, soft, and comfortable premium fashion for little stars. Handcrafted with luxury fabrics.",
    url: "https://nkorakidswear.com",
    siteName: "NKORA KidsWear",
    images: [
      {
        url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "NKORA Premium Kids Fashion",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NKORA KidsWear | Luxury Kids Fashion",
    description: "Delivering skin-friendly, high-end children's wear. Premium quality crafted for little stars.",
    images: ["https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=1200"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${nunito.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="antialiased">

        <CustomerProvider>
          <CartProvider>
            {/* Custom Luxury Preloader */}
            <Loader />

            {/* Interactive Custom Cursor */}
            <CustomCursor />

            <div className="flex flex-col min-h-screen">
              {/* Promotional Top Header */}
              <TopBar />

              {/* Main Interactive Header */}
              <Navbar />

              {/* Main Page Layout Wrapper */}
              <main className="flex-grow">{children}</main>

              {/* Static Multi-column Footer */}
              <Footer />
            </div>

            {/* Animated Slide-out Cart Drawer */}
            <CartDrawer />
          </CartProvider>
        </CustomerProvider>

      </body>
    </html>
  );
}
