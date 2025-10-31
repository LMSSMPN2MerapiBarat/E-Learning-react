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

export type QuizBaseForm = {
  title: string;
  description: string;
  mata_pelajaran_id: number | null;
  duration: number;
  status: QuizStatus;
  kelas_ids: number[];
  questions: QuizQuestionForm[];
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
  status: QuizStatus;
  kelas: { id: number; nama: string }[];
  kelas_ids?: number[];
  questions: QuizQuestionForm[];
  created_at?: string | null;
}