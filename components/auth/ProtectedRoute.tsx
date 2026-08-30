'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { Role } from '@/types';

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user.role.name)) {
      router.push('/'); // logged in but wrong role
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role.name)) return null;

  return <>{children}</>;
}