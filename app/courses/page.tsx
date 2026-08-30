'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Course, StrapiListResponse } from '@/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let ignore = false;
    apiFetch<StrapiListResponse<Course>>(
      '/api/courses?populate=owner&filters[isPublished][$eq]=true'
    )
      .then((res) => {
        if (!ignore) setCourses(res.data);
      })
      .catch(console.error);
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
      <div className="grid gap-4">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`} className="border p-4 rounded hover:bg-gray-50">
            <h2 className="font-semibold">{course.title}</h2>
            <p className="text-sm text-gray-600">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}