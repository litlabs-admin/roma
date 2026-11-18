import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";
import ContactHero from "@/components/contact/ContactHero";
import ProofAside from "@/components/contact/ProofAside";
import LeadForm from "@/components/forms/LeadForm";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import ArrowLink from "@/components/ui/ArrowLink";
import { contactPage } from "@/lib/content/contact";
import s from "@/components/contact/contact.module.css";

export const metadata: Metadata = {
  title: "Contact us | Roma",
  description: "Questions about Roma, pricing, support or partnerships? Send us a note and the right person will get back to you within one business day.",
};

/** /contact (DESIGN.md §G.12). */
export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <ContactHero
          eyebrow={contactPage.eyebrow}
          icon="mail"
          heading={contactPage.heading}
          lead={contactPage.lead}
          formTitle={contactPage.formTitle}
          formSub={contactPage.formSub}
          aside={
            <ProofAside
              footer={
                <ul className={s.quickLinks}>
                  {contactPage.aside.map((a) => (
                    <li key={a.title}>
                      <span>{a.title}</span>
                      <ArrowLink href={a.link.href}>{a.link.label}</ArrowLink>
                    </li>
                  ))}
                </ul>
              }
            />
          }
        >
          <LeadForm kind="contact" />
        </ContactHero>
        <Faq order={[1, 3, 2, 4, 0, 5, 6]} />
        <ClosingCta />
      </main>
      <Footer />
      <PageBackdrop />
    </>
  );
}
