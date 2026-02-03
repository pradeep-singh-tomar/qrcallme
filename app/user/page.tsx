"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { QRCodeCanvas } from "qrcode.react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function UserDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [origin, setOrigin] = useState("");
  const [activeTab, setActiveTab] = useState("tags");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [phone, setPhone] = useState("");
  const [tagName, setTagName] = useState("");
  const [myTags, setMyTags] = useState<any[]>([]);
  
  const [profile, setProfile] = useState<any>({
    username: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    instagram_url: "",
    linkedin_url: "",
    facebook_url: "", // New
    website_url: "",  // New
    avatar_url: "",   // New (for profile pic)
    is_public: true
  });

  useEffect(() => {
    setOrigin(window.location.origin);
    const checkUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setSession(null); return; }
      setSession(session);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profileData?.username) {
        router.push('/setup');
      } else {
        setProfile(profileData);
        fetchTags(session.user.id);
      }
    };
    checkUserAndProfile();
  }, [router]);

  const fetchTags = async (userId: string) => {
    const { data } = await supabase.from("qr_links").select(`*, scans:scan_logs(count)`).eq("user_id", userId).order("created_at", { ascending: false });
    if (data) setMyTags(data);
  };

  // PROFILE IMAGE UPLOAD HANDLER
  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error('Select an image.');
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setProfile({ ...profile, avatar_url: publicUrl });
      alert("Photo uploaded! Remember to click 'Update Digital Profile' to save.");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      ...profile,
      updated_at: new Date()
    });
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else alert("Profile Updated Successfully!");
  };

  const generateQR = async () => {
    if (!session || !phone) return;
    const newId = crypto.randomUUID();
    const { error } = await supabase.from("qr_links").insert([{ id: newId, phone_number: phone, label: tagName || "My Vehicle", user_id: session.user.id }]);
    if (error) alert(error.message);
    else { setPhone(""); setTagName(""); fetchTags(session.user.id); }
  };

  const deleteTag = async (id: string) => {
    if (confirm("Delete this tag?")) {
      await supabase.from("qr_links").delete().eq("id", id);
      fetchTags(session.user.id);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F172A] p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center">
          <h1 className="text-3xl font-black text-blue-600 mb-6">QRCallMe</h1>
  		  <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={['google']} redirectTo={origin ? `${origin}/user` : ""} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-black">
      {/* SIDEBAR (Shortened for brevity) */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex">
        <h2 className="text-2xl font-black text-blue-600 mb-10 cursor-pointer" onClick={() => router.push('/')}>QRCallMe</h2>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('tags')} className={`w-full text-left p-4 rounded-2xl font-bold text-sm ${activeTab === 'tags' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>🏷️ My Security Tags</button>
          <button onClick={() => setActiveTab('profile')} className={`w-full text-left p-4 rounded-2xl font-bold text-sm ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>👤 Digital Card Profile</button>
          <button onClick={() => setActiveTab('affiliate')} className={`w-full text-left p-4 rounded-2xl font-bold text-sm ${activeTab === 'affiliate' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>🤝 Affiliate Account</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-10">
          {activeTab === 'tags' && "My Security Tags"}
          {activeTab === 'profile' && "Edit Digital Contact Card"}
          {activeTab === 'affiliate' && "Affiliate Hub"}
        </h1>

        {activeTab === 'tags' && (
           <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-8 rounded-[35px] shadow-xl border border-slate-100 h-fit">
              <h2 className="text-xl font-black mb-6">Create New Tag</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Tag Label (e.g. My BMW)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500" value={tagName} onChange={(e) => setTagName(e.target.value)} />
                <input type="tel" placeholder="Receiver Phone Number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <button onClick={generateQR} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-lg">Generate QR</button>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {myTags.map((tag) => (
                <div key={tag.id} className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-all">
                  <div className="bg-slate-50 p-4 rounded-3xl">
                    {origin && <QRCodeCanvas value={`${origin}/call/${tag.id}`} size={100} />}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-black text-slate-900">{tag.label || 'Unnamed Tag'}</h3>
                    <p className="text-slate-500 font-medium text-sm">{tag.phone_number}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">Active</span>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Scans: {tag.scans?.[0]?.count || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => deleteTag(tag.id)} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
           </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="max-w-4xl bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-10">
            
            {/* PROFILE PHOTO UPLOAD SECTION */}
            <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-10">
               <div className="relative w-32 h-32 mb-4">
                  <div className="w-full h-full bg-slate-100 rounded-[40px] overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-slate-300 font-black">{profile.first_name?.[0] || "?"}</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:scale-110 transition-all">
                    <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
                    {uploading ? "..." : "📸"}
                  </label>
               </div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Identity Photo</p>
            </div>

            <div className="flex items-center justify-between p-6 bg-blue-50 rounded-[30px] border border-blue-100">
              <div>
                <p className="font-black text-blue-900">Privacy Mode</p>
                <p className="text-xs text-blue-700">Toggle public visibility of your ID card.</p>
              </div>
              <input type="checkbox" className="w-6 h-6" checked={profile.is_public} onChange={(e) => setProfile({...profile, is_public: e.target.checked})} />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">First Name</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" value={profile.first_name || ""} onChange={(e) => setProfile({...profile, first_name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Last Name</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" value={profile.last_name || ""} onChange={(e) => setProfile({...profile, last_name: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">Social & Links</label>
              <div className="grid md:grid-cols-2 gap-4">
                <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" placeholder="Instagram Username (@...)" value={profile.instagram_url || ""} onChange={(e) => setProfile({...profile, instagram_url: e.target.value})} />
                <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" placeholder="LinkedIn URL" value={profile.linkedin_url || ""} onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})} />
                <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" placeholder="Facebook Profile URL" value={profile.facebook_url || ""} onChange={(e) => setProfile({...profile, facebook_url: e.target.value})} />
                <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" placeholder="Personal Website URL" value={profile.website_url || ""} onChange={(e) => setProfile({...profile, website_url: e.target.value})} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" placeholder="City" value={profile.city || ""} onChange={(e) => setProfile({...profile, city: e.target.value})} />
              <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" placeholder="State" value={profile.state || ""} onChange={(e) => setProfile({...profile, state: e.target.value})} />
              <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none border focus:border-blue-500 font-bold" placeholder="Pincode" value={profile.pincode || ""} onChange={(e) => setProfile({...profile, pincode: e.target.value})} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl hover:bg-blue-700 shadow-xl uppercase tracking-widest transition-all">
              {loading ? "Saving..." : "Update Digital Profile"}
            </button>
          </form>
        )}

        {/* AFFILIATE SECTION (Kept same) */}
        {activeTab === 'affiliate' && (
           <div className="bg-blue-600 p-12 rounded-[40px] text-white shadow-2xl">
              <h2 className="text-3xl font-black mb-4">Affiliate Program</h2>
              <div className="bg-white/10 p-4 rounded-3xl border border-white/20 flex gap-2">
                <input readOnly value={`${origin}?ref=${session.user.id}`} className="bg-transparent flex-1 outline-none font-bold" />
                <button onClick={() => {navigator.clipboard.writeText(`${origin}?ref=${session.user.id}`); alert("Copied!");}} className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black">Copy</button>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}