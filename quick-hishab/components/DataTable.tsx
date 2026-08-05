"use client";

import { useLedgerStore } from "@/store/useLedgerStore";
import { UNIT_OPTIONS } from "@/lib/types";

export default function DataTable() {
  const items = useLedgerStore((s) => s.items);
  const updateRow = useLedgerStore((s) => s.updateRow);
  const removeRow = useLedgerStore((s) => s.removeRow);
  const addRow = useLedgerStore((s) => s.addRow);
  const reset = useLedgerStore((s) => s.reset);
  const sources = useLedgerStore((s) => s.sources);

  if (!items.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-brand-ink">
          Extracted items
        </h2>
        <div className="flex flex-wrap gap-2 font-mono text-xs text-brand-inkSoft">
          {sources.map((s, i) => (
            <span key={i} className="chip bg-brand-primary/10 text-brand-primary">
              {s.fileName ?? s.source}
              {s.confidence !== undefined && (
                <span className="text-brand-secondary"> · {Math.round(s.confidence)}%</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="corner-bracket overflow-hidden rounded-xl2 border border-brand-border bg-white shadow-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-gradient text-white">
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wide">Item</th>
              <th className="w-20 px-3 py-3 text-right font-semibold uppercase tracking-wide">Qty</th>
              <th className="w-24 px-3 py-3 text-left font-semibold uppercase tracking-wide">Unit</th>
              <th className="w-32 px-4 py-3 text-right font-semibold uppercase tracking-wide">Unit price</th>
              <th className="w-32 px-4 py-3 text-right font-semibold uppercase tracking-wide">Total</th>
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-t border-brand-border/70 transition-colors hover:bg-brand-primary/5 ${
                  idx % 2 === 0 ? "bg-white" : "bg-brand-bg/60"
                }`}
              >
                <td className="px-2 py-1">
                  <input
                    value={row.item}
                    onChange={(e) => updateRow(row.id, { item: e.target.value })}
                    placeholder="Item name"
                    className="w-full rounded-lg bg-transparent px-2 py-2 outline-none focus:bg-brand-primary/5"
                  />
                </td>
                <td className="px-1 py-1">
                  <input
                    type="number"
                    value={row.qty}
                    onChange={(e) => updateRow(row.id, { qty: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg bg-transparent px-2 py-2 text-right font-mono outline-none focus:bg-brand-primary/5"
                  />
                </td>
                <td className="px-1 py-1">
                  <select
                    value={row.unit}
                    onChange={(e) => updateRow(row.id, { unit: e.target.value as typeof row.unit })}
                    className="w-full rounded-lg bg-transparent px-2 py-2 font-mono text-xs uppercase text-brand-inkSoft outline-none focus:bg-brand-primary/5"
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) => updateRow(row.id, { price: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg bg-transparent px-2 py-2 text-right font-mono outline-none focus:bg-brand-primary/5"
                  />
                </td>
                <td className="px-4 py-2 text-right font-mono font-semibold text-brand-ink">
                  {row.total.toFixed(2)}
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    aria-label={`Remove ${row.item || "row"}`}
                    onClick={() => removeRow(row.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-brand-inkSoft transition-colors hover:bg-brand-danger/10 hover:text-brand-danger"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={() => addRow()}
          className="rounded-full border border-brand-border bg-white px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-brand-inkSoft shadow-card transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          + add row
        </button>
        <button
          onClick={() => reset()}
          className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-inkSoft transition-colors hover:text-brand-danger"
        >
          clear all
        </button>
      </div>
    </section>
  );
}
