export interface Option {
  id: number;
  nama: string;
}

export type QuizQuestionForm = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
};

export type QuizStatus = "draft" | "published";

export type QuizAttemptLimitOption = "unlimited" | "1" | "2";

export type QuizBaseForm = {
  title: string;
  description: string;
  mata_pelajaran_id: number | null;
  duration: number;
  max_attempts: QuizAttemptLimitOption;
  status: QuizStatus;
  kelas_ids: number[];
  questions: QuizQuestionForm[];
  available_from: string | null;
  available_until: string | null;
};

export interface QuizItem {
  id: number;
  judul: string;
  deskripsi?: string | null;
  mata_pelajaran_id?: number | null;
  mapel?: {
    id: number;
    nama: string;
  } | null;
  durasi: number;
  max_attempts?: number | null;
  status: QuizStatus;
  kelas: { id: number; nama: string }[];
  kelas_ids?: number[];
  questions: QuizQuestionForm[];
  created_at?: string | null;
  available_from?: string | null;
  available_until?: string | null;
}
