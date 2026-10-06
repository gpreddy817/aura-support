import type { Metadata } from "next";
import { Index } from "./index-client";

export const metadata: Metadata = {
  title: "Aura Skincare · Talk to Aria",
  description:
    "Voice customer support for Aura Skincare. Ask Aria about orders, returns, shipping and more.",
  openGraph: {
    title: "Aura Skincare · Talk to Aria",
    description: "Voice customer support for Aura Skincare, powered by Aria.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return <Index />;
}
