import { useState } from "react";

import type { CallSummary } from "@/lib/summary";
import { cn } from "@/lib/utils";

const resColor: Record<CallSummary["resolution"], string> = {
  resolved: "bg-sage/15 text-sage-dark",
  info_provided: "bg-sage/15 text-sage-dark",
  denied_by_policy: "bg-clay/15 text-clay",
  needs_follow_up: "bg-amber/20 text-ink",
  out_of_scope: "bg-secondary text-foreground",
  no_conversation: "bg-secondary text-foreground",
};

export function SummaryPanel({ summary, onNewCall }: { summary: CallSummary; onNewCall: () => void }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(summary, null, 2);
  const rows: [string, React.ReactNode][] = [
    ["Intent", summary.intent],
    ["Order ID", summary.order_id ? <span key="order-id" className="font-mono">{summary.order_id}</span> : "—"],
    ["Resolution", <span key="resolution" className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", resColor[summary.resolution])}>{summary.resolution.replace(/_/g, " ")}</span>],
    ["Order lookup", summary.tool_used ? "get_order_details" : "Not needed"],
    ["Follow-up", summary.follow_up ?? "None"],
    ["Duration", `${summary.duration_seconds}s · ${summary.turns} turns`],
  ];
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-serif text-xl">Call summary</h3>
      <p className="mt-2 text-sm text-ink-soft">{summary.summary}</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-secondary/50 p-3">
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="mt-1 text-sm font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <details className="mt-4 rounded-xl border border-border">
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium">Raw JSON</summary>
        <div className="relative">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(json);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="absolute right-3 top-2 rounded-lg border border-border bg-card px-2 py-1 text-xs"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <pre className="overflow-x-auto px-4 pb-4 pt-2 font-mono text-xs">{json}</pre>
        </div>
      </details>
      <button onClick={onNewCall} className="mt-5 h-11 rounded-xl bg-primary px-6 font-medium text-primary-foreground hover:bg-sage-dark">
        New Call
      </button>
    </section>
  );
}
