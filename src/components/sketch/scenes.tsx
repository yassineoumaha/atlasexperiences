/**
 * Imourig "alive" activity scenes — rich, filled, illustrated.
 * Designed to be scroll-animated by GSAP (ScrollScene). Each exposes
 * .scene-wave (landscape/element that breathes up) and .scene-rider
 * (the figure that travels across).
 *
 * Colors use the zellij palette CSS vars so they adapt to light/dark
 * and to the section's accent. Shapes are filled (not wireframe).
 */

type Props = { className?: string };

/* ---- Surfer riding a swelling wave ---- */
export function SceneSurf({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="surfWave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--zellij-1)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--zellij-1)" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="surfSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--zellij-2)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--zellij-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="600" height="400" fill="url(#surfSky)" />
      <circle cx="490" cy="110" r="46" fill="var(--zellij-2)" fillOpacity="0.55" />
      <g className="scene-wave">
        {/* back swell */}
        <path d="M-40 300 C 120 210, 230 205, 320 255 C 400 300, 470 305, 560 240 C 600 212, 640 218, 660 235 L 660 420 L -40 420 Z" fill="url(#surfWave)" />
        {/* curling lip */}
        <path d="M300 255 C 360 290, 430 296, 520 244 C 540 232, 560 232, 575 244 C 540 296, 470 318, 380 304 C 350 299, 322 286, 300 268 Z" fill="var(--zellij-1)" fillOpacity="0.95" />
        {/* foam */}
        <path d="M300 255 C 360 290, 430 296, 520 244" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="7" strokeLinecap="round" />
        <circle cx="330" cy="288" r="6" fill="#fff" fillOpacity="0.7" />
        <circle cx="360" cy="296" r="4" fill="#fff" fillOpacity="0.6" />
        <circle cx="300" cy="276" r="5" fill="#fff" fillOpacity="0.6" />
        {/* front water */}
        <path d="M-40 330 C 140 270, 240 272, 340 300 C 430 324, 500 322, 590 286 L 660 420 L -40 420 Z" fill="var(--zellij-1)" fillOpacity="0.45" />
      </g>
      <g className="scene-rider">
        {/* board */}
        <path d="M250 256 C 295 244, 355 244, 405 262 C 358 272, 296 272, 250 256 Z" fill="var(--zellij-2)" />
        {/* surfer silhouette */}
        <path d="M300 256 L 295 214 L 326 188 L 322 154" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M330 262 L 348 222" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
        <circle cx="320" cy="142" r="15" fill="currentColor" />
        {/* arms */}
        <path d="M306 200 L 274 186 M 306 200 L 350 196" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ---- Swimmer in water ---- */
export function SceneSwim({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="swimW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--zellij-1)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--zellij-1)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g className="scene-wave">
        <rect x="0" y="250" width="600" height="170" fill="url(#swimW)" />
        <path d="M0 250 C 100 238, 200 262, 300 250 C 400 238, 500 262, 600 250 L 600 270 L 0 270 Z" fill="var(--zellij-1)" fillOpacity="0.5" />
        <path d="M0 290 C 120 280, 220 300, 320 290 C 440 278, 520 300, 600 290" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="4" />
      </g>
      <g className="scene-rider">
        {/* swimmer doing freestyle */}
        <ellipse cx="300" cy="252" rx="70" ry="20" fill="currentColor" fillOpacity="0.9" />
        <circle cx="364" cy="246" r="16" fill="currentColor" />
        {/* stroking arm */}
        <path d="M330 244 C 350 220, 372 218, 388 232" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
        {/* splash */}
        <circle cx="392" cy="230" r="6" fill="#fff" fillOpacity="0.7" />
        <circle cx="240" cy="258" r="7" fill="#fff" fillOpacity="0.6" />
        <circle cx="225" cy="250" r="4" fill="#fff" fillOpacity="0.6" />
      </g>
    </svg>
  );
}

/* ---- Mountain biker ---- */
export function SceneBike({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--zellij-4)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--zellij-4)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <g className="scene-wave">
        <path d="M-40 360 L 150 220 L 270 300 L 420 160 L 660 360 L 660 420 L -40 420 Z" fill="url(#ridge)" />
        <path d="M-40 385 L 180 300 L 320 350 L 500 250 L 660 360 L 660 420 L -40 420 Z" fill="var(--zellij-4)" fillOpacity="0.35" />
        {/* snow cap */}
        <path d="M420 160 L 398 192 L 442 192 Z" fill="#fff" fillOpacity="0.6" />
      </g>
      <g className="scene-rider">
        <circle cx="250" cy="300" r="44" fill="none" stroke="currentColor" strokeWidth="10" />
        <circle cx="370" cy="300" r="44" fill="none" stroke="currentColor" strokeWidth="10" />
        <circle cx="250" cy="300" r="10" fill="currentColor" />
        <circle cx="370" cy="300" r="10" fill="currentColor" />
        <path d="M250 300 L 318 300 L 370 300 M 318 300 L 296 230 L 250 300 M 296 230 L 354 230" fill="none" stroke="var(--zellij-2)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M296 230 L 322 192 L 354 230 M 322 192 L 326 158" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="326" cy="146" r="15" fill="currentColor" />
        <path d="M322 192 L 358 230" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ---- Hiker cresting a hill ---- */
export function SceneHike({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="scene-wave">
        <path d="M-40 380 C 150 320, 320 350, 500 250 C 560 218, 620 224, 660 244 L 660 420 L -40 420 Z" fill="var(--zellij-3)" fillOpacity="0.6" />
        <path d="M380 285 L 470 160 L 520 220 L 560 185 L 600 230 L 600 300 L 380 300 Z" fill="var(--zellij-3)" fillOpacity="0.35" />
        <path d="M470 160 L 452 192 L 492 192 Z" fill="#fff" fillOpacity="0.55" />
      </g>
      <g className="scene-rider">
        <path d="M270 332 L 292 248 L 282 206" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="286" cy="192" r="15" fill="currentColor" />
        {/* backpack */}
        <path d="M296 230 C 330 224, 334 286, 300 292 Z" fill="var(--zellij-2)" />
        <path d="M292 248 L 322 332 M 292 248 L 268 332" fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
        <path d="M282 228 L 320 258 L 332 340" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ---- Camel in the dunes ---- */
export function SceneCamel({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dune" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--zellij-2)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--zellij-4)" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <g className="scene-wave">
        <circle cx="470" cy="150" r="52" fill="var(--zellij-2)" fillOpacity="0.6" />
        <path d="M-40 330 C 120 280, 220 330, 340 310 C 460 290, 540 330, 660 310 L 660 420 L -40 420 Z" fill="url(#dune)" />
        <path d="M-40 365 C 160 325, 300 355, 440 335 C 540 321, 620 345, 660 340 L 660 420 L -40 420 Z" fill="var(--zellij-4)" fillOpacity="0.4" />
      </g>
      <g className="scene-rider">
        <path d="M226 300 C 246 232, 292 232, 314 280 C 336 226, 388 226, 410 286 L 458 298 C 492 288, 510 230, 506 194 C 504 172, 528 162, 542 176 L 524 200 L 462 300 Z"
              fill="currentColor" fillOpacity="0.92" />
        <path d="M254 298 L 248 378 M 308 292 L 314 378 M 396 288 L 390 378 M 446 296 L 454 378"
              fill="none" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ---- Tagine with steam (food/cooking) ---- */
export function SceneFood({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="scene-rider">
        <path d="M226 270 L 300 110 L 374 270 Z" fill="var(--zellij-4)" fillOpacity="0.9" />
        <circle cx="300" cy="100" r="14" fill="var(--zellij-2)" />
        <path d="M196 270 L 404 270 C 404 320, 356 346, 300 346 C 244 346, 196 320, 196 270 Z" fill="var(--zellij-1)" fillOpacity="0.85" />
        <ellipse cx="300" cy="270" rx="104" ry="16" fill="var(--zellij-1)" />
      </g>
      <g className="scene-wave">
        <path d="M276 108 C 262 80, 292 70, 278 40 C 270 22, 286 14, 280 -2" fill="none" stroke="var(--zellij-2)" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.7" />
        <path d="M324 108 C 310 80, 340 70, 326 40 C 318 22, 334 14, 328 -2" fill="none" stroke="var(--zellij-2)" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.5" />
      </g>
    </svg>
  );
}

/* ---- Lantern / hammam wellness (steam + lantern) ---- */
export function SceneWellness({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="scene-rider">
        {/* moroccan lantern */}
        <path d="M300 90 L 332 130 L 332 250 C 332 270, 268 270, 268 250 L 268 130 Z" fill="var(--zellij-2)" fillOpacity="0.9" />
        <path d="M300 70 L 300 90 M 286 130 L 314 130" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <circle cx="300" cy="185" r="22" fill="#fff" fillOpacity="0.7" />
        <path d="M300 250 L 300 285" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g className="scene-wave">
        <path d="M250 110 C 236 82, 266 72, 252 42 M 350 110 C 336 82, 366 72, 352 42" fill="none" stroke="var(--zellij-1)" strokeWidth="7" strokeOpacity="0.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export const SCENES = {
  surf: SceneSurf,
  water: SceneSwim,
  adventure: SceneBike,
  hiking: SceneHike,
  desert: SceneCamel,
  food: SceneFood,
  wellness: SceneWellness,
  culture: SceneCamel,
  "day-trip": SceneHike,
  photography: SceneHike,
  transport: SceneCamel,
  other: SceneCamel,
} as const;

export type SceneKey = keyof typeof SCENES;
