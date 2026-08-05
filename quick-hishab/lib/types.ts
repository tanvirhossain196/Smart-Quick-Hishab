export type Unit = "pcs" | "gm" | "kg" | "ml" | "L";

export const UNIT_OPTIONS: Unit[] = ["pcs", "gm", "kg", "ml", "L"];

export interface LineItem {
  id: string;
  item: string;
  category?: string;
  qty: number;
  unit: Unit;
  price: number; // derived per-unit price (total / qty)
  total: number; // actual amount paid — source of truth from receipt/sheet
}

export interface CalcSettings {
  taxPercent: number;
  discountPercent: number;
}

export interface CalcResult {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  highest: LineItem | null;
  lowest: LineItem | null;
  average: number;
  itemCount: number;
}

export type SourceKind = "excel" | "csv" | "image" | "manual";
