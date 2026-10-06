export interface Order {
  orderId: string;
  customer: string;
  items: string;
  total: number;
  currency: string;
  status: string;
  courier?: string;
  trackingId?: string;
  eta?: string;
  payment?: string;
  note?: string;
}

export const ORDERS: Order[] = [
  {
    orderId: "ORD-101",
    customer: "Priya Sharma",
    items: "Vitamin C Serum (30ml)",
    total: 699,
    currency: "INR",
    status: "Out for Delivery",
    courier: "BlueDart",
    trackingId: "BD-982103",
    eta: "Expected by 6 PM today",
    payment: "Prepaid",
  },
  {
    orderId: "ORD-102",
    customer: "Rahul Verma",
    items: "Hydrating Sunscreen SPF 50",
    total: 499,
    currency: "INR",
    status: "Delivered",
    courier: "Delhivery",
    trackingId: "DL-441029",
    payment: "Prepaid",
    note: "Delivered 14 days ago — outside the 7-day return window.",
  },
  {
    orderId: "ORD-103",
    customer: "Ananya Patel",
    items: "Green Tea Face Wash + Toner",
    total: 850,
    currency: "INR",
    status: "Processing",
    payment: "COD",
    note: "Ordered 3 hours ago — eligible for cancellation while Processing.",
  },
];

export function findOrder(orderId: string): Order | undefined {
  const normalized = orderId.trim().toUpperCase();
  return ORDERS.find((o) => o.orderId === normalized);
}

export type OrderLookup =
  | { ok: true; order: { order_id: string; customer: string; product: string; value: number; currency: string; status: string; courier?: string | undefined; tracking_id?: string | undefined; eta?: string | undefined; payment?: string | undefined; notes?: string | undefined } }
  | { ok: false; error: { code: string; message: string } };

/** Verified order facts for the agent tool and the post-call summary. Never guesses. */
export function getOrderDetails(orderId: unknown): OrderLookup {
  if (typeof orderId !== "string" || !orderId.trim()) {
    return { ok: false, error: { code: "MISSING_ORDER_ID", message: "Please provide an order ID like ORD-101." } };
  }
  const order = findOrder(orderId);
  if (!order) {
    return { ok: false, error: { code: "NOT_FOUND", message: `No order found for ${orderId}. Please verify the order ID.` } };
  }
  return {
    ok: true,
    order: {
      order_id: order.orderId,
      customer: order.customer,
      product: order.items,
      value: order.total,
      currency: order.currency,
      status: order.status,
      courier: order.courier,
      tracking_id: order.trackingId,
      eta: order.eta,
      payment: order.payment,
      notes: order.note,
    },
  };
}
