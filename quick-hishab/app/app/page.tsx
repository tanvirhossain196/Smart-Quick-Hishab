"use client";

import { useRef } from "react";
import FileUpload from "@/components/FileUpload";
import DataTable from "@/components/DataTable";
import IssuesPanel from "@/components/IssuesPanel";
import CalculationPanel from "@/components/CalculationPanel";
import ExportBar from "@/components/ExportBar";
import ExportPreview from "@/components/ExportPreview";
import { useLedgerStore, useCalc } from "@/store/useLedgerStore";

export default function CalculatorPage() {
  const items = useLedgerStore((s) => s.items);
  const settings = useLedgerStore((s) => s.settings);
  const calc = useCalc();
  const summaryRef = useRef<HTMLDivElement>(null);
  const fullReportRef = useRef<HTMLDivElement>(null);
  const pngFullRef = useRef<HTMLDivElement>(null);
  const pngTotalRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-brand-hero">
      <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">
        <div className="mb-8 flex items-center gap-2">
          <span className="chip bg-brand-primary/10 text-brand-primary">
            MODULE 01 — UPLOAD
          </span>
          <span className="chip bg-brand-secondary/10 text-brand-secondary">
            MODULE 02 — CALCULATE
          </span>
        </div>

        <FileUpload />

        {items.length > 0 && (
          <div
            ref={fullReportRef}
            className="mt-4 grid grid-cols-1 gap-10 rounded-xl2 bg-brand-hero lg:grid-cols-[1fr_320px]"
          >
            <div>
              <DataTable />
              <IssuesPanel />
            </div>
            <div>
              <CalculationPanel ref={summaryRef} />
              <ExportBar pngFullRef={pngFullRef} pngTotalRef={pngTotalRef} />
            </div>
          </div>
        )}

        {/* Hidden, PDF-styled layouts used only for PNG capture — never shown on screen.
            The 0x0 + overflow:hidden wrapper keeps this invisible without using
            off-screen positioning, which html-to-image can render as blank. */}
        {items.length > 0 && (
          <div
            style={{ width: 0, height: 0, overflow: "hidden" }}
            aria-hidden="true"
          >
            <ExportPreview
              ref={pngFullRef}
              items={items}
              calc={calc}
              settings={settings}
              mode="full"
            />
            <ExportPreview
              ref={pngTotalRef}
              items={items}
              calc={calc}
              settings={settings}
              mode="totalOnly"
            />
          </div>
        )}
      </main>

      <footer className="border-t border-brand-border/70 py-6 text-center font-mono text-xs text-brand-inkSoft">
        Quick Hishab <span className="gradient-text font-semibold"></span> —
       runs entirely in your browser, no file ever leaves your
        machine
      </footer>
    </div>
  );
}
