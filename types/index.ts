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

export interface StrapiListResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiItemResponse<T> {
  data: T;
}

export interface Enrollment {
  id: number;
  student: number;
  course: Course;
  enrolledAt: string;
}

export interface ProgressSummary {
  completed: number;
  total: number;
  percentage: number;
}

export interface QuizAttempt {
  id: number;
  student: number;
  quiz: number;
  score: number;
  totalQuestions: number;
  answers: { questionId: number; selectedIndex: number }[];
  submittedAt: string;
}

export interface QuizSubmitResult {
  attemptId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
}

export interface QuestionInput {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  usersPerRole: Record<string, number>;
}

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  role: { id: number; name: string };
}