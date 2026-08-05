import * as XLSX from "xlsx";
import { CalcResult, CalcSettings, LineItem } from "./types";
import type { ExportMode } from "./exportPdf";

function summaryRows(calc: CalcResult, settings: CalcSettings) {
  const rows: Record<string, unknown>[] = [
    { Item: "Subtotal", Qty: "", Unit: "", "Unit Price": "", Total: calc.subtotal },
  ];
  if (settings.discountPercent > 0) {
    rows.push({
      Item: `Discount (${settings.discountPercent}%)`,
      Qty: "",
      Unit: "",
      "Unit Price": "",
      Total: -calc.discountAmount,
    });
  }
  if (settings.taxPercent > 0) {
    rows.push({
      Item: `Tax (${settings.taxPercent}%)`,
      Qty: "",
      Unit: "",
      "Unit Price": "",
      Total: calc.taxAmount,
    });
  }
  rows.push({ Item: "Grand Total", Qty: "", Unit: "", "Unit Price": "", Total: calc.grandTotal });
  rows.push({ Item: "Currency: BDT · Generated with Quick Hishab by Md Tanvir Hossain", Qty: "", Unit: "", "Unit Price": "", Total: "" });
  return rows;
}

export function exportExcel(items: LineItem[], calc: CalcResult, settings: CalcSettings, mode: ExportMode = "full") {
  const rows: Record<string, unknown>[] =
    mode === "full"
      ? [
          ...items.map((i) => ({ Item: i.item, Qty: i.qty, Unit: i.unit, "Unit Price": i.price, Total: i.total })),
          { Item: "", Qty: "", Unit: "", "Unit Price": "", Total: "" },
          ...summaryRows(calc, settings),
        ]
      : summaryRows(calc, settings);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, mode === "full" ? "Report" : "Total");
  XLSX.writeFile(workbook, `Quick Hishab-${mode === "full" ? "report" : "total"}-${Date.now()}.xlsx`);
}

export function exportCsv(items: LineItem[], calc: CalcResult, settings: CalcSettings, mode: ExportMode = "full") {
  const rows: Record<string, unknown>[] =
    mode === "full"
      ? [
          ...items.map((i) => ({ Item: i.item, Qty: i.qty, Unit: i.unit, "Unit Price": i.price, Total: i.total })),
          { Item: "", Qty: "", Unit: "", "Unit Price": "", Total: "" },
          ...summaryRows(calc, settings),
        ]
      : summaryRows(calc, settings);

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Quick Hishab-${mode === "full" ? "report" : "total"}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
