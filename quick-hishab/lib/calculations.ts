import { CalcResult, CalcSettings, LineItem } from "./types";

export function recomputeRowTotal(item: LineItem): LineItem {
  return { ...item, total: round2(item.qty * item.price) };
}

export function calculate(items: LineItem[], settings: CalcSettings): CalcResult {
  const subtotal = round2(items.reduce((sum, i) => sum + i.total, 0));
  const discountAmount = round2(subtotal * (settings.discountPercent / 100));
  const taxable = subtotal - discountAmount;
  const taxAmount = round2(taxable * (settings.taxPercent / 100));
  const grandTotal = round2(taxable + taxAmount);

  let highest: LineItem | null = null;
  let lowest: LineItem | null = null;
  for (const i of items) {
    if (!highest || i.total > highest.total) highest = i;
    if (!lowest || i.total < lowest.total) lowest = i;
  }

  const average = items.length ? round2(subtotal / items.length) : 0;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    highest,
    lowest,
    average,
    itemCount: items.length,
  };
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function detectIssues(items: LineItem[]): string[] {
  const issues: string[] = [];
  const seen = new Map<string, number>();

  items.forEach((i) => {
    const key = `${i.item.trim().toLowerCase()}|${i.unit}`;
    seen.set(key, (seen.get(key) || 0) + 1);
    if (Math.abs(i.total - i.qty * i.price) > 0.01) {
      issues.push(`Wrong total for "${i.item}": expected ${round2(i.qty * i.price)}, found ${i.total}`);
    }
    if (!i.item.trim()) issues.push("A row is missing an item name.");
    if (i.qty <= 0) issues.push(`"${i.item || "Unnamed item"}" has an invalid quantity.`);
    if (i.price < 0) issues.push(`"${i.item || "Unnamed item"}" has a negative price.`);
  });

  seen.forEach((count, key) => {
    if (count > 1) {
      const [name] = key.split("|");
      issues.push(`Possible duplicate entries for "${name}" (${count} rows).`);
    }
  });

  return issues;
}
