'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AdminStats, StrapiItemResponse } from '@/types';

function AdminDashboardContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    apiFetch<StrapiItemResponse<AdminStats>>('/api/admin-stats', {
      token: getToken()!,
    }).then((res) => setStats(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border p-4 rounded text-center">
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
          <div className="border p-4 rounded text-center">
            <p className="text-2xl font-bold">{stats.totalCourses}</p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
          <div className="border p-4 rounded text-center">
            <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
            <p className="text-sm text-gray-500">Total Enrollments</p>
          </div>
        </div>
      )}

      {stats && (
        <div className="mb-8">
          <h2 className="font-semibold mb-2">Users per Role</h2>
          <div className="flex flex-col gap-1 text-sm">
            {Object.entries(stats.usersPerRole).map(([role, count]) => (
              <div key={role} className="flex justify-between border-b py-1">
                <span>{role}</span>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/admin/users" className="text-blue-600 underline">Manage Users</Link>
        <Link href="/staff/courses" className="text-blue-600 underline">Manage Courses</Link>
        <Link href="/staff/blog" className="text-blue-600 underline">Manage Blog</Link>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['Platform Admin']}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}