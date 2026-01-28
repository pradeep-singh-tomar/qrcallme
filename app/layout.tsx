"use client"; // We need this to check if the user is logged in
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // 1. Check if user is logged in on load
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

    // 2. Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-black bg-white`}>
        
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 z-[9999] shadow-sm">
          <Link href="/" className="text-xl font-black tracking-tighter shrink-0">
            QR<span className="text-blue-600">CallMe</span>
          </Link>
          
          {/* Main Links - Hidden on mobile for beauty */}
          <div className="hidden lg:flex space-x-6 text-[11px] font-black uppercase tracking-widest text-gray-500"> 
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/generate-qr-code" className="hover:text-blue-600 transition-colors">QRcodes</Link>
            <Link href="/parking-qr-code" className="hover:text-blue-600 transition-colors">Vehicle</Link>
            <Link href="/share-wifi-qr-code" className="hover:text-blue-600 transition-colors">Network</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-3">
            {session ? (
              /* ONLY SHOWS IF LOGGED IN */
              <div className="flex items-center gap-2">
                <Link href="/admin-dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                  Dashboard
                </Link>
                <button 
                  onClick={() => supabase.auth.signOut()} 
                  className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* SHOWS FOR REGULAR VISITORS */
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            )}
          </div>
        </nav>

        <main className="relative">
          {children}
        </main>
        
		
		<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}