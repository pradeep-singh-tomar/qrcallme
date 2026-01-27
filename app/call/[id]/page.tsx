"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [myTags, setMyTags] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTags(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTags(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTags = async (userId: string) => {
    const { data } = await supabase
      .from("qr_links")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setMyTags(data);
  };

  const generateQR = async () => {
    if (!session || !phone) return;
    const newId = crypto.randomUUID();
    const { error } = await supabase
      .from("qr_links")
      .insert([{ id: newId, phone_number: phone, user_id: session.user.id }]);

    if (error) alert(error.message);
    else {
      setPhone("");
      fetchTags(session.user.id);
    }
  };

  const deleteTag = async (id: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      const { error } = await supabase.from("qr_links").delete().eq("id", id);
      if (error) alert(error.message);
      else if (session) fetchTags(session.user.id);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-black">
          <h1 className="text-3xl font-black text-blue-600 mb-6 text-center">QRCallMe</h1>
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 print:hidden">
          <h1 className="text-3xl font-black text-blue-600">QRCallMe</h1>
          <button onClick={() => supabase.auth.signOut()} className="text-sm text-gray-500 underline">Sign Out</button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Generator - Hidden when printing */}
          <div className="bg-white p-8 rounded-3xl shadow-xl h-fit print:hidden">
            <h2 className="text-xl font-bold mb-4 text-black">Create New Tag</h2>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-4 text-black focus:border-blue-500 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={generateQR} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all">
              Generate QR Code
            </button>
          </div>

          {/* RIGHT: My Tags List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-black text-center md:text-left print:hidden">My Active Tags</h2>
            {myTags.length === 0 && <p className="text-gray-400 print:hidden text-center md:text-left">No tags created yet.</p>}
            
            {myTags.map((tag) => (
              <div key={tag.id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-4 relative">
                
                {/* --- THE BRANDED STICKER (Only shows when printing) --- */}
                <div className="hidden print:flex fixed inset-0 bg-white z-[9999] flex-col items-center justify-center p-10 text-center">
                  <div className="border-[10px] border-blue-600 p-12 rounded-[60px] flex flex-col items-center bg-white shadow-none">
                    <h1 className="text-6xl font-black text-blue-600 mb-8">QRCallMe</h1>
                    <QRCodeSVG 
                      value={`${window.location.origin}/call/${tag.id}`} 
                      size={400} 
                      level="H" 
                      includeMargin={true}
                    />
                    <p className="text-4xl font-bold text-gray-700 mt-10">Scan to contact owner</p>
                    <p className="text-2xl text-gray-400 mt-4 font-mono">ID: {tag.id.substring(0, 8)}</p>
                  </div>
                </div>

                {/* --- THE NORMAL DASHBOARD VIEW (Hides when printing) --- */}
                <div className="print:hidden flex items-center gap-4">
                  <QRCodeCanvas value={`${window.location.origin}/call/${tag.id}`} size={80} />
                  <div className="flex-1">
                    <p className="font-bold text-lg text-black">{tag.phone_number}</p>
                    <p className="text-xs text-gray-400 font-mono">ID: {tag.id.substring(0, 8)}</p>
                  </div>
                </div>

                <div className="flex gap-2 print:hidden">
                  <button 
                    onClick={() => window.print()} 
                    className="flex-1 bg-blue-100 text-blue-700 font-bold py-2 rounded-xl hover:bg-blue-200 text-sm"
                  >
                    📥 Print Sticker
                  </button>
                  <a href={`/call/${tag.id}`} target="_blank" className="px-4 bg-gray-100 text-gray-600 font-bold py-2 rounded-xl text-sm flex items-center">
                    View
                  </a>
                  <button onClick={() => deleteTag(tag.id)} className="px-4 bg-red-50 text-red-500 font-bold rounded-xl text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}