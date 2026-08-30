'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="font-bold">Shikho</Link>
      <div className="flex gap-4 items-center text-sm">
        <Link href="/courses">Courses</Link>
        <Link href="/blog">Blog</Link>
        {user ? (
          <>
            {user.role.name === 'Authenticated' && <Link href="/my-courses">My Courses</Link>}
            {(user.role.name === 'Instructor' || user.role.name === 'Content Manager') && <Link href="/staff/courses">Manage</Link>}
            {user.role.name === 'Platform Admin' && <Link href="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}