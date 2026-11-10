import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';
export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter(post => !post.data.draft && post.data.date <= new Date());
  return rss({ title: 'Steven Log', description: 'AI에 대한 생각과 소프트웨어 개발 기록', site: context.site!, items: posts.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: `/posts/${post.id}/` })), customData: '<language>ko-kr</language>' });
}
