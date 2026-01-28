"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function SetupUsername() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login');
      setSession(session);
    });
  }, []);

  // Check if username is taken
  const checkUsername = async (val: string) => {
    const cleanName = val.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(cleanName);

    if (cleanName.length < 3) {
      setIsAvailable(null);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", cleanName)
      .single();

    setIsAvailable(!data);
  };

  const handleSubmit = async () => {
    if (!isAvailable || !session) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        username: username,
        display_name: username, // Default display name to username
      });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push('/account'); // Move to Dashboard (or Step 2)
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
        <div className="mb-8 text-center">
          <span className="text-4xl">💎</span>
          <h1 className="text-3xl font-black mt-4 tracking-tighter">Claim Your ID</h1>
          <p className="text-slate-400 mt-2">This will be your public contact link.</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</span>
            <input
              type="text"
              placeholder="username"
              className="w-full p-5 pl-10 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
              value={username}
              onChange={(e) => checkUsername(e.target.value)}
            />
          </div>

          {/* Availability Indicator */}
          {username.length >= 3 && (
            <div className={`text-xs font-black uppercase tracking-widest text-center ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
              {isAvailable ? "✓ Username Available" : "✕ Already Taken"}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isAvailable || loading}
            className="w-full bg-blue-600 p-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all"
          >
            {loading ? "Saving..." : "Continue to Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}