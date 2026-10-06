"use client";

import { useMemo } from "react";
import { useAriaCall } from "@/hooks/use-aria-call";
import { CallPanel } from "@/components/aura/CallPanel";
import { Transcript } from "@/components/aura/Transcript";
import { TestOrders } from "@/components/aura/TestOrders";
import { SummaryPanel } from "@/components/aura/SummaryPanel";
import { buildSummary } from "@/lib/summary";
import { cn } from "@/lib/utils";

export function Index() {
  const call = useAriaCall();
  const connection =
    call.state === "connecting" ? "Connecting" : ["listening", "thinking", "speaking"].includes(call.state) ? "Connected" : "Disconnected";
  const summary = useMemo(
    () => (call.state === "ended" ? buildSummary(call.items.filter((i) => i.text.trim()), call.startedAt, call.endedAt) : null),
    [call.state, call.items, call.startedAt, call.endedAt],
  );

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <h1 className="font-serif text-2xl md:text-[28px]">Aura Skincare</h1>
            <p className="text-xs text-muted-foreground">Customer Support · Aria</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            <span className={cn("size-2 rounded-full", connection === "Connected" ? "bg-sage" : connection === "Connecting" ? "bg-amber" : "bg-sand")} />
            {connection}
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:px-8 md:py-8 lg:grid-cols-[1fr_1.3fr_1fr]">
        <div className="space-y-6">
          <CallPanel
            state={call.state}
            error={call.error}
            muted={call.muted}
            startedAt={call.startedAt}
            onStart={call.start}
            onStop={call.stop}
            onMute={call.toggleMute}
          />
        </div>
        <div className="space-y-6">
          <Transcript items={call.items} />
          {summary && <SummaryPanel summary={summary} onNewCall={call.reset} />}
        </div>
        <TestOrders />
      </main>
    </div>
  );
}
