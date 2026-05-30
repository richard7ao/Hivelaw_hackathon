export default function SteelmanLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shield shape — the primary form, doubles as suited torso */}
      <path
        d="M32 4L52 14V36C52 46 43 55 32 60C21 55 12 46 12 36V14L32 4Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path
        d="M32 4L52 14V36C52 46 43 55 32 60C21 55 12 46 12 36V14L32 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Suit jacket — sharp V-cut lapels inside the shield */}
      <path
        d="M32 26L22 38V24L32 18L42 24V38L32 26Z"
        fill="currentColor"
        opacity="0.85"
      />

      {/* Tie — thin dagger shape */}
      <path
        d="M31.2 26L32 24.5L32.8 26L32 42Z"
        fill="currentColor"
        opacity="0.3"
      />

      {/* Head — clean circle */}
      <circle cx="32" cy="14" r="5" fill="currentColor" opacity="0.9" />

      {/* Crosshair slit — 007 gun barrel motif, a single horizontal cut */}
      <line x1="16" y1="32" x2="26" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="38" y1="32" x2="48" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.2" />

      {/* Balance scales hint — two small tick marks at the shoulder line */}
      <line x1="20" y1="22" x2="24" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="44" y1="22" x2="40" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Inner shield chevron — adds depth and military precision */}
      <path
        d="M32 48L22 40V30L32 38L42 30V40L32 48Z"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}
