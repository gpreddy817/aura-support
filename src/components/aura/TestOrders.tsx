import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ORDERS } from "@/lib/orders";
import { cn } from "@/lib/utils";

const badge: Record<string, string> = {
  "Out for Delivery": "bg-clay/15 text-clay",
  Delivered: "bg-sage/15 text-sage-dark",
  Processing: "bg-amber/20 text-ink",
  Shipped: "bg-secondary text-foreground",
};

const tries: Record<string, string> = {
  "ORD-101": "Where is my order ORD-101?",
  "ORD-102": "Can I return ORD-102?",
  "ORD-103": "I want to cancel ORD-103.",
};

function orderNote(o: (typeof ORDERS)[number]): string {
  const parts: string[] = [];
  if (o.courier && o.trackingId) parts.push(`${o.courier} ${o.trackingId}`);
  if (o.eta) parts.push(o.eta);
  if (o.note) parts.push(o.note);
  return parts.join(" · ");
}

export function TestOrders() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold">Test orders</h3>
      <div className="space-y-3">
        {ORDERS.map((o) => (
          <article key={o.orderId} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => copy(o.orderId)} className="inline-flex items-center gap-1.5 font-mono text-sm font-bold hover:text-primary" aria-label={`Copy ${o.orderId}`}>
                {o.orderId}
                {copied === o.orderId ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5 text-muted-foreground" />}
              </button>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", badge[o.status] ?? "bg-secondary text-foreground")}>{o.status}</span>
            </div>
            <p className="mt-2 text-sm font-medium">{o.items}</p>
            <p className="text-sm text-muted-foreground">{o.customer} · ₹{o.total}</p>
            <p className="mt-1 text-xs text-muted-foreground">{orderNote(o)}</p>
            <p className="mt-2 text-xs italic text-ink-soft">Try saying: “{tries[o.orderId]}”</p>
          </article>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-secondary/60 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Policy test ideas</p>
        <ul className="space-y-1 text-sm text-ink-soft">
          <li>Return ORD-102 (delivered 14 days ago)</li>
          <li>Cancel ORD-101 (out for delivery)</li>
          <li>Ask about invalid order ORD-999</li>
          <li>Ask about shipping fee for a ₹399 order</li>
        </ul>
      </div>
    </section>
  );
}
