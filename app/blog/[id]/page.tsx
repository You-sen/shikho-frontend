'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { BlogPost, StrapiItemResponse } from '@/types';

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    apiFetch<StrapiItemResponse<BlogPost>>(`/api/blog-posts/${id}`)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null));
  }, [id]);

  if (!post) return <div className="p-6">Not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="mt-4 whitespace-pre-wrap">{post.body}</div>
    </div>
  );
}