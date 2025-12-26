import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { FileText, ArrowLeft, Loader2, Calendar, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import type { StudentAssignmentItem } from "@/Pages/Siswa/types";
import AssignmentHeaderCard from "./KartuHeaderTugas";
import AssignmentSubmissionForm from "./FormPengumpulanTugas";

interface AssignmentDetailViewProps {
  assignment: StudentAssignmentItem;
  onBack: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Belum dikumpulkan",
  submitted: "Sudah dikumpulkan",
  graded: "Dinilai",
  late: "Terlambat",
};

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "-";

export default function AssignmentDetailView({
  assignment,
  onBack,
}: AssignmentDetailViewProps) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const showSubmissionForm =
    assignment.status === "pending" && assignment.isOpen && !assignment.isClosed;
  const showSubmissionPreview =
    assignment.status === "submitted" || assignment.status === "graded";

  const handleCancelClick = () => {
    setConfirmCancel(true);
  };

  const handleConfirmCancel = () => {
    setConfirmCancel(false);
    setIsCanceling(true);
    router.post(`/siswa/tugas/${assignment.id}/cancel`, undefined, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Pengumpulan berhasil dibatalkan!", {
          description: "Anda dapat mengerjakan dan mengumpulkan ulang tugas ini.",
        });
        setIsCanceling(false);
      },
      onError: () => {
        toast.error("Gagal membatalkan pengumpulan", {
          description: "Silakan coba lagi atau hubungi guru Anda.",
        });
        setIsCanceling(false);
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar tugas
        </Button>

        <AssignmentHeaderCard
          assignment={assignment}
          statusLabel={STATUS_LABEL[assignment.status] ?? assignment.status}
        />

        {showSubmissionForm && <AssignmentSubmissionForm assignment={assignment} />}

        {showSubmissionPreview && (
          <div className="space-y-6">
            {/* Grading Feedback Section - Show first if graded */}
            {assignment.status === "graded" && (
              <Card className="border-l-4 border-l-green-500 shadow-sm">
                <CardHeader className="border-b bg-green-50/50 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base font-semibold text-green-900">
                      Hasil Penilaian
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-green-100 bg-green-50/50 p-6 min-w-[150px]">
                      <span className="text-sm font-medium text-green-600">Nilai Anda</span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-green-700">{assignment.score}</span>
                        <span className="text-sm text-green-500">/ {assignment.maxScore}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm font-medium text-gray-900">Catatan Guru</Label>
                      {assignment.feedback ? (
                        <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {assignment.feedback}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Tidak ada catatan tambahan dari guru.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submission Content */}
            <Card className="shadow-sm">
              <CardHeader className="border-b bg-gray-50/50 px-6 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">
                  Detail Pengumpulan
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  Dikumpulkan pada {formatDate(assignment.submittedDate)}
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {assignment.textAnswer && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Jawaban Teks</Label>
                    <div className="rounded-lg border bg-white p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap shadow-sm">
                      {assignment.textAnswer}
                    </div>
                  </div>
                )}

                {assignment.files.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">Lampiran Jawaban</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {assignment.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="rounded bg-green-50 p-2 text-green-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="truncate text-sm font-medium text-gray-700">
                              {file.name}
                            </span>
                          </div>
                          {file.url && (
                            <div className="flex items-center gap-1">
                              <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs text-blue-600 hover:text-blue-700">
                                <a href={file.url} target="_blank" rel="noreferrer">
                                  Lihat
                                </a>
                              </Button>
                              <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700">
                                <a href={file.url} download={file.name}>
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

                {assignment.status === "submitted" &&
                  assignment.allowCancelSubmit &&
                  !assignment.isClosed && (
                    <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 mt-6">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-amber-900">Ingin mengubah jawaban?</p>
                          <p className="text-xs text-amber-700">Anda masih dapat membatalkan pengumpulan sebelum tenggat waktu.</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-200 text-amber-900 hover:bg-amber-100"
                        onClick={handleCancelClick}
                        disabled={isCanceling}
                      >
                        {isCanceling && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                        Batalkan Submit
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pengumpulan?</AlertDialogTitle>
            <AlertDialogDescription>
              Jawaban yang sudah Anda kumpulkan akan ditarik kembali. Anda harus mengumpulkan ulang tugas ini agar dapat dinilai.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/90">
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

