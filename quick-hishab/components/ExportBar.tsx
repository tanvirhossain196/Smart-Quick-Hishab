"use client";

import { RefObject, useState } from "react";
import { useLedgerStore, useCalc } from "@/store/useLedgerStore";
import { exportPdf, ExportMode } from "@/lib/exportPdf";
import { exportExcel, exportCsv } from "@/lib/exportExcel";
import { exportImage } from "@/lib/exportImage";

export default function ExportBar({
  pngFullRef,
  pngTotalRef,
}: {
  pngFullRef: RefObject<HTMLDivElement>;
  pngTotalRef: RefObject<HTMLDivElement>;
}) {
  const items = useLedgerStore((s) => s.items);
  const settings = useLedgerStore((s) => s.settings);
  const calc = useCalc();
  const [mode, setMode] = useState<ExportMode>("full");

  const buttons = [
    { label: "PDF", icon: "📄", color: "from-brand-primary to-brand-graphite", action: () => exportPdf(items, calc, settings, mode) },
    {
      label: "Excel",
      icon: "📊",
      color: "from-brand-success to-brand-secondary",
      action: () => exportExcel(items, calc, settings, mode),
    },
    {
      label: "CSV",
      icon: "🗂️",
      color: "from-brand-secondary to-brand-primary",
      action: () => exportCsv(items, calc, settings, mode),
    },
    {
      label: "PNG",
      icon: "🖼️",
      color: "from-brand-accent to-brand-danger",
      action: () => {
        const node = mode === "full" ? pngFullRef.current : pngTotalRef.current;
        if (node) exportImage(node);
      },
    },
  ];

  return (
    <div className="mt-6">
      <div className="mb-3 flex rounded-md border border-brand-border bg-white p-1 shadow-card">
        <button
          onClick={() => setMode("full")}
          className={`flex-1 rounded-sm py-1.5 font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
            mode === "full"
              ? "bg-brand-graphite text-white"
              : "text-brand-inkSoft"
          }`}
        >
          📋 Full report
        </button>
        <button
          onClick={() => setMode("totalOnly")}
          className={`flex-1 rounded-sm py-1.5 font-mono text-xs font-semibold uppercase tracking-wide transition-colors ${
            mode === "totalOnly"
              ? "bg-brand-graphite text-white"
              : "text-brand-inkSoft"
          }`}
        >
          🧾 Total only
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            onClick={b.action}
            className={`flex items-center justify-center gap-2 rounded-md bg-gradient-to-br ${b.color} px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-white shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-card-lg`}
          >
            <span>{b.icon}</span> {b.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-brand-inkSoft">
        Generated with Quick Hishab · by Md Tanvir Hossain
      </p>
    </div>
  );
}