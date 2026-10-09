"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import AdminBar from "@/components/AdminBar";
import ChatWidget from "@/components/ChatWidget";

// The admin panel (/admin/**) is its own self-contained shell (see AdminShell.js) with
// its own compact sidebar/topbar — it must not be wrapped in the public site's navbar,
// bottom nav, or footer, which would double up navigation and waste vertical space.
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="public-site">
      <a href="#main-content" className="skip-link">Langsung ke konten</a>
      <AdminBar />
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <BottomNav />
      <Footer />
      <ChatWidget />
    </div>
  );
}
