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
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit gap-1.5 pl-0 hover:bg-transparent hover:text-blue-600 text-xs"
            onClick={() => router.visit("/guru/tugas")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke daftar tugas
          </Button>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                {assignment.mapel?.nama ?? "Tanpa mata pelajaran"}
              </p>
              <h1 className="text-xl font-semibold leading-tight">{assignment.title}</h1>
              <div className="flex flex-wrap gap-1.5">
                <Badge className="text-[10px]">{statusLabel[assignment.status] ?? assignment.status}</Badge>
                {assignment.kelas.map((kelas) => (
                  <Badge key={kelas.id} variant="outline" className="text-[10px]">
                    {kelas.nama}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/guru/tugas/${assignment.id}/export`, "_blank")
                }
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export Nilai
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-2 p-4">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Sudah dikumpulkan</p>
                <p className="text-base font-semibold">
                  {assignment.stats.submitted}/{assignment.stats.totalStudents}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-4">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Dibuka</p>
                <p className="text-xs font-medium">{schedule.open}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 p-4">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Ditutup</p>
                <p className="text-xs font-medium">{schedule.close}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Detail Tugas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignment.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Deskripsi</p>
                  <p className="rounded-xl border bg-muted/30 p-3 text-xs whitespace-pre-wrap">
                    {assignment.description}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Rentang waktu</p>
                <div className="rounded-xl border p-3 text-xs">
                  <div className="flex justify-between">
                    <span>Dibuka</span>
                    <span className="font-medium">{schedule.open}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span>Ditutup</span>
                    <span className="font-medium">{schedule.close}</span>
                  </div>
                </div>
              </div>

              {assignment.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Lampiran referensi</p>
                  <div className="space-y-1.5">
                    {assignment.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-xl border p-2.5 text-xs"
                      >
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{file.name}</span>
                        </div>
                        {file.url && (
                          <div className="flex gap-1">
                            <Button asChild size="sm" variant="ghost" className="h-6 text-[10px]">
                              <a href={file.url} target="_blank" rel="noreferrer">
                                <Eye className="mr-0.5 h-3 w-3" />
                                Lihat
                              </a>
                            </Button>
                            <Button asChild size="sm" variant="ghost" className="h-6 text-[10px]">
                              <a href={file.url} download rel="noreferrer">
                                <Download className="mr-0.5 h-3 w-3" />
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
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pengaturan Penilaian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
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
              <div className="space-y-0.5">
                <p className="font-medium">Pengumpulan</p>
                <p className="text-muted-foreground text-[10px]">
                  {assignment.allowTextAnswer
                    ? "Jawaban teks diaktifkan"
                    : "Jawaban teks dimatikan"}
                </p>
                <p className="text-muted-foreground text-[10px]">
                  {assignment.allowFileUpload
                    ? `File diperbolehkan (${assignment.allowedFileTypes.join(", ")})`
                    : "Unggah file dimatikan"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Pengumpulan Siswa</CardTitle>
            <div className="relative w-56">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari siswa..."
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                className="pl-7 h-8 text-xs"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {paginatedSubmissions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">
                {submissionSearch
                  ? "Tidak ada siswa yang ditemukan."
                  : "Belum ada pengumpulan dari siswa."}
              </p>
            )}
            {paginatedSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium leading-tight text-sm">{submission.studentName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {submission.studentClass ?? "Tanpa kelas"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {submission.status === "graded"
                      ? "Dinilai"
                      : submission.status === "submitted"
                        ? "Perlu dinilai"
                        : "Draft"}
                  </Badge>
                  {submission.status !== "draft" && (
                    <Button size="sm" className="h-7 text-xs" onClick={() => setGradingSubmission(submission)}>
                      {submission.status === "graded" ? "Lihat nilai" : "Nilai sekarang"}
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredSubmissions.length > 0 && (
              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Halaman {submissionPage} dari {totalPages} | Menampilkan{" "}
                  {paginatedSubmissions.length} dari {filteredSubmissions.length} siswa
                </p>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSubmissionPage((p) => Math.max(1, p - 1))}
                    disabled={submissionPage === 1}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setSubmissionPage((p) => Math.min(totalPages, p + 1))}
                    disabled={submissionPage === totalPages}
                  >
                    Berikutnya
                    <ChevronRight className="h-3.5 w-3.5" />
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
