import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ArticleBody from "@/components/blog/ArticleBody";
import ArticleToc from "@/components/blog/ArticleToc";
import Reveal from "@/components/blog/Reveal";
import type { LegalDoc } from "@/lib/content/legal";
import DocHeader from "./DocHeader";
import a from "@/components/blog/article.module.css";
import d from "./doc.module.css";

/** /terms-and-conditions and /privacy-policy: centred cream header, then the blog article layout. */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const toc = doc.body.flatMap((b) => (b.type === "h2" ? [{ id: b.id, text: b.text }] : []));
  return (
    <>
      <Nav />
      <main>
        <DocHeader kicker="Legal" title={doc.title} lead={doc.lead} meta={`Effective ${doc.effective}`} tone="light" />
        <div className={a.main}>
          <div className={a.layout}>
            <div className={a.tocCol}>
              <ArticleToc items={toc} label="On this page" />
            </div>
            <Reveal mode="each" as="article" className={`${a.prose} ${d.legal}`} aria-labelledby="doc-title">
              <ArticleBody blocks={doc.body} />
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
