import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ContactHero from "@/components/contact/ContactHero";
import ProofAside from "@/components/contact/ProofAside";
import LeadForm from "@/components/forms/LeadForm";
import Faq from "@/components/sections/faq/Faq";
import { demoPage } from "@/lib/content/contact";

export const metadata: Metadata = {
  title: "Book a demo | Roma",
  description: "See what Roma can do for you. Book 30 minutes with our team and see the platform in action on your own deductions.",
};

/** /book-a-demo (DESIGN.md §G.12). No closing CTA: it would only point back here. */
export default function BookADemoPage() {
  return (
    <>
      <Nav />
      <main>
        <ContactHero
          eyebrow={demoPage.eyebrow}
          icon="calendar"
          heading={demoPage.heading}
          lead={demoPage.lead}
          formTitle={demoPage.formTitle}
          formSub={demoPage.formSub}
          aside={<ProofAside />}
        >
          <LeadForm kind="demo" />
        </ContactHero>
        <Faq order={[3, 2, 1, 5, 4, 0, 6]} />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
