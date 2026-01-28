import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://qrcallme.com'; // Replace with your actual domain

  // 1. Fetch all blog posts from Supabase
  const { data: posts } = await supabase.from('posts').select('slug, updated_at');

  const blogPosts = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 2. Static Pages
  const routes = [
    '',
    '/blog',
    '/generate-qr-code',
    '/parking-qr-code',
    '/pets-qr-code',
    '/share-wifi-qr-code',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes, ...blogPosts];
}