"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // Start true to check session first
  const [authLoading, setAuthLoading] = useState(false); // For the button click
  const [errorMsg, setErrorMsg] = useState('');

  // 🛡️ 1. SESSION CHECK (Run on load)
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user.email === 'pradeepfyou@gmail.com') {
        // Already logged in? Skip to dashboard
        router.push('/admin/dashboard');
      } else {
        // No session? Show the login form
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  // 🚀 2. LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      setErrorMsg(error.message);
      setAuthLoading(false);
    } else if (data.user) {
      if (data.user.email === 'pradeepfyou@gmail.com') {
        // Hard refresh to ensure cookies are set correctly
        window.location.href = '/admin/dashboard';
      } else {
        // If a non-admin tries to login here, send them to their account
        router.push('/account');
      }
    }
  };

  // 3. LOADING STATE (Prevents "flicker" of login form if already logged in)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden px-6">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 border border-white/20 shadow-2xl">
            <span className="text-4xl">🛡️</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Admin Portal</h1>
          <p className="text-slate-400 font-medium mt-2">QRCallMe Management System</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Email</label>
              <input 
                type="email" required 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
              <input 
                type="password" required 
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold text-center">
                ⚠️ {errorMsg}
              </div>
            )}

            <button 
              type="submit" disabled={authLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {authLoading ? 'Verifying...' : 'Access Command Center'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
             <button onClick={() => router.push('/')} className="text-xs text-slate-500 hover:text-white transition-colors">
               ← Back to Website
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}