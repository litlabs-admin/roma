import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import DocHeader from "@/components/legal/DocHeader";
import CodeLibrary from "@/components/legal/CodeLibrary";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { codeSets, codesCopy } from "@/lib/content/deductionCodes";
import d from "@/components/legal/doc.module.css";

export const metadata: Metadata = {
  title: "Deduction code library | Roma",
  description: codesCopy.lead,
};

/** /deduction-codes: the code reference from runroma.com, searchable per retailer. */
export default function DeductionCodesPage() {
  return (
    <>
      <Nav />
      <main>
        <DocHeader kicker={codesCopy.kicker} title={codesCopy.title} lead={codesCopy.lead} meta={codesCopy.updated} />
        <section className={d.librarySection} aria-labelledby="doc-title">
          <CodeLibrary sets={codeSets} />
        </section>
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
