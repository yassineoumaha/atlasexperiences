import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_EFFECTIVE_LABEL } from "@/lib/legal";
import { TERMS_CONTENT } from "@/lib/legal-content";
import LocalizedLegalDoc from "@/components/LocalizedLegalDoc";

export const metadata: Metadata = {
  title: "Terms & Conditions — Imourig",
  description: "Terms and conditions for using Imourig — Morocco's local experience marketplace. Governs traveler bookings and operator listings.",
};

const LAST_UPDATED = LEGAL_EFFECTIVE_LABEL;
const COMMISSION = "10%";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale === "ar" || locale === "fr") {
    return (
      <LocalizedLegalDoc
        title={locale === "ar" ? "الشروط والأحكام" : "Conditions Générales"}
        lastUpdated={(locale === "ar" ? "آخر تحديث: " : "Dernière mise à jour : ") + LAST_UPDATED}
        doc={TERMS_CONTENT[locale]}
        englishHref="/en/terms"
        isRTL={locale === "ar"}
      />
    );
  }
  return (
    <div className="pt-20 min-h-screen bg-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: {LAST_UPDATED}</p>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Two sets of terms apply:</strong> Sections 1–8 apply to all users (travelers). Sections 9–14 apply additionally to operators (guides, coaches, instructors) who list experiences on the platform.
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed">

          {/* ── PART A: ALL USERS ── */}
          <div className="border-l-4 border-amber-400 pl-4">
            <p className="font-black text-foreground/80 uppercase text-xs tracking-widest">Part A — All Users</p>
          </div>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">1. What Imourig Is</h2>
            <p>Imourig (&ldquo;the Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is an online marketplace connecting travelers with local experience operators in Morocco.
            We provide the technology that enables travelers to discover, inquire, and book activities such as surf lessons, desert tours, cooking classes, and other local experiences.</p>
            <p className="mt-2">We are <strong>not</strong> a tour operator, travel agency, or transport provider. We do not directly deliver any experience listed on this platform. Each operator is an independent third party.</p>
            <p className="mt-2">Some discovery features are optional conveniences. For example, &ldquo;Experiences near me&rdquo; uses your device location only when you choose to enable it, solely to suggest the nearest Moroccan city; it is never required to use the platform. See our <Link href="/en/privacy" className="text-primary underline">Privacy Policy</Link> for details.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">2. Acceptance of Terms</h2>
            <p>By accessing or using Imourig — whether as a traveler or operator — you agree to these Terms. If you do not agree, stop using the platform immediately.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">3. Booking Requests</h2>
            <p>When you submit a booking request through Imourig:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>Your request is sent directly to the operator. It is <strong>not a confirmed booking</strong> until the operator explicitly confirms via email or message.</li>
              <li>No payment is collected by Imourig at the time of the request. Payment is arranged directly between you and the operator unless otherwise stated.</li>
              <li>You must provide accurate personal details (name, email, group size, date). Inaccurate information may result in the operator declining your request.</li>
              <li>A booking is confirmed only when the operator sends you a written confirmation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">4. Cancellations & Refunds</h2>
            <p>Cancellation policies are set by each individual operator and displayed on the experience listing page. Imourig is not responsible for enforcing refunds between travelers and operators. If a dispute arises, contact the operator first, then contact us at <a href="mailto:support@imourig.com" className="text-primary underline">support@imourig.com</a>.</p>
            <p className="mt-2">Under Morocco Consumer Protection Law 31-08, if you purchased a digital service directly through Imourig, you have the right to withdraw within <strong>14 days</strong> provided the service has not yet been performed.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">5. Operator Independence</h2>
            <p>All experience operators are independent third parties, not employees or agents of Imourig. We do not control how they deliver their services. Imourig:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>Does not guarantee the quality, safety, accuracy, or availability of any listed experience</li>
              <li>Is not responsible for any injury, loss, damage, or dispute arising from your interaction with an operator</li>
              <li>Does not hold any insurance on behalf of operators or travelers</li>
              <li>Verifies operators in good faith but cannot guarantee all information is current</li>
            </ul>
            <p className="mt-2">You book and participate in any experience entirely at your own risk. We strongly recommend checking that operators hold valid Moroccan licences for regulated activities (guide, instructor, transport), and purchasing appropriate travel insurance.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>Submit false, misleading, or fraudulent booking requests</li>
              <li>Attempt to contact operators outside the platform to avoid platform fees (circumvention)</li>
              <li>Post fake reviews or manipulate ratings</li>
              <li>Use the platform to harass, threaten, or defame operators or other users</li>
              <li>Scrape, copy, or reproduce platform content without permission</li>
            </ul>
            <p className="mt-2">Violations may result in immediate account suspension and, where applicable, legal action.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">7. Reviews</h2>
            <p>Reviews submitted by travelers are moderated by Imourig before publication. By submitting a review, you confirm it reflects your genuine experience. We reserve the right to reject or remove reviews that are defamatory, fraudulent, or violate these terms. We do not edit the substance of reviews.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">8. Limitation of Liability</h2>
            <p>To the fullest extent permitted by Moroccan law, Imourig is not liable for:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>Any personal injury, death, illness, or property damage during an experience</li>
              <li>Any financial loss arising from a cancelled, modified, or unfulfilled booking</li>
              <li>Indirect, consequential, or special damages of any kind</li>
              <li>Any content or representations made by operators on their listings</li>
            </ul>
            <p className="mt-2">Our maximum aggregate liability to you for any claim arising out of or related to these Terms is limited to <strong>MAD 500 (approximately USD 50)</strong>, or the amount you paid directly to Imourig, whichever is greater.</p>
          </section>

          {/* ── PART B: OPERATORS ── */}
          <div className="border-l-4 border-stone-900 pl-4 mt-10">
            <p className="font-black text-foreground/80 uppercase text-xs tracking-widest">Part B — Operators (Guides, Coaches & Instructors)</p>
          </div>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">9. Operator Eligibility</h2>
            <p>To list on Imourig as an operator, you must:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>Be a legal resident of Morocco or hold a valid Moroccan business registration</li>
              <li>Hold all required licences for the services you offer (e.g. surf instructor certification, official guide licence, transport permit)</li>
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and truthful information during registration</li>
            </ul>
            <p className="mt-2">Imourig reserves the right to verify your identity and licences, and to reject or remove any listing that does not meet these requirements.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">10. Platform Commission — {COMMISSION}</h2>
            <p>Imourig charges a commission of <strong>{COMMISSION} of each confirmed booking value</strong> (the total amount paid by the traveler for the experience).</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li><strong>Listing is free.</strong> No monthly fees, no setup fees.</li>
              <li>Commission is calculated on the full booking price (price per person × group size).</li>
              <li>Invoices are issued <strong>monthly</strong> for all completed bookings in the prior calendar month.</li>
              <li>Payment is due within <strong>14 days</strong> of invoice date, by bank transfer or other agreed method.</li>
              <li>Operators who fail to pay within 30 days of invoice may have their listings suspended or removed.</li>
              <li>Imourig may change the commission rate with <strong>30 days written notice</strong>. Continued use after notice constitutes acceptance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">11. Operator Responsibilities</h2>
            <p>As an operator, you are solely responsible for:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>Delivering experiences as described in your listing</li>
              <li>Responding to booking requests within <strong>24 hours</strong></li>
              <li>Maintaining appropriate insurance for your activities</li>
              <li>Complying with all applicable Moroccan laws (safety, licensing, tax)</li>
              <li>Declaring and paying any applicable Moroccan income tax on earnings</li>
              <li>Accurately reporting all confirmed bookings to Imourig for invoicing</li>
              <li>Handling cancellations and refunds according to your stated cancellation policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">12. Prohibited Conduct (Operators)</h2>
            <p>Operators must not:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li><strong>Circumvent commissions</strong> — redirecting travelers to book directly off-platform to avoid the commission is a material breach of these terms and may result in permanent removal and legal action to recover owed fees</li>
              <li>Post false availability, pricing, or qualifications</li>
              <li>Solicit or offer bribes for positive reviews</li>
              <li>List experiences in categories where you do not hold the required licence</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">13. Listing Approval & Removal</h2>
            <p>All listings are subject to approval by Imourig before going live. We reserve the right to reject any listing without explanation, or to remove a live listing at any time if it violates these terms, contains inaccurate information, or receives sustained negative feedback. Operators will be notified of removal where possible.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">14. Operator Indemnity</h2>
            <p>You agree to indemnify, defend, and hold Imourig harmless from any claim, liability, damage, or expense (including reasonable legal fees) arising out of your listings, your delivery of experiences, your conduct with travelers, or your breach of these Terms.</p>
          </section>

          {/* ── GENERAL ── */}
          <div className="border-l-4 border-border pl-4 mt-10">
            <p className="font-black text-foreground/80 uppercase text-xs tracking-widest">General</p>
          </div>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">15. Intellectual Property</h2>
            <p>All original content on Imourig (text, design, code, branding) is our property or licensed to us.
            Operators retain ownership of their listing content but grant Imourig a non-exclusive, royalty-free licence to display it on the platform and in marketing materials.
            You may share links and brief excerpts with attribution. Scraping, copying, or reproducing substantial portions without written permission is prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">16. Governing Law & Disputes</h2>
            <p>These Terms are governed by the laws of the Kingdom of Morocco. Any dispute arising from these Terms will first be submitted to good-faith mediation. If unresolved within 30 days, disputes will be submitted to the competent courts of Casablanca, Morocco.</p>
            <p className="mt-2">For EU residents, nothing in these terms removes your mandatory EU consumer rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">17. Changes to These Terms</h2>
            <p>We may update these Terms at any time. Material changes will be notified by email (registered users) or by prominent notice on this page with at least <strong>14 days notice</strong> before taking effect. Continued use after the effective date constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">18. Contact</h2>
            <p>Legal questions: <a href="mailto:legal@imourig.com" className="text-primary underline">legal@imourig.com</a><br />
            Operator support: <a href="mailto:operators@imourig.com" className="text-primary underline">operators@imourig.com</a><br />
            Traveler support: <a href="mailto:support@imourig.com" className="text-primary underline">support@imourig.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
