export type AssignmentStatus = "draft" | "active" | "closed";
export type SubmissionStatus = "draft" | "submitted" | "graded";

export interface Option {
  id: number;
  nama: string;
}

export interface AssignmentAttachment {
  id: number;
  name: string;
  url: string | null;
  mime?: string | null;
  size?: number | null;
}

export interface AssignmentSubmissionFile {
  id: number;
  name: string;
  url: string | null;
  size?: number | null;
  mime?: string | null;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  studentClass?: string | null;
  status: SubmissionStatus;
  submittedAt?: string | null;
  gradedAt?: string | null;
  score?: number | null;
  maxScore: number;
  feedback?: string | null;
  textAnswer?: string | null;
  files: AssignmentSubmissionFile[];
}

export interface AssignmentStats {
  totalStudents: number;
  submitted: number;
  needsGrading: number;
  graded: number;
}

export interface AssignmentItem {
  id: number;
  title: string;
  description?: string | null;
  status: AssignmentStatus;
  openDate?: string | null;
  closeDate?: string | null;
  maxScore: number;
  passingGrade?: number | null;
  allowTextAnswer: boolean;
  allowFileUpload: boolean;
  allowedFileTypes: string[];
  allowCancelSubmit: boolean;
  kelas: Option[];
  kelasIds: number[];
  attachments: AssignmentAttachment[];
  mapel?: Option | null;
  submissions: AssignmentSubmission[];
  stats: AssignmentStats;
}

export interface AssignmentFormState {
  title: string;
  description: string;
  mata_pelajaran_id: number | null;
  kelas_ids: number[];
  open_at: string;
  close_at: string;
  max_score: number | string;
  passing_grade: number | string | null;
  allow_text_answer: boolean;
  allow_file_upload: boolean;
  allowed_file_types: string[];
  allow_cancel_submit: boolean;
  status: "draft" | "active";
  attachments: File[];
  removed_attachment_ids: number[];
}
