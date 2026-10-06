import { useEffect, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, RotateCcw } from "lucide-react";
import type { CallState } from "@/hooks/use-aria-call";
import { cn } from "@/lib/utils";

const META: Record<CallState, { label: string; helper: string; dot: string; pulse?: boolean }> = {
  idle: { label: "Ready to help", helper: "Click Start Call and say hello", dot: "bg-sand" },
  connecting: { label: "Connecting…", helper: "Setting up your call", dot: "bg-amber", pulse: true },
  listening: { label: "Listening…", helper: "Speak now", dot: "bg-sage", pulse: true },
  thinking: { label: "Thinking…", helper: "Aria is thinking…", dot: "bg-amber" },
  speaking: { label: "Speaking", helper: "Aria is speaking – you can interrupt", dot: "bg-clay", pulse: true },
  ended: { label: "Call ended", helper: "See the summary below", dot: "bg-ink-soft" },
  error: { label: "Something went wrong", helper: "", dot: "bg-rose" },
};

function Timer({ since }: { since: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.max(0, Math.floor((now - since) / 1000));
  return <span className="font-mono text-xs text-ink-soft">{String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</span>;
}

interface Props {
  state: CallState;
  error: string | null;
  muted: boolean;
  startedAt: number | null;
  onStart: () => void;
  onStop: () => void;
  onMute: () => void;
}

export function CallPanel({ state, error, muted, startedAt, onStart, onStop, onMute }: Props) {
  const m = META[state];
  const inCall = state === "connecting" || state === "listening" || state === "thinking" || state === "speaking";
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-5 grid size-28 place-items-center rounded-full bg-secondary">
          {m.pulse && <span className={cn("absolute inset-0 rounded-full animate-soft-pulse", m.dot)} />}
          <span className="relative grid size-20 place-items-center rounded-full bg-card font-serif text-3xl text-primary shadow-sm">A</span>
          <span className={cn("absolute bottom-2 right-2 size-4 rounded-full ring-4 ring-card", m.dot)} />
        </div>
        <h2 className="font-serif text-2xl">Aria</h2>
        <p className="text-sm text-muted-foreground">Aura Skincare Support</p>
        <p className="mt-4 text-lg font-semibold">{m.label}</p>
        <p className="min-h-5 text-sm text-muted-foreground">{state === "error" ? error : m.helper}</p>
        {startedAt && inCall && state !== "connecting" && <Timer since={startedAt} />}

        <div className="mt-6 flex items-center gap-3">
          {inCall ? (
            <>
              <button
                onClick={onMute}
                disabled={state === "connecting"}
                className="grid size-12 place-items-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </button>
              <button onClick={onStop} className="inline-flex h-12 items-center gap-2 rounded-xl bg-destructive px-6 font-medium text-destructive-foreground transition-opacity hover:opacity-90">
                <PhoneOff className="size-5" /> End Call
              </button>
            </>
          ) : (
            <button onClick={onStart} className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 font-medium text-primary-foreground transition-colors hover:bg-sage-dark">
              {state === "error" ? <RotateCcw className="size-5" /> : <Phone className="size-5" />}
              {state === "error" ? "Retry" : "Start Call"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
