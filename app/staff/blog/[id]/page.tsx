'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { BlogPost, StrapiItemResponse } from '@/types';

function EditBlogPostContent() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [blogStatus, setBlogStatus] = useState<'draft' | 'published'>('draft');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<StrapiItemResponse<BlogPost>>(`/api/blog-posts/${id}`, { token: getToken()! }).then((res) => {
      setTitle(res.data.title);
      setBody(res.data.body);
      setCoverImageUrl(res.data.coverImageUrl || '');
      setBlogStatus(res.data.blogStatus);
    });
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch(`/api/blog-posts/${id}`, {
        method: 'PUT',
        token: getToken()!,
        body: {
          data: {
            title,
            body,
            coverImageUrl: coverImageUrl || undefined,
            blogStatus,
            blogPublishedAt: blogStatus === 'published' ? new Date().toISOString() : undefined,
          },
        },
      });
      router.push('/staff/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    try {
      await apiFetch(`/api/blog-posts/${id}`, { method: 'DELETE', token: getToken()! });
      router.push('/staff/blog');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Blog Post</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} className="border p-2 rounded h-40" />
        <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="border p-2 rounded" />
        <select value={blogStatus} onChange={(e) => setBlogStatus(e.target.value as 'draft' | 'published')} className="border p-2 rounded">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-black text-white px-3 py-1.5 rounded text-sm">Save</button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditBlogPostPage() {
  return (
    <ProtectedRoute allowedRoles={['Content Manager', 'Platform Admin']}>
      <EditBlogPostContent />
    </ProtectedRoute>
  );
}