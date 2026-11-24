/**
 * Build step: pre-render every page to static HTML.
 *
 * Why: the site is a React single-page app. Without this step every URL returns
 * an empty <div id="root"></div>, so crawlers that don't run JavaScript (Bing in
 * many cases, WhatsApp/Facebook link previews, and AI crawlers such as GPTBot,
 * ClaudeBot and PerplexityBot) see no content, no title and no description.
 *
 * Output (in dist/):
 *   index.html, properti/<id>.html, 404.html   – full HTML + per-page <head>
 *   sitemap.xml, robots.txt, llms.txt          – generated from src/data
 *
 * Runs automatically as part of `npm run build`.
 */
import { build } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrOut = path.join(root, 'node_modules', '.prerender');

// 1. Bundle src/entry-server.tsx for Node
await build({
  root,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: ssrOut,
    emptyOutDir: true,
    copyPublicDir: false,
    minify: false,
  },
});
const entryFile = (await fs.readdir(ssrOut)).find((f) => /^entry-server\.(m?js)$/.test(f));
if (!entryFile) throw new Error(`prerender: SSR bundle not found in ${ssrOut}`);
const app = await import(pathToFileURL(path.join(ssrOut, entryFile)).href);

// 2. Read the client build output
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const manifestPath = path.join(dist, '.vite', 'manifest.json');
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

// The property page is a lazy-loaded chunk; link its CSS up front so the
// pre-rendered HTML is styled immediately, and preload its JS.
const detailChunk = manifest['src/pages/PropertyDetail.tsx'];
const detailAssets = detailChunk
  ? [
      ...(detailChunk.css ?? []).map((href) => `<link rel="stylesheet" href="/${href}" />`),
      `<link rel="modulepreload" href="/${detailChunk.file}" />`,
    ]
  : [];

const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/;
const ROOT_DIV = '<div id="root"></div>';
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('prerender: index.html is missing the <!--seo--> block or <div id="root"></div>');
}

// 3. Render each route
const routes = [
  { url: '/', file: 'index.html' },
  ...app.properties.map((p) => ({ url: app.propertyPath(p), file: `${app.propertyPath(p).slice(1)}.html`, detail: true })),
  { url: '/404', file: '404.html' },
];

for (const route of routes) {
  const body = await app.render(route.url);
  const head = app.renderHeadTags(app.metaForPath(route.url));
  // Detail-page CSS goes right before </head> so it comes after the main
  // stylesheet, exactly like when the chunk is loaded dynamically.
  const extra = route.detail ? `  ${detailAssets.join('\n    ')}\n  </head>` : '</head>';
  const html = template
    .replace(SEO_BLOCK, head)
    .replace('</head>', extra)
    .replace(ROOT_DIV, `<div id="root">${body}</div>`);
  const outFile = path.join(dist, route.file);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, html);
  console.log(`  prerendered ${route.url.padEnd(40)} → dist/${route.file} (${(html.length / 1024).toFixed(1)} kB)`);
}

// 4. sitemap.xml, robots.txt, llms.txt
const lastmod = (() => {
  try {
    return execSync('git log -1 --format=%cs', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
})() || new Date().toISOString().slice(0, 10);

const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sitemapEntries = [
  { loc: `${app.SITE_URL}/`, images: ['/images/kos-nyaman/8.webp', ...app.properties.map((p) => p.heroImage)] },
  ...app.properties.map((p) => ({ loc: `${app.SITE_URL}${app.propertyPath(p)}`, images: p.gallery })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries
  .map(
    (e) => `  <url>
    <loc>${xmlEsc(e.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
${[...new Set(e.images)].map((img) => `    <image:image><image:loc>${xmlEsc(app.absUrl(img))}</image:loc></image:image>`).join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`;
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap);

const robots = `# All crawlers are welcome — search engines (Googlebot, Bingbot) and
# AI assistants (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, etc.).
User-agent: *
Allow: /

Sitemap: ${app.SITE_URL}/sitemap.xml
`;
await fs.writeFile(path.join(dist, 'robots.txt'), robots);

const B = app.BUSINESS;
const statusText = { available: 'Tersedia', limited: 'Hampir penuh', rented: 'Sedang tersewa (bisa daftar tunggu)' };
const llms = `# ${B.name}

> Kost AC dengan kamar mandi dalam dan WiFi, serta rumah kontrakan luas di ${B.address.city}, ${B.address.region}, Indonesia — dekat Universitas Sriwijaya (UNSRI) Bukit Besar. Booking langsung ke pemilik via WhatsApp ${B.phoneDisplay}, tanpa perantara.

Data diperbarui: ${lastmod}. Harga dan ketersediaan bisa berubah; konfirmasi ke pemilik via WhatsApp.

## Kontak

- WhatsApp / telepon: ${B.phoneDisplay} (${app.waLink()})
- Alamat kost: ${B.address.street}, Kec. ${B.address.district}, ${B.address.city}, ${B.address.region}
- Google Maps: ${B.mapsUrl}
- Website: ${app.SITE_URL}/

## Properti

${app.properties
  .map((p) => {
    const priv = p.facilities.filter((f) => f.type === 'private').map((f) => f.name).join(', ');
    const shared = p.facilities.filter((f) => f.type === 'shared').map((f) => f.name).join(', ');
    const specs = (p.specs ?? []).map((s) => `${s.label}: ${s.value}`).join('; ');
    return `### [${p.name}](${app.SITE_URL}${app.propertyPath(p)})

- Jenis: ${p.type === 'kost' ? 'Kost' : 'Rumah kontrakan'}
- Harga: ${p.priceLabel}${p.pricePeriod}${p.originalPriceLabel ? ` (harga normal ${p.originalPriceLabel})` : ''}
- Status: ${statusText[p.status]}
- Alamat: ${p.location}
- Fasilitas ${p.type === 'kost' ? 'kamar' : 'rumah'}: ${priv}
- Fasilitas ${p.type === 'kost' ? 'bersama' : 'lainnya'}: ${shared}${specs ? `\n- Spesifikasi: ${specs}` : ''}

${p.description.replace(/\n+/g, ' ')}`;
  })
  .join('\n\n')}

## Pertanyaan yang sering ditanyakan

${app.FAQ_DATA.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}
`;
await fs.writeFile(path.join(dist, 'llms.txt'), llms);
console.log('  wrote sitemap.xml, robots.txt, llms.txt');

// 5. Clean up build-only files
await fs.rm(ssrOut, { recursive: true, force: true });
await fs.rm(path.join(dist, '.vite'), { recursive: true, force: true });
