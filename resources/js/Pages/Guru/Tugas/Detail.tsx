import { useMemo, useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import TeacherLayout from "@/Layouts/TeacherLayout";
import AssignmentGradingDialog from "@/Pages/Guru/components/tugas/AssignmentGradingDialog";
import type {
  AssignmentItem,
  AssignmentSubmission,
} from "@/Pages/Guru/components/tugas/types";
import type { PageProps } from "@/types";
import { CalendarDays, Download, FileText, Users, ArrowLeft, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";

const statusLabel: Record<string, string> = {
  draft: "Draft",
  active: "Aktif",
  closed: "Selesai",
};

export default function AssignmentDetailPage() {
  const { assignment } = usePage<PageProps<{ assignment: AssignmentItem }>>().props;
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  
  // Pagination & Search State
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [submissionPage, setSubmissionPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredSubmissions = useMemo(() => {
    return assignment.submissions.filter((sub) =>
      sub.studentName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      (sub.studentClass ?? "").toLowerCase().includes(submissionSearch.toLowerCase())
    );
  }, [assignment.submissions, submissionSearch]);

  const totalPages = Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE);
  const paginatedSubmissions = filteredSubmissions.slice(
    (submissionPage - 1) * ITEMS_PER_PAGE,
    submissionPage * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setSubmissionPage(1);
  }, [submissionSearch]);

  const schedule = useMemo(() => {
    const toReadable = (value?: string | null) =>
      value ? new Date(value).toLocaleString("id-ID") : "-";
    return {
      open: toReadable(assignment.openDate),
      close: toReadable(assignment.closeDate),
    };
  }, [assignment.openDate, assignment.closeDate]);

  return (
    <TeacherLayout title="Detail Tugas">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit gap-2 pl-0 hover:bg-transparent hover:text-blue-600"
            onClick={() => router.visit("/guru/tugas")}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke daftar tugas
          </Button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {assignment.mapel?.nama ?? "Tanpa mata pelajaran"}
              </p>
              <h1 className="text-2xl font-semibold leading-tight">{assignment.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge>{statusLabel[assignment.status] ?? assignment.status}</Badge>
                {assignment.kelas.map((kelas) => (
                  <Badge key={kelas.id} variant="outline">
                    {kelas.nama}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`/guru/tugas/${assignment.id}/export`, "_blank")
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Export Nilai
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Sudah dikumpulkan</p>
                <p className="text-lg font-semibold">
                  {assignment.stats.submitted}/{assignment.stats.totalStudents}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Dibuka</p>
                <p className="text-sm font-medium">{schedule.open}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ditutup</p>
                <p className="text-sm font-medium">{schedule.close}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detail Tugas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {assignment.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Deskripsi</p>
                  <p className="rounded-xl border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                    {assignment.description}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Rentang waktu</p>
                <div className="rounded-xl border p-4 text-sm">
                  <div className="flex justify-between">
                    <span>Dibuka</span>
                    <span className="font-medium">{schedule.open}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between">
                    <span>Ditutup</span>
                    <span className="font-medium">{schedule.close}</span>
                  </div>
                </div>
              </div>

              {assignment.attachments.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Lampiran referensi</p>
                  <div className="space-y-2">
                    {assignment.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-xl border p-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{file.name}</span>
                        </div>
                        {file.url && (
                          <div className="flex gap-2">
                            <Button asChild size="sm" variant="ghost">
                              <a href={file.url} target="_blank" rel="noreferrer">
                                <Eye className="mr-1 h-4 w-4" />
                                Lihat
                              </a>
                            </Button>
                            <Button asChild size="sm" variant="ghost">
                              <a href={file.url} download rel="noreferrer">
                                <Download className="mr-1 h-4 w-4" />
                                Unduh
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Penilaian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Nilai maksimum</span>
                <span className="font-semibold">{assignment.maxScore}</span>
              </div>
              <div className="flex justify-between">
                <span>KKM</span>
                <span className="font-semibold">
                  {assignment.passingGrade ?? "Belum ditentukan"}
                </span>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="font-medium">Pengumpulan</p>
                <p className="text-muted-foreground">
                  {assignment.allowTextAnswer
                    ? "Jawaban teks diaktifkan"
                    : "Jawaban teks dimatikan"}
                </p>
                <p className="text-muted-foreground">
                  {assignment.allowFileUpload
                    ? `File diperbolehkan (${assignment.allowedFileTypes.join(", ")})`
                    : "Unggah file dimatikan"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Pengumpulan Siswa</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari siswa..."
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paginatedSubmissions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {submissionSearch
                  ? "Tidak ada siswa yang ditemukan."
                  : "Belum ada pengumpulan dari siswa."}
              </p>
            )}
            {paginatedSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium leading-tight">{submission.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    {submission.studentClass ?? "Tanpa kelas"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {submission.status === "graded"
                      ? "Dinilai"
                      : submission.status === "submitted"
                        ? "Perlu dinilai"
                        : "Draft"}
                  </Badge>
                  {submission.status !== "draft" && (
                    <Button size="sm" onClick={() => setGradingSubmission(submission)}>
                      {submission.status === "graded" ? "Lihat nilai" : "Nilai sekarang"}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredSubmissions.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Halaman {submissionPage} dari {totalPages} | Menampilkan{" "}
                  {paginatedSubmissions.length} dari {filteredSubmissions.length} siswa
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmissionPage((p) => Math.max(1, p - 1))}
                    disabled={submissionPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmissionPage((p) => Math.min(totalPages, p + 1))}
                    disabled={submissionPage === totalPages}
                  >
                    Berikutnya
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AssignmentGradingDialog
        submission={gradingSubmission}
        open={gradingSubmission !== null}
        onOpenChange={(open) => !open && setGradingSubmission(null)}
      />
    </TeacherLayout>
  );
}
