"use client";

import SteelmanLogo from "./SteelmanLogo";

export default function Spinner({ message = "Analysing..." }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="steelman-spin">
        <SteelmanLogo className="h-16 w-16 text-accent" />
      </div>
      <p className="mt-6 text-sm font-medium text-ink-soft">{message}</p>
    </div>
  );
}
