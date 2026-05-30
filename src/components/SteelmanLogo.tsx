export default function SteelmanLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Suit body */}
      <path d="M22 28L32 22L42 28V48L32 54L22 48V28Z" fill="currentColor" opacity="0.9" />
      {/* Lapels */}
      <path d="M32 22L26 32V26L32 22Z" fill="currentColor" opacity="0.6" />
      <path d="M32 22L38 32V26L32 22Z" fill="currentColor" opacity="0.6" />
      {/* Tie */}
      <path d="M31 28L32 26L33 28L32 40Z" fill="currentColor" opacity="0.3" />
      {/* Head */}
      <circle cx="32" cy="16" r="6" fill="currentColor" opacity="0.85" />
      {/* Shield overlay */}
      <path d="M32 8L44 14V34C44 42 38 50 32 54C26 50 20 42 20 34V14L32 8Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* 007-style crosshair ring */}
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}
