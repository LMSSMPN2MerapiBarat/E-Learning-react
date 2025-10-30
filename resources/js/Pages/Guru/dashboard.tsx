import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { BookOpen, FileQuestion, GraduationCap, Users } from "lucide-react";

interface DashboardProps {
  stats: {
    kelas: number;
    materi: number;
    kuis: number;
    siswa: number;
  };
  mataPelajaran: string[];
  recentMateri: Array<{
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
  }>;
  recentQuizzes: Array<{
    id: number;
    judul: string;
    mapel?: string | null;
    durasi: number;
    status: string;
    kelas: string[];
    pertanyaan: number;
    created_at?: string | null;
  }>;
}

const getFileExtension = (
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

const getFileTypeColor = (extension: string) => {
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

const statCards = [
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
    icon: FileQuestion,
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

type GuruDashboardPageProps = InertiaPageProps & DashboardProps;

export default function GuruDashboard() {
  const { stats, mataPelajaran, recentMateri, recentQuizzes } =
    usePage<GuruDashboardPageProps>().props;

  return (
    <TeacherLayout title="Dashboard Guru">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map(({ key, label, icon: Icon, color, bg }) => (
            <Card key={key}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats?.[key] ?? 0}
                  </p>
                </div>
                <div className={`${bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mataPelajaran && mataPelajaran.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mata Pelajaran Diampu</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {mataPelajaran.map((nama) => (
                <Badge key={nama} variant="outline" className="px-3 py-1">
                  {nama}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Materi Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMateri.length === 0 && (
                <p className="text-sm text-gray-500">
                  Belum ada materi yang diunggah.
                </p>
              )}
              {recentMateri.map((materi) => {
                const extension = getFileExtension(
                  materi.file_name,
                  materi.file_mime,
                );
                const fileTypeLabel = extension
                  ? extension.toUpperCase()
                  : null;
                const fileTypeClass = extension
                  ? getFileTypeColor(extension)
                  : getFileTypeColor("default");

                return (
                  <div
                    key={materi.id}
                    className="rounded-lg border p-4 hover:bg-gray-50 transition"
                  >
                    <h3 className="text-base font-medium text-gray-800">
                      {materi.judul}
                    </h3>
                    {materi.deskripsi && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {materi.deskripsi}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {materi.mapel && (
                        <Badge variant="outline">{materi.mapel}</Badge>
                      )}
                      {materi.kelas && (
                        <Badge variant="outline">Kelas {materi.kelas}</Badge>
                      )}
                      {fileTypeLabel && (
                        <Badge className={fileTypeClass}>{fileTypeLabel}</Badge>
                      )}
                      {materi.created_at && (
                        <span>
                          {new Date(materi.created_at).toLocaleDateString("id-ID")}
                        </span>
                      )}
                      {materi.file_url && (
                        <a
                          href={materi.file_url}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {materi.file_name ?? "Unduh Materi"}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kuis Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentQuizzes.length === 0 && (
                <p className="text-sm text-gray-500">
                  Belum ada kuis yang dibuat.
                </p>
              )}
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="rounded-lg border p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="text-base font-medium text-gray-800">
                    {quiz.judul}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {quiz.mapel && (
                      <Badge variant="outline">{quiz.mapel}</Badge>
                    )}
                    <Badge variant="outline">{quiz.durasi} Menit</Badge>
                    <Badge
                      className={
                        quiz.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {quiz.status === "published" ? "Aktif" : "Draft"}
                    </Badge>
                    <Badge variant="outline">
                      {quiz.pertanyaan} Pertanyaan
                    </Badge>
                    {quiz.created_at && (
                      <span>
                        {new Date(quiz.created_at).toLocaleDateString("id-ID")}
                      </span>
                    )}
                  </div>
                  {quiz.kelas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {quiz.kelas.map((kelas) => (
                        <Badge key={kelas} variant="secondary">
                          {kelas}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </TeacherLayout>
  );
}
