"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { GA_ID, hasAnalyticsConsent } from "@/lib/analytics";

/**
 * Site analytics. Two independent layers:
 *  - Vercel Analytics: privacy-friendly traffic + Web Vitals, always on (no PII, no cookies).
 *  - GA4: event funnel, injected ONLY after the user grants analytics consent
 *    (Morocco Law 09-08 / GDPR). CookieConsent dispatches `imourig-consent-changed`
 *    when the user accepts, so GA loads immediately without a page reload.
 */
export default function Analytics() {
  const [gaEnabled, setGaEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setGaEnabled(Boolean(GA_ID) && hasAnalyticsConsent());
    sync();
    window.addEventListener("imourig-consent-changed", sync);
    return () => window.removeEventListener("imourig-consent-changed", sync);
  }, []);

  return (
    <>
      <VercelAnalytics />
      {gaEnabled && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  );
}
