"use client";

import { useState } from "react";
import { Heart, X, Coffee, CreditCard } from "lucide-react";

export default function DonateButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-stone-400 hover:text-rose-400 text-sm transition-colors"
        aria-label="Support Imourig"
      >
        <Heart className="w-4 h-4" /> Support Us
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-stone-300 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <img src="/logo.png" alt="Imourig" className="h-14 w-auto mx-auto mb-1" />
              <h2 className="text-xl font-black text-stone-900 mb-2">Support Imourig</h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Imourig is free for travelers and local operators. If our guides have helped you,
                a small donation keeps the platform running and the content honest.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="https://buymeacoffee.com/atlasmaroc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <Coffee className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-black">Buy Me a Coffee</div>
                  <div className="text-xs font-normal opacity-75">One-time, any amount</div>
                </div>
              </a>

              <a
                href="https://www.paypal.com/donate?hosted_button_id=ATLASMAROC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <CreditCard className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-black">Donate via PayPal</div>
                  <div className="text-xs font-normal opacity-75">Card, PayPal balance, or bank</div>
                </div>
              </a>
            </div>

            <p className="text-stone-400 text-xs text-center mt-4">
              Donations are voluntary. Imourig is not a registered charity.
              All donations go toward server costs and content creation.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
