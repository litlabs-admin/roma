import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { terms } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: "Terms & conditions | Roma",
  description: terms.lead,
};

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
