import Image from "next/image";
import Link from "next/link";
import { storyPageCopy, type CustomerStory } from "@/lib/content/customers";
import TeaserVideo from "@/components/video/TeaserVideo";
import WatchTestimonial from "@/components/video/WatchTestimonial";
import v from "@/components/video/video.module.css";
import s from "./story.module.css";

/**
 * Story page intro (DESIGN.md §G.15, Hyperline story page): breadcrumb → cover photo →
 * title → lead → the person quoted (portrait when we have one). The brand mark appears
 * only in "At a glance" (StoryGlance), never twice.
 * [data-nav-light]: the nav is solid cream from the top.
 */
export default function StoryIntro({ story }: { story: CustomerStory }) {
  const { quote, brand } = story;
  return (
    <header className={s.intro} data-nav-light>
      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <ol>
          <li>
            <Link href="/customers">{storyPageCopy.breadcrumb}</Link>
          </li>
          <li aria-current="page">{brand.name}</li>
        </ol>
      </nav>

      <div className={s.cover}>
        <Image
          src={story.photo.src}
          alt=""
          fill
          sizes="(max-width: 860px) 100vw, 48rem"
          quality={85}
          loading="eager"
          fetchPriority="high"
          style={{ objectPosition: story.photo.position }}
        />
        {story.video && (
          <>
            <TeaserVideo src={story.video.teaser} position={story.photo.position} className={v.teaser} />
            <WatchTestimonial video={story.video} variant="cover" />
          </>
        )}
      </div>

      <h1 id="story-title" className={s.title}>
        {story.cardTitle}
      </h1>
      <p className={`${s.lead} type-lead`}>{story.excerpt}</p>

      <div className={s.person}>
        {quote.portrait && <Image src={quote.portrait.src} alt="" width={96} height={96} className={s.portrait} />}
        <div className={s.personText}>
          {quote.name && <p className={s.personName}>{quote.name}</p>}
          <p className={quote.name ? s.personRole : s.personName}>
            {quote.role} @ {brand.name}
          </p>
        </div>
      </div>
    </header>
  );
}
