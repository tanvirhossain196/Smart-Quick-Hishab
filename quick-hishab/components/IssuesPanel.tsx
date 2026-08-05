"use client";

import { useIssues } from "@/store/useLedgerStore";

export default function IssuesPanel() {
  const issues = useIssues();
  if (!issues.length) return null;

  return (
    <div className="mt-4 rounded-xl2 border border-brand-accent/30 bg-brand-accent/10 px-5 py-4 shadow-card">
      <p className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide text-brand-accent">
        ⚠ Flagged for review ({issues.length})
      </p>
      <ul className="space-y-1.5 text-sm text-brand-ink">
        {issues.map((issue, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="text-brand-accent">
              •
            </span>
            <span>{issue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
