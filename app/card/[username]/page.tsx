"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";


const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PublicContactCard() {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("username", username).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    if (username) fetchPublicProfile();
  }, [username]);
  
  // IMAGE DOWNLOAD FUNCTION
const downloadImage = async () => {
  if (!cardRef.current) return;

  try {
    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      skipFonts: true,
    });

    const link = document.createElement("a");
    link.download = `QRCallMe-ID-${profile.username}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("PNG Error:", err);
    alert("Failed to generate image");
  }
};


  const handleShare = async () => {
    // Check if we are on localhost or a non-secure site
    const isLocal = window.location.hostname === "localhost" || window.location.protocol === "http:";
    
    const shareData = {
      title: `QRCallMe Digital ID - ${profile?.first_name}`,
      url: window.location.href,
    };

    if (!isLocal && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard! (Native sharing requires HTTPS/Live site)");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100 font-bold tracking-widest">DECODING SECURE ID...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-white text-red-600 font-black tracking-widest uppercase">ID Not Found</div>;

  return (
    <div className="min-h-screen bg-[#E2E8F0] p-4 flex flex-col items-center justify-center font-sans text-slate-900">
      
      {/* 🚀 CSS FOR PERFECT PRINTING - FORCES COLORS AND LANDSCAPE */}
      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; }
          .no-print { display: none !important; }
          .id-card-container { 
            box-shadow: none !important; 
            border: 1px solid #ccc !important;
            margin: 20px auto !important;
            width: 90% !important;
            max-width: 650px !important;
          }
          /* Ensure backgrounds show up in PDF */
          .bg-slate-50, .bg-blue-50, .bg-slate-100, .bg-gradient-to-r {
            background-color: inherit !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* LANDSCAPE ID CARD */}
      <div
  ref={cardRef}
  className="id-card-container w-full max-w-[650px] aspect-[1.6/1] bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden border-t-[6px] border-[#003366] relative flex flex-col" >

        
        {/* TOP BAR */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <p className="text-xs font-black text-[#003366] uppercase tracking-tighter leading-none">
                QRCallMe Digital ID
              </p>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Status: Verified</p>
           </div>
		   
		   
		   
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 flex p-6 gap-8">
          
          {/* LEFT COLUMN: Image and Handle */}
          <div className="flex flex-col items-center justify-between w-1/3 border-r border-slate-100 pr-4">
		  
            <div className="w-full aspect-[4/5] bg-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center text-6xl text-slate-300 font-black shadow-inner overflow-hidden uppercase">
				{profile.avatar_url ? (
					<img 
				src={profile.avatar_url} 
					alt="Profile" 
					className="w-full h-full object-cover" 
					crossOrigin="anonymous" // CRITICAL: This allows the PNG download to work
					/>
				) : (
					profile.first_name?.[0]
				)}
			</div>
			
            <div className="mt-4 text-center w-full">
               <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Username / उपयोगकर्ता</p>
               <a 
                 href={`https://www.qrcallme.com/${profile.username}`}
                 className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-2 rounded-md border border-blue-100 block hover:bg-blue-600 hover:text-white transition-all overflow-hidden text-ellipsis whitespace-nowrap"
               >
                 www.qrcallme.com@{profile.username}
               </a>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Full Name / नाम</p>
                  <p className="text-1xl font-black text-[#003366] uppercase tracking-tight leading-tight">{profile.first_name} {profile.last_name}</p>
                </div>
                {/* LARGE QR CODE */}
                <div className="bg-white p-2 border-2 border-slate-100 rounded-2xl shadow-sm">
                   <QRCodeCanvas value={`tel:${profile.mobile_number}`} size={150} />
                   <p className="text-[7px] font-black text-center mt-1 text-slate-400 uppercase">Scan to Call</p>
                </div>
              </div>

              {profile.is_public ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Region / क्षेत्र</p>
                    <p className="text-xs font-bold text-slate-700 uppercase">{profile.city}, {profile.state}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Pin / पिन</p>
                    <p className="text-xs font-bold text-slate-700">{profile.pincode}</p>
                  </div>
                  
                  <div className="col-span-2 flex flex-wrap gap-2 mt-2">
                     {profile.instagram_url && (
                        <a href={`https://instagram.com/${profile.instagram_url.replace('@','')}`} target="_blank" className="text-[9px] font-black bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 border border-slate-200">
                          IG: @{profile.instagram_url.replace('@','')}
                        </a>
                     )}
                     {profile.linkedin_url && (
                        <a href={profile.linkedin_url} target="_blank" className="text-[9px] font-black bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 border border-slate-200">
                          LI: Connected
                        </a>
                     )}
					 {profile.facebook_url && (
  <a 
    href={profile.facebook_url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-[9px] font-black bg-blue-50 px-3 py-1.5 rounded-full text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"
  >
    FB: Profile
  </a>
)}
{profile.website_url && (
  <a 
    href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-[9px] font-black bg-emerald-50 px-3 py-1.5 rounded-full text-emerald-700 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
  >
    WEB: Visit
  </a>
)}


                  </div>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Privacy Lock Enabled</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
               <div className="flex flex-col">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Security ID Hash</p>
                  <p className="text-[8px] font-mono text-slate-400 uppercase">{profile.id.slice(0,24)}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-[#003366] tracking-tighter uppercase">www.qrcallme.com</p>
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM DECORATIVE STRIP */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500"></div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-[650px] no-print">
         <button onClick={downloadImage} className="bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
           PNG Image
         </button>
         <button onClick={() => window.print()} className="bg-white border border-slate-300 text-[#003366] font-black py-4 rounded-2xl shadow-lg uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
           Print PDF
         </button>
         <button onClick={handleShare} className="bg-[#003366] text-white font-black py-4 rounded-2xl shadow-xl uppercase text-[10px] tracking-widest hover:opacity-90 transition-all">
           Share Link
         </button>
      </div>

      <p className="mt-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] no-print">Verified Secure Identity</p>
    </div>
  );
}