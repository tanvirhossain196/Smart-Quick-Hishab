"use client";

import { forwardRef } from "react";
import { CalcResult, CalcSettings, LineItem } from "@/lib/types";
import { formatBDT } from "@/lib/format";
import { ExportMode } from "@/lib/exportPdf";

type Props = {
  items: LineItem[];
  calc: CalcResult;
  settings: CalcSettings;
  mode: ExportMode;
};

/**
 * Off-screen report layout that mirrors the PDF export styling exactly
 * (gradient header, styled table, highlight summary box). This is never
 * shown to the user — exportImage() captures this node instead of the
 * live, interactive UI, so PNG and PDF output match.
 *
 * NOTE: do not position this node itself off-screen (e.g. position:fixed;
 * left:-9999px) — html-to-image can render that as a blank/solid-color
 * image because far off-screen nodes don't always get painted. Instead,
 * this stays in normal document flow and the PARENT (in page.tsx) clips
 * it to 0x0 with overflow:hidden, which keeps it invisible to the user
 * while still letting the browser paint it correctly for capture.
 */
const ExportPreview = forwardRef<HTMLDivElement, Props>(function ExportPreview(
  { items, calc, settings, mode },
  ref,
) {
  return (
    <div
      ref={ref}
      className="w-[720px] overflow-hidden rounded-xl2 bg-white font-mono"
    >
      <div className="bg-gradient-to-r from-brand-primary to-brand-graphite px-6 py-5 text-white">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
          Quick Hishab Report
        </h2>
        <p className="mt-1 text-[11px] text-white/70">
          Generated: {new Date().toLocaleString()}
        </p>
      </div>

      {mode === "full" && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-brand-primary to-brand-secondary text-left text-white">
              <th className="px-4 py-3 font-semibold uppercase tracking-wide">
                Item
              </th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">
                Qty
              </th>
              <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">
                Unit
              </th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">
                Unit Price
              </th>
              <th className="px-4 py-3 text-right font-semibold uppercase tracking-wide">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, idx) => (
              <tr
                key={i.id}
                className={idx % 2 === 1 ? "bg-brand-hero/60" : "bg-white"}
              >
                <td className="px-4 py-3">{i.item}</td>
                <td className="px-4 py-3 text-center">{i.qty}</td>
                <td className="px-4 py-3 text-center uppercase text-brand-inkSoft">
                  {i.unit}
                </td>
                <td className="px-4 py-3 text-right">{i.price}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {i.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {items.length > 0 && (
        <div className="mx-6 my-6 grid grid-cols-2 gap-4 rounded-lg bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-4 text-white">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/70">
              Total Items
            </p>
            <p className="mt-1 text-lg font-semibold">{items.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/70">
              Grand Total
            </p>
            <p className="mt-1 text-lg font-semibold">
              {formatBDT(calc.grandTotal)}
            </p>
          </div>
        </div>
      )}

      <p className="px-6 pb-4 text-[10px] text-brand-inkSoft">
        Generated with Quick Hishab · by Md Tanvir Hossain
      </p>
    </div>
  );
});

export default ExportPreview;
