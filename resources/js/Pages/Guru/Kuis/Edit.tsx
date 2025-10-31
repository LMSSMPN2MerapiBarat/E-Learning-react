import { useForm } from "@inertiajs/react";
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
  status: "draft" | "published";
  kelas_ids?: number[] | null;
  questions: QuizQuestionForm[];
}

interface EditQuizForm extends QuizBaseForm {
  _method: "PUT";
}

interface EditQuizProps {
  quiz: QuizData;
  kelasOptions: Option[];
  mapelOptions: Option[];
  onSuccess: () => void;
  onCancel: () => void;
}

const normalizeQuestions = (
  questions: Array<Partial<QuizQuestionForm>> | undefined,
): QuizQuestionForm[] =>
  (questions ?? []).map((question, index) => ({
    id: String(question.id ?? index),
    question: question.question ?? "",
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
  onSuccess,
  onCancel,
}: EditQuizProps) {
  const form = useForm<EditQuizForm>({
    title: quiz.judul,
    description: quiz.deskripsi ?? "",
    mata_pelajaran_id: quiz.mata_pelajaran_id ?? null,
    duration: quiz.durasi,
    status: quiz.status,
    kelas_ids: quiz.kelas_ids ?? [],
    questions: normalizeQuestions(quiz.questions),
    _method: "PUT",
  });

  const { data, setData, post, processing, errors } = form;

  useEffect(() => {
    form.setData(() => ({
      title: quiz.judul,
      description: quiz.deskripsi ?? "",
      mata_pelajaran_id: quiz.mata_pelajaran_id ?? null,
      duration: quiz.durasi,
      status: quiz.status,
      kelas_ids: quiz.kelas_ids ?? [],
      questions: normalizeQuestions(quiz.questions),
      _method: "PUT",
    }));
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

    post(`/guru/kuis/${quiz.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Kuis berhasil diperbarui!");
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <QuizMetadataFields
        data={data}
        setData={setData}
        errors={errors}
        mapelOptions={mapelOptions}
      />

      <ClassSelector
        options={kelasOptions}
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

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}