"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const onApp = pathname?.startsWith("/app");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-graphite/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-gradient font-display text-base font-bold text-white shadow-glow">
            Σ
          </span>
          <span className="font-display text-lg font-semibold uppercase tracking-wide text-white">
            Quick Hishab <span className="text-brand-accent"></span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          
          {!onApp && (
            <Link
              href="/app"
              className="rounded-md bg-brand-accent px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white shadow-glow-accent transition-transform hover:-translate-y-0.5"
            >
              Get Started →
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
