import type { APIRoute } from 'astro';
import { getPosts } from '../lib/posts';

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Site URL is required for the sitemap');
  const now = new Date();
  const posts = (await getPosts()).filter(post => !post.data.draft && post.data.date <= now);
  const paths = ['/', '/about/', ...posts.map(post => `/posts/${post.id}/`)];
  const urls = [...new Set(paths.map(path => new URL(path, site).href))];
  return new Response(`${urls.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
