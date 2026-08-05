import Tesseract from "tesseract.js";
import { LineItem, Unit } from "./types";
import { round2 } from "./calculations";

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function runOcr(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ text: string; confidence: number }> {
  const { data } = await Tesseract.recognize(file, "eng", {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });
  return { text: data.text, confidence: data.confidence };
}

const UNIT_ALIASES: Record<string, Unit> = {
  kg: "kg",
  kgs: "kg",
  kilogram: "kg",
  kilograms: "kg",
  g: "gm",
  gm: "gm",
  gms: "gm",
  gram: "gm",
  grams: "gm",
  l: "L",
  ltr: "L",
  ltrs: "L",
  litre: "L",
  litres: "L",
  liter: "L",
  liters: "L",
  ml: "ml",
  pc: "pcs",
  pcs: "pcs",
  piece: "pcs",
  pieces: "pcs",
};

const UNIT_PATTERN = /(\d+(?:\.\d+)?)\s*(kgs?|kilograms?|gms?|grams?|g|ltrs?|litres?|liters?|l|ml|pcs?|pieces?)\b/i;

/**
 * Parses lines shaped like a grocery/shopping list:
 *   "Jira 50gm = 40"   -> item "Jira", qty 50 gm, total 40, unit price 0.8/gm
 *   "Roshon 1kg = 180"  -> item "Roshon", qty 1 kg, total 180
 *   "Gorom Moshla = 200 tk" -> no unit given, qty 1 pcs, total 200
 * Falls back to a trailing-numbers heuristic for lines without "=".
 */
export function textToLineItems(text: string): LineItem[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items: LineItem[] = [];

  for (const line of lines) {
    if (/^(total|subtotal|tax|vat|discount|grand)\b/i.test(line)) continue;

    const parsed = parseEqualsLine(line) ?? parseTrailingNumberLine(line);
    if (parsed) items.push(parsed);
  }

  return items;
}

function parseEqualsLine(line: string): LineItem | null {
  const match = line.match(/^(.*?)=\s*([\d,]+(?:\.\d+)?)\s*(tk|taka|৳|bdt|usd|\$)?\s*$/i);
  if (!match) return null;

  let leftPart = match[1].trim();
  const amount = parseFloat(match[2].replace(/,/g, ""));
  if (!leftPart || Number.isNaN(amount)) return null;

  let qty = 1;
  let unit: Unit = "pcs";

  const qtyMatch = leftPart.match(UNIT_PATTERN);
  if (qtyMatch) {
    qty = parseFloat(qtyMatch[1]) || 1;
    unit = UNIT_ALIASES[qtyMatch[2].toLowerCase()] ?? "pcs";
    leftPart = leftPart.replace(qtyMatch[0], "").trim();
  }

  const itemName = leftPart.replace(/[-–—]\s*$/, "").trim() || "Untitled item";
  const price = qty > 0 ? round2(amount / qty) : amount;

  return {
    id: newId(),
    item: itemName,
    qty,
    unit,
    price,
    total: round2(amount),
  };
}

function parseTrailingNumberLine(line: string): LineItem | null {
  const numberMatches = line.match(/-?\d+(?:[.,]\d+)?/g);
  if (!numberMatches || numberMatches.length === 0) return null;

  const numbers = numberMatches.map((n) => parseFloat(n.replace(",", "")));
  const label = line.replace(/[-\d.,\s]+$/g, "").trim();
  if (!label) return null;

  let qty = 1;
  let unit: Unit = "pcs";
  let total = 0;

  const unitMatch = label.match(UNIT_PATTERN);
  let cleanLabel = label;
  if (unitMatch) {
    qty = parseFloat(unitMatch[1]) || 1;
    unit = UNIT_ALIASES[unitMatch[2].toLowerCase()] ?? "pcs";
    cleanLabel = label.replace(unitMatch[0], "").trim();
  }

  if (numbers.length >= 2) {
    total = numbers[numbers.length - 1];
    if (!unitMatch && numbers.length >= 3) qty = numbers[numbers.length - 3] || qty;
  } else {
    total = numbers[0];
  }

  const price = qty > 0 ? round2(total / qty) : total;

  return {
    id: newId(),
    item: cleanLabel || "Untitled item",
    qty,
    unit,
    price,
    total: round2(total),
  };
}
