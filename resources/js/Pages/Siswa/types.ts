import type { PageProps as InertiaPageProps } from "@inertiajs/core";

export interface StudentInfo {
  name: string;
  className?: string | null;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface StatsPayload {
  materialCount: number;
  quizCount: number;
  recentMaterialCount: number;
  classmateCount: number;
}

export type StudentNotificationType = "material" | "quiz" | "assignment";

export interface StudentNotificationItem {
  id: string;
  type: StudentNotificationType;
  title: string;
  meta?: string[];
  createdAt?: string | null;
  url: string;
}

export interface StudentNotificationsPayload {
  items: StudentNotificationItem[];
  unreadCount: number;
  windowDays: number;
  recentQuizCount?: number;
}

export interface ScheduleSlot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  room?: string | null;
  teacherName?: string | null;
  teacherId?: number | null;
}

export interface StudentScheduleItem {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject?: string | null;
  subjectId?: number | null;
  teacher?: string | null;
  teacherId?: number | null;
  className?: string | null;
  room?: string | null;
}

export interface StudentSchedulePayload {
  days: string[];
  items: StudentScheduleItem[];
  byDay: Record<string, StudentScheduleItem[]>;
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
  youtubeUrl?: string | null;
  youtubeEmbedUrl?: string | null;
  videoUrl?: string | null;
  videoMime?: string | null;
  videoSize?: number | null;
  createdAt?: string | null;
  scheduleSlots?: ScheduleSlot[];
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

export interface QuizAttemptAnswerDetail {
  questionId: number;
  selectedOption?: number | null;
  isCorrect?: boolean;
}

export interface QuizAttemptDetail extends QuizAttemptLite {
  durationSeconds?: number | null;
  answers: QuizAttemptAnswerDetail[];
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
  entryUrl?: string;
  latestAttempt?: QuizAttemptLite | null;
  maxAttempts?: number | null;
  attemptsUsed?: number;
  remainingAttempts?: number | null;
}

export interface StudentSubject {
  id: number;
  name: string;
  teacher?: string | null;
  teacherEmail?: string | null;
  teacherId?: number | null;
  className?: string | null;
  description?: string | null;
  schedule?: string | null;
  scheduleSlots?: ScheduleSlot[];
  materialCount: number;
  quizCount: number;
  materials: MaterialItem[];
  quizzes: QuizItem[];
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

export type StudentAssignmentStatus = "pending" | "submitted" | "graded" | "late";

export interface StudentAssignmentFile {
  id: number;
  name: string;
  url: string | null;
}

export interface StudentAssignmentItem {
  id: number;
  title: string;
  description?: string | null;
  subject?: string | null;
  teacher?: string | null;
  classes: (string | null)[];
  openDate?: string | null;
  closeDate?: string | null;
  maxScore: number;
  passingGrade?: number | null;
  allowTextAnswer: boolean;
  allowFileUpload: boolean;
  allowedFileTypes: string[];
  allowCancelSubmit: boolean;
  attachments: StudentAssignmentFile[];
  status: StudentAssignmentStatus;
  submittedDate?: string | null;
  score?: number | null;
  feedback?: string | null;
  textAnswer?: string | null;
  files: StudentAssignmentFile[];
  submissionId?: number | null;
  isOpen?: boolean;
  isClosed?: boolean;
}

export interface SiswaPageProps extends InertiaPageProps {
  auth: {
    user: AuthUser;
  };
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
  assignments?: StudentAssignmentItem[];
  classSubjects?: StudentSubject[];
  schedule?: StudentSchedulePayload;
  notifications?: StudentNotificationsPayload;
}
