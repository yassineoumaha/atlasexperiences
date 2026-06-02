import type { Metadata } from "next";
import { Mail, MessageCircle, Clock, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Imourig",
  description: "Contact the Imourig team. Report inaccuracies, partner with us, or ask for help planning your Morocco trip.",
};

const topics = [
  { icon: "🏠", title: "List your property or service", desc: "Hotels, riads, taxi drivers, tour guides — list for free", href: "/en/list-your-property" },
  { icon: "✏️", title: "Report inaccurate information", desc: "Help us keep our guides honest and up-to-date" },
  { icon: "🤝", title: "Partnership or press enquiry", desc: "Media, affiliate programs, B2B partnerships" },
  { icon: "❓", title: "Trip planning question", desc: "Use WhatsApp for fastest response" },
];

export default function ContactPage() {
  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="bg-stone-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Contact Us</h1>
          <p className="text-white/70 text-lg">
            We&apos;re a small team — we read every message.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <a
            href="mailto:hello@imourig.com"
            className="flex items-start gap-4 bg-white border border-stone-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="font-bold text-stone-900 mb-0.5">Email</div>
              <div className="text-amber-600 text-sm font-medium">hello@imourig.com</div>
              <div className="text-stone-400 text-xs mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Reply within 48 hours
              </div>
            </div>
          </a>

          <a
            href="https://wa.me/212600000000?text=Hello%20Atlas%20Maroc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 bg-white border border-stone-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-green-200 transition-all group"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
              <MessageCircle className="w-5 h-5 text-green-600 fill-green-600" />
            </div>
            <div>
              <div className="font-bold text-stone-900 mb-0.5">WhatsApp</div>
              <div className="text-green-600 text-sm font-medium">+212 600 000 000</div>
              <div className="text-stone-400 text-xs mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Usually within a few hours
              </div>
            </div>
          </a>
        </div>

        {/* Topic selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-stone-900 mb-6">What can we help with?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topics.map((t) => (
              <div
                key={t.title}
                className="flex items-start gap-3 bg-stone-50 rounded-xl p-4 border border-stone-100"
              >
                <span className="text-2xl shrink-0">{t.icon}</span>
                <div>
                  <div className="font-bold text-stone-800 text-sm">{t.title}</div>
                  <div className="text-stone-500 text-xs mt-0.5">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-stone-50 rounded-2xl border border-stone-100 p-6">
          <h2 className="text-xl font-black text-stone-900 mb-5 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            Send a Message
          </h2>
          <form
            action="mailto:hello@imourig.com"
            method="POST"
            encType="text/plain"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 outline-none focus:border-amber-400 transition-colors bg-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 outline-none focus:border-amber-400 transition-colors bg-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Subject</label>
              <select
                name="subject"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 outline-none focus:border-amber-400 transition-colors bg-white"
              >
                <option>Trip planning question</option>
                <option>List my property / service</option>
                <option>Report inaccurate information</option>
                <option>Partnership / press</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-stone-800 outline-none focus:border-amber-400 transition-colors bg-white resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Send Message
            </button>
          </form>
          <p className="text-stone-400 text-xs mt-4 text-center">
            Alternatively, email us directly at hello@imourig.com
          </p>
        </div>
      </div>
    </div>
  );
}
