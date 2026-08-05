import Link from "next/link";

const MODULES = [
  {
    n: "01",
    title: "Upload",
    desc: "Excel, CSV, receipt photos, or screenshots — drop up to 3 images at once and they merge into one list.",
    icon: "⬆️",
  },
  {
    n: "02",
    title: "Extract",
    desc: "SheetJS reads spreadsheets, Tesseract OCR reads images — every line becomes structured JSON automatically.",
    icon: "🔎",
  },
  {
    n: "03",
    title: "Verify",
    desc: "Mixed units like 50gm, 1kg, and 2L are parsed correctly. Wrong totals and duplicate entries get flagged.",
    icon: "⚖️",
  },
  {
    n: "04",
    title: "Export",
    desc: "Download a full itemized report or a total-only summary, as PDF, Excel, CSV, or PNG — in BDT.",
    icon: "⬇️",
  },
];

const SPECS = [
  ["Formats in", "XLSX · XLS · CSV · PNG · JPG · WEBP"],
  ["Formats out", "PDF · XLSX · CSV · PNG"],
  ["Currency", "BDT (৳) only"],
  ["Processing", "100% client-side — nothing uploaded to a server"],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-graphite text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-blueprint bg-[length:36px_36px] px-6 pb-24 pt-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-graphite via-brand-graphite/70 to-brand-graphite" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="chip mb-6 border border-white/15 bg-white/5 text-white/70">
            ⚙ Industrial-grade accuracy
          </span>
          <h1 className="font-display text-5xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-6xl">
            Upload a file.
            <br />
            <span className="text-brand-accent">Get an exact total.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-white/70">
            Quick Hishab reads spreadsheets, receipts, and screenshots —
            understands mixed units like{" "}
            <span className="font-mono text-brand-accent">50gm</span>,{" "}
            <span className="font-mono text-brand-accent">1kg</span>, and{" "}
            <span className="font-mono text-brand-accent">2L</span> — and turns
            them into a verified, exportable report in BDT.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              href="/app"
              className="rounded-md bg-brand-accent px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-glow-accent transition-transform hover:-translate-y-0.5"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg px-6 py-20 text-brand-ink">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-brand-primary">
            Process overview
          </p>
          <h2 className="mb-10 font-display text-3xl font-semibold uppercase tracking-tight">
            Four modules, one pipeline
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {MODULES.map((m) => (
              <div
                key={m.n}
                className="corner-bracket rounded-xl2 border border-brand-border bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-lg text-white">
                    {m.icon}
                  </span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-brand-inkSoft">
                    Module {m.n}
                  </span>
                </div>
                <h3 className="mb-1.5 font-display text-lg font-semibold uppercase tracking-wide">
                  {m.title}
                </h3>
                <p className="text-sm text-brand-inkSoft">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-graphite px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
            Specification sheet
          </p>
          <dl className="divide-y divide-white/10 rounded-xl2 border border-white/10 bg-white/5">
            {SPECS.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <dt className="font-mono text-xs uppercase tracking-wide text-white/50">
                  {label}
                </dt>
                <dd className="text-right font-mono text-sm text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 text-center">
            <Link
              href="/app"
              className="inline-block rounded-md bg-brand-accent px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-glow-accent transition-transform hover:-translate-y-0.5"
            >
              Launch Quick Hishab →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-brand-graphite py-6 text-center font-mono text-xs text-white/50">
        Quick Hishab — built by Md Tanvir Hossain
      </footer>
    </div>
  );
}
