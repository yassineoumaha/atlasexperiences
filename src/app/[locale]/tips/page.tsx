import type { Metadata } from "next";
import Link from "next/link";
import { Shield, AlertTriangle, CheckCircle, Info, MapPin, DollarSign, Users, Star } from "lucide-react";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Morocco Travel Safety Tips — Avoid Scams & Overpaying",
  description:
    "Practical advice for tourists in Morocco: how to avoid common scams, negotiate fairly, stay safe in medinas, and travel like a local. Updated 2026.",
  keywords: ["Morocco safety tips", "Morocco scams", "Morocco travel advice", "medina Morocco", "Morocco tourist tips"],
};

const TIPS = [
  {
    icon: <MapPin className="w-6 h-6" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    category: "Medinas & Souks",
    items: [
      {
        title: "The \"Helpful Stranger\" Guide Scam",
        desc: "Someone approaches you in the medina claiming you're going the wrong way, then leads you to a shop and demands payment or the shop owner pays them a commission from your purchase. If you need directions, ask shopkeepers (they have no reason to lead you astray) or use Google Maps offline.",
        type: "scam",
      },
      {
        title: "Henna artists at tourist spots",
        desc: "Women near tourist monuments will offer to apply a small henna design — sometimes without asking — then demand 200–500 MAD. Only use henna artists where prices are clearly displayed. Agree on a price before they touch your hand.",
        type: "scam",
      },
      {
        title: "Photo requests for your animals",
        desc: "Snake charmers and men with monkeys near Jemaa el-Fna or Aït Benhaddou will let you take photos, then demand large sums. Move past quickly if not interested; a firm \"la shukran\" (no thank you) works.",
        type: "scam",
      },
      {
        title: "\"The shop is free to look\" pressure tactic",
        desc: "You're invited in for \"free\" mint tea — then pressured to buy something to justify the tea. You owe nothing. Accept the tea if you like, browse genuinely, and leave without guilt if you don't want to buy.",
        type: "tip",
      },
      {
        title: "Bargaining is normal and expected",
        desc: "In souks, the first price is almost always 2–4× the fair price. Counter at 30–40% of the asking price and meet in the middle. Never start bargaining unless you intend to buy — walking away after agreeing on a price is considered rude.",
        type: "info",
      },
    ],
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    category: "Money & Prices",
    items: [
      {
        title: "Know the fair prices before you go",
        desc: "Rough benchmarks: mint tea 5–15 MAD, street food (harira, msemen) 5–20 MAD, a small souvenir tagine 50–120 MAD, a leather bag (genuine) 150–400 MAD, a short petit-taxi ride 10–25 MAD. Tourists often pay 3–5× the local price.",
        type: "info",
      },
      {
        title: "ATMs are safer than exchange bureaus",
        desc: "Airport exchange desks often offer terrible rates. Use ATMs in banks (Attijariwafa, CIH, BMCE). Avoid exchange stands in medinas — short-changing tricks are common. Check your withdrawal fees with your home bank first.",
        type: "tip",
      },
      {
        title: "Restaurant \"tourist menus\" vs. local plates",
        desc: "Restaurants facing major squares (like Jemaa el-Fna) charge 4–6× more than restaurants one street back. A decent set menu in a local restaurant is 50–80 MAD. The same meal on the square can be 250+ MAD.",
        type: "info",
      },
      {
        title: "Taxi meters — insist on them",
        desc: "Petit taxis in cities are legally required to use meters. If the driver refuses, get out and take the next one. Grand taxis (intercity) have fixed shared fares — ask locals what the going rate is before you board.",
        type: "tip",
      },
      {
        title: "Tipping culture",
        desc: "Tipping is appreciated but not obligatory. For restaurants: round up or leave 10%. For hotel housekeeping: 10–20 MAD/day. For a tour guide: 50–100 MAD per day is generous. Never tip someone who scammed you.",
        type: "info",
      },
    ],
  },
  {
    icon: <Shield className="w-6 h-6" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    category: "Safety & Security",
    items: [
      {
        title: "Keep valuables out of sight",
        desc: "Pickpocketing happens in crowded medinas and on public buses. Use a money belt or inside jacket pocket. Keep your phone face-down on restaurant tables. Never leave bags unattended.",
        type: "tip",
      },
      {
        title: "Photographs of people require consent",
        desc: "Photographing people without asking can cause confrontations — especially with women, men in religious dress, or market vendors. Ask first (a smile and pointing at your camera works across languages). Offer a small tip if someone posed for you.",
        type: "info",
      },
      {
        title: "Dress modestly outside beach/resort areas",
        desc: "Morocco is a Muslim country. Shorts and sleeveless tops are fine on the beach and in tourist resorts, but in medinas, mosques, and smaller towns, covering shoulders and knees shows respect and reduces unwanted attention for both men and women.",
        type: "info",
      },
      {
        title: "Drink only bottled or filtered water",
        desc: "Tap water in Morocco is technically treated but travellers' stomachs are not adapted to local microbes. Buy 1.5L bottles (5–8 MAD at supermarkets) rather than paying restaurant prices. Avoid ice unless you're in a reputable establishment.",
        type: "tip",
      },
      {
        title: "Emergency numbers",
        desc: "Police: 19 · Gendarmerie: 177 · Ambulance/SAMU: 15 · Tourist Police (Brigade Touristique): available in Marrakech, Fez, Agadir — ask at your hotel for the local number.",
        type: "emergency",
      },
    ],
  },
  {
    icon: <Users className="w-6 h-6" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
    category: "Tours & Activities",
    items: [
      {
        title: "Book tours through verified platforms",
        desc: "Street tours sold by hustlers near monuments are often overpriced, uninsured, and the guide may abandon you mid-way. Booking through a verified platform (like Imourig) means the operator is vetted, insured, and accountable.",
        type: "tip",
      },
      {
        title: "Sahara tours — what to watch out for",
        desc: "Many agencies sell '1-night Sahara tours' that rush through the desert in 20 hours of driving for 30 minutes of dunes. Reputable tours are 3+ days with overnight camping. Check reviews and ask for the exact itinerary before paying.",
        type: "scam",
      },
      {
        title: "Surf school safety",
        desc: "Ensure your surf school provides life vests for beginners and has a qualified instructor in the water with you. Agadir and Taghazout have strong rip currents. Never surf alone on an unfamiliar beach.",
        type: "info",
      },
      {
        title: "Camel ride pricing",
        desc: "Short camel rides near Merzouga and Marrakech: agree the price for the full ride before mounting — not per photo, not per loop. Get any included items (tea, photos, return) confirmed in writing or with a clear verbal agreement.",
        type: "tip",
      },
      {
        title: "Hammam — public vs. tourist",
        desc: "Tourist hammams in medinas are priced 150–400 MAD. Public hammams used by locals cost 15–30 MAD. Both are legitimate — tourist hammams have English-speaking staff; public hammams are a more authentic (and cheaper) experience.",
        type: "info",
      },
    ],
  },
];

const TYPE_BADGE: Record<string, { label: string; style: string }> = {
  scam:      { label: "Common scam",  style: "bg-red-100 text-red-700" },
  tip:       { label: "Pro tip",       style: "bg-amber-100 text-amber-700" },
  info:      { label: "Good to know", style: "bg-blue-100 text-blue-700" },
  emergency: { label: "Emergency",    style: "bg-rose-100 text-rose-700" },
};

export default async function TipsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm px-4 py-1.5 rounded-full mb-5">
            <Shield className="w-4 h-4 text-emerald-400" /> Updated for 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            {dict.tips.title}
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            {dict.tips.subtitle}
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10 flex gap-4">
          <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 mb-1">Morocco is safe — and amazing</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              The vast majority of Moroccan people are genuinely hospitable and welcoming.
              Tourism hustling happens in high-traffic tourist areas, not everywhere. Being aware
              of the common patterns below will let you relax and enjoy the country without
              defensiveness. Most of these situations are easy to sidestep once you know what to look for.
            </p>
          </div>
        </div>

        {/* Tips by category */}
        <div className="space-y-12">
          {TIPS.map((section) => (
            <div key={section.category}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${section.bg} ${section.color} flex items-center justify-center`}>
                  {section.icon}
                </div>
                <h2 className="text-2xl font-black text-stone-900">{section.category}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map((item) => {
                  const badge = TYPE_BADGE[item.type] ?? TYPE_BADGE.info;
                  return (
                    <div key={item.title}
                      className={`bg-white border ${section.border} rounded-2xl p-5 shadow-sm`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                        <h3 className="font-black text-stone-900 text-base">{item.title}</h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap ${badge.style}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-stone-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick reference card */}
        <div className="mt-14 bg-stone-900 text-white rounded-3xl p-8">
          <h3 className="text-xl font-black mb-5 text-amber-400">Quick Reference — Fair Prices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              ["Petit taxi (short city ride)", "10–25 MAD"],
              ["Grand taxi (intercity, shared)", "20–60 MAD per seat"],
              ["Street food (harira, msemen, sfenj)", "5–20 MAD"],
              ["Café coffee / mint tea", "5–15 MAD"],
              ["1.5L bottled water", "5–8 MAD"],
              ["Local restaurant set menu", "50–80 MAD"],
              ["Tourist restaurant (same food)", "150–350 MAD"],
              ["Small souvenir (keyring, tile)", "5–30 MAD"],
              ["Quality argan oil (250ml)", "60–120 MAD"],
              ["Leather bag (genuine, negotiated)", "150–400 MAD"],
              ["Short camel ride", "50–150 MAD (agree upfront)"],
              ["1-hour surf lesson", "150–250 MAD"],
              ["Hammam entry (public)", "10–30 MAD"],
              ["Tourist hammam + scrub", "150–350 MAD"],
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between gap-2 border-b border-stone-800 pb-2">
                <span className="text-stone-300">{item}</span>
                <span className="text-amber-400 font-bold shrink-0">{price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-stone-500 mb-4">Ready to book a trusted local experience?</p>
          <Link href={`/${locale}/experiences`}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
            <Star className="w-4 h-4" /> Browse Verified Experiences
          </Link>
        </div>
      </div>
    </div>
  );
}
