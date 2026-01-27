import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRCallMe | Smart Privacy QR Tags",
  description: "Protect your privacy with smart QR tags for parking, pets, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-black bg-white`}>
        
        {/* Navigation Bar - Forced to Top with shadow and high Z-index */}
        <nav className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 z-[9999] shadow-sm">
          <Link href="/" className="text-xl font-black tracking-tighter">
            QR<span className="text-blue-600">CallMe</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-600">
            <Link href="/generate-qr-code" className="hover:text-blue-600 transition-colors">Free QR</Link>
            <Link href="/parking-qr-code" className="hover:text-blue-600 transition-colors">Parking</Link>
            <Link href="/pets-qr-code" className="hover:text-blue-600 transition-colors">Pets</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Support</Link>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="space-y-4">
  <Link href="/admin-dashboard" className="...">Dashboard</Link>
  <Link href="/admin-dashboard/blog" className="...">Write Blog</Link>
  <Link href="/admin-dashboard/messages" className="...">Inbox</Link>
</nav>
          </div>
        </nav>

        {/* Page Content Wrapper - ensures relative positioning doesn't break layout */}
        <main className="relative">
          {children}
        </main>
        
      </body>
    </html>
  );
}