'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Enrollment, StrapiListResponse } from '@/types';

function MyCoursesContent() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    if (!user) return;
    apiFetch<StrapiListResponse<Enrollment>>(
      `/api/enrollments?filters[student][id][$eq]=${user.id}&populate=course`,
      { token: getToken()! }
    ).then((res) => setEnrollments(res.data));
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      <div className="flex flex-col gap-3">
        {enrollments.map((e) => (
          <Link key={e.id} href={`/my-courses/${e.course.id}`} className="border p-4 rounded hover:bg-gray-50">
            {e.course.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={['Authenticated']}>
      <MyCoursesContent />
    </ProtectedRoute>
  );
}