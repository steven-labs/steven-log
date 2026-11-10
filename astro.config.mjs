import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://steven-log.home201.com',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-light' } },
});
