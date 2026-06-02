import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — Imourig",
  description: "Imourig affiliate disclosure — how we earn revenue and how it affects our recommendations.",
};

const LAST_UPDATED = "1 June 2026";

export default function AffiliateDisclosurePage() {
  return (
    <div className="pt-20 min-h-screen bg-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-black text-foreground mb-2">Affiliate Disclosure</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: {LAST_UPDATED}</p>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Short version:</strong> Some links on Imourig are affiliate links. When you click them and book or buy something, we may earn a small commission — at no extra cost to you. This helps fund the platform. We always recommend based on quality, not commission rates.
        </div>

        <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">1. What Is an Affiliate Link?</h2>
            <p>An affiliate link is a tracked URL that identifies Imourig as the source of a referral to a third-party website (such as a hotel booking platform, airline, or tour provider). When you click an affiliate link and complete a purchase or booking, the third party pays us a commission.</p>
            <p className="mt-2">This commission is paid by the business, not by you. You pay the same price whether you use our link or go directly to the website.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">2. What We Link To</h2>
            <p>Imourig may contain affiliate links to the following types of services:</p>
            <ul className="list-disc list-inside space-y-1.5 text-foreground/80 mt-2">
              <li><strong>Hotel and accommodation booking platforms</strong> (e.g. Booking.com, Agoda, Hostelworld) — where property listings include a &ldquo;Book&rdquo; link</li>
              <li><strong>Travel insurance providers</strong> — recommended in our safety and trip planning guides</li>
              <li><strong>Transport services</strong> — including shuttle and bus booking tools</li>
              <li><strong>Travel gear and equipment retailers</strong> — referenced in packing or activity guides</li>
            </ul>
            <p className="mt-3">We only include affiliate links for products and services we would recommend regardless of any commission. Commission rates do not influence which services we feature or rank.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">3. Our Primary Revenue Model</h2>
            <p>Imourig is primarily a marketplace. Our main source of revenue is a <strong>10% commission on confirmed bookings</strong> made through the platform, paid by operators — not by travelers. Affiliate revenue from external links is supplementary.</p>
            <p className="mt-2">This means our core interest is in the quality of the operators and experiences listed on the platform, not in pushing users to external affiliate links.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">4. Editorial Independence</h2>
            <p>Our guides, safety tips, destination pages, and blog content are written to be genuinely useful to travelers. We do not:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>Write positive reviews in exchange for commission arrangements</li>
              <li>Rank or feature products/services based on commission rates</li>
              <li>Accept payment from third parties to be included in guides or &ldquo;best of&rdquo; lists</li>
              <li>Suppress negative information about affiliate partners</li>
            </ul>
            <p className="mt-2">If we recommend something, it is because we believe it is genuinely good for Morocco travelers.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">5. FTC Compliance (US Readers)</h2>
            <p>In accordance with the US Federal Trade Commission (FTC) guidelines (16 CFR Part 255), we disclose that some links on this website are affiliate links. This disclosure applies to all content on imourig.com where such links appear, including blog posts, destination guides, tips pages, and property listings.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">6. How to Identify Affiliate Links</h2>
            <p>Affiliate links on Imourig may appear as:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/80 mt-2">
              <li>&ldquo;Book on [Platform]&rdquo; buttons on property listing pages</li>
              <li>Links in blog posts and destination guides pointing to accommodation, insurance, or gear sites</li>
            </ul>
            <p className="mt-2">When in doubt, this page serves as a blanket disclosure for all affiliate relationships on the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-foreground mb-3">7. Questions</h2>
            <p>If you have any questions about our affiliate relationships or editorial policy, contact us at <a href="mailto:hello@imourig.com" className="text-primary underline">hello@imourig.com</a>.</p>
          </section>

          <div className="pt-4 border-t border-border flex flex-wrap gap-4 text-sm">
            <Link href="/en/terms" className="text-primary hover:text-amber-700 underline">Terms & Conditions</Link>
            <Link href="/en/privacy" className="text-primary hover:text-amber-700 underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
