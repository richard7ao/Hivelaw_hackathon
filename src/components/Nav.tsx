import Link from "next/link";

/** Fixed, slim top bar. Wordmark left, in-page anchors + demo CTA right. */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/95">
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Hivelaw home"
        >
          <span className="block h-2.5 w-2.5 rounded-[2px] bg-accent transition-transform duration-300 group-hover:rotate-45" />
          <span className="font-serif text-lg font-semibold tracking-tight text-ink">
            Hivelaw
          </span>
        </Link>

        <nav className="flex items-center gap-7 text-sm">
          <Link
            href="/#how"
            className="hidden text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            How it works
          </Link>
          <Link
            href="/#verdict"
            className="hidden text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            The honest no
          </Link>
          <Link
            href="/#gtm"
            className="hidden text-ink-soft transition-colors hover:text-ink md:inline"
          >
            Go to market
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-medium text-paper transition-colors duration-200 hover:bg-accent-deep"
          >
            Use the demo
            <span aria-hidden>&rarr;</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
