# 🌿 Aura Skincare — Aria Voice Customer Support Agent
Live Demo : https://aura-support.vercel.app

A modern, real-time voice support assistant for **Aura Skincare**, powered by **Aria** (an AI voice agent built on [Omnidimension](https://omnidim.io)). Aria assists customers with order tracking, product usage advice, delivery updates, order cancellations, and return policy queries via real-time interactive voice streaming.

🌐 **Live Demo:** [https://aura-support.vercel.app/](https://aura-support.vercel.app/)

---

## 📸 Key Features

- 🎙️ **Real-Time Voice Streaming**: Ultra-low-latency real-time voice interaction using Omnidimension `@omnidim-ai/client` WebSession.
- 🔒 **Secure Ephemeral Voice Sessions**: Server-side session creation (`src/lib/voice.functions.ts`) keeps secret API keys off the client.
- 📦 **Live Order Lookup Tool**: Integrated custom function calling tool exposed at `/api/public/get-order-details` for real-time order status, tracking IDs, and delivery estimates.
- 💬 **Live Transcript View**: Real-time transcript display showing spoken messages between the customer and Aria.
- 📄 **Post-Call Summary Panel**: Automatically displays order details, verified facts, and actions discussed upon call completion.
- 💅 **Modern Glassmorphic UI**: High-end responsive design with smooth micro-animations built with Tailwind CSS v4 and Radix UI primitives.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) 
- **Voice Engine**: [Omnidimension AI](https://omnidim.io/) `@omnidim-ai/client`
- **Deployment**: Hosted on [Vercel](https://vercel.com/)

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/aura-skincare.git
cd aura-skincare
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Omnidimension credentials in `.env`:
```env
OMNIDIM_API_KEY=your_omnidim_api_key
OMNIDIM_AGENT_ID=your_agent_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🔌 API Endpoints & Custom Tools

### Order Details API Endpoint
The voice agent relies on a verified custom tool route for real-time order lookups:

- **URL**: `GET /api/public/get-order-details?order_id=ORD-101`
- **Alternative**: `POST /api/public/get-order-details` with body `{"order_id": "ORD-101"}`

#### Sample Response:
```json
{
  "ok": true,
  "order": {
    "order_id": "ORD-101",
    "customer": "Priya Sharma",
    "product": "Vitamin C Serum (30ml)",
    "value": 699,
    "currency": "INR",
    "status": "Out for Delivery",
    "courier": "BlueDart",
    "tracking_id": "BD-982103",
    "eta": "Expected by 6 PM today",
    "payment": "Prepaid"
  }
}
```

---

## Some whys

### 1. Why did I choose particular architecture and technology stack?
* **Next.js (App Router) + TypeScript**: Next.js provides full-stack unification with Server Actions and Route Handlers in a single repository. Server Actions (`src/lib/voice.functions.ts`) securely keep the Omnidimension API key server-side, while App Router route handlers (`/api/public/get-order-details`) provide a public HTTP JSON endpoint for the voice agent's custom tool call.
* **Tailwind CSS v4**: Offers high-performance utility-first styling with accessible UI primitives, enabling a polished, modern glassmorphic interface with real-time transcript streaming and dynamic order status cards.
* **Omnidimension `@omnidim-ai/client`**: WebSession enables ultra-low-latency real-time voice communication over WebSockets, giving customers natural, responsive turn-taking during support calls.

### 2. What was the most difficult part of the assignment, and how did you solve it?
* **Challenge**: Guaranteeing real-time synchronization between the voice session lifecycle, streaming transcripts, and verified backend order tool calls without exposing API secrets or causing race conditions.
* **Solution**: Decoupled session initialization from client-side state by creating a secure Next.js Server Action (`createVoiceSession`) that requests an ephemeral WebSocket URL from Omnidimension. In addition, designed a single source of truth order verification module (`src/lib/orders.ts`) shared between the public API route and the post-call summary component to ensure consistent, non-hallucinated data across both the agent and UI.

### 3. If you had one more week to work on this, what would you improve first and why?
* **Database & E-Commerce Integration**: Replace in-memory mock order data with a PostgreSQL database (via Prisma ORM) and connect live webhooks to e-commerce platforms (Shopify/WooCommerce) for real-time inventory checks, live shipping updates, and automated order modifications.
* **Sentiment Analysis & Human Handoff**: Integrate real-time sentiment scoring during voice streams. If a customer expresses high frustration, the agent would seamlessly transfer the call context and live transcript to a human support queue.
* **Interactive Audio Visualizer & Call Exports**: Add canvas-rendered waveform visualizers during active speech and exportable transcript summaries via email or PDF for customer records.

### 4. Imagine this agent is handling 1,000 customer conversations a day. What do I think would need to change or improve?
* **Infrastructure & Caching**: Implement Redis (Upstash) caching for order details and API responses to prevent database strain during peak call hours.
* **Rate Limiting & DDoS Protection**: Add token-bucket rate limiting on the `/api/public/get-order-details` and session creation endpoints to protect against abuse and manage concurrent WebSocket connections.
* **Observability & Analytics**: Integrate OpenTelemetry and analytics logging (e.g. Datadog / PostHog) to track key performance indicators such as audio packet latency, tool call execution speeds, transcript resolution rates, and dropped call metrics.
* **Security & Auth**: Secure the custom order lookup tool endpoint with HMAC signature validation or API tokens to ensure only authorized voice agent requests can query customer PII, while masking sensitive details in recorded logs.

---

## 📄 License

MIT © [Aura Skincare](https://aura-support.vercel.app/)
