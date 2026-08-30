'use client';

import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function ManageQuizContent() {
  const { id, quizId } = useParams();
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Delete this quiz?')) return;
    try {
      await apiFetch(`/api/quizzes/${quizId}`, { method: 'DELETE', token: getToken()! });
      router.push(`/staff/courses/${id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Manage Quiz</h1>
      <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm">
        Delete Quiz
      </button>
    </div>
  );
}

export default function ManageQuizPage() {
  return (
    <ProtectedRoute allowedRoles={['Instructor', 'Content Manager']}>
      <ManageQuizContent />
    </ProtectedRoute>
  );
}