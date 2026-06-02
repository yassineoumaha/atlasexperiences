/**
 * Imourig line-art activity sketches.
 * Minimal continuous-line SVG drawings used as scroll-reactive backgrounds.
 * Each draws with `currentColor`; the parent controls color/opacity.
 * Paths use round caps/joins for a hand-sketch feel.
 */

type SketchProps = { className?: string };

const baseStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

function wrap(children: React.ReactNode, className?: string) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g {...baseStroke}>{children}</g>
    </svg>
  );
}

/** Surfer riding a wave */
export function SketchSurfer({ className }: SketchProps) {
  return wrap(
    <>
      {/* wave */}
      <path d="M20 210 C 80 150, 140 150, 180 190 C 220 230, 300 240, 380 170 C 340 230, 240 280, 150 250 C 90 230, 50 230, 20 210 Z" />
      <path d="M60 200 C 110 175, 150 180, 175 200" />
      {/* board */}
      <path d="M150 215 C 175 205, 215 205, 250 218" />
      {/* surfer body */}
      <path d="M195 215 L 198 188 L 210 170" />
      <circle cx="207" cy="158" r="10" />
      {/* arms */}
      <path d="M198 188 L 178 178 M 198 188 L 222 182" />
      {/* legs */}
      <path d="M198 215 L 180 216 M 210 170 L 228 215" />
    </>,
    className,
  );
}

/** Mountain biker climbing */
export function SketchBiker({ className }: SketchProps) {
  return wrap(
    <>
      {/* mountain line */}
      <path d="M10 250 L 120 130 L 180 180 L 260 80 L 390 250" />
      {/* wheels */}
      <circle cx="150" cy="225" r="34" />
      <circle cx="250" cy="225" r="34" />
      {/* frame */}
      <path d="M150 225 L 205 225 L 250 225 M 205 225 L 188 178 L 150 225 M 188 178 L 232 178" />
      {/* rider */}
      <path d="M188 178 L 210 150 L 232 178 M 210 150 L 214 124" />
      <circle cx="214" cy="113" r="10" />
      <path d="M210 150 L 234 178" />
    </>,
    className,
  );
}

/** Hiker with backpack and trekking pole */
export function SketchHiker({ className }: SketchProps) {
  return wrap(
    <>
      {/* trail / hill */}
      <path d="M10 260 C 120 230, 200 250, 390 200" />
      <path d="M250 200 L 320 120 L 360 150" />
      {/* body */}
      <path d="M180 250 L 195 195 L 188 160" />
      <circle cx="190" cy="148" r="11" />
      {/* backpack */}
      <path d="M195 175 C 215 172, 218 200, 200 205" />
      {/* legs */}
      <path d="M195 195 L 215 250 M 195 195 L 180 250" />
      {/* arm + pole */}
      <path d="M188 175 L 210 195 L 218 255" />
    </>,
    className,
  );
}

/** Camel in the dunes (desert) */
export function SketchCamel({ className }: SketchProps) {
  return wrap(
    <>
      {/* dunes */}
      <path d="M10 250 C 90 210, 150 250, 220 235 C 290 220, 340 250, 390 235" />
      {/* body + humps */}
      <path d="M120 200 C 135 165, 155 165, 170 185 C 185 160, 210 160, 222 188 L 250 195" />
      {/* neck + head */}
      <path d="M250 195 C 270 190, 280 160, 278 140 C 277 128, 288 122, 296 128 C 300 132, 298 140, 292 142" />
      {/* legs */}
      <path d="M135 198 L 132 245 M 165 195 L 168 245 M 210 192 L 206 245 M 240 195 L 245 245" />
    </>,
    className,
  );
}

/** Tagine / cooking pot (food) */
export function SketchTagine({ className }: SketchProps) {
  return wrap(
    <>
      {/* conical lid */}
      <path d="M150 180 L 200 80 L 250 180" />
      <circle cx="200" cy="72" r="8" />
      {/* base dish */}
      <path d="M130 180 L 270 180 C 270 210, 240 225, 200 225 C 160 225, 130 210, 130 180 Z" />
      {/* steam */}
      <path d="M185 70 C 178 55, 192 50, 185 35 M 215 70 C 208 55, 222 50, 215 35" />
    </>,
    className,
  );
}

/** Compass / route motif (map page) */
export function SketchCompass({ className }: SketchProps) {
  return wrap(
    <>
      <circle cx="200" cy="150" r="90" />
      <circle cx="200" cy="150" r="70" />
      {/* needle */}
      <path d="M200 95 L 222 150 L 200 205 L 178 150 Z" />
      {/* dashed route */}
      <path d="M40 240 C 110 200, 130 110, 200 60 C 270 110, 300 210, 370 250" strokeDasharray="2 14" />
      {/* pins */}
      <path d="M200 60 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0" />
    </>,
    className,
  );
}

/** Moroccan landmark arch / Koutoubia-style minaret (destinations) */
export function SketchLandmark({ className }: SketchProps) {
  return wrap(
    <>
      {/* minaret tower */}
      <path d="M170 250 L 170 110 L 230 110 L 230 250" />
      <path d="M170 110 L 200 70 L 230 110" />
      <path d="M200 70 L 200 48" />
      <circle cx="200" cy="42" r="7" />
      {/* keyhole arch door */}
      <path d="M188 250 L 188 175 C 188 158, 212 158, 212 175 L 212 250" />
      {/* horizon arches */}
      <path d="M60 250 L 60 200 C 60 182, 96 182, 96 200 L 96 250 M 304 250 L 304 200 C 304 182, 340 182, 340 200 L 340 250" />
    </>,
    className,
  );
}

export const ACTIVITY_SKETCHES = {
  surf: SketchSurfer,
  adventure: SketchBiker,
  hiking: SketchHiker,
  desert: SketchCamel,
  food: SketchTagine,
  compass: SketchCompass,
  landmark: SketchLandmark,
} as const;

export type SketchKey = keyof typeof ACTIVITY_SKETCHES;
