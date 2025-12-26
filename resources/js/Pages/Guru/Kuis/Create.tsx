import { useForm, router } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import ClassSelector from "@/Pages/Guru/components/kuis/ClassSelector";
import QuizMetadataFields from "@/Pages/Guru/components/kuis/QuizMetadataFields";
import QuizQuestionsEditor from "@/Pages/Guru/components/kuis/QuizQuestionsEditor";
import QuizAIGenerator from "@/Pages/Guru/components/kuis/QuizAIGenerator";
import type {
  Option,
  QuizBaseForm,
  QuizQuestionForm,
  AIQuota,
} from "@/Pages/Guru/components/kuis/formTypes";

interface CreateQuizProps {
  kelasOptions: Option[];
  mapelOptions: Option[];
  kelasMapelOptions?: Record<number, number[]>;
  onSuccess: () => void;
  onCancel?: () => void;
  aiQuota: AIQuota;
}

export default function CreateQuiz({
  kelasOptions,
  mapelOptions,
  kelasMapelOptions,
  onSuccess,
  onCancel,
  aiQuota,
}: CreateQuizProps) {
  const form = useForm<QuizBaseForm>({
    title: "",
    description: "",
    mata_pelajaran_id: null,
    duration: 30,
    max_attempts: "unlimited",
    status: "draft",
    kelas_ids: [],
    questions: [],
    available_from: null,
    available_until: null,
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

  const toggleKelas = (id: number) => {
    setData(
      "kelas_ids",
      data.kelas_ids.includes(id)
        ? data.kelas_ids.filter((kelasId) => kelasId !== id)
        : [...data.kelas_ids, id],
    );
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestionForm = {
      id: crypto.randomUUID(),
      question: "",
      options: ["", "", "", ""],
      correct_answer: 0,
    };
    setData("questions", [...data.questions, newQuestion]);
  };

  const updateQuestion = (id: string, payload: Partial<QuizQuestionForm>) => {
    setData(
      "questions",
      data.questions.map((question) =>
        question.id === id ? { ...question, ...payload } : question,
      ),
    );
  };

  const removeQuestion = (id: string) => {
    setData(
      "questions",
      data.questions.filter((question) => question.id !== id),
    );
  };

  const questionsError = useMemo(
    () => errors["questions"] || errors["questions.0.question"],
    [errors],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (data.questions.length === 0) {
      toast.error("Tambahkan minimal satu soal sebelum menyimpan.");
      return;
    }

    const invalidQuestion = data.questions.some(
      (question) =>
        !question.question.trim() ||
        question.options.some((option) => !option.trim()),
    );

    if (invalidQuestion) {
      toast.error(
        "Lengkapi pertanyaan dan semua opsi jawaban sebelum menyimpan.",
      );
      return;
    }

    if (
      data.available_from &&
      data.available_until &&
      new Date(data.available_from) >= new Date(data.available_until)
    ) {
      toast.error("Waktu selesai harus lebih lama dari waktu mulai.");
      return;
    }

    // Transform questions to include imageFile for upload
    const transformedQuestions = data.questions.map((q) => ({
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      image: q.imageFile || null, // Send the File object for upload
    }));

    router.post("/guru/kuis", {
      title: data.title,
      description: data.description,
      mata_pelajaran_id: data.mata_pelajaran_id,
      duration: data.duration,
      max_attempts: data.max_attempts,
      status: data.status,
      available_from: data.available_from,
      available_until: data.available_until,
      kelas_ids: data.kelas_ids,
      questions: transformedQuestions,
    }, {
      forceFormData: true,
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
      onError: (formErrors) => {
        const message = formErrors.title || formErrors.description;
        if (message) {
          toast.error(message);
        }
      },
    });
  };

  const handleAIQuestionsGenerated = (aiQuestions: QuizQuestionForm[]) => {
    // Replace existing questions with AI-generated ones
    setData("questions", aiQuestions);
    toast.success(`${aiQuestions.length} pertanyaan telah ditambahkan. Silakan tinjau dan edit sesuai kebutuhan.`);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <QuizMetadataFields
        data={data}
        setData={setData}
        errors={errors}
        mapelOptions={filteredMapelOptions}
        attemptLimitError={errors.max_attempts}
      />

      <ClassSelector
        options={filteredKelasOptions}
        selectedIds={data.kelas_ids}
        onToggle={toggleKelas}
        error={errors.kelas_ids as string | undefined}
      />

      <QuizAIGenerator onQuestionsGenerated={handleAIQuestionsGenerated} initialQuota={aiQuota} />

      <QuizQuestionsEditor
        questions={data.questions}
        onAdd={addQuestion}
        onRemove={removeQuestion}
        onUpdate={updateQuestion}
        error={questionsError as string | undefined}
      />

      <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end sm:gap-1.5">
        {onCancel && (
          <Button type="button" variant="destructive" size="default" className="w-full sm:w-auto" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" size="default" className="w-full sm:w-auto" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan Kuis"}
        </Button>
      </div>
    </form>
  );
}
