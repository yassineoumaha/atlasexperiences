"use client";

import { useEffect } from "react";

export default function LocaleAttributes({
  locale,
  isRTL,
}: {
  locale: string;
  isRTL: boolean;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);

  return null;
}
