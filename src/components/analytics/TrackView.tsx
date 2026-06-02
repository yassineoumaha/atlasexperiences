"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * Fires a single analytics view event on mount. Drop into any server-rendered
 * page to record a view (operator_profile_view, experience_view, category_view,
 * destination_view) without converting the page to a client component.
 */
export function TrackView({
  event,
  props,
}: {
  event: AnalyticsEvent;
  props?: Record<string, string | number | boolean | undefined>;
}) {
  useEffect(() => {
    track(event, props);
    // Fire once per mount; props are primitive identifiers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
