import { useState, useMemo, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ui/use-toast";
import AssignmentBasicSection from "@/Pages/Guru/components/tugas/form/AssignmentBasicSection";
import AssignmentScheduleSection from "@/Pages/Guru/components/tugas/form/AssignmentScheduleSection";
import AssignmentGradingSection from "@/Pages/Guru/components/tugas/form/AssignmentGradingSection";
import AssignmentSubmissionSection from "@/Pages/Guru/components/tugas/form/AssignmentSubmissionSection";
import AssignmentAttachmentSection from "@/Pages/Guru/components/tugas/form/AssignmentAttachmentSection";
import type {
  AssignmentAttachment,
  AssignmentFormState,
  AssignmentItem,
  Option,
} from "@/Pages/Guru/components/tugas/types";

interface EditAssignmentProps {
  assignment: AssignmentItem;
  kelasOptions: Option[];
  mapelOptions: Option[];
  kelasMapelOptions?: Record<number, number[]>;
  fileTypeOptions: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

type AssignmentEditFormState = AssignmentFormState & { _method: "PUT" };

export default function EditAssignment({
  assignment,
  kelasOptions,
  mapelOptions,
  kelasMapelOptions,
  fileTypeOptions,
  onSuccess,
  onCancel,
}: EditAssignmentProps) {
  const { toast } = useToast();
  const [existingAttachments, setExistingAttachments] = useState<AssignmentAttachment[]>(
    assignment.attachments,
  );

  const form = useForm<AssignmentEditFormState>({
    title: assignment.title,
    description: assignment.description ?? "",
    mata_pelajaran_id: assignment.mapel?.id ?? null,
    kelas_ids: assignment.kelasIds,
    open_at: assignment.openDate ?? "",
    close_at: assignment.closeDate ?? "",
    max_score: assignment.maxScore,
    passing_grade: assignment.passingGrade ?? null,
    allow_text_answer: assignment.allowTextAnswer,
    allow_file_upload: assignment.allowFileUpload,
    allowed_file_types: assignment.allowedFileTypes ?? fileTypeOptions,
    allow_cancel_submit: assignment.allowCancelSubmit,
    status: assignment.status === "draft" ? "draft" : "active",
    attachments: [],
    removed_attachment_ids: [],
    _method: "PUT",
  });

  const { data, setData, processing, errors } = form;

  // Filter mapel options based on selected class
  const filteredMapelOptions = useMemo(() => {
    if (data.kelas_ids.length === 0) return mapelOptions;

    // Get all mapel IDs allowed for the selected classes
    const allowedMapelIds = new Set<number>();
    data.kelas_ids.forEach((kelasId) => {
      const mapelIds = kelasMapelOptions?.[kelasId] || [];
      mapelIds.forEach((id) => allowedMapelIds.add(id));
    });

    return mapelOptions.filter((option) =>
      allowedMapelIds.has(option.id),
    );
  }, [data.kelas_ids, mapelOptions, kelasMapelOptions]);

  // Reset selected mapel if it's no longer valid for the selected class
  useEffect(() => {
    if (data.mata_pelajaran_id && filteredMapelOptions.length > 0) {
      const isValid = filteredMapelOptions.some(
        (option) => option.id === data.mata_pelajaran_id,
      );
      if (!isValid) {
        setData("mata_pelajaran_id", null);
      }
    }
  }, [filteredMapelOptions, data.mata_pelajaran_id]);

  // Filter kelas options based on selected mapel
  const filteredKelasOptions = useMemo(() => {
    if (!data.mata_pelajaran_id) return kelasOptions;

    return kelasOptions.filter((kelas) => {
      const mapelIds = kelasMapelOptions?.[kelas.id] || [];
      return mapelIds.includes(data.mata_pelajaran_id!);
    });
  }, [data.mata_pelajaran_id, kelasOptions, kelasMapelOptions]);

  // Reset selected kelas if they are no longer valid for the selected mapel
  useEffect(() => {
    if (data.mata_pelajaran_id) {
      const validClassIds = new Set(filteredKelasOptions.map((k) => k.id));
      const nextKelasIds = data.kelas_ids.filter((id) => validClassIds.has(id));

      if (nextKelasIds.length !== data.kelas_ids.length) {
        setData("kelas_ids", nextKelasIds);
      }
    }
  }, [data.mata_pelajaran_id, filteredKelasOptions, data.kelas_ids]);

  const setFieldValue = <K extends keyof AssignmentFormState>(
    key: K,
    value: AssignmentFormState[K],
  ) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeExistingAttachment = (attachmentId: number) => {
    setExistingAttachments((prev) => prev.filter((item) => item.id !== attachmentId));
    setData("removed_attachment_ids", [
      ...data.removed_attachment_ids,
      attachmentId,
    ]);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.post(`/guru/tugas/${assignment.id}`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Perubahan tersimpan",
          description: "Tugas berhasil diperbarui.",
        });
        onSuccess();
      },
      onError: (formErrors) => {
        const firstError = Object.values(formErrors)[0];
        if (firstError) {
          toast({
            title: "Gagal memperbarui tugas",
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
        kelasOptions={filteredKelasOptions}
        mapelOptions={filteredMapelOptions}
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
        existingAttachments={existingAttachments}
        onRemoveExisting={removeExistingAttachment}
      />

      <div className="flex justify-end gap-1.5 pt-1">
        <Button type="button" variant="destructive" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
