'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Quiz, StrapiListResponse } from '@/types';

function QuizListContent() {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    apiFetch<StrapiListResponse<Quiz>>(
      `/api/quizzes?filters[course][id][$eq]=${id}`
    ).then((res) => setQuizzes(res.data));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Quizzes</h1>
      <div className="flex flex-col gap-2">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} href={`/my-courses/${id}/quizzes/${quiz.id}`} className="border p-3 rounded hover:bg-gray-50">
            {quiz.title}
          </Link>
        ))}
        {quizzes.length === 0 && <p className="text-gray-500">No quizzes yet.</p>}
      </div>
    </div>
  );
}

export default function QuizListPage() {
  return (
    <ProtectedRoute allowedRoles={['Authenticated']}>
      <QuizListContent />
    </ProtectedRoute>
  );
}