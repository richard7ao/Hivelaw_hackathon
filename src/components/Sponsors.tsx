import type { ReactNode } from "react";

type Tone = "light" | "dark";

type Org = { name: string; mark: string; accent?: boolean; url: string };

const SPONSORS: Org[] = [
  { name: "Lawhive", mark: "⬡", accent: true, url: "https://lawhive.co.uk" },
  { name: "GV", mark: "GV", url: "https://www.gv.com" },
  { name: "Balderton", mark: "◇", url: "https://www.balderton.com" },
];

const POWERED: Org[] = [
  { name: "Anthropic", mark: "✱", url: "https://www.anthropic.com" },
  { name: "Google Cloud", mark: "G", url: "https://cloud.google.com" },
  { name: "Gemini", mark: "✦", url: "https://gemini.google.com" },
  { name: "Lovable", mark: "♥", url: "https://lovable.dev" },
];

function Mark({ org, tone }: { org: Org; tone: Tone }) {
  const base =
    "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border px-1 text-[10px] font-semibold leading-none";
  const skin = org.accent
    ? "border-accent/45 text-accent"
    : tone === "dark"
      ? "border-canvas/25 text-canvas/80"
      : "border-line text-ink";
  return <span className={`${base} ${skin}`}>{org.mark}</span>;
}

function Group({
  label,
  items,
  tone,
}: {
  label: string;
  items: Org[];
  tone: Tone;
}) {
  const labelSkin = tone === "dark" ? "text-canvas/45" : "text-ink-faint";
  const ruleSkin = tone === "dark" ? "bg-canvas/20" : "bg-line";
  const nameSkin = tone === "dark" ? "text-canvas/85 hover:text-canvas" : "text-ink hover:text-accent";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
      <span className={`text-[10px] font-medium uppercase tracking-[0.18em] ${labelSkin}`}>
        {label}
      </span>
      <span className={`hidden h-px w-6 sm:block ${ruleSkin}`} aria-hidden />
      {items.map((org) => (
        <a
          key={org.name}
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 transition-colors ${nameSkin}`}
        >
          <Mark org={org} tone={tone} />
          <span className="text-sm">{org.name}</span>
        </a>
      ))}
    </div>
  );
}

export default function Sponsors({
  tone = "light",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}): ReactNode {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-12 gap-y-5 ${className}`}
      aria-label="Sponsors and technology partners"
    >
      <Group label="Sponsored by" items={SPONSORS} tone={tone} />
      <Group label="Powered by" items={POWERED} tone={tone} />
    </div>
  );
}
