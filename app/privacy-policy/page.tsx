import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { privacy } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy | Roma",
  description: privacy.lead.split(". ")[0] + ".",
};

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
