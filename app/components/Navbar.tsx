"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menu when route changes
  useEffect(() => setIsMenuOpen(false), [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'QRcodes', href: '/generate-qr-code' },
    { name: 'Barcodes', href: '/generate-bar-code' },
    { name: 'Pets', href: '/pets-qr-code' },
    { name: 'Parking', href: '/parking-qr-code' },
    { name: 'WiFi', href: '/share-wifi-qr-code' },
    { name: 'Baby', href: '/baby-qr-code' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQs', href: '/faq' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6 sticky top-0 z-[9999] shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition-transform">
          QR<span className="text-blue-600">CallMe</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue-600 transition-colors">
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <Link href="/admin/dashboard" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/user" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-slate-900 focus:outline-none"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

 {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 top-[65px] bg-white z-[9998] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col p-6 space-y-3 text-center h-[calc(100vh-65px)] overflow-y-auto bg-white">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`text-xl font-black p-4 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-900 active:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/admin/dashboard" className="text-xl font-black p-4 rounded-2xl bg-blue-600 text-white shadow-blue-200 shadow-lg">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-xl font-black p-4 rounded-2xl bg-red-50 text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/user" className="text-xl font-black p-4 rounded-2xl bg-slate-900 text-white shadow-xl">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
	  </nav>
	
	
  );
}