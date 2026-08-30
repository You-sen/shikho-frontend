'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Lesson, StrapiItemResponse } from '@/types';

function EditLessonContent() {
  const { id, lessonId } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<'text' | 'video'>('text');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<StrapiItemResponse<Lesson>>(`/api/lessons/${lessonId}`, { token: getToken()! }).then((res) => {
      setTitle(res.data.title);
      setContentType(res.data.contenttype);
      setContent(res.data.content || '');
      setVideoUrl(res.data.videoUrl || '');
      setOrder(res.data.order);
    });
  }, [lessonId]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        token: getToken()!,
        body: {
          data: {
            title,
            contentType,
            content: contentType === 'text' ? content : undefined,
            videoUrl: contentType === 'video' ? videoUrl : undefined,
            order,
          },
        },
      });
      router.push(`/staff/courses/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this lesson?')) return;
    try {
      await apiFetch(`/api/lessons/${lessonId}`, { method: 'DELETE', token: getToken()! });
      router.push(`/staff/courses/${id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Edit Lesson</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" />
        <select value={contentType} onChange={(e) => setContentType(e.target.value as 'text' | 'video')} className="border p-2 rounded">
          <option value="text">Text</option>
          <option value="video">Video</option>
        </select>
        {contentType === 'text' ? (
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border p-2 rounded" />
        ) : (
          <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="border p-2 rounded" />
        )}
        <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="border p-2 rounded" />
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

export default function EditLessonPage() {
  return (
    <ProtectedRoute allowedRoles={['Instructor', 'Content Manager']}>
      <EditLessonContent />
    </ProtectedRoute>
  );
}