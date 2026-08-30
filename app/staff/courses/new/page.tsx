'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function NewCourseContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await apiFetch<{ data: { id: number } }>('/api/courses', {
        method: 'POST',
        token: getToken()!,
        body: { data: { title, description, isPublished, owner: user?.id } },
      });
      router.push(`/staff/courses/${res.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">New Course</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" required />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Publish immediately
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white p-2 rounded">Create</button>
      </form>
    </div>
  );
}

export default function NewCoursePage() {
  return (
    <ProtectedRoute allowedRoles={['Instructor', 'Content Manager']}>
      <NewCourseContent />
    </ProtectedRoute>
  );
}