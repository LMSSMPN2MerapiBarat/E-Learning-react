import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import type { AssignmentFormState } from "../types";

interface AssignmentSubmissionSectionProps {
  data: AssignmentFormState;
  errors: Record<string, string | undefined>;
  setFieldValue: <K extends keyof AssignmentFormState>(
    key: K,
    value: AssignmentFormState[K],
  ) => void;
  fileTypeOptions: string[];
}

export default function AssignmentSubmissionSection({
  data,
  errors,
  setFieldValue,
  fileTypeOptions,
}: AssignmentSubmissionSectionProps) {
  const toggleFileType = (ext: string) => {
    const exists = data.allowed_file_types.includes(ext);
    const next = exists
      ? data.allowed_file_types.filter((item) => item !== ext)
      : [...data.allowed_file_types, ext];
    setFieldValue("allowed_file_types", next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border p-4">
        <div>
          <Label>Izinkan jawaban teks</Label>
          <p className="text-xs text-muted-foreground">
            Siswa dapat mengetik jawaban langsung.
          </p>
        </div>
        <Switch
          checked={data.allow_text_answer}
          onCheckedChange={(checked) => setFieldValue("allow_text_answer", checked)}
        />
      </div>

      <div className="space-y-3 rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Izinkan unggah file</Label>
            <p className="text-xs text-muted-foreground">
              Jawaban dapat dilampirkan dalam bentuk file.
            </p>
          </div>
          <Switch
            checked={data.allow_file_upload}
            onCheckedChange={(checked) =>
              setFieldValue("allow_file_upload", checked)
            }
          />
        </div>

        {data.allow_file_upload && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Klik untuk memilih tipe file yang diterima.
            </p>
            <div className="flex flex-wrap gap-2">
              {fileTypeOptions.map((ext) => {
                const active = data.allowed_file_types.includes(ext);
                return (
                  <Badge
                    key={ext}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleFileType(ext)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && toggleFileType(ext)
                    }
                    className={active ? "" : "border-dashed bg-transparent"}
                  >
                    {ext.toUpperCase()}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border p-4">
        <div>
          <Label>Izinkan batalkan submit</Label>
          <p className="text-xs text-muted-foreground">
            Siswa dapat menarik kembali pengumpulan sebelum deadline.
          </p>
        </div>
        <Switch
          checked={data.allow_cancel_submit}
          onCheckedChange={(checked) =>
            setFieldValue("allow_cancel_submit", checked)
          }
        />
      </div>

      {errors.submission && (
        <p className="text-xs text-destructive">{errors.submission}</p>
      )}
    </div>
  );
}
