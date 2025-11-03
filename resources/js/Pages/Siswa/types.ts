import type { PageProps as InertiaPageProps } from "@inertiajs/core";

export interface StudentInfo {
  name: string;
  className?: string | null;
}

export interface StatsPayload {
  materialCount: number;
  quizCount: number;
  recentMaterialCount: number;
  classmateCount: number;
}

export interface MaterialItem {
  id: number;
  title: string;
  description?: string | null;
  subject?: string | null;
  subjectId?: number | null;
  className?: string | null;
  teacher?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  previewUrl?: string | null;
  downloadUrl?: string | null;
  fileMime?: string | null;
  fileSize?: number | null;
  createdAt?: string | null;
}

export interface QuizQuestionOption {
  id: number;
  text: string;
  order: number;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  options: QuizQuestionOption[];
  correctAnswer: number;
}

export interface QuizAttemptLite {
  id: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt?: string | null;
}

export interface QuizItem {
  id: number;
  title: string;
  description?: string | null;
  duration: number;
  status: string;
  subject?: string | null;
  subjectId?: number | null;
  teacher?: string | null;
  classNames: string[];
  questions: QuizQuestion[];
  totalQuestions: number;
  createdAt?: string | null;
  availableFrom?: string | null;
  availableUntil?: string | null;
  isAvailable?: boolean;
  latestAttempt?: QuizAttemptLite | null;
  maxAttempts?: number | null;
  attemptsUsed?: number;
  remainingAttempts?: number | null;
}

export interface GradeItem {
  id: number;
  title: string;
  subject: string;
  type: "quiz" | "assignment";
  score: number;
  maxScore: number;
  date: string;
  status: "graded" | "late";
  feedback?: string | null;
}

export interface GradeSummary {
  overallAverage: number;
  quizAverage: number;
  assignmentAverage: number;
  totalAssessments: number;
}

export interface SiswaPageProps extends InertiaPageProps {
  student: StudentInfo;
  hasClass: boolean;
  stats: StatsPayload;
  materials: MaterialItem[];
  materialSubjects: string[];
  quizzes: QuizItem[];
  quizSubjects?: string[];
  grades: GradeItem[];
  gradeSubjects?: string[];
  gradeSummary?: GradeSummary;
}
