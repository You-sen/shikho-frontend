'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function NewBlogPostContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [blogStatus, setBlogStatus] = useState<'draft' | 'published'>('draft');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/api/blog-posts', {
        method: 'POST',
        token: getToken()!,
        body: {
          data: {
            title,
            body,
            coverImageUrl: coverImageUrl || undefined,
            blogStatus,
            blogPublishedAt: blogStatus === 'published' ? new Date().toISOString() : undefined,
            author: user?.id,
          },
        },
      });
      router.push('/staff/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />
        <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} className="border p-2 rounded h-40" required />
        <input placeholder="Cover image URL (optional)" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="border p-2 rounded" />
        <select value={blogStatus} onChange={(e) => setBlogStatus(e.target.value as 'draft' | 'published')} className="border p-2 rounded">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white p-2 rounded">Create</button>
      </form>
    </div>
  );
}

export default function NewBlogPostPage() {
  return (
    <ProtectedRoute allowedRoles={['Content Manager', 'Platform Admin']}>
      <NewBlogPostContent />
    </ProtectedRoute>
  );
}