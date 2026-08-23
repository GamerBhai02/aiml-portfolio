import { useEffect } from 'react';
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '../siteConfig';

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Per-page SEO: document title, description, canonical URL, Open Graph and
// robots directives. Re-runs whenever any argument changes (e.g. after a blog
// post finishes loading), so dynamic pages get correct meta tags.
export default function usePageMeta({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  path = '/',
  image = null,
  noindex = false,
} = {}) {
  useEffect(() => {
    const url = `${SITE_URL}${path.replace(/^\//, '')}`;
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    if (image) {
      upsertMeta('property', 'og:image', image);
      upsertMeta('name', 'twitter:image', image);
    }
  }, [title, description, path, image, noindex]);
}
