export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-black tracking-tighter mb-8">Privacy <span className="text-blue-600">Policy</span></h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p className="font-bold text-black">Last Updated: February 2026</p>
        
        <section>
          <h2 className="text-xl font-black text-black uppercase tracking-widest text-[12px] mb-4">1. Data Collection</h2>
          <p>QRCallMe is designed with a privacy-first approach. We do not track your location or sell your personal data. When you generate a QR code, we only store the minimum information necessary to make the code functional.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-black uppercase tracking-widest text-[12px] mb-4">2. Public Information</h2>
          <p>Please be aware that any information you embed in a QR code (such as phone numbers or WiFi passwords) is technically public to anyone who scans that physical code. We recommend only sharing information you are comfortable being accessed via scan.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-black uppercase tracking-widest text-[12px] mb-4">3. Third-Party Services</h2>
          <p>We use Supabase for secure authentication and Razorpay for payment processing. These services have their own privacy policies regarding your financial and login data.</p>
        </section>
      </div>
    </div>
  );
}