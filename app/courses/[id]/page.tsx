'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import { Course, StrapiItemResponse } from '@/types';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    apiFetch<StrapiItemResponse<Course>>(`/api/courses/${id}?populate=owner`).then((res) =>
      setCourse(res.data)
    );
  }, [id]);

  async function handleEnroll() {
    if (!user) {
      router.push('/login');
      return;
    }
    setEnrolling(true);
    try {
      await apiFetch('/api/enrollments', {
        method: 'POST',
        token: getToken()!,
        body: { data: { student: user.id, course: id } },
      });
      router.push('/my-courses');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      alert(message);
    } finally {
      setEnrolling(false);
    }
  }

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="mt-2 text-gray-700">{course.description}</p>
      {user?.role.name === 'Authenticated' && (
        <button
          onClick={handleEnroll}
          disabled={enrolling}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          {enrolling ? 'Enrolling...' : 'Enroll'}
        </button>
      )}
    </div>
  );
}