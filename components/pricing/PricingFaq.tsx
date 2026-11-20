"use client";

import { useEffect } from "react";
import Faq from "@/components/sections/faq/Faq";
import { PRICING_FAQS, pricingCopy } from "@/lib/content/pricing";
import { pricingSource, track } from "@/lib/calculator/track";

const ITEMS = PRICING_FAQS.map(({ q, a }) => ({ q, a }));

/** The pricing FAQ (brief §3.8) with pricing_faq_open, plus the page's pricing_view event. */
export default function PricingFaq() {
  useEffect(() => {
    track("pricing_view", { source: pricingSource() });
  }, []);
  return <Faq items={ITEMS} copy={pricingCopy.faqHead} onOpen={(q) => track("pricing_faq_open", { question: q })} />;
}
