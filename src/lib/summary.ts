import type { TranscriptItem } from "@/hooks/use-aria-call";
import { getOrderDetails } from "@/lib/orders";

export interface CallSummary {
  intent: string;
  order_id: string | null;
  order_status: string | null;
  resolution: "resolved" | "info_provided" | "denied_by_policy" | "needs_follow_up" | "out_of_scope" | "no_conversation";
  summary: string;
  tool_used: boolean;
  follow_up: string | null;
  turns: number;
  duration_seconds: number;
}

const has = (t: string, ...w: string[]) => w.some((x) => t.includes(x));

/** Deterministic summary from the transcript. Order facts come from the same verified data the tool uses. */
export function buildSummary(items: TranscriptItem[], startedAt: number | null, endedAt: number | null): CallSummary {
  const user = items.filter((i) => i.role === "user").map((i) => i.text.toLowerCase()).join(" ");
  const agent = items.filter((i) => i.role === "agent").map((i) => i.text.toLowerCase()).join(" ");
  const all = `${user} ${agent}`;
  const duration = startedAt && endedAt ? Math.max(0, Math.round((endedAt - startedAt) / 1000)) : 0;

  const idMatch = all.match(/o\s*r\s*d[\s\-]*(\d{3})|order\s*(?:id|number)?\s*(?:is)?\s*(\d{3})\b/);
  const rawId = idMatch ? `ORD-${idMatch[1] ?? idMatch[2]}` : null;
  const lookup = rawId ? getOrderDetails(rawId) : null;

  let intent = "General enquiry";
  if (has(user, "cancel")) intent = "Cancel order";
  else if (has(user, "return", "refund", "exchange")) intent = "Return / refund";
  else if (has(user, "damage", "broken", "leak")) intent = "Damaged product";
  else if (has(user, "where", "track", "status", "deliver", "arrive")) intent = "Order tracking";
  else if (has(user, "shipping", "cod", "cash on delivery")) intent = "Shipping / payment policy";

  let resolution: CallSummary["resolution"] = "info_provided";
  if (!items.length) resolution = "no_conversation";
  else if (has(agent, "can only help with aura")) resolution = "out_of_scope";
  else if (has(agent, "outside", "not eligible", "cannot be cancelled", "can't be cancelled", "unfortunately")) resolution = "denied_by_policy";
  else if (has(agent, "noted your request", "team will confirm", "support team")) resolution = "needs_follow_up";
  else if (lookup?.ok) resolution = "resolved";

  const orderPart = lookup?.ok
    ? ` about ${lookup.order.order_id} (${lookup.order.product}, ${lookup.order.status})`
    : rawId
      ? ` about ${rawId}, which was not found`
      : "";

  return {
    intent,
    order_id: lookup?.ok ? lookup.order.order_id : rawId,
    order_status: lookup?.ok ? lookup.order.status : null,
    resolution,
    summary: items.length
      ? `Customer called with a ${intent.toLowerCase()} request${orderPart}. Aria ${resolution.replace(/_/g, " ")}.`
      : "The call ended before any conversation took place.",
    tool_used: Boolean(rawId),
    follow_up: resolution === "needs_follow_up" ? "Support team to confirm the customer's request." : null,
    turns: items.length,
    duration_seconds: duration,
  };
}
