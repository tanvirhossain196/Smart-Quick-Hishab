"use client";

import { forwardRef } from "react";
import { useLedgerStore, useCalc } from "@/store/useLedgerStore";
import { formatBDT } from "@/lib/format";

const CalculationPanel = forwardRef<HTMLDivElement>(function CalculationPanel(_, ref) {
  const settings = useLedgerStore((s) => s.settings);
  const updateSettings = useLedgerStore((s) => s.updateSettings);
  const calc = useCalc();

  return (
    <div className="sticky top-20">
      <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl2 border border-brand-border bg-white p-4 text-sm shadow-card">
        <label className="block">
          <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-inkSoft">
            Tax / VAT %
          </span>
          <input
            type="number"
            value={settings.taxPercent}
            onChange={(e) => updateSettings({ taxPercent: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-brand-border bg-brand-bg px-2 py-1.5 font-mono outline-none focus:border-brand-primary"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-inkSoft">
            Discount %
          </span>
          <input
            type="number"
            value={settings.discountPercent}
            onChange={(e) => updateSettings({ discountPercent: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-brand-border bg-brand-bg px-2 py-1.5 font-mono outline-none focus:border-brand-primary"
          />
        </label>
        <div className="col-span-2 flex items-center justify-between rounded-lg bg-brand-bg px-3 py-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-inkSoft">
            Currency
          </span>
          <span className="chip bg-brand-primary text-white">BDT ৳</span>
        </div>
      </div>

      <div ref={ref} className="overflow-hidden rounded-xl2 shadow-card-lg">
        <div className="bg-brand-gradient px-6 py-5 text-white">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Report Summary
          </p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <span className="font-display text-sm font-semibold uppercase">Grand Total</span>
            <span className="font-mono text-2xl font-bold sm:text-3xl">{formatBDT(calc.grandTotal)}</span>
          </div>
        </div>

        <div className="space-y-2 bg-white px-6 py-5 font-mono text-sm">
          <Row label="Subtotal" value={formatBDT(calc.subtotal)} />
          {settings.discountPercent > 0 && (
            <Row
              label={`Discount (${settings.discountPercent}%)`}
              value={`- ${formatBDT(calc.discountAmount)}`}
              tone="text-brand-success"
            />
          )}
          {settings.taxPercent > 0 && (
            <Row
              label={`Tax (${settings.taxPercent}%)`}
              value={`+ ${formatBDT(calc.taxAmount)}`}
              tone="text-brand-accent"
            />
          )}

          <div className="grid grid-cols-2 gap-2 border-t border-brand-border pt-4 text-center text-xs text-brand-inkSoft">
            <Stat label="items" value={String(calc.itemCount)} />
            <Stat label="highest" value={calc.highest?.item ?? "—"} truncate />
          </div>
        </div>
      </div>
    </div>
  );
});

export default CalculationPanel;

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-brand-inkSoft">{label}</dt>
      <dd className={tone}>{value}</dd>
    </div>
  );
}

function Stat({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div>
      <div className={`font-semibold text-brand-ink ${truncate ? "truncate" : ""}`}>{value}</div>
      {label}
    </div>
  );
}
