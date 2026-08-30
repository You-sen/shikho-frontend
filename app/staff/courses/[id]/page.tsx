'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Course, Lesson, Quiz, StrapiItemResponse, StrapiListResponse } from '@/types';

function ManageCourseContent() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<StrapiItemResponse<Course>>(`/api/courses/${id}`, { token: getToken()! }).then((res) => {
      setCourse(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setIsPublished(res.data.isPublished);
    });
    apiFetch<StrapiListResponse<Lesson>>(`/api/lessons?filters[course][id][$eq]=${id}&sort=order`, {
      token: getToken()!,
    }).then((res) => setLessons(res.data));
    apiFetch<StrapiListResponse<Quiz>>(`/api/quizzes?filters[course][id][$eq]=${id}`, {
      token: getToken()!,
    }).then((res) => setQuizzes(res.data));
  }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch(`/api/courses/${id}`, {
        method: 'PUT',
        token: getToken()!,
        body: { data: { title, description, isPublished } },
      });
      alert('Course updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this course?')) return;
    try {
      await apiFetch(`/api/courses/${id}`, { method: 'DELETE', token: getToken()! });
      router.push('/staff/courses');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Manage Course</h1>

      <form onSubmit={handleUpdate} className="flex flex-col gap-3 mb-8 border p-4 rounded">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 rounded" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Published
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-black text-white px-3 py-1.5 rounded text-sm">Save</button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-3 py-1.5 rounded text-sm">
            Delete Course
          </button>
        </div>
      </form>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Lessons</h2>
          <Link href={`/staff/courses/${id}/lessons/new`} className="text-sm text-blue-600 underline">
            + Add Lesson
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {lessons.map((l) => (
            <Link key={l.id} href={`/staff/courses/${id}/lessons/${l.id}`} className="border p-2 rounded text-sm hover:bg-gray-50">
              {l.order}. {l.title}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Quizzes</h2>
          <Link href={`/staff/courses/${id}/quizzes/new`} className="text-sm text-blue-600 underline">
            + Add Quiz
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {quizzes.map((q) => (
            <Link key={q.id} href={`/staff/courses/${id}/quizzes/${q.id}`} className="border p-2 rounded text-sm hover:bg-gray-50">
              {q.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ManageCoursePage() {
  return (
    <ProtectedRoute allowedRoles={['Instructor', 'Content Manager']}>
      <ManageCourseContent />
    </ProtectedRoute>
  );
}