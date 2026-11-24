/**
 * Build-time entry used by scripts/prerender.mjs to render every route to
 * static HTML. Not shipped to the browser.
 */
import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import App from './App';

export { properties, propertyPath } from './data/properties';
export { FAQ_DATA } from './data/faq';
export { BUSINESS, SITE_URL, waLink } from './data/site';
export { metaForPath, renderHeadTags, absUrl } from './seo';

export async function render(url: string): Promise<string> {
  // `prerender` waits for lazy-loaded routes (e.g. PropertyDetail) to resolve,
  // so every page is rendered in full.
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return new Response(prelude).text();
}
