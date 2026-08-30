'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Question, QuizSubmitResult, StrapiListResponse, StrapiItemResponse } from '@/types';

function TakeQuizContent() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<StrapiListResponse<Question>>(
      `/api/questions?filters[quiz][id][$eq]=${quizId}`
    ).then((res) => setQuestions(res.data));
  }, [quizId]);

  function selectAnswer(questionId: number, optionIndex: number) {
    setSelected((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const answers = Object.entries(selected).map(([questionId, selectedIndex]) => ({
        questionId: Number(questionId),
        selectedIndex,
      }));

      const res = await apiFetch<StrapiItemResponse<QuizSubmitResult>>('/api/quiz-attempts/submit', {
        method: 'POST',
        token: getToken()!,
        body: { quizId: Number(quizId), answers },
      });

      setResult(res.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Quiz Complete</h1>
        <p className="text-lg">
          Score: {result.score} / {result.totalQuestions} ({result.percentage}%)
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Quiz</h1>
      <div className="flex flex-col gap-6">
        {questions.map((q) => (
          <div key={q.id}>
            <p className="font-medium mb-2">{q.questionText}</p>
            <div className="flex flex-col gap-1">
              {q.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={selected[q.id] === i}
                    onChange={() => selectAnswer(q.id, i)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitting || questions.length === 0}
        className="mt-6 bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </div>
  );
}

export default function TakeQuizPage() {
  return (
    <ProtectedRoute allowedRoles={['Authenticated']}>
      <TakeQuizContent />
    </ProtectedRoute>
  );
}