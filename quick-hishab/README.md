# SmartCalc AI — Phase 1 MVP

Upload → Extract → Convert to JSON → Editable table → Calculate → Download PDF/Excel/CSV/PNG.

This is the **Phase 1 MVP** slice of the full SmartCalc AI spec: everything runs client-side in
the browser (no backend, no login) so you can try the entire core flow immediately.

## What's implemented

- **Upload**: Excel (`.xlsx`/`.xls`), CSV, image/screenshot (drag-and-drop or click), or start
  from a blank manual row.
- **Extraction**:
  - Excel/CSV → parsed with SheetJS + PapaParse, columns guessed from headers (item/qty/price/total).
  - Image/screenshot → OCR'd in-browser with Tesseract.js, then parsed into line items with a
    heuristic line parser (item name + trailing numbers → qty/price/total).
- **Structured JSON**: every extraction path normalizes into the same `LineItem[]` shape.
- **Editable table**: every cell is editable; totals recompute live; rows can be added/removed.
- **Calculation engine**: subtotal, discount %, tax/VAT %, grand total, average, highest/lowest item.
- **Error/issue detection**: flags wrong totals (qty × price ≠ total), duplicate item names,
  missing item names, invalid quantities/prices.
- **Export**: PDF (jsPDF + autotable), Excel (SheetJS), CSV, and PNG (html-to-image) of the report card.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's intentionally *not* in Phase 1

Per the full project spec, these come in later phases and were left out so this MVP stays
small and runnable:

- **Phase 2**: PDF upload (text + scanned), multi-image merge, saved history, search/filter/categories.
- **Phase 3 (AI)**: OpenAI-powered natural-language queries ("remove VAT", "show items above 1000"),
  smarter error/duplicate detection, currency auto-detection.
- **Backend/SaaS shell**: Node/Express + MongoDB API, JWT + Google auth, dashboard, admin panel,
  subscription/billing (Stripe-ready), rate limiting, role-based access. The client code here is
  structured (typed `LineItem`/`CalcResult` models, isolated `lib/` parsers and exporters) so a
  backend can be added later without reworking the calculation or export logic — e.g. swap
  `setItems()` in `store/useLedgerStore.ts` for a call that also POSTs to an API, and add an
  `app/(auth)` route group for login.

## Project structure

```
app/                 Next.js App Router pages, layout, global styles
components/          FileUpload, DataTable, CalculationPanel, ExportBar, IssuesPanel, Header
lib/                 excelParser, ocrParser, calculations, exportPdf, exportExcel, exportImage, types
store/               useLedgerStore.ts (Zustand) — single source of truth for items/settings
```

## Next step for real OCR/AI accuracy

Tesseract.js runs fully offline and free, but is less accurate than a hosted model. To upgrade
extraction quality (per the spec's "AI Extraction" section), pipe the OCR'd raw text through an
OpenAI API call that returns strict JSON line items instead of the current heuristic parser in
`lib/ocrParser.ts` — that's a single function swap, everything downstream (table, calc, export)
is unaffected.
