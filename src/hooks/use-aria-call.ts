"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createVoiceSession } from "@/lib/voice.functions";

export type CallState = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "ended" | "error";
export interface TranscriptItem {
  id: string;
  role: "user" | "agent";
  text: string;
  final: boolean;
  at: number;
}

export function useAriaCall() {
  const [state, setState] = useState<CallState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<TranscriptItem[]>([]);
  const [muted, setMuted] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const sessionRef = useRef<import("@omnidim-ai/client").WebSession | null>(null);
  const userStopRef = useRef(false);

  const handleTranscript = useCallback((t: { role: "user" | "agent"; text: string; final: boolean }) => {
    const trimmed = t.text.trim();
    if (!trimmed) return;

    setItems((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === t.role) {
        // If same role, update the current turn item if it's open or a continuation of the turn
        const isSameTurn = !last.final || t.text.startsWith(last.text) || last.text.startsWith(t.text);
        if (isSameTurn) {
          return [...prev.slice(0, -1), { ...last, text: t.text, final: t.final }];
        }
      }
      return [...prev, { id: crypto.randomUUID(), role: t.role, text: t.text, final: t.final, at: Date.now() }];
    });

    if (t.role === "user") setState(t.final ? "thinking" : "listening");
    else setState(t.final ? "listening" : "speaking");
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setItems([]);
    setEndedAt(null);
    setState("connecting");
    userStopRef.current = false;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => s.getTracks().forEach((t) => t.stop()));
    } catch {
      setError("Microphone access is needed. Please allow it and try again.");
      setState("error");
      return;
    }
    const res = await createVoiceSession();
    if (!res.ok) {
      setError(res.error);
      setState("error");
      return;
    }
    try {
      const { WebSession } = await import("@omnidim-ai/client");
      const session = new WebSession();
      sessionRef.current = session;
      session.on("transcript", handleTranscript);
      session.on("error", (e) => console.warn("voice error", e));
      session.on("status", (s) => {
        if (s === "active") {
          setStartedAt(Date.now());
          setState("listening");
        } else if (typeof s === "object" && s.state === "ended") {
          sessionRef.current = null;
          setEndedAt(Date.now());
          if (s.reason === "connection_lost" && !userStopRef.current) {
            setError("The call disconnected unexpectedly.");
            setState("error");
          } else if (s.reason === "insufficient_balance") {
            setError("The voice service has run out of balance.");
            setState("error");
          } else setState("ended");
        }
      });
      await session.start({ wsUrl: res.wsUrl });
    } catch (e) {
      console.error(e);
      setError("Couldn't connect to the voice service.");
      setState("error");
    }
  }, [handleTranscript]);

  const stop = useCallback(() => {
    userStopRef.current = true;
    sessionRef.current?.stop();
    sessionRef.current = null;
    setEndedAt(Date.now());
    setState("ended");
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      sessionRef.current?.mute(!m);
      return !m;
    });
  }, []);

  const reset = useCallback(() => {
    setItems([]);
    setError(null);
    setStartedAt(null);
    setEndedAt(null);
    setState("idle");
  }, []);

  useEffect(() => () => { void sessionRef.current?.stop(); }, []);

  return { state, error, items, muted, startedAt, endedAt, start, stop, toggleMute, reset };
}
