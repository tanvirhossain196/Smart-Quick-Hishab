import * as XLSX from "xlsx";
import Papa from "papaparse";
import { LineItem, Unit, UNIT_OPTIONS } from "./types";
import { recomputeRowTotal, round2 } from "./calculations";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function normalizeUnit(v: unknown): Unit {
  const s = String(v ?? "").trim().toLowerCase();
  const found = UNIT_OPTIONS.find((u) => u.toLowerCase() === s);
  if (found) return found;
  if (/^kg/.test(s)) return "kg";
  if (/^g/.test(s)) return "gm";
  if (/^l/.test(s)) return "L";
  if (/^ml/.test(s)) return "ml";
  return "pcs";
}

/** Turn a loosely-shaped row of cells into a LineItem by guessing column intent. */
function rowsToLineItems(rows: (string | number)[][]): LineItem[] {
  if (!rows.length) return [];

  const header = rows[0].map((c) => String(c).trim().toLowerCase());
  const hasHeader = header.some((h) =>
    ["item", "name", "product", "description", "qty", "quantity", "price", "amount", "total"].some((k) =>
      h.includes(k)
    )
  );

  const dataRows = hasHeader ? rows.slice(1) : rows;
  const idx = {
    item: hasHeader ? header.findIndex((h) => /item|name|product|description/.test(h)) : 0,
    qty: hasHeader ? header.findIndex((h) => /qty|quantity/.test(h)) : 1,
    unit: hasHeader ? header.findIndex((h) => /unit$|uom/.test(h)) : -1,
    price: hasHeader ? header.findIndex((h) => /price|rate|unit.?price/.test(h)) : 2,
    total: hasHeader ? header.findIndex((h) => /total|amount/.test(h)) : -1,
  };

  const items: LineItem[] = [];
  for (const r of dataRows) {
    if (!r || r.every((c) => c === "" || c == null)) continue;
    const itemName = idx.item >= 0 ? String(r[idx.item] ?? "").trim() : "";
    const qty = idx.qty >= 0 ? toNumber(r[idx.qty]) : 1;
    const unit = idx.unit >= 0 ? normalizeUnit(r[idx.unit]) : "pcs";
    const price = idx.price >= 0 ? toNumber(r[idx.price]) : toNumber(r[1]);
    const totalCell = idx.total >= 0 ? toNumber(r[idx.total]) : undefined;

    if (!itemName && qty === 0 && price === 0) continue;

    const total = totalCell !== undefined && !Number.isNaN(totalCell) ? totalCell : round2(qty * price);

    items.push({
      id: newId(),
      item: itemName || "Untitled item",
      qty: qty || 1,
      unit,
      price: price || 0,
      total,
    });
  }
  return items.map(recomputeRowTotal).map((i, n) => ({ ...items[n], total: i.total }));
}

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  const cleaned = String(v ?? "")
    .replace(/[^0-9.\-]/g, "")
    .trim();
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

export async function parseExcelFile(file: File): Promise<LineItem[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: (string | number)[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
  return rowsToLineItems(rows);
}

export async function parseCsvFile(file: File): Promise<LineItem[]> {
  const text = await file.text();
  const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
  const rows = (result.data as (string | number)[][]).filter((r) => r.length);
  return rowsToLineItems(rows);
}
