import { create } from "zustand";
import { CalcSettings, LineItem, SourceKind } from "@/lib/types";
import { calculate, detectIssues, recomputeRowTotal } from "@/lib/calculations";

interface LedgerState {
  items: LineItem[];
  settings: CalcSettings;
  sources: { source: SourceKind; fileName?: string; confidence?: number }[];
  isProcessing: boolean;
  processingMessage: string;

  /** Replaces the whole ledger — used for the very first upload. */
  setItems: (items: LineItem[], source: SourceKind, fileName?: string, confidence?: number) => void;
  /** Appends to the existing ledger — used when merging additional images/files. */
  addItems: (items: LineItem[], source: SourceKind, fileName?: string, confidence?: number) => void;
  addRow: () => void;
  updateRow: (id: string, patch: Partial<LineItem>) => void;
  removeRow: (id: string) => void;
  updateSettings: (patch: Partial<CalcSettings>) => void;
  setProcessing: (isProcessing: boolean, message?: string) => void;
  reset: () => void;
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

const defaultSettings: CalcSettings = {
  taxPercent: 0,
  discountPercent: 0,
};

export const useLedgerStore = create<LedgerState>((set) => ({
  items: [],
  settings: defaultSettings,
  sources: [],
  isProcessing: false,
  processingMessage: "",

  setItems: (items, source, fileName, confidence) =>
    set({
      items: items.map(recomputeRowTotal),
      sources: [{ source, fileName, confidence }],
    }),

  addItems: (items, source, fileName, confidence) =>
    set((state) => ({
      items: [...state.items, ...items.map(recomputeRowTotal)],
      sources: [...state.sources, { source, fileName, confidence }],
    })),

  addRow: () =>
    set((state) => ({
      items: [...state.items, { id: newId(), item: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
    })),

  updateRow: (id, patch) =>
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id !== id) return i;
        const merged = { ...i, ...patch };
        if (patch.qty !== undefined || patch.price !== undefined) {
          return recomputeRowTotal(merged);
        }
        return merged;
      }),
    })),

  removeRow: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),

  setProcessing: (isProcessing, message = "") => set({ isProcessing, processingMessage: message }),

  reset: () => set({ items: [], sources: [], settings: defaultSettings }),
}));

export function useCalc() {
  const items = useLedgerStore((s) => s.items);
  const settings = useLedgerStore((s) => s.settings);
  return calculate(items, settings);
}

export function useIssues() {
  const items = useLedgerStore((s) => s.items);
  return detectIssues(items);
}
