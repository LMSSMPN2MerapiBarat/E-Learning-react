import { useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import AssignmentBasicSection from "@/Pages/Guru/components/tugas/form/AssignmentBasicSection";
import AssignmentScheduleSection from "@/Pages/Guru/components/tugas/form/AssignmentScheduleSection";
import AssignmentGradingSection from "@/Pages/Guru/components/tugas/form/AssignmentGradingSection";
import AssignmentSubmissionSection from "@/Pages/Guru/components/tugas/form/AssignmentSubmissionSection";
import AssignmentAttachmentSection from "@/Pages/Guru/components/tugas/form/AssignmentAttachmentSection";
import type {
  AssignmentFormState,
  Option,
} from "@/Pages/Guru/components/tugas/types";

interface CreateAssignmentProps {
  kelasOptions: Option[];
  mapelOptions: Option[];
  fileTypeOptions: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

const futureDate = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

export default function CreateAssignment({
  kelasOptions,
  mapelOptions,
  fileTypeOptions,
  onSuccess,
  onCancel,
}: CreateAssignmentProps) {
  const { toast } = useToast();
  const initialData = useMemo<AssignmentFormState>(
    () => ({
      title: "",
      description: "",
      mata_pelajaran_id: null,
      kelas_ids: [],
      open_at: futureDate(0),
      close_at: futureDate(72),
      max_score: 100,
      passing_grade: null,
      allow_text_answer: true,
      allow_file_upload: true,
      allowed_file_types: fileTypeOptions,
      allow_cancel_submit: true,
      status: "draft",
      attachments: [],
      removed_attachment_ids: [],
    }),
    [fileTypeOptions],
  );

  const form = useForm<AssignmentFormState>(initialData);
  const { data, setData, processing, errors } = form;

  const setFieldValue = <K extends keyof AssignmentFormState>(
    key: K,
    value: AssignmentFormState[K],
  ) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.post("/guru/tugas", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Tugas berhasil dibuat",
          description: "Data tugas baru telah tersimpan.",
        });
        form.reset();
        onSuccess();
      },
      onError: (formErrors) => {
        const firstError = Object.values(formErrors)[0];
        if (firstError) {
          toast({
            title: "Gagal membuat tugas",
            description: firstError,
            variant: "destructive",
          });
        }
      },
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <AssignmentBasicSection
        data={data}
        errors={errors}
        setFieldValue={setFieldValue}
        kelasOptions={kelasOptions}
        mapelOptions={mapelOptions}
      />

      <AssignmentScheduleSection
        data={data}
        errors={errors}
        setFieldValue={setFieldValue}
      />

      <AssignmentGradingSection
        data={data}
        errors={errors}
        setFieldValue={setFieldValue}
      />

      <AssignmentSubmissionSection
        data={data}
        errors={errors}
        fileTypeOptions={fileTypeOptions}
        setFieldValue={setFieldValue}
      />

      <AssignmentAttachmentSection
        attachments={data.attachments}
        setFieldValue={setFieldValue}
        existingAttachments={[]}
      />

      <div className="flex justify-end gap-1.5 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
