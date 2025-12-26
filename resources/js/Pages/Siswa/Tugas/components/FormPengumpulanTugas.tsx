import { useEffect, useRef, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Upload, X, Loader2, FileText, Send, Save, CloudUpload } from "lucide-react";
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

  const validateSubmission = (): string | null => {
    const hasText = form.data.text_answer.trim().length > 0;
    const hasFiles = form.data.files.length > 0;
    const hasExistingFiles = existingFiles.length > 0;

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
      <Card className="border-none shadow-sm ring-1 ring-gray-200">
        <CardHeader className="border-b bg-gray-50/50 px-6 py-4">
          <CardTitle className="text-base font-semibold text-gray-900">
            Jawaban Anda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {assignment.allowTextAnswer ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Jawaban Teks</Label>
              <Textarea
                rows={8}
                className="resize-y border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.data.text_answer}
                onChange={(event) => form.setData("text_answer", event.target.value)}
                placeholder="Tuliskan jawaban Anda secara rinci di sini..."
              />
              {form.errors.text_answer && (
                <p className="text-xs text-red-500">{form.errors.text_answer}</p>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
              Jawaban teks tidak diizinkan untuk tugas ini.
            </div>
          )}

          {assignment.allowFileUpload && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Lampiran Jawaban</Label>

              <div
                className={`transition-colors border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 ${form.data.files.length > 0 ? 'border-blue-200 bg-blue-50/10' : 'border-gray-200'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                    <CloudUpload className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Klik untuk unggah file
                    </p>
                    <p className="text-xs text-gray-500">
                      Format: {assignment.allowedFileTypes.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={addFiles}
              />

              {/* File List Section */}
              <div className="space-y-2">
                {/* Existing Files */}
                {assignment.files.map((file) => {
                  const isRemoved = removedFileIds.includes(file.id);
                  return (
                    <div
                      key={file.id}
                      className={`group flex items-center justify-between rounded-lg border p-3 text-sm transition-all ${isRemoved
                        ? "border-red-100 bg-red-50 text-red-600"
                        : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`h-4 w-4 ${isRemoved ? "text-red-400" : "text-gray-400"}`} />
                        <div className="flex flex-col">
                          <span className={`font-medium ${isRemoved ? "line-through" : "text-gray-700"}`}>
                            {file.name}
                          </span>
                          {isRemoved && <span className="text-[10px] text-red-500">Akan dihapus</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.url && !isRemoved && (
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0 text-gray-400 hover:text-blue-600">
                            <a href={file.url} target="_blank" rel="noreferrer" title="Lihat File">
                              <CloudUpload className="h-4 w-4 rotate-180" /> {/* Download icon equivalent */}
                            </a>
                          </Button>
                        )}
                        {isRemoved ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
                            onClick={() => restoreExistingFile(file.id)}
                          >
                            Batalkan
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeExistingFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* New Files */}
                {form.data.files.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-blue-100 p-1.5 text-blue-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-blue-900">{file.name}</span>
                        <span className="text-[10px] text-blue-600">File Baru</span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full text-blue-400 hover:bg-blue-100 hover:text-blue-600"
                      onClick={() => removeNewFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              variant="secondary"
              type="button"
              disabled={form.processing}
              onClick={handleSaveDraft}
              className="gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              {form.processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan Draft
            </Button>
            <Button
              type="button"
              disabled={form.processing}
              onClick={handleSubmitClick}
              className="gap-2 min-w-[140px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40"
            >
              {form.processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
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
              Pastikan jawaban Anda sudah benar. Setelah dikumpulkan, Anda mungkin tidak dapat mengubah jawaban lagi tergantung pengaturan tugas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Periksa Lagi</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} className="bg-blue-600 hover:bg-blue-700">
              Ya, Kumpulkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

