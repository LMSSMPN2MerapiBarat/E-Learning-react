import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Calendar, Eye, FileQuestion, FileText, BookOpen } from "lucide-react";
import StudentStatsGrid from "./components/StudentStatsGrid";
import type { SiswaPageProps } from "./types";

export default function Dashboard() {
  const { props } = usePage<SiswaPageProps>();
  const {
    student,
    hasClass,
    stats,
    materials = [],
    quizzes = [],
  } = props;

  const routeHelper =
    typeof window !== "undefined" && typeof (window as any).route === "function"
      ? ((window as any).route as (
          name: string,
          params?: Record<string, unknown>,
        ) => string)
      : undefined;

  const recentMaterials = materials.slice(0, 3);
  const upcomingQuizzes = quizzes.slice(0, 3);

  return (
    <StudentLayout
      title="Dashboard Siswa"
      subtitle={
        student.className
          ? `Kelas ${student.className}`
          : "Silakan hubungi admin atau guru untuk penempatan kelas."
      }
    >
      <Head title="Dashboard Siswa" />

      <div className="space-y-6">
        {!hasClass && (
          <Alert className="border-l-4 border-l-amber-500">
            <AlertDescription>
              Akun Anda belum terhubung ke kelas. Hubungi admin atau guru agar
              bisa mengakses materi dan kuis.
            </AlertDescription>
          </Alert>
        )}

        <StudentStatsGrid stats={stats} />

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Kegiatan Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3"
            >
              <Link href={routeHelper ? routeHelper("siswa.materials") : "#"}>
                <BookOpen className="h-5 w-5 text-blue-600" />
                Lihat Materi Pembelajaran
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3"
            >
              <Link href={routeHelper ? routeHelper("siswa.quizzes") : "#"}>
                <FileQuestion className="h-5 w-5 text-emerald-600" />
                Kerjakan Kuis Tersedia
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start gap-3"
            >
              <Link href={routeHelper ? routeHelper("siswa.grades") : "#"}>
                <FileText className="h-5 w-5 text-purple-600" />
                Lihat Nilai Saya
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Materi Terbaru</CardTitle>
                <p className="text-sm text-gray-500">
                  Tiga materi terbaru dari guru Anda.
                </p>
              </div>
              <Button
                variant="link"
                className="text-blue-600"
                asChild
              >
                <Link href={routeHelper ? routeHelper("siswa.materials") : "#"}>
                  Lihat semua
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMaterials.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                  Belum ada materi yang tersedia.
                </div>
              ) : (
                recentMaterials.map((material, index) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg border border-blue-100 bg-blue-50/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {material.title}
                        </p>
                        {material.subject && (
                          <Badge variant="outline" className="mt-1">
                            {material.subject}
                          </Badge>
                        )}
                      </div>
                      {material.createdAt && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(material.createdAt).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </span>
                      )}
                    </div>
                    {material.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {material.description}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      {(material.previewUrl || material.fileUrl) && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={material.previewUrl ?? material.fileUrl ?? undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Buka
                          </a>
                        </Button>
                      )}
                      {(material.downloadUrl || material.fileUrl) && (
                        <Button size="sm" asChild>
                          <a
                            href={material.downloadUrl ?? material.fileUrl ?? undefined}
                            download={material.downloadUrl || material.fileUrl ? material.fileName ?? undefined : undefined}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Unduh
                          </a>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Kuis Untuk Dikerjakan</CardTitle>
                <p className="text-sm text-gray-500">
                  Cek kuis terbaru sesuai kelas Anda.
                </p>
              </div>
              <Button
                variant="link"
                className="text-blue-600"
                asChild
              >
                <Link href={routeHelper ? routeHelper("siswa.quizzes") : "#"}>
                  Lihat semua
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingQuizzes.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                  Belum ada kuis yang tersedia.
                </div>
              ) : (
                upcomingQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {quiz.title}
                        </p>
                        {quiz.subject && (
                          <Badge variant="outline" className="mt-1">
                            {quiz.subject}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {quiz.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileQuestion className="h-3 w-3" />
                        {quiz.totalQuestions} Soal
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {quiz.duration} Menit
                      </span>
                    </div>
                    {quiz.latestAttempt && (
                      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        <p className="font-medium">
                          Nilai Terakhir: {quiz.latestAttempt.score}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {quiz.latestAttempt.correctAnswers} dari{" "}
                          {quiz.latestAttempt.totalQuestions} jawaban benar
                        </p>
                      </div>
                    )}
                    <Button
                      className="mt-3"
                      asChild
                      size="sm"
                    >
                      <Link
                        href={routeHelper ? routeHelper("siswa.quizzes") : "#"}
                      >
                        {quiz.latestAttempt ? "Kerjakan Lagi" : "Mulai Kuis"}
                      </Link>
                    </Button>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
