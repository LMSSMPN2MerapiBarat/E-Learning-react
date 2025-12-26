import { useMemo, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
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
  kelasMapelOptions?: Record<number, number[]>;
  fileTypeOptions: string[];
  onSuccess: () => void;
  onCancel: () => void;
}

const futureDate = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

export default function CreateAssignment({
  kelasOptions,
  mapelOptions,
  kelasMapelOptions,
  fileTypeOptions,
  onSuccess,
  onCancel,
}: CreateAssignmentProps) {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.post("/guru/tugas", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Tugas berhasil dibuat", {
          description: "Data tugas baru telah tersimpan.",
        });
        form.reset();
        onSuccess();
      },
      onError: (formErrors) => {
        const firstError = Object.values(formErrors)[0];
        if (firstError) {
          toast.error("Gagal membuat tugas", {
            description: firstError,
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
        existingAttachments={[]}
      />

      <div className="flex justify-end gap-1.5 pt-1">
        <Button type="button" variant="destructive" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
