'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Lesson, ProgressSummary, StrapiListResponse, StrapiItemResponse } from '@/types';

function CourseLessonsContent() {
  const { id } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressSummary>({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    apiFetch<StrapiListResponse<Lesson>>(
      `/api/lessons?filters[course][id][$eq]=${id}&sort=order`
    ).then((res) => setLessons(res.data));

    apiFetch<StrapiItemResponse<ProgressSummary>>(
      `/api/progress/course/${id}`,
      { token: getToken()! }
    ).then((res) => setProgress(res.data));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-2">Course Lessons</h1>
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded h-3">
          <div className="bg-black h-3 rounded" style={{ width: `${progress.percentage}%` }} />
        </div>
        <p className="text-sm mt-1">{progress.completed} / {progress.total} lessons ({progress.percentage}%)</p>
      </div>
      <div className="flex flex-col gap-2">
        {lessons.map((lesson) => (
          <Link key={lesson.id} href={`/my-courses/${id}/lessons/${lesson.id}`} className="border p-3 rounded hover:bg-gray-50">
            {lesson.order}. {lesson.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function CourseLessonsPage() {
  return (
    <ProtectedRoute allowedRoles={['Authenticated']}>
      <CourseLessonsContent />
    </ProtectedRoute>
  );
}