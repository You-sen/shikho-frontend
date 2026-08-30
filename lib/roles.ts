import { Role } from '@/types';

export function hasRole(userRole: Role | undefined, allowed: Role[]): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole);
}

export const ROLE_STUDENT: Role = 'Authenticated';
export const ROLE_INSTRUCTOR: Role = 'Instructor';
export const ROLE_CONTENT_MANAGER: Role = 'Content Manager';
export const ROLE_ADMIN: Role = 'Platform Admin';