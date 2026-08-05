"use client";

import { useCallback, useRef, useState } from "react";
import { useLedgerStore } from "@/store/useLedgerStore";
import { parseCsvFile, parseExcelFile } from "@/lib/excelParser";
import { runOcr, textToLineItems } from "@/lib/ocrParser";

const ACCEPTED = ".xlsx,.xls,.csv,image/*,.png,.jpg,.jpeg,.webp";
const MAX_FILES = 3;

const FILE_TYPES = [
  { label: "Excel", icon: "📊", color: "text-brand-success" },
  { label: "CSV", icon: "🗂️", color: "text-brand-primary" },
  { label: "Image ×3", icon: "🖼️", color: "text-brand-accent" },
  { label: "Screenshot", icon: "🖥️", color: "text-brand-secondary" },
];

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addItems = useLedgerStore((s) => s.addItems);
  const setProcessing = useLedgerStore((s) => s.setProcessing);
  const isProcessing = useLedgerStore((s) => s.isProcessing);
  const processingMessage = useLedgerStore((s) => s.processingMessage);
  const [progress, setProgress] = useState(0);
  const [fileProgress, setFileProgress] = useState({ current: 0, total: 0 });

  const handleOneFile = useCallback(
    async (file: File) => {
      const name = file.name.toLowerCase();
      if (name.endsWith(".csv")) {
        const items = await parseCsvFile(file);
        if (!items.length) throw new Error(`No rows found in "${file.name}".`);
        addItems(items, "csv", file.name);
      } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        const items = await parseExcelFile(file);
        if (!items.length) throw new Error(`No rows found in "${file.name}".`);
        addItems(items, "excel", file.name);
      } else if (file.type.startsWith("image/")) {
        const { text, confidence } = await runOcr(file, setProgress);
        const items = textToLineItems(text);
        if (!items.length) throw new Error(`Couldn't find line items in "${file.name}".`);
        addItems(items, "image", file.name, confidence);
      } else {
        throw new Error(`Unsupported file type: "${file.name}".`);
      }
    },
    [addItems]
  );

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setError(null);
      const files = Array.from(fileList).slice(0, MAX_FILES);
      setProcessing(true, "Starting…");
      setFileProgress({ current: 0, total: files.length });

      const errors: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setFileProgress({ current: i + 1, total: files.length });
        setProgress(0);
        setProcessing(true, files[i].type.startsWith("image/") ? "Running OCR on image…" : "Reading file…");
        try {
          await handleOneFile(files[i]);
        } catch (e) {
          errors.push(e instanceof Error ? e.message : `Failed to read "${files[i].name}".`);
        }
      }

      setProcessing(false);
      if (errors.length) setError(errors.join(" "));
    },
    [handleOneFile, setProcessing]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl2 border-2 border-dashed px-8 py-16 text-center transition-all ${
          isDragging
            ? "scale-[1.01] border-brand-accent bg-brand-accent/5 shadow-glow-accent"
            : "border-brand-border bg-white/70 shadow-card hover:border-brand-primary/50 hover:shadow-card-lg"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-brand-hero" />
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <span className="animate-float relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-2xl shadow-glow">
          ⬆️
        </span>
        <span className="relative mb-2 font-display text-2xl font-semibold uppercase tracking-wide text-brand-ink">
          Drop your files here
        </span>
        <span className="relative max-w-sm text-sm text-brand-inkSoft">
          Excel, CSV, receipt photos, or screenshots — select up to {MAX_FILES} images at once and
          they&apos;ll merge into one list.
        </span>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
          {FILE_TYPES.map((t) => (
            <span key={t.label} className="chip bg-white shadow-card">
              <span className={t.color}>{t.icon}</span> {t.label}
            </span>
          ))}
        </div>

        {isProcessing && (
          <div className="relative mt-6 w-full max-w-xs">
            <div className="mb-1 flex justify-between font-mono text-xs text-brand-inkSoft">
              <span>
                {processingMessage}
                {fileProgress.total > 1 ? ` (${fileProgress.current}/${fileProgress.total})` : ""}
              </span>
              {processingMessage.includes("OCR") && <span>{progress}%</span>}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-border">
              <div
                className="h-full rounded-full bg-brand-gradient-accent transition-all"
                style={{ width: `${processingMessage.includes("OCR") ? progress : 60}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-brand-danger/30 bg-brand-danger/10 px-4 py-3 text-sm font-medium text-brand-danger"
        >
          ⚠ {error}
        </p>
      )}

      <div className="flex items-center justify-center gap-3 text-sm">
        <span className="text-brand-inkSoft">or</span>
        <button
          onClick={() => useLedgerStore.getState().addRow()}
          className="rounded-md bg-brand-graphite px-4 py-2 font-display text-xs font-semibold uppercase tracking-wider text-white shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-card-lg"
        >
          Start with a blank row →
        </button>
      </div>
    </div>
  );
}
