import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/Components/ui/radio-group";
import { Badge } from "@/Components/ui/badge";
import { Trash2 } from "lucide-react";

interface Option {
  id: number;
  nama: string;
}

type QuizQuestionForm = {
  id: string | number;
  question: string;
  options: string[];
  correct_answer: number;
};

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

type EditQuizForm = {
  title: string;
  description: string;
  mata_pelajaran_id: number | null;
  duration: number;
  status: "draft" | "published";
  kelas_ids: number[];
  questions: QuizQuestionForm[];
  _method: "PUT";
};

interface EditQuizProps {
  quiz: QuizData;
  kelasOptions: Option[];
  mapelOptions: Option[];
  onSuccess: () => void;
  onCancel: () => void;
}

const normalizeQuestions = (
  questions: Array<Partial<QuizQuestionForm>> | undefined,
): QuizQuestionForm[] => {
  return (questions ?? []).map((question, index) => ({
    id: question.id ?? index,
    question: question.question ?? "",
    options: Array.isArray(question.options) ? question.options : [],
    correct_answer:
      typeof question.correct_answer === "number"
        ? question.correct_answer
        : typeof (question as { correctAnswer?: number }).correctAnswer === "number"
          ? (question as { correctAnswer?: number }).correctAnswer!
          : 0,
  }));
};

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
    const nextState: EditQuizForm = {
      title: quiz.judul,
      description: quiz.deskripsi ?? "",
      mata_pelajaran_id: quiz.mata_pelajaran_id ?? null,
      duration: quiz.durasi,
      status: quiz.status,
      kelas_ids: quiz.kelas_ids ?? [],
      questions: normalizeQuestions(quiz.questions),
      _method: "PUT",
    };

    form.setData(() => nextState);
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

  const updateQuestion = (
    id: string | number,
    payload: Partial<QuizQuestionForm>,
  ) => {
    setData(
      "questions",
      data.questions.map((question) =>
        question.id === id ? { ...question, ...payload } : question,
      ),
    );
  };

  const removeQuestion = (id: string | number) => {
    setData(
      "questions",
      data.questions.filter((question) => question.id !== id),
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
      toast.error("Lengkapi pertanyaan dan semua opsi jawaban sebelum menyimpan.");
      return;
    }

    post(`/guru/kuis/${quiz.id}`, {
      onSuccess: () => {
        toast.success("Kuis berhasil diperbarui.");
        onSuccess();
      },
      onError: () => toast.error("Terjadi kesalahan saat memperbarui kuis."),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title_edit">Judul Kuis</Label>
        <Input
          id="title_edit"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
          placeholder="Masukkan judul kuis"
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description_edit">Deskripsi</Label>
        <Textarea
          id="description_edit"
          rows={3}
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
          placeholder="Tambahkan deskripsi singkat mengenai kuis"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mapel_edit">Mata Pelajaran</Label>
          <Select
            value={
              data.mata_pelajaran_id !== null ? String(data.mata_pelajaran_id) : ""
            }
            onValueChange={(value: string) =>
              setData("mata_pelajaran_id", value ? Number(value) : null)
            }
          >
            <SelectTrigger id="mapel_edit">
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              {mapelOptions.map((mapel) => (
                <SelectItem key={mapel.id} value={String(mapel.id)}>
                  {mapel.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mata_pelajaran_id && (
            <p className="text-xs text-red-500">
              {errors.mata_pelajaran_id}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_edit">Durasi (menit)</Label>
          <Input
            id="duration_edit"
            type="number"
            min={1}
            value={data.duration}
            onChange={(e) => setData("duration", Number(e.target.value))}
          />
          {errors.duration && (
            <p className="text-xs text-red-500">{errors.duration}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={data.status}
            onValueChange={(value: "draft" | "published") =>
              setData("status", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Dipublikasikan</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-xs text-red-500">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Pilih Kelas</Label>
        <div className="flex flex-wrap gap-2">
          {kelasOptions.map((kelas) => {
            const selected = data.kelas_ids.includes(kelas.id);
            return (
              <Button
                key={kelas.id}
                type="button"
                variant={selected ? "default" : "outline"}
                onClick={() => toggleKelas(kelas.id)}
              >
                {selected && <Badge className="mr-2">Dipilih</Badge>}
                {kelas.nama}
              </Button>
            );
          })}
        </div>
        {errors.kelas_ids && (
          <p className="text-xs text-red-500">{errors.kelas_ids}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Daftar Soal</Label>
            <p className="text-xs text-gray-500">
              Sunting pertanyaan dan pilihan jawaban.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addQuestion}>
            Tambah Soal
          </Button>
        </div>

        {data.questions.map((question, index) => (
          <div key={question.id} className="rounded-lg border p-4 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <Label className="text-sm font-medium">
                Pertanyaan {index + 1}
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeQuestion(question.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <Textarea
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, { question: e.target.value })
              }
              placeholder="Tulis pertanyaan..."
            />
            <div className="space-y-2">
              <Label>Pilihan Jawaban</Label>
              <RadioGroup
                value={String(question.correct_answer)}
                onValueChange={(value: string) =>
                  updateQuestion(question.id, {
                    correct_answer: Number(value),
                  })
                }
              >
                {question.options.map((option, optionIndex) => (
                  <div key={`${question.id}-${optionIndex}`} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={String(optionIndex)}
                      id={`correct-edit-${question.id}-${optionIndex}`}
                    />
                    <Input
                      value={option}
                      onChange={(e) => {
                        const nextOptions = [...question.options];
                        nextOptions[optionIndex] = e.target.value;
                        updateQuestion(question.id, {
                          options: nextOptions,
                        });
                      }}
                      placeholder={`Pilihan ${String.fromCharCode(
                        65 + optionIndex,
                      )}`}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        ))}
      </div>

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
