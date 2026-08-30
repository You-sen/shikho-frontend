'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function NewLessonContent() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<'text' | 'video'>('text');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/api/lessons', {
        method: 'POST',
        token: getToken()!,
        body: {
          data: {
            title,
            contentType,
            content: contentType === 'text' ? content : undefined,
            videoUrl: contentType === 'video' ? videoUrl : undefined,
            order,
            course: id,
          },
        },
      });
      router.push(`/staff/courses/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">New Lesson</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />
        <select value={contentType} onChange={(e) => setContentType(e.target.value as 'text' | 'video')} className="border p-2 rounded">
          <option value="text">Text</option>
          <option value="video">Video</option>
        </select>
        {contentType === 'text' ? (
          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="border p-2 rounded" />
        ) : (
          <input placeholder="Video URL" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="border p-2 rounded" />
        )}
        <input type="number" placeholder="Order" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="border p-2 rounded" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white p-2 rounded">Create</button>
      </form>
    </div>
  );
}

export default function NewLessonPage() {
  return (
    <ProtectedRoute allowedRoles={['Instructor', 'Content Manager']}>
      <NewLessonContent />
    </ProtectedRoute>
  );
}