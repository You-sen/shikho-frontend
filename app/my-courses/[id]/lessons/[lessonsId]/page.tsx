'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Lesson, StrapiItemResponse } from '@/types';

function LessonViewContent() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    apiFetch<StrapiItemResponse<Lesson>>(`/api/lessons/${lessonId}`).then((res) => setLesson(res.data));
  }, [lessonId]);

  async function handleComplete() {
    await apiFetch('/api/progress/complete', {
      method: 'POST',
      token: getToken()!,
      body: { lessonId },
    });
    setMarked(true);
  }

  if (!lesson) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">{lesson.title}</h1>
      {lesson.contenttype === 'video' ? (
        <a href={lesson.videoUrl} target="_blank" className="text-blue-600 underline">Watch video</a>
      ) : (
        <p className="whitespace-pre-wrap">{lesson.content}</p>
      )}
      <button
        onClick={handleComplete}
        disabled={marked}
        className="mt-6 bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {marked ? 'Completed ✓' : 'Mark as Complete'}
      </button>
    </div>
  );
}

export default function LessonViewPage() {
  return (
    <ProtectedRoute allowedRoles={['Authenticated']}>
      <LessonViewContent />
    </ProtectedRoute>
  );
}