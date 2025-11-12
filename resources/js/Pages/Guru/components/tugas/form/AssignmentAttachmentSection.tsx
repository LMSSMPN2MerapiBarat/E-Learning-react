import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import type { AssignmentAttachment, AssignmentFormState } from "../types";

interface AssignmentAttachmentSectionProps {
  attachments: File[];
  setFieldValue: <K extends keyof AssignmentFormState>(
    key: K,
    value: AssignmentFormState[K],
  ) => void;
  existingAttachments: AssignmentAttachment[];
  onRemoveExisting?: (attachmentId: number) => void;
}

export default function AssignmentAttachmentSection({
  attachments,
  setFieldValue,
  existingAttachments,
  onRemoveExisting,
}: AssignmentAttachmentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const next = [...attachments, ...files];
    setFieldValue("attachments", next);
    event.target.value = "";
  };

  const removeNewFile = (index: number) => {
    const next = attachments.filter((_, idx) => idx !== index);
    setFieldValue("attachments", next);
  };

  return (
    <div className="space-y-3">
      <Label>Lampiran referensi</Label>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Unggah file
      </Button>

      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          {existingAttachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-xl border p-3 text-sm"
            >
              <span>{file.name}</span>
              <div className="flex items-center gap-2">
                {file.url && (
                  <Button asChild size="sm" variant="ghost">
                    <a href={file.url} target="_blank" rel="noreferrer">
                      Lihat
                    </a>
                  </Button>
                )}
                {onRemoveExisting && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveExisting(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-xl border p-3 text-sm"
            >
              <span>{file.name}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeNewFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
