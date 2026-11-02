import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output (default) → deploys to Cloudflare Pages / Netlify as plain files.
export default defineConfig({
  site: 'https://www.thecommon.io',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/type-study/') })],
});
