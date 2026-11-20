/**
 * Links into /customers/[slug], /blogs/[slug] and /compare/[slug] need a per-link prefetch.
 * With partialPrefetching, a default <Link> prefetches only the route's App Shell (Nav + Footer):
 * the slug-specific body sits behind Suspense and streams in after the click, so the Footer
 * flashed directly under the Nav. `prefetch={true}` resolves the slug before the click; these
 * pages are fully prerendered, so it is served from the static cache.
 */
const DETAIL = /^\/(customers|blogs|compare)\/[^/?#]+/;

export const detailPrefetch = (href: string): true | undefined => (DETAIL.test(href) ? true : undefined);
