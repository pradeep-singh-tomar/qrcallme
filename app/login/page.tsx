"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSignUp) {
      // 1. Check if this user was referred by someone
      const refId = typeof window !== "undefined" ? localStorage.getItem('referral_id') : null;

      // 2. Perform the Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else if (data.user) {
        // 3. Create the profile record and link the Referrer (Affiliate)
        // We use upsert so it creates the row if it doesn't exist
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            referred_by: refId, // This links the new user to the affiliate
            subscription_tier: 'free'
          });

        if (profileError) console.error("Profile error:", profileError);

        // 4. Clear the referral from storage and move to setup
        localStorage.removeItem('referral_id');
        router.push('/setup');
      }
    } else {
      // LOGIN LOGIC
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        router.push('/account'); 
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] relative overflow-hidden px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 border border-white/20 shadow-2xl">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            {isSignUp ? 'Join the Empire' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 font-medium mt-2">
            {isSignUp ? 'Create your privacy card in seconds.' : 'Sign in to manage your QR empire.'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input 
                type="email" required placeholder="admin@qrcallme.com"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Password</label>
              <input 
                type="password" required placeholder="••••••••"
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
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isSignUp ? 'Create My Account' : 'Enter Dashboard'}
            </button>
          </form>
          
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-6 text-sm text-blue-400 font-bold hover:underline"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}