export type Role = 'Authenticated' | 'Instructor' | 'Content Manager' | 'Platform Admin';

export interface User {
  id: number;
  username: string;
  email: string;
  role: { id: number; name: Role };
}

export interface Course {
  id: number;
  title: string;
  description: string;
  coverImageUrl?: string;
  isPublished: boolean;
  owner: User;
}

export interface Lesson {
  id: number;
  title: string;
  contenttype: 'text' | 'video';
  content?: string;
  videoUrl?: string;
  order: number;
  course: number;
}

export interface Quiz {
  id: number;
  title: string;
  course: number;
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex?: number; // only present for staff
  quiz: number;
}

export interface BlogPost {
  id: number;
  title: string;
  body: string;
  coverImageUrl?: string;
  blogStatus: 'draft' | 'published';
  author: User;
}