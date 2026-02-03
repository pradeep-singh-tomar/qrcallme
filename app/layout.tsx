import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Navbar from './components/Navbar'; 
import FooterNews from './components/FooterNews';
import { Metadata, Viewport } from 'next';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// 1. Enhanced SEO Metadata
export const metadata: Metadata = {
  title: "QRCallMe | Privacy-First QR Solutions",
  description: "Secure QR tags for vehicles, pets, and babies. No tracking, no subscriptions. Generate your free privacy-first QR code today.",
  keywords: ["QR Code Generator", "Privacy QR", "Parking QR", "Pet ID Tag", "Baby Safety QR"],
  openGraph: {
    title: "QRCallMe | Secure QR Solutions",
    description: "Privacy-first QR technology for your daily security.",
    url: "https://www.qrcallme.com",
    siteName: "QRCallMe",
    type: "website",
  },
  robots: "index, follow",
};

// 2. Mobile Responsive Viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-black bg-white selection:bg-blue-100 selection:text-blue-900`}>
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="relative min-h-screen">
          {children}
        </main>
        
        {/* Enhanced Footer */}
        <footer className="bg-slate-900 text-white py-16 px-6 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            
            {/* TOP SECTION: Brand + 3 RSS Feeds (Same Line) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-1 space-y-4">
                <Link href="/" className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  QRCallMe
                </Link>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Privacy-first QR solutions for vehicles, pets, and smart IDs. No tracking, just security.
                </p>
              </div>

              {/* Your 3 RSS Feeds Area */}
              <div className="md:col-span-3">
                <FooterNews /> {/* This component should render your 3 columns of feeds */}
              </div>
            </div>

            {/* HORIZONTAL LINE */}
            <hr className="border-slate-800 mb-8" />

            {/* MIDDLE SECTION: Solutions Navigation (Now horizontal below the line) */}
            <div className="mb-12">
              <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6 opacity-40">
                Explore Solutions
              </h4>
              <nav className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-400 font-bold">
                <Link href="/generate-qr-code" className="hover:text-blue-400 transition-colors">QR Generator</Link>
                <Link href="/parking-qr-code" className="hover:text-blue-400 transition-colors">Vehicle Tag</Link>
                <Link href="/pets-qr-code" className="hover:text-blue-400 transition-colors">Pet ID Tags</Link>
                <Link href="/baby-qr-code" className="hover:text-blue-400 transition-colors">Baby Safety</Link>
                <Link href="/share-wifi-qr-code" className="hover:text-blue-400 transition-colors">WiFi Sharing</Link>
                <Link href="/blog" className="hover:text-blue-400 transition-colors">Privacy Blog</Link>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">Support</Link>
              </nav>
            </div>

            {/* BOTTOM SECTION: SEO Text + Legal */}
            <div className="pt-8 border-t border-slate-800 space-y-6">
              <p className="text-slate-500 text-[11px] font-medium tracking-tight leading-relaxed max-w-4xl">
                Generate free <span className="text-slate-300">Parking QR codes</span>, <span className="text-slate-300">Baby QR codes</span>, and <span className="text-slate-300">Pet QR codes</span>. 
                Using <span className="text-blue-400 font-bold">www.qrcallme.com</span>, you can also create digital QR Business Cards to share instantly. 
                © {new Date().getFullYear()} 
              </p>

              <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Link href="/privacy" className="hover:text-white">Privacy</Link>
                <Link href="/terms" className="hover:text-white">Terms</Link>
                <Link href="/report" className="text-red-400/60 hover:text-red-500">Report Abuse</Link>
                <Link href="/user" className="ml-auto opacity-10 hover:opacity-100">Staff</Link>
              </div>
            </div>
          </div>
        </footer>

        {/* Third Party Scripts */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  );
}