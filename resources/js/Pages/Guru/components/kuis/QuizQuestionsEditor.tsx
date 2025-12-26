import React from "react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/Components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import type { QuizQuestionForm } from "./formTypes";

interface QuizQuestionsEditorProps {
  questions: QuizQuestionForm[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, payload: Partial<QuizQuestionForm>) => void;
  error?: string;
}

const QuizQuestionsEditor: React.FC<QuizQuestionsEditorProps> = ({
  questions,
  onAdd,
  onRemove,
  onUpdate,
  error,
}) => (
  <div className="space-y-4">
    <div>
      <Label className="text-sm font-medium">Daftar Soal</Label>
      <p className="text-xs text-gray-500">
        Tambahkan pertanyaan beserta pilihan jawaban.
      </p>
    </div>

    {error && <p className="text-xs text-red-500">{error}</p>}

    {questions.map((question, index) => (
      <div key={question.id} className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium">
            Pertanyaan {index + 1}
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(question.id)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        <Textarea
          value={question.question}
          onChange={(event) =>
            onUpdate(question.id, { question: event.target.value })
          }
          placeholder="Tulis pertanyaan..."
        />

        <div className="space-y-2">
          <Label>Pilihan Jawaban</Label>
          <RadioGroup
            value={String(question.correct_answer)}
            onValueChange={(value) =>
              onUpdate(question.id, { correct_answer: Number(value) })
            }
          >
            {question.options.map((option, optionIndex) => (
              <div
                key={`${question.id}-${optionIndex}`}
                className="flex items-center gap-2"
              >
                <RadioGroupItem
                  value={String(optionIndex)}
                  id={`correct-${question.id}-${optionIndex}`}
                />
                <Input
                  value={option}
                  onChange={(event) => {
                    const nextOptions = [...question.options];
                    nextOptions[optionIndex] = event.target.value;
                    onUpdate(question.id, { options: nextOptions });
                  }}
                  placeholder={`Pilihan ${String.fromCharCode(
                    65 + optionIndex,
                  )}`}
                />
              </div>
            ))}
          </RadioGroup>
          <p className="text-xs text-red-500">
            Tandai jawaban benar dengan memilih radio button di samping.
          </p>
        </div>
      </div>
    ))}

    <div className="flex justify-end">
      <Button type="button" variant="outline" onClick={onAdd} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Tambah Soal
      </Button>
    </div>
  </div>
);

export default QuizQuestionsEditor;
