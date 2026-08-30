'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Course, StrapiListResponse } from '@/types';

function StaffCoursesContent() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    apiFetch<StrapiListResponse<Course>>('/api/courses?populate=owner', {
      token: getToken()!,
    }).then((res) => setCourses(res.data));
  }, []);

  const isInstructor = user?.role.name === 'Instructor';
  const visibleCourses = isInstructor
    ? courses.filter((c) => c.owner.id === user?.id)
    : courses;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Manage Courses</h1>
        <Link href="/staff/courses/new" className="bg-black text-white px-3 py-1.5 rounded text-sm">
          + New Course
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {visibleCourses.map((course) => (
          <div key={course.id} className="border p-3 rounded flex justify-between items-center">
            <span>{course.title}</span>
            <Link href={`/staff/courses/${course.id}`} className="text-blue-600 underline text-sm">
              Manage
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StaffCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={['Instructor', 'Content Manager']}>
      <StaffCoursesContent />
    </ProtectedRoute>
  );
}