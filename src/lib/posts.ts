import { getCollection } from 'astro:content';
export async function getPosts() {
  const now = new Date();
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.DEV || (!data.draft && data.date <= now));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
