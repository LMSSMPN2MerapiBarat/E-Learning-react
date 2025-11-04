import { useForm } from "@inertiajs/react";
import { useMemo } from "react";
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

interface CreateQuizProps {
  kelasOptions: Option[];
  mapelOptions: Option[];
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function CreateQuiz({
  kelasOptions,
  mapelOptions,
  onSuccess,
  onCancel,
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

    form.post("/guru/kuis", {
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

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <QuizMetadataFields
        data={data}
        setData={setData}
        errors={errors}
        mapelOptions={mapelOptions}
        attemptLimitError={errors.max_attempts}
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
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan Kuis"}
        </Button>
      </div>
    </form>
  );
}
