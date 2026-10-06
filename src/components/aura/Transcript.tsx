import { useEffect, useRef } from "react";
import type { TranscriptItem } from "@/hooks/use-aria-call";
import { cn } from "@/lib/utils";

const time = (t: number) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function Transcript({ items }: { items: TranscriptItem[] }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [items]);
  return (
    <section className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card shadow-sm">
      <header className="border-b border-border px-5 py-4">
        <h3 className="font-semibold">Live conversation</h3>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-5" style={{ maxHeight: 520 }}>
        {items.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Your conversation will appear here.</p>
        ) : (
          items.map((i) => (
            <div key={i.id} className={cn("flex flex-col", i.role === "user" ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  i.role === "user" ? "bg-secondary" : "border border-border border-l-4 border-l-primary bg-card",
                  !i.final && "opacity-70",
                )}
              >
                {i.text}
              </div>
              <span className="mt-1 text-[11px] text-muted-foreground">
                {i.role === "user" ? "You" : "Aria"} · {time(i.at)}
              </span>
            </div>
          ))
        )}
        <div ref={end} />
      </div>
    </section>
  );
}
