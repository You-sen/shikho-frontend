// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { apiFetch } from '@/lib/api';
// import { getToken } from '@/lib/auth';
// import { useAuth } from '@/lib/AuthContext';
// import { Course, StrapiItemResponse } from '@/types';

// export default function CourseDetailPage() {
//   const { id } = useParams();
//   const [course, setCourse] = useState<Course | null>(null);
//   const [enrolling, setEnrolling] = useState(false);
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     apiFetch<StrapiItemResponse<Course>>(`/api/courses/${id}?populate=owner`).then((res) =>
//       setCourse(res.data)
//     );
//   }, [id]);

//   async function handleEnroll() {
//     if (!user) {
//       router.push('/login');
//       return;
//     }
//     setEnrolling(true);
//     try {
//       await apiFetch('/api/enrollments', {
//         method: 'POST',
//         token: getToken()!,
//         body: { data: { student: user.id, course: id } },
//       });
//       router.push('/my-courses');
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Something went wrong';
//       alert(message);
//     } finally {
//       setEnrolling(false);
//     }
//   }

//   if (!course) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold">{course.title}</h1>
//       <p className="mt-2 text-gray-700">{course.description}</p>
//       {user?.role.name === 'Authenticated' && (
//         <button
//           onClick={handleEnroll}
//           disabled={enrolling}
//           className="mt-4 bg-black text-white px-4 py-2 rounded"
//         >
//           {enrolling ? 'Enrolling...' : 'Enroll'}
//         </button>
//       )}
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { apiFetch } from '@/lib/api';
// import { Course, StrapiListResponse } from '@/types';

// export default function CoursesPage() {
//   const [courses, setCourses] = useState<Course[]>([]);

//   useEffect(() => {
//     let ignore = false;
//     apiFetch<StrapiListResponse<Course>>(
//       '/api/courses?populate=owner&filters[isPublished][$eq]=true'
//     )
//       .then((res) => {
//         if (!ignore) setCourses(res.data);
//       })
//       .catch(console.error);
//     return () => {
//       ignore = true;
//     };
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Available Courses</h1>
//       <div className="grid gap-4">
//         {courses.map((course) => (
//           <Link key={course.id} href={`/courses/${course.id}`} className="border p-4 rounded hover:bg-gray-50">
//             <h2 className="font-semibold">{course.title}</h2>
//             <p className="text-sm text-gray-600">{course.description}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
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