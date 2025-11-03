import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";

export type DashboardStats = {
  kelas: number;
  materi: number;
  kuis: number;
  siswa: number;
};

export type RecentMateriItem = {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kelas?: string | null;
  tingkat?: string | null;
  mapel?: string | null;
  created_at?: string | null;
  file_name?: string | null;
  file_mime?: string | null;
  file_size?: number | null;
  file_url?: string | null;
};

export type RecentQuizItem = {
  id: number;
  judul: string;
  mapel?: string | null;
  durasi: number;
  status: string;
  kelas: string[];
  pertanyaan: number;
  created_at?: string | null;
};

export const statCards = [
  {
    key: "kelas" as const,
    label: "Kelas Diampu",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "materi" as const,
    label: "Materi Dibagikan",
    icon: BookOpen,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "kuis" as const,
    label: "Kuis Dibuat",
    icon: ClipboardList,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    key: "siswa" as const,
    label: "Total Siswa",
    icon: Users,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export const getFileExtension = (
  fileName?: string | null,
  mimeType?: string | null,
): string | null => {
  if (fileName) {
    const parts = fileName.split(".");
    const ext = parts.pop();
    if (ext) {
      return ext.toLowerCase();
    }
  }

  if (mimeType) {
    const [, subtype] = mimeType.split("/");
    if (subtype) {
      return subtype.toLowerCase();
    }
  }

  return null;
};

export const getFileTypeColor = (extension: string) => {
  switch (extension) {
    case "pdf":
      return "bg-red-100 text-red-700";
    case "doc":
    case "docx":
      return "bg-blue-100 text-blue-700";
    case "ppt":
    case "pptx":
      return "bg-orange-100 text-orange-700";
    case "xls":
    case "xlsx":
      return "bg-emerald-100 text-emerald-700";
    case "txt":
      return "bg-green-100 text-green-700";
    case "zip":
    case "rar":
      return "bg-slate-200 text-slate-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
