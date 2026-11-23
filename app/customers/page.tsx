import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/blog/Reveal";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import StoryStrip from "@/components/sections/stories/StoryStrip";
import { STORIES } from "@/components/sections/stories/data";
import LogoCard from "@/components/customers/LogoCard";
import { CUSTOMER_STORIES, custClosing, customersCopy } from "@/lib/content/customers";
import c from "@/components/customers/customers.module.css";

export const metadata: Metadata = {
  title: "Customers | Roma",
  description:
    "How CPG brands stopped writing off deductions with Roma: watch Farmer Direct Foods’ story, and see how Good Day Chocolate recovered $53K in 6 months and Smash Kitchen recovered $23K.",
};

/**
 * /customers (DESIGN.md §G.15, Hyperline customers page): one cream sheet holding the
 * centred intro, the featured strip (the homepage's three real-figure stories, cream
 * tone, story link on the active card) and every story as a logo card; then the
 * closing CTA. [data-nav-light]: the nav is solid cream from the top.
 */
export default function CustomersPage() {
  return (
    <>
      <Nav />
      <main>
        <div className={c.page}>
          <Reveal as="section" className="container-lg" aria-labelledby="customers-title">
            <div className={c.intro} data-nav-light>
              <h1 id="customers-title" className={`${c.heading} type-h2`} data-reveal>
                {customersCopy.heading}
              </h1>
              <p className={`${c.lead} type-lead`} data-reveal>
                {customersCopy.lead}
              </p>
            </div>
            <div data-reveal>
              <StoryStrip stories={STORIES} tone="cream" storyLink priority />
            </div>
          </Reveal>

          <Reveal as="section" className={`container-lg ${c.library}`} aria-labelledby="all-stories">
            <h2 id="all-stories" className="sr-only">
              {customersCopy.gridHeading}
            </h2>
            <ul className={c.grid}>
              {CUSTOMER_STORIES.map((st) => (
                <li key={st.slug}>
                  <LogoCard story={st} />
                </li>
              ))}
            </ul>
            <p className={c.note}>{customersCopy.note}</p>
          </Reveal>
        </div>

        <ClosingCta copy={custClosing} secondary={custClosing.secondary} />
      </main>
      <Footer />
    </>
  );
}
