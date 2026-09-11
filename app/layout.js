import "./globals.css";
import RegisterSW from "@/components/RegisterSW";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "MUI Jakarta Timur",
  description:
    "Portal layanan keagamaan digital Majelis Ulama Indonesia Kota Administrasi Jakarta Timur: fatwa, dakwah, dan layanan umat.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = {
  themeColor: "#0B4D33",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="font-sans bg-cream text-ink">
        <RegisterSW />
        <Navbar />
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomNav />
        <Footer />
      </body>
    </html>
  );
}
