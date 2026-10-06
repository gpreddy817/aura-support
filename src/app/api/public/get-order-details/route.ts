import { getOrderDetails } from "@/lib/orders";

// Called by the Omnidimension agent's custom API tool (get_order_details).
// Read-only mock data; no PII beyond the demo orders.
export const dynamic = "force-dynamic";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function respond(result: ReturnType<typeof getOrderDetails>) {
  return Response.json(result, { status: 200, headers: cors });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("order_id");
  return respond(getOrderDetails(id));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = body["order_id"] ?? (body["args"] as Record<string, unknown> | undefined)?.["order_id"];
    return respond(getOrderDetails(id));
  } catch {
    return Response.json(
      { ok: false, error: { code: "BAD_REQUEST", message: "Invalid JSON body." } },
      { status: 400, headers: cors },
    );
  }
}
