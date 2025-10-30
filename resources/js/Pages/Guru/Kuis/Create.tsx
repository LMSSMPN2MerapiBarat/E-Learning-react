import { useForm } from "@inertiajs/react";
import { useMemo } from "react";
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
import { Plus, Trash2 } from "lucide-react";

interface Option {
  id: number;
  nama: string;
}

type QuizQuestionForm = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
};

type CreateQuizForm = {
  title: string;
  description: string;
  mata_pelajaran_id: number | null;
  duration: number;
  status: "draft" | "published";
  kelas_ids: number[];
  questions: QuizQuestionForm[];
};

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
  const form = useForm<CreateQuizForm>({
    title: "",
    description: "",
    mata_pelajaran_id: null,
    duration: 30,
    status: "draft",
    kelas_ids: [],
    questions: [],
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
      toast.error("Lengkapi pertanyaan dan semua opsi jawaban sebelum menyimpan.");
      return;
    }

    form.post("/guru/kuis", {
      onSuccess: () => {
        toast.success("Kuis berhasil dibuat.");
        form.reset();
        onSuccess();
      },
      onError: () => toast.error("Terjadi kesalahan saat membuat kuis."),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Judul Kuis</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
          placeholder="Masukkan judul kuis"
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
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
          <Label htmlFor="mapel">Mata Pelajaran</Label>
          <Select
            value={
              data.mata_pelajaran_id !== null ? String(data.mata_pelajaran_id) : ""
            }
            onValueChange={(value: string) =>
              setData("mata_pelajaran_id", value ? Number(value) : null)
            }
          >
            <SelectTrigger id="mapel">
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
          <Label htmlFor="duration">Durasi (menit)</Label>
          <Input
            id="duration"
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
              Tambahkan pertanyaan beserta pilihan jawaban.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Soal
          </Button>
        </div>

        {questionsError && (
          <p className="text-xs text-red-500">{questionsError}</p>
        )}

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
                      id={`correct-${question.id}-${optionIndex}`}
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
              <p className="text-xs text-gray-500">
                Tandai jawaban benar dengan memilih radio button di samping.
              </p>
            </div>
          </div>
        ))}
      </div>

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
