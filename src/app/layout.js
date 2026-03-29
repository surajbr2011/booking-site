import { Inter, Outfit } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: {
    default: "Exotica Agonda | Luxury Resort in Goa",
    template: "%s | Exotica Agonda"
  },
  description: "Experience the ultimate beach luxury at Exotica Agonda. Exclusive cottages, fine dining, and serene Agonda beach views.",
  keywords: ["Agonda Beach", "Goa Hotel", "Luxury Resort Goa", "Beach Resort Agonda", "Exotica Agonda"],
  authors: [{ name: "Exotica Agonda" }],
  openGraph: {
    title: "Exotica Agonda - Luxury Beach Resort",
    description: "Relax in luxury at the finest beach resort in Agonda, Goa.",
    url: "https://exoticaagonda.com",
    siteName: "Exotica Agonda",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "The Exotica Agonda",
    "image": "https://exoticaagonda.com/hero-bg.jpg",
    "description": "Experience the ultimate beach luxury at Exotica Agonda. Exclusive cottages and fine dining near Agonda Beach, Goa.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Agonda Beach Road",
      "addressLocality": "Agonda",
      "addressRegion": "Goa",
      "postalCode": "403702",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 15.045,
      "longitude": 73.988
    },
    "url": "https://exoticaagonda.com",
    "telephone": "+91-XXXXXXXXXX",
    "priceRange": "₹₹₹"
  };

  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-gray-50 flex flex-col min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

