"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isRoomDetail = pathname?.startsWith("/room/") && pathname !== "/room";
  const isBooking = pathname === "/booking";

  return (
    <>
      {!isAdmin && !isRoomDetail && !isBooking && <Header />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
