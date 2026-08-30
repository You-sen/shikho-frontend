'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { QuestionInput } from '@/types';

function NewQuizContent() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionInput[]>([
    { questionText: '', options: ['', ''], correctOptionIndex: 0 },
  ]);
  const [error, setError] = useState('');

  function updateQuestion(index: number, field: keyof QuestionInput, value: string | number | string[]) {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) => {
      const copy = [...prev];
      const opts = [...copy[qIndex].options];
      opts[oIndex] = value;
      copy[qIndex] = { ...copy[qIndex], options: opts };
      return copy;
    });
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, { questionText: '', options: ['', ''], correctOptionIndex: 0 }]);
  }

  function addOption(qIndex: number) {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], options: [...copy[qIndex].options, ''] };
      return copy;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const quizRes = await apiFetch<{ data: { id: number } }>('/api/quizzes', {
        method: 'POST',
        token: getToken()!,
        body: { data: { title, course: id } },
      });

      for (const q of questions) {
        await apiFetch('/api/questions', {
          method: 'POST',
          token: getToken()!,
          body: {
            data: {
              questionText: q.questionText,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex,
              quiz: quizRes.data.id,
            },
          },
        });
      }

      router.push(`/staff/courses/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">New Quiz</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input placeholder="Quiz title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" required />

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-3 rounded flex flex-col gap-2">
            <input
              placeholder={`Question ${qIndex + 1}`}
              value={q.questionText}
              onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
              className="border p-2 rounded"
            />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={q.correctOptionIndex === oIndex}
                  onChange={() => updateQuestion(qIndex, 'correctOptionIndex', oIndex)}
                />
                <input
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="border p-2 rounded flex-1 text-sm"
                />
              </div>
            ))}
            <button type="button" onClick={() => addOption(qIndex)} className="text-xs text-blue-600 underline self-start">
              + Add option
            </button>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="text-sm text-blue-600 underline self-start">
          + Add question
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white p-2 rounded">Create Quiz</button>
      </form>
    </div>
  );
}

export default function NewQuizPage() {
  return (
    <ProtectedRoute allowedRoles={['Instructor', 'Content Manager']}>
      <NewQuizContent />
    </ProtectedRoute>
  );
}