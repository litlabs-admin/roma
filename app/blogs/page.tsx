import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostGrid from "@/components/blog/PostGrid";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import { blogIndex, getPosts } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "Blog | Roma",
  description:
    "Plain-spoken guides for CPG founders and finance leads on deductions, retailers, trade rate and the margin in between.",
};

/** /blogs: hero → featured → latest grid → closing CTA (DESIGN.md §G.10). */
export default function BlogPage() {
  const [featured, ...rest] = getPosts();
  return (
    <>
      <Nav />
      <main>
        <BlogHero />
        <FeaturedPost post={featured} />
        <PostGrid id="latest-heading" label={blogIndex.latest.label} heading={blogIndex.latest.heading} posts={rest} />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
