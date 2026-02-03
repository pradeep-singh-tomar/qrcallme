import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Navbar from './components/Navbar'; 
import FooterNews from './components/FooterNews';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "QRCallMe",
  description: "Privacy-first QR solutions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-black bg-white`}>
        
        <Navbar />

        <main className="relative min-h-screen">
          {children}
        </main>
        
        <footer className="bg-slate-900 text-white py-16 px-6 border-t border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              
              <div className="space-y-4">
                <h3 className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  QRCallMe
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Privacy-first QR solutions for vehicles, pets, and smart IDs. No subscription, no tracking, just security.
                </p>
              </div>

              <div className="space-y-4">
                {/* Your RSS feed will load here exactly as it does now */}
                <FooterNews />
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">
                  Quick Navigation
                </h4>
                <nav className="flex flex-col space-y-2 text-sm text-slate-400 font-bold">
                  <Link href="/generate-qr-code" className="hover:text-blue-400 transition-colors">QR Generator</Link>
                  <Link href="/parking-qr-code" className="hover:text-blue-400 transition-colors">Vehicle Tag</Link>
                  <Link href="/blog" className="hover:text-blue-400 transition-colors">Privacy Blog</Link>
                  <Link href="/contact" className="hover:text-blue-400 transition-colors">Support</Link>
                </nav>
              </div>
            </div>

           <div className="mt-16 pt-8 border-t border-slate-800 space-y-4">
  <p className="text-slate-500 text-[12px] font-medium tracking-tight leading-relaxed">
    Now you can generate free QR codes like Parking QR codes, Baby QR codes, and Pet QR codes for use on bracelets or belts. 
    Using <span className="text-blue-400 font-bold">www.qrcallme.com</span>, you can also create digital QR Business Cards to share instantly—perfect for 
    social media influencers, creators, and businesses. <span className="text-blue-400 font-bold">www.qrcallme.com</span> © {new Date().getFullYear()} 
  </p>

			  
              <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Link href="/privacy" className="hover:text-white">Privacy</Link>
                <Link href="/terms" className="hover:text-white">Terms</Link>
				<Link href="/report" className="text-red-400 hover:text-red-500 transition-colors">Report Abuse</Link>
              </div>
            </div>
          </div>
        </footer>

        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </body>
    </html>
  );
}