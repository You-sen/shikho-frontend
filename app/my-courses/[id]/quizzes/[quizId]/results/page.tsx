'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { QuizAttempt, StrapiListResponse } from '@/types';

function QuizResultsContent() {
  const { quizId } = useParams();
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    if (!user) return;
    apiFetch<StrapiListResponse<QuizAttempt>>(
      `/api/quiz-attempts?filters[quiz][id][$eq]=${quizId}&filters[student][id][$eq]=${user.id}&sort=submittedAt:desc`,
      { token: getToken()! }
    ).then((res) => setAttempts(res.data));
  }, [quizId, user]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Past Attempts</h1>
      <div className="flex flex-col gap-2">
        {attempts.map((a) => (
          <div key={a.id} className="border p-3 rounded">
            {a.score} / {a.totalQuestions} — {new Date(a.submittedAt).toLocaleString()}
          </div>
        ))}
        {attempts.length === 0 && <p className="text-gray-500">No attempts yet.</p>}
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <ProtectedRoute allowedRoles={['Authenticated']}>
      <QuizResultsContent />
    </ProtectedRoute>
  );
}