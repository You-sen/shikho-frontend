'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { BlogPost, StrapiListResponse } from '@/types';

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    apiFetch<StrapiListResponse<BlogPost>>('/api/blog-posts').then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Blog</h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="border p-4 rounded hover:bg-gray-50">
            <h2 className="font-semibold">{post.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}