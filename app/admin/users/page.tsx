'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { StrapiUser } from '@/types';

const ROLE_OPTIONS = ['Authenticated', 'Instructor', 'Content Manager', 'Platform Admin'];

interface RoleOption {
  id: number;
  name: string;
}

function ManageUsersContent() {
  const [users, setUsers] = useState<StrapiUser[]>([]);
  const [roleIds, setRoleIds] = useState<Record<string, number>>({});

  useEffect(() => {
    apiFetch<StrapiUser[]>('/api/users?populate=role', { token: getToken()! }).then(setUsers);

    apiFetch<{ data: RoleOption[] }>('/api/admin-stats/roles', {
      token: getToken()!,
    }).then((res) => {
      const map: Record<string, number> = {};
      res.data.forEach((r) => {
        map[r.name] = r.id;
      });
      setRoleIds(map);
    });
  }, []);

  async function changeRole(userId: number, roleName: string) {
    const roleId = roleIds[roleName];
    if (!roleId) return;
    try {
      await apiFetch(`/api/users/${userId}`, {
        method: 'PUT',
        token: getToken()!,
        body: { role: roleId },
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: { id: roleId, name: roleName } } : u))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-6">Manage Users</h1>
      <div className="flex flex-col gap-2">
        {users.map((u) => (
          <div key={u.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-medium">{u.username}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <select
              value={u.role?.name}
              onChange={(e) => changeRole(u.id, e.target.value)}
              className="border p-1.5 rounded text-sm"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManageUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['Platform Admin']}>
      <ManageUsersContent />
    </ProtectedRoute>
  );
}