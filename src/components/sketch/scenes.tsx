/**
 * Imourig "alive" activity scenes.
 * Richer, organic SVG scenes (filled shapes + line art) designed to be
 * scroll-animated by GSAP: each exposes named groups (.wave, .rider, .scene)
 * that ScrollScene translates / fades as the user scrolls past.
 *
 * Colors use currentColor + the zellij palette via CSS vars so they adapt
 * to light/dark and the section's accent.
 */

type Props = { className?: string };

/** Surfer riding a swelling wave. */
export function SceneSurf({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* wave body — organic filled curve */}
      <g className="scene-wave">
        <path
          d="M-40 320 C 120 230, 200 220, 300 270 C 360 300, 430 305, 520 250 C 580 214, 640 220, 660 250 L 660 420 L -40 420 Z"
          fill="var(--zellij-1)" fillOpacity="0.85"
        />
        <path
          d="M-40 340 C 130 270, 220 270, 320 300 C 400 322, 470 322, 560 285 C 610 264, 650 270, 660 285 L 660 420 L -40 420 Z"
          fill="var(--zellij-1)" fillOpacity="0.5"
        />
        {/* foam crest */}
        <path
          d="M300 270 C 360 300, 430 305, 520 250 C 470 300, 400 312, 330 292"
          fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round"
        />
      </g>
      {/* surfer riding the crest */}
      <g className="scene-rider" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* board */}
        <path d="M250 262 C 290 250, 350 250, 400 268" stroke="var(--zellij-2)" strokeWidth="9" />
        {/* legs */}
        <path d="M300 262 L 296 222 M 330 268 L 348 226" />
        {/* torso */}
        <path d="M296 222 L 330 198" />
        {/* head */}
        <circle cx="340" cy="184" r="15" fill="currentColor" stroke="none" />
        {/* arms outstretched for balance */}
        <path d="M312 210 L 280 196 M 312 210 L 352 206" />
      </g>
    </svg>
  );
}

/** Mountain biker climbing a ridge. */
export function SceneBike({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="scene-wave">
        {/* ridge */}
        <path d="M-40 360 L 150 230 L 270 300 L 420 170 L 660 360 L 660 420 L -40 420 Z" fill="var(--zellij-4)" fillOpacity="0.7" />
        <path d="M-40 380 L 180 300 L 320 350 L 500 250 L 660 360 L 660 420 L -40 420 Z" fill="var(--zellij-4)" fillOpacity="0.4" />
      </g>
      <g className="scene-rider" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="250" cy="300" r="42" />
        <circle cx="370" cy="300" r="42" />
        <path d="M250 300 L 318 300 L 370 300 M 318 300 L 296 232 L 250 300 M 296 232 L 352 232" stroke="var(--zellij-2)" />
        {/* rider */}
        <path d="M296 232 L 322 196 L 352 232 M 322 196 L 326 162" />
        <circle cx="326" cy="148" r="14" fill="currentColor" stroke="none" />
        <path d="M322 196 L 356 232" />
      </g>
    </svg>
  );
}

/** Hiker cresting a hill with trekking pole. */
export function SceneHike({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="scene-wave">
        <path d="M-40 370 C 150 320, 320 340, 500 250 C 560 218, 620 224, 660 240 L 660 420 L -40 420 Z" fill="var(--zellij-3)" fillOpacity="0.6" />
        <path d="M380 280 L 470 170 L 520 220 L 560 190" fill="none" stroke="var(--zellij-3)" strokeWidth="6" strokeOpacity="0.6" />
      </g>
      <g className="scene-rider" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M270 330 L 292 250 L 282 210" />
        <circle cx="286" cy="194" r="15" fill="currentColor" stroke="none" />
        {/* backpack */}
        <path d="M296 232 C 326 226, 330 280, 300 286" stroke="var(--zellij-2)" />
        {/* legs */}
        <path d="M292 250 L 322 330 M 292 250 L 268 330" />
        {/* arm + pole */}
        <path d="M282 230 L 318 258 L 330 338" />
      </g>
    </svg>
  );
}

/** Camel crossing the dunes. */
export function SceneCamel({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="scene-wave">
        <path d="M-40 340 C 120 290, 220 340, 340 320 C 460 300, 540 340, 660 320 L 660 420 L -40 420 Z" fill="var(--zellij-2)" fillOpacity="0.55" />
        <path d="M-40 370 C 160 330, 300 360, 440 340 C 540 326, 620 350, 660 345 L 660 420 L -40 420 Z" fill="var(--zellij-4)" fillOpacity="0.4" />
        {/* sun */}
        <circle cx="500" cy="150" r="40" fill="var(--zellij-2)" fillOpacity="0.5" />
      </g>
      <g className="scene-rider" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M230 300 C 250 240, 290 240, 312 280 C 334 232, 384 232, 406 285 L 452 296" />
        <path d="M452 296 C 486 286, 504 232, 500 198 C 498 176, 520 166, 534 178 C 540 184, 538 198, 528 200" />
        <path d="M258 296 L 252 372 M 308 290 L 314 372 M 392 286 L 386 372 M 440 292 L 448 372" />
      </g>
    </svg>
  );
}

/** Tagine with rising steam (food). */
export function SceneFood({ className }: Props) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g className="scene-rider" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M230 280 L 300 130 L 370 280" stroke="var(--zellij-4)" />
        <circle cx="300" cy="120" r="12" fill="var(--zellij-2)" stroke="none" />
        <path d="M200 280 L 400 280 C 400 326, 356 350, 300 350 C 244 350, 200 326, 200 280 Z" fill="var(--zellij-1)" fillOpacity="0.18" />
      </g>
      <g className="scene-wave" stroke="var(--zellij-2)" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M278 118 C 266 92, 292 84, 280 56 C 272 38, 288 30, 282 14" strokeOpacity="0.6" />
        <path d="M322 118 C 310 92, 336 84, 324 56 C 316 38, 332 30, 326 14" strokeOpacity="0.45" />
      </g>
    </svg>
  );
}

export const SCENES = {
  surf: SceneSurf,
  adventure: SceneBike,
  hiking: SceneHike,
  desert: SceneCamel,
  food: SceneFood,
} as const;

export type SceneKey = keyof typeof SCENES;
