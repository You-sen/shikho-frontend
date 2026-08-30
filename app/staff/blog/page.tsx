'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BlogPost, StrapiListResponse } from '@/types';

function StaffBlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    apiFetch<StrapiListResponse<BlogPost>>('/api/blog-posts?populate=author', {
      token: getToken()!,
    }).then((res) => setPosts(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Manage Blog</h1>
        <Link href="/staff/blog/new" className="bg-black text-white px-3 py-1.5 rounded text-sm">
          + New Post
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/staff/blog/${post.id}`} className="border p-3 rounded flex justify-between items-center hover:bg-gray-50">
            <span>{post.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${post.blogStatus === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {post.blogStatus}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function StaffBlogPage() {
  return (
    <ProtectedRoute allowedRoles={['Content Manager', 'Platform Admin']}>
      <StaffBlogContent />
    </ProtectedRoute>
  );
}