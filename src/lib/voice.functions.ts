"use server";

export async function createVoiceSession() {
  const apiKey = process.env["OMNIDIM_API_KEY"];
  const agentId = Number(process.env["OMNIDIM_AGENT_ID"]);
  if (!apiKey || !agentId) {
    return { ok: false as const, error: "Voice service is not configured yet." };
  }
  try {
    const res = await fetch("https://omnidim.io/api/v1/sessions/create", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, type: "voice" }),
    });
    const data = (await res.json().catch(() => ({}))) as { ws_url?: string; message?: string; error?: string };
    if (!res.ok || !data.ws_url) {
      console.error("Omnidimension session failed", res.status, data);
      return { ok: false as const, error: "Couldn't connect to the voice service." };
    }
    return { ok: true as const, wsUrl: data.ws_url };
  } catch (e) {
    console.error(e);
    return { ok: false as const, error: "Couldn't connect to the voice service." };
  }
}
