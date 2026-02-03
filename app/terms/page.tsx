export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-black tracking-tighter mb-8">Terms of <span className="text-blue-600">Service</span></h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed">
        <p className="font-bold text-black">Effective Date: February 2026</p>

        <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <h2 className="text-xl font-black text-red-600 uppercase tracking-widest text-[12px] mb-4">⚠️ Important: Limitation of Liability</h2>
          <p className="text-red-900 font-medium">
            QRCallMe is an open platform. We provide tools for QR generation but do not monitor the end-use of every code generated. 
            <strong> We explicitly disclaim all responsibility for any illegal activity, misuse, or fraudulent behavior </strong> 
            conducted via QR codes generated on this platform. Users generate and deploy codes at their own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-black uppercase tracking-widest text-[12px] mb-4">1. Acceptable Use</h2>
          <p>By using this service, you agree not to use QRCallMe for phishing, malware distribution, or any activity that violates local or international laws.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-black uppercase tracking-widest text-[12px] mb-4">2. Service Availability</h2>
          <p>While we strive for 99.9% uptime, QRCallMe is provided "as is." We are not liable for any damages resulting from temporary service interruptions or the expiration of generated codes.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-black uppercase tracking-widest text-[12px] mb-4">3. Termination</h2>
          <p>We reserve the right to disable any QR code that is reported for abuse or found to be linked to malicious content without prior notice.</p>
        </section>
      </div>
    </div>
  );
}