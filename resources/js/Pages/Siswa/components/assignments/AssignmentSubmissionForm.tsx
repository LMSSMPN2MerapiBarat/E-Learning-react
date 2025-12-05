import { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
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

interface AssignmentSubmissionFormProps {
  assignment: StudentAssignmentItem;
}

export default function AssignmentSubmissionForm({
  assignment,
}: AssignmentSubmissionFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const form = useForm<{ text_answer: string; files: File[] }>({
    text_answer: assignment.textAnswer ?? "",
    files: [],
  });

  useEffect(() => {
    form.setData({
      text_answer: assignment.textAnswer ?? "",
      files: [],
    });
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment.id]);

  const addFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    form.setData("files", [...form.data.files, ...files]);
    event.target.value = "";
  };

  const removeNewFile = (index: number) => {
    form.setData(
      "files",
      form.data.files.filter((_, idx) => idx !== index),
    );
  };

  // Validasi sebelum submit
  const validateSubmission = (): string | null => {
    const hasText = form.data.text_answer.trim().length > 0;
    const hasFiles = form.data.files.length > 0;
    const hasExistingFiles = assignment.files.length > 0;

    // Cek apakah ada jawaban yang diisi
    if (!hasText && !hasFiles && !hasExistingFiles) {
      if (assignment.allowTextAnswer && assignment.allowFileUpload) {
        return "Harap isi jawaban teks atau unggah file sebelum mengumpulkan.";
      } else if (assignment.allowTextAnswer) {
        return "Harap isi jawaban teks sebelum mengumpulkan.";
      } else if (assignment.allowFileUpload) {
        return "Harap unggah file sebelum mengumpulkan.";
      }
      return "Harap lengkapi jawaban sebelum mengumpulkan.";
    }

    return null;
  };

  const handleSubmitClick = () => {
    const error = validateSubmission();
    if (error) {
      toast.error(error);
      return;
    }
    setConfirmSubmit(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmSubmit(false);
    form.post(`/siswa/tugas/${assignment.id}/submit`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Tugas berhasil dikumpulkan!", {
          description: "Jawaban Anda telah terkirim ke guru.",
        });
        form.setData("files", []);
      },
      onError: (errors) => {
        const first = Object.values(errors)[0];
        toast.error("Gagal mengumpulkan tugas", {
          description: (first as string) || "Silakan coba lagi.",
        });
      },
    });
  };

  const handleSaveDraft = () => {
    const hasText = form.data.text_answer.trim().length > 0;
    const hasFiles = form.data.files.length > 0;

    if (!hasText && !hasFiles) {
      toast.error("Tidak ada perubahan untuk disimpan", {
        description: "Harap isi jawaban teks atau unggah file terlebih dahulu.",
      });
      return;
    }

    form.post(`/siswa/tugas/${assignment.id}/draft`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Draft berhasil disimpan!", {
          description: "Anda dapat melanjutkan pengerjaan nanti.",
        });
        form.setData("files", []);
      },
      onError: (errors) => {
        const first = Object.values(errors)[0];
        toast.error("Gagal menyimpan draft", {
          description: (first as string) || "Silakan coba lagi.",
        });
      },
    });
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-4 p-5">
          {assignment.allowTextAnswer ? (
            <div className="space-y-2">
              <Label>Jawaban teks</Label>
              <Textarea
                rows={6}
                value={form.data.text_answer}
                onChange={(event) => form.setData("text_answer", event.target.value)}
                placeholder="Tulis jawaban Anda..."
              />
              {form.errors.text_answer && (
                <p className="text-xs text-destructive">{form.errors.text_answer}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Jawaban teks tidak diizinkan untuk tugas ini.
            </p>
          )}

          {assignment.allowFileUpload && (
            <div className="space-y-2">
              <Label>Lampiran jawaban</Label>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={addFiles}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Unggah File
              </Button>
              <p className="text-xs text-muted-foreground">
                Tipe diizinkan: {assignment.allowedFileTypes.join(", ")}
              </p>
              {form.data.files.length > 0 && (
                <div className="space-y-2">
                  {form.data.files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border p-3 text-sm"
                    >
                      <span>{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNewFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={form.processing}
              onClick={handleSaveDraft}
            >
              {form.processing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Simpan Draft
            </Button>
            <Button
              type="button"
              disabled={form.processing}
              onClick={handleSubmitClick}
            >
              {form.processing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Kumpulkan
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kumpulkan Tugas?</AlertDialogTitle>
            <AlertDialogDescription>
              Pastikan jawaban Anda sudah benar. Setelah dikumpulkan, Anda mungkin tidak dapat mengubah jawaban lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Ya, Kumpulkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

