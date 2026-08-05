import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CalcResult, CalcSettings, LineItem } from "./types";
import { formatBDT } from "./format";

export type ExportMode = "full" | "totalOnly";

export function exportPdf(
  items: LineItem[],
  calc: CalcResult,
  settings: CalcSettings,
  mode: ExportMode = "full",
  reportTitle = "SmartCalc AI Report"
) {
  const doc = new jsPDF();
  const reportId = `SC-${Date.now().toString(36).toUpperCase()}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, 210, 28, "F");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle, 14, 18);

  doc.setFontSize(9);
  doc.setTextColor(230, 236, 250);
  doc.text(`Report ID: ${reportId}`, 14, 24);
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 24);

  let cursorY = 36;

  if (mode === "full") {
    autoTable(doc, {
      startY: cursorY,
      head: [["ITEM", "QTY", "UNIT", "UNIT PRICE", "TOTAL"]],
      body: items.map((i) => [i.item, String(i.qty), i.unit.toUpperCase(), formatBDT(i.price), formatBDT(i.total)]),
      headStyles: {
        fillColor: [22, 90, 120],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
      },
      bodyStyles: {
        cellPadding: { top: 4.5, bottom: 4.5, left: 4, right: 4 },
        textColor: [40, 40, 40],
      },
      alternateRowStyles: { fillColor: [244, 246, 248] },
      styles: { fontSize: 9.5, lineColor: [230, 230, 230], lineWidth: 0.1 },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center", textColor: [130, 130, 130] },
        3: { halign: "right" },
        4: { halign: "right", fontStyle: "bold" },
      },
      theme: "grid",
    });
    cursorY = (doc as any).lastAutoTable.finalY + 8;
  }

  // --- Summary highlight box: Total Items / Grand Total ---
  if (items.length > 0) {
    const boxWidth = pageWidth - margin * 2;
    const boxHeight = 24;

    // page-break safety
    const pageHeight = doc.internal.pageSize.getHeight();
    if (cursorY + boxHeight + 16 > pageHeight) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFillColor(22, 90, 120);
    doc.roundedRect(margin, cursorY, boxWidth, boxHeight, 3, 3, "F");

    const colWidth = boxWidth / 2;
    const labelY = cursorY + 9;
    const valueY = cursorY + 18;

    doc.setTextColor(200, 225, 235);
    doc.setFontSize(8);
    doc.text("TOTAL ITEMS", margin + 8, labelY);
    doc.text("GRAND TOTAL", margin + colWidth + 8, labelY);

    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.setFontSize(13);
    doc.text(String(items.length), margin + 8, valueY);
    doc.text(formatBDT(calc.grandTotal), margin + colWidth + 8, valueY);
    doc.setFont(undefined, "normal");

    cursorY += boxHeight + 10;
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Generated with SmartCalc AI · by Md Tanvir Hossain",
    14,
    (doc as any).internal.pageSize.getHeight() - 10
  );

  doc.save(`smartcalc-${mode === "full" ? "report" : "total"}-${reportId}.pdf`);
}