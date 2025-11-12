import { useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Upload, X } from "lucide-react";
import type { StudentAssignmentItem } from "@/Pages/Siswa/types";

interface AssignmentSubmissionFormProps {
  assignment: StudentAssignmentItem;
}

export default function AssignmentSubmissionForm({
  assignment,
}: AssignmentSubmissionFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const sendRequest = (path: string, message: string) => {
    form.post(path, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success(message);
        form.setData("files", []);
      },
      onError: (errors) => {
        const first = Object.values(errors)[0];
        first && toast.error(first as string);
      },
    });
  };

  return (
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
            onClick={() =>
              sendRequest(
                `/siswa/tugas/${assignment.id}/draft`,
                "Draft tersimpan.",
              )
            }
          >
            Simpan Draft
          </Button>
          <Button
            type="button"
            disabled={form.processing}
            onClick={() =>
              sendRequest(
                `/siswa/tugas/${assignment.id}/submit`,
                "Tugas dikumpulkan.",
              )
            }
          >
            Kumpulkan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
