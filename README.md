# Aura Skincare · Aria voice support

Next.js (App Router) + TypeScript + Tailwind CSS v4. Voice agent powered by Omnidimension.

## Setup

```sh
npm install
cp .env.example .env   # then fill in OMNIDIM_API_KEY and OMNIDIM_AGENT_ID
npm run dev            # http://localhost:8080
```

## Scripts

- `npm run dev` – dev server on port 8080
- `npm run build` – production build
- `npm start` – serve the production build
- `npm run lint` – ESLint

## Agent tool endpoint

`GET /api/public/get-order-details?order_id=ORD-101` or `POST` with `{"order_id":"ORD-101"}`.
