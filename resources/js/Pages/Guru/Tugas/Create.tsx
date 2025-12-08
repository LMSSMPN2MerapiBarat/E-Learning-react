import { useMemo, useEffect } from "react";
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

  // Filter mapel options based on selected class (keep selected subject visible even if not allowed for the chosen class)
  const filteredMapelOptions = useMemo(() => {
    if (data.kelas_ids.length === 0) return mapelOptions;

    // Get all mapel IDs allowed for the selected classes
    const allowedMapelIds = new Set<number>();
    data.kelas_ids.forEach((kelasId) => {
      const mapelIds = kelasMapelOptions?.[kelasId] || [];
      mapelIds.forEach((id) => allowedMapelIds.add(id));
    });

    // Base filtered options
    let result = mapelOptions.filter((option) => allowedMapelIds.has(option.id));

    // Ensure the currently selected mata_pelajaran_id remains in the list so UI doesn't disappear
    if (data.mata_pelajaran_id) {
      const selected = mapelOptions.find((opt) => opt.id === data.mata_pelajaran_id);
      if (selected && !result.some((opt) => opt.id === selected.id)) {
        result = [...result, selected];
      }
    }
    return result;
  }, [data.kelas_ids, data.mata_pelajaran_id, mapelOptions, kelasMapelOptions]);

  // NOTE: Keep selected mata pelajaran even if it is not in the filtered options for the chosen class.
  // This prevents the UI from clearing the selection when the class changes.
  // No automatic reset is performed here.
  // useEffect(() => {
  //   if (data.mata_pelajaran_id && filteredMapelOptions.length > 0) {
  //     const isValid = filteredMapelOptions.some(
  //       (option) => option.id === data.mata_pelajaran_id,
  //     );
  //     if (!isValid) {
  //       setData("mata_pelajaran_id", null);
  //     }
  //   }
  // }, [filteredMapelOptions, data.mata_pelajaran_id]);

  // Filter kelas options based on selected mapel (support both class‑>mapel and mapel‑>class mappings)
  const filteredKelasOptions = useMemo(() => {
    if (!data.mata_pelajaran_id) return kelasOptions;

    const allowedClassIds = new Set<number>();
    if (kelasMapelOptions) {
      // Direct mapping: classId => [mapelIds]
      Object.entries(kelasMapelOptions).forEach(([classIdStr, mapelIds]) => {
        if (Array.isArray(mapelIds) && mapelIds.includes(data.mata_pelajaran_id!)) {
          allowedClassIds.add(parseInt(classIdStr, 10));
        }
      });
      // Reverse mapping: mapelId => [classIds]
      const reverse = (kelasMapelOptions as any)[data.mata_pelajaran_id];
      if (Array.isArray(reverse)) {
        reverse.forEach((cid: number) => allowedClassIds.add(cid));
      }
    }
    // If no mapping found, fallback to all classes to avoid empty list
    if (allowedClassIds.size === 0) {
      return kelasOptions;
    }
    return kelasOptions.filter((kelas) => allowedClassIds.has(kelas.id));
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
