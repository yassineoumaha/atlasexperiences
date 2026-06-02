import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Imourig",
  description: "How Imourig collects, uses, and protects your personal data. Compliant with Morocco Law 09-08, Law 07-26, and EU GDPR.",
};

const LAST_UPDATED = "31 May 2026";

export default function PrivacyPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-stone-400 text-sm mb-8">Last updated: {LAST_UPDATED} · Effective: {LAST_UPDATED}</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Legal Compliance:</strong> This policy complies with Morocco Law 09-08 on personal data protection (supervised by CNDP),
          Morocco Law 07-26 on data breach notifications, EU General Data Protection Regulation (GDPR) for EU resident visitors,
          and Morocco Consumer Protection Law 31-08.
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">1. Data Controller</h2>
            <p>Imourig (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is the data controller for personal data collected through this website (<strong>imourig.com</strong>). We operate a marketplace connecting travelers with local experience operators in Morocco.</p>
            <p className="mt-2">Contact: <a href="mailto:privacy@imourig.com" className="text-amber-600 underline">privacy@imourig.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">2. What Data We Collect & Why</h2>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50">
                  <th className="text-left p-2 border border-stone-200">Data</th>
                  <th className="text-left p-2 border border-stone-200">Why We Collect It</th>
                  <th className="text-left p-2 border border-stone-200">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Name, email address", "Account creation, booking requests, newsletter", "Contractual necessity / Consent"],
                  ["Phone number", "Booking requests, operator listings", "Contractual necessity / Consent"],
                  ["Country of residence", "Booking requests (operator needs this)", "Contractual necessity"],
                  ["Group size, requested date", "Processing booking requests", "Contractual necessity"],
                  ["Special requests / notes", "Communicating your needs to the operator", "Consent"],
                  ["Operator business details (name, city, phone, bio, languages, licence number)", "Creating and displaying operator listings publicly", "Consent + Contractual"],
                  ["Experience listings content (title, description, photos, pricing)", "Displaying operator services on the platform", "Contractual necessity"],
                  ["Booking history", "Commission tracking, dispute resolution, operator invoicing", "Contractual necessity + Legitimate interest"],
                  ["Chat messages (traveler ↔ operator)", "Facilitating booking communication", "Contractual necessity"],
                  ["IP address, browser/device type", "Security, fraud prevention, analytics", "Legitimate interest (GDPR Art. 6(1)(f))"],
                  ["Pages visited, time on site", "Analytics — aggregate only", "Consent (via cookie banner)"],
                  ["Review content", "Displaying verified traveler reviews publicly", "Consent"],
                ].map(([data, why, basis]) => (
                  <tr key={data}>
                    <td className="p-2 border border-stone-100 font-medium">{data}</td>
                    <td className="p-2 border border-stone-100">{why}</td>
                    <td className="p-2 border border-stone-100 text-stone-500">{basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">3. How We Share Your Data</h2>
            <p><strong>We do NOT sell your personal data.</strong> We share data only in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-1.5 text-stone-600 mt-2">
              <li><strong>With operators:</strong> When you submit a booking request, your name, email, phone, date, group size, and special requests are shared with the relevant operator so they can confirm your booking. The operator is an independent third party and has their own privacy obligations.</li>
              <li><strong>With Supabase (our database provider):</strong> All data is stored on Supabase infrastructure (AWS EU regions), which is GDPR-compliant. See their privacy policy at supabase.com/privacy.</li>
              <li><strong>With legal authorities:</strong> We may disclose data if required by Moroccan law, court order, or to protect safety and prevent fraud.</li>
              <li><strong>In chat messages:</strong> Messages exchanged between a traveler and operator via the in-platform chat are visible to both parties and stored securely in our database. They are not visible to any other user.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">4. Cookies (Law 09-08 + GDPR)</h2>
            <p>We use minimal cookies necessary for the platform to function (authentication session cookies). Analytics cookies require your consent, which you can give or withdraw via our cookie banner. Under CNDP guidance, we have filed a simplified notification for cookie processing.</p>
            <p className="mt-2">We do not use advertising or cross-site tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">5. Data Retention</h2>
            <ul className="list-disc list-inside space-y-1 text-stone-600">
              <li><strong>Newsletter subscriptions:</strong> Until you unsubscribe, then deleted within 30 days</li>
              <li><strong>Account data:</strong> Duration of account + 2 years after deletion request (for dispute resolution)</li>
              <li><strong>Booking records:</strong> 5 years from booking date (financial and legal compliance)</li>
              <li><strong>Chat messages:</strong> 2 years from booking date, then permanently deleted</li>
              <li><strong>Operator listings:</strong> Until removed by operator or Imourig + 1 year</li>
              <li><strong>Reviews:</strong> Until removed by Imourig or reviewer + 1 year</li>
              <li><strong>Analytics logs (IP):</strong> 12 months in aggregate form</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">6. Your Rights</h2>
            <p>Under Morocco Law 09-08 and GDPR (EU residents), you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 mt-2">
              <li><strong>Access</strong> — request a copy of your personal data we hold</li>
              <li><strong>Rectification</strong> — correct inaccurate or incomplete data</li>
              <li><strong>Erasure</strong> (&ldquo;right to be forgotten&rdquo;) — delete your data, subject to legal retention requirements</li>
              <li><strong>Object</strong> — stop processing based on legitimate interests</li>
              <li><strong>Restrict processing</strong> — limit how we use your data</li>
              <li><strong>Portability</strong> (EU/GDPR) — receive your data in machine-readable format</li>
              <li><strong>Withdraw consent</strong> — at any time, without affecting lawfulness of prior processing</li>
            </ul>
            <p className="mt-3">To exercise any right: <a href="mailto:privacy@imourig.com" className="text-amber-600 underline">privacy@imourig.com</a>. We respond within <strong>30 days</strong> (Law 09-08) / <strong>1 month</strong> (GDPR).</p>
            <p className="mt-2">Note: Deleting your account does not automatically delete reviews you have submitted publicly, as these form part of the platform&apos;s trust system. Request review removal separately if needed.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">7. Cross-Border Data Transfers</h2>
            <p>Your data is stored on servers operated by Supabase (AWS EU regions, primarily Frankfurt).
            Supabase is GDPR-compliant and processes data under Standard Contractual Clauses (SCCs).
            For Morocco Law 09-08, transfers outside Morocco are conducted with appropriate CNDP-notified safeguards.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">8. Data Breach Notification (Law 07-26)</h2>
            <p>Under Morocco Law 07-26, in the event of a data breach that affects your rights, we will:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 mt-2">
              <li>Notify the CNDP within <strong>72 hours</strong> of discovery</li>
              <li>Notify affected users without undue delay where the breach poses a high risk to their rights and freedoms</li>
              <li>Take immediate steps to contain and remediate the breach</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">9. Children&apos;s Privacy</h2>
            <p>This platform is not directed at children under 16. We do not knowingly collect personal data from children under 16. If you believe a child has provided personal data, contact us immediately and we will delete it.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">10. Security</h2>
            <p>We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), row-level security on our database (Supabase RLS), hashed passwords managed by Supabase Auth, and regular security reviews. No system is 100% secure; we encourage you to use a strong password and not share your credentials.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">11. Complaints</h2>
            <p>If you believe we have not handled your data correctly:</p>
            <ul className="list-disc list-inside space-y-1 text-stone-600">
              <li><strong>Morocco:</strong> File a complaint with CNDP at <a href="https://cndp.ma" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">cndp.ma</a></li>
              <li><strong>EU residents:</strong> Contact your national Data Protection Authority (DPA)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-stone-900 mb-3">12. Changes to This Policy</h2>
            <p>We may update this policy when the platform changes or new legal requirements arise. Material changes will be notified by email (registered users) or by a prominent notice on this page. The &ldquo;Last updated&rdquo; date at the top always reflects the current version.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
