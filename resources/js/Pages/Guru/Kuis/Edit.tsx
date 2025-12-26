import { useForm, router } from "@inertiajs/react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import ClassSelector from "@/Pages/Guru/components/kuis/ClassSelector";
import QuizMetadataFields from "@/Pages/Guru/components/kuis/QuizMetadataFields";
import QuizQuestionsEditor from "@/Pages/Guru/components/kuis/QuizQuestionsEditor";
import type {
  Option,
  QuizBaseForm,
  QuizQuestionForm,
} from "@/Pages/Guru/components/kuis/formTypes";

interface QuizData {
  id: number;
  judul: string;
  deskripsi?: string | null;
  mata_pelajaran_id?: number | null;
  durasi: number;
  max_attempts?: number | null;
  status: "draft" | "published";
  kelas_ids?: number[] | null;
  questions: QuizQuestionForm[];
  available_from?: string | null;
  available_until?: string | null;
}

interface EditQuizForm extends QuizBaseForm {
  _method: "PUT";
}

interface EditQuizProps {
  quiz: QuizData;
  kelasOptions: Option[];
  mapelOptions: Option[];
  kelasMapelOptions?: Record<number, number[]>;
  onSuccess: () => void;
  onCancel: () => void;
}

const formatToDateTimeLocal = (value?: string | null): string | null => {
  if (!value) return null;

  // Handle already formatted value (yyyy-MM-ddTHH:mm)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Fallback for formats like "2024-01-01 08:00:00"
  const fallback = value.replace(" ", "T").slice(0, 16);
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(fallback) ? fallback : null;
};

const normalizeQuestions = (
  questions: Array<Partial<QuizQuestionForm>> | undefined,
): QuizQuestionForm[] =>
  (questions ?? []).map((question, index) => ({
    id: String(question.id ?? index),
    question: question.question ?? "",
    image: question.image ?? null,
    imageFile: null,
    options: Array.isArray(question.options) ? question.options : ["", "", "", ""],
    correct_answer:
      typeof question.correct_answer === "number"
        ? question.correct_answer
        : typeof (question as { correctAnswer?: number }).correctAnswer === "number"
          ? (question as { correctAnswer?: number }).correctAnswer!
          : 0,
  }));

export default function EditQuiz({
  quiz,
  kelasOptions,
  mapelOptions,
  kelasMapelOptions,
  onSuccess,
  onCancel,
}: EditQuizProps) {
  const form = useForm<EditQuizForm>({
    title: quiz.judul,
    description: quiz.deskripsi ?? "",
    mata_pelajaran_id: quiz.mata_pelajaran_id ?? null,
    duration: quiz.durasi,
    max_attempts: quiz.max_attempts
      ? (String(quiz.max_attempts) as QuizBaseForm["max_attempts"])
      : "unlimited",
    status: quiz.status,
    kelas_ids: quiz.kelas_ids ?? [],
    questions: normalizeQuestions(quiz.questions),
    _method: "PUT",
    available_from: formatToDateTimeLocal(quiz.available_from),
    available_until: formatToDateTimeLocal(quiz.available_until),
  });

  const { data, setData, post, processing, errors } = form;

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

  useEffect(() => {
    form.setData({
      title: quiz.judul,
      description: quiz.deskripsi ?? "",
      mata_pelajaran_id: quiz.mata_pelajaran_id ?? null,
      duration: quiz.durasi,
      max_attempts: quiz.max_attempts
        ? (String(quiz.max_attempts) as QuizBaseForm["max_attempts"])
        : "unlimited",
      status: quiz.status,
      kelas_ids: quiz.kelas_ids ?? [],
      questions: normalizeQuestions(quiz.questions),
      _method: "PUT" as const,
      available_from: formatToDateTimeLocal(quiz.available_from),
      available_until: formatToDateTimeLocal(quiz.available_until),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.id]);

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

  const updateQuestion = (
    id: string,
    payload: Partial<QuizQuestionForm>,
  ) => {
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
      existing_image: !q.imageFile && q.image ? q.image : null, // Keep existing image
    }));

    router.post(`/guru/kuis/${quiz.id}`, {
      _method: "PUT",
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
      preserveScroll: true,
      onSuccess: () => {
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <QuizMetadataFields
        data={data}
        setData={setData}
        errors={errors}
        mapelOptions={filteredMapelOptions}
        attemptLimitError={errors.max_attempts as string | undefined}
      />

      <ClassSelector
        options={filteredKelasOptions}
        selectedIds={data.kelas_ids}
        onToggle={toggleKelas}
        error={errors.kelas_ids as string | undefined}
      />

      <QuizQuestionsEditor
        questions={data.questions}
        onAdd={addQuestion}
        onRemove={removeQuestion}
        onUpdate={updateQuestion}
        error={questionsError as string | undefined}
      />

      <div className="flex justify-end gap-1.5 pt-3">
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
