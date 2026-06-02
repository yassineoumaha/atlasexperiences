import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Heart, Users, Star, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Imourig — Our Story and Mission",
  description:
    "We built Imourig because travel platforms were failing Morocco visitors. Honest reviews, real cost breakdowns, and ScamGuard protection for every destination.",
};

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Radical Honesty",
    desc: "We write about Morocco's scams, hidden fees, and real risks. Not because we want to scare you, but because you deserve to arrive prepared.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Built on Local Knowledge",
    desc: "Our guides are written with input from people who actually live in Morocco — not copy-paste from other travel blogs.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community First",
    desc: "Taxi drivers, riad owners, and surf instructors who list on Imourig don't pay commissions. We believe local operators deserve a fair platform.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Transparent Affiliates",
    desc: "We earn commissions when you book through our hotel links (Booking.com, Agoda). We tell you this upfront. It's how we keep this platform free.",
    color: "bg-amber-50 text-amber-600",
  },
];

const stats = [
  { value: "16+", label: "Destinations covered" },
  { value: "6", label: "Blog guides" },
  { value: "4", label: "Languages" },
  { value: "13", label: "Documented scams in ScamGuard" },
];

const why = [
  "Other platforms show hotels without disclosing the tourist tax — we show the real total",
  "Most Morocco travel blogs are written by people who visited once and copy each other",
  "Taxi pricing in Morocco is a mess — we built a reference table and driver directory",
  "Arabic travelers deserve content in Arabic, not Google Translated English",
  "The World Cup 2030 will bring 26 million visitors to Morocco — they need honest guidance now",
];

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <div className="pt-16 min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <img src="/logo.png" alt="Imourig" className="h-20 w-auto [mix-blend-mode:screen]" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
            We built the Morocco travel guide<br className="hidden sm:block" />
            <span className="text-amber-400"> we wish had existed</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl leading-relaxed">
            Morocco is one of the world&apos;s most extraordinary travel destinations. It&apos;s also consistently let down by tourism platforms that hide fees, ignore scams, and treat the country as a generic backdrop.
            Imourig exists to fix that.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-stone-50 rounded-2xl p-5 border border-stone-100">
              <div className="text-3xl font-black text-amber-500 mb-1">{s.value}</div>
              <div className="text-stone-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Why we exist */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-stone-900 mb-2">Why Imourig Exists</h2>
          <p className="text-stone-500 mb-6">Five problems we set out to solve:</p>
          <div className="space-y-3">
            {why.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-stone-50 rounded-xl p-4 border border-stone-100">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-stone-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-stone-900 mb-2">Our Values</h2>
          <p className="text-stone-500 mb-8">What we commit to every time we publish content</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${v.color}`}>
                  {v.icon}
                </div>
                <h3 className="font-black text-stone-900 text-lg mb-2">{v.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How we make money */}
        <div className="bg-stone-50 rounded-2xl border border-stone-100 p-6 mb-16">
          <h2 className="text-2xl font-black text-stone-900 mb-3">How We Make Money (and Why It Matters)</h2>
          <p className="text-stone-600 mb-4 leading-relaxed">
            Imourig earns affiliate commissions when you click our hotel or tour booking links (Booking.com, Agoda, Viator, GetYourGuide). This is standard practice for travel sites.
          </p>
          <p className="text-stone-600 mb-4 leading-relaxed">
            We do <strong>not</strong> accept payment for reviews or sponsored placement. A hotel paying to appear in our listings would undermine the honesty that makes Imourig useful.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Taxi drivers and property owners can list on Imourig for free. We do not charge drivers or small operators commissions — that model kills the diversity that makes Morocco worth visiting.
          </p>
          <p className="text-stone-500 text-sm mt-4">
            Full details in our <Link href="/en/affiliate-disclosure" className="text-amber-600 hover:underline">Affiliate Disclosure</Link>.
          </p>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/en/contact"
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-2xl p-6 text-center transition-colors"
          >
            <div className="text-2xl mb-2">✉️</div>
            <div className="font-black text-lg mb-1">Get in Touch</div>
            <div className="text-stone-400 text-sm">Partner inquiries, corrections, feedback</div>
          </Link>
          <Link
            href="/en/list-your-property"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl p-6 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🏡</div>
            <div className="font-black text-lg mb-1">List Your Property or Service</div>
            <div className="text-amber-100 text-sm">Riad, taxi, tour guide — free listing</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
