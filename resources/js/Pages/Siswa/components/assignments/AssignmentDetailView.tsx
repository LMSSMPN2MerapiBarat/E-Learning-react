import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { FileText, ArrowLeft, Loader2 } from "lucide-react";
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
import AssignmentHeaderCard from "./AssignmentHeaderCard";
import AssignmentSubmissionForm from "./AssignmentSubmissionForm";

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
      day: "numeric",
      month: "long",
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
      <div className="space-y-5">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke daftar
        </Button>

        <AssignmentHeaderCard
          assignment={assignment}
          statusLabel={STATUS_LABEL[assignment.status] ?? assignment.status}
        />

        {showSubmissionForm && <AssignmentSubmissionForm assignment={assignment} />}

        {showSubmissionPreview && (
          <Card>
            <CardContent className="space-y-3 p-5">
              <p className="text-sm text-muted-foreground">
                Dikumpulkan pada {formatDate(assignment.submittedDate)}
              </p>
              {assignment.status === "submitted" &&
                assignment.allowCancelSubmit &&
                !assignment.isClosed && (
                  <Button
                    variant="secondary"
                    onClick={handleCancelClick}
                    disabled={isCanceling}
                  >
                    {isCanceling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Batalkan Submit
                  </Button>
                )}
              {assignment.textAnswer && (
                <div className="space-y-1">
                  <Label>Jawaban Teks</Label>
                  <p className="rounded-xl border bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                    {assignment.textAnswer}
                  </p>
                </div>
              )}
              {assignment.files.length > 0 && (
                <div className="space-y-2">
                  <Label>Lampiran Anda</Label>
                  {assignment.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-xl border p-3 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{file.name}</span>
                      </div>
                      {file.url && (
                        <Button asChild size="sm" variant="ghost">
                          <a href={file.url} target="_blank" rel="noreferrer">
                            Unduh
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {assignment.status === "graded" && (
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-end gap-3">
                <p className="text-4xl font-bold">{assignment.score}</p>
                <Badge variant="outline">/ {assignment.maxScore}</Badge>
              </div>
              {assignment.feedback && (
                <div className="space-y-1">
                  <Label>Catatan Guru</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {assignment.feedback}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pengumpulan?</AlertDialogTitle>
            <AlertDialogDescription>
              Jawaban yang sudah Anda kumpulkan akan dihapus. Anda perlu mengerjakan dan mengumpulkan ulang tugas ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/90">
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

