import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useToast } from "@/Components/ui/use-toast";
import { FileText } from "lucide-react";
import type { AssignmentSubmission } from "./types";

interface AssignmentGradingDialogProps {
  submission: AssignmentSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AssignmentGradingDialog({
  submission,
  open,
  onOpenChange,
}: AssignmentGradingDialogProps) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!submission) return;
    setScore(submission.score?.toString() ?? "");
    setFeedback(submission.feedback ?? "");
  }, [submission]);

  const handleSave = () => {
    if (!submission) return;
    const value = Number(score);
    if (Number.isNaN(value)) {
      toast({
        title: "Nilai tidak valid",
        description: "Masukkan angka yang benar sebelum menyimpan.",
        variant: "destructive",
      });
      return;
    }
    router.put(
      `/guru/tugas/submissions/${submission.id}`,
      { score: value, feedback },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Nilai tersimpan",
            description: "Penilaian siswa berhasil diperbarui.",
          });
          onOpenChange(false);
        },
        onError: (errors) => {
          toast({
            title: "Gagal menyimpan nilai",
            description: errors.score || "Terjadi kesalahan saat menyimpan.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] overflow-hidden p-0">
        {submission && (
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader className="text-left">
              <DialogTitle>Penilaian Tugas</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {submission.studentName} &bull;{" "}
                {submission.studentClass ?? "Tanpa kelas"}
              </p>
            </DialogHeader>

            <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
              {submission.textAnswer && (
                <div>
                  <Label>Jawaban Teks</Label>
                  <p className="mt-2 rounded-xl border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                    {submission.textAnswer}
                  </p>
                </div>
              )}

              {submission.files.length > 0 && (
                <div>
                  <Label>Lampiran</Label>
                  <div className="mt-2 space-y-2">
                    {submission.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-xl border p-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{file.name}</span>
                        </div>
                        {file.url && (
                          <div className="flex items-center gap-1">
                            <Button asChild size="sm" variant="ghost">
                              <a href={file.url} target="_blank" rel="noreferrer">
                                Lihat
                              </a>
                            </Button>
                            <Button asChild size="sm" variant="outline">
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

              <div className="space-y-2">
                <Label>Nilai</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={score}
                    onChange={(event) => {
                      const newValue = event.target.value;
                      if (newValue === "") {
                        setScore("");
                        return;
                      }
                      // Allow only integers/digits
                      if (!/^\d+$/.test(newValue)) {
                        return;
                      }
                      const numValue = parseInt(newValue, 10);
                      if (
                        !Number.isNaN(numValue) &&
                        numValue >= 0 &&
                        numValue <= submission.maxScore
                      ) {
                        setScore(newValue);
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    placeholder="0-100"
                  />
                  <Badge variant="secondary">/ {submission.maxScore}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catatan untuk siswa</Label>
                <Textarea
                  rows={5}
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Berikan umpan balik..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handleSave}>Simpan</Button>
            </div>
          </div>
        )}

        {!submission && (
          <div className="p-6 text-sm text-muted-foreground">
            Pilih pengumpulan untuk dinilai.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
