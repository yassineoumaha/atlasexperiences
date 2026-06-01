"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/212600000000?text=Hello%20Atlas%20Maroc%2C%20I%20have%20a%20question%20about%20visiting%20Morocco"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105 group"
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}
