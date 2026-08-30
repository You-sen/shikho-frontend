'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await login(identifier, password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="Email or username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}