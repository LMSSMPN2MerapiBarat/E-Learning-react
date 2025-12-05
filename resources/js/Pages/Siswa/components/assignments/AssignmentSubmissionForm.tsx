import { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Upload, X, Loader2, FileText } from "lucide-react";
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
  const [removedFileIds, setRemovedFileIds] = useState<number[]>([]);
  const form = useForm<{ text_answer: string; files: File[]; removed_file_ids: number[] }>({
    text_answer: assignment.textAnswer ?? "",
    files: [],
    removed_file_ids: [],
  });

  // File yang masih ada (belum dihapus)
  const existingFiles = assignment.files.filter(f => !removedFileIds.includes(f.id));

  useEffect(() => {
    form.setData({
      text_answer: assignment.textAnswer ?? "",
      files: [],
      removed_file_ids: [],
    });
    setRemovedFileIds([]);
    form.clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment.id]);

  const addFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    // Validasi tipe file
    const allowedExtensions = assignment.allowedFileTypes.map(ext =>
      ext.toLowerCase().replace(/^\./, '')
    );

    const invalidFiles: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (allowedExtensions.includes(ext)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    if (invalidFiles.length > 0) {
      toast.error(`Tipe file tidak diizinkan: ${invalidFiles.join(', ')}`, {
        description: `Tipe yang diizinkan: ${assignment.allowedFileTypes.join(', ')}`,
      });
    }

    if (validFiles.length > 0) {
      form.setData("files", [...form.data.files, ...validFiles]);
    }

    event.target.value = "";
  };

  const removeNewFile = (index: number) => {
    form.setData(
      "files",
      form.data.files.filter((_, idx) => idx !== index),
    );
  };

  const removeExistingFile = (fileId: number) => {
    setRemovedFileIds(prev => [...prev, fileId]);
    form.setData("removed_file_ids", [...removedFileIds, fileId]);
  };

  const restoreExistingFile = (fileId: number) => {
    const newRemovedIds = removedFileIds.filter(id => id !== fileId);
    setRemovedFileIds(newRemovedIds);
    form.setData("removed_file_ids", newRemovedIds);
  };

  // Validasi sebelum submit
  const validateSubmission = (): string | null => {
    const hasText = form.data.text_answer.trim().length > 0;
    const hasFiles = form.data.files.length > 0;
    const hasExistingFiles = existingFiles.length > 0;

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
    const hasExistingFiles = existingFiles.length > 0;
    const hasChanges = hasText || hasFiles || removedFileIds.length > 0;

    if (!hasText && !hasFiles && !hasExistingFiles && removedFileIds.length === 0) {
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
        <CardContent className="space-y-3 p-4">
          {assignment.allowTextAnswer ? (
            <div className="space-y-1.5">
              <Label className="text-xs">Jawaban teks</Label>
              <Textarea
                rows={5}
                className="text-xs"
                value={form.data.text_answer}
                onChange={(event) => form.setData("text_answer", event.target.value)}
                placeholder="Tulis jawaban Anda..."
              />
              {form.errors.text_answer && (
                <p className="text-[10px] text-destructive">{form.errors.text_answer}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Jawaban teks tidak diizinkan untuk tugas ini.
            </p>
          )}

          {assignment.allowFileUpload && (
            <div className="space-y-1.5">
              <Label className="text-xs">Lampiran jawaban</Label>

              {/* File yang sudah ada sebelumnya */}
              {assignment.files.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground">File yang sudah dilampirkan:</p>
                  {assignment.files.map((file) => {
                    const isRemoved = removedFileIds.includes(file.id);
                    return (
                      <div
                        key={file.id}
                        className={`flex items-center justify-between rounded-lg border p-2 text-xs ${isRemoved
                          ? "border-red-200 bg-red-50 opacity-60"
                          : "border-green-200 bg-green-50"
                          }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <FileText className={`h-3.5 w-3.5 ${isRemoved ? "text-red-600" : "text-green-600"}`} />
                          <span className={isRemoved ? "text-red-800 line-through" : "text-green-800"}>
                            {file.name}
                          </span>
                          {isRemoved && (
                            <span className="text-[10px] text-red-600">(akan dihapus)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {file.url && !isRemoved && (
                            <Button asChild size="sm" variant="ghost" className="h-6 px-1.5 text-[10px]">
                              <a href={file.url} target="_blank" rel="noreferrer">
                                Lihat
                              </a>
                            </Button>
                          )}
                          {isRemoved ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-1.5 text-[10px] text-green-600 hover:text-green-700"
                              onClick={() => restoreExistingFile(file.id)}
                            >
                              Batalkan
                            </Button>
                          ) : (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-red-500 hover:text-red-600"
                              onClick={() => removeExistingFile(file.id)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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
                size="sm"
                className="w-full text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                {assignment.files.length > 0 ? "Tambah File Baru" : "Unggah File"}
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Tipe diizinkan: {assignment.allowedFileTypes.join(", ")}
              </p>

              {/* File baru yang akan diupload */}
              {form.data.files.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground">File baru yang akan diunggah:</p>
                  {form.data.files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs"
                    >
                      <span className="text-blue-800">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeNewFile(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="text-xs"
              disabled={form.processing}
              onClick={handleSaveDraft}
            >
              {form.processing ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : null}
              Simpan Draft
            </Button>
            <Button
              size="sm"
              type="button"
              className="text-xs"
              disabled={form.processing}
              onClick={handleSubmitClick}
            >
              {form.processing ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
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

