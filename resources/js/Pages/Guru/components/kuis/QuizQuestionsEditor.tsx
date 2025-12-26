import React, { useRef, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/Components/ui/radio-group";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import type { QuizQuestionForm } from "./formTypes";

interface QuizQuestionsEditorProps {
  questions: QuizQuestionForm[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, payload: Partial<QuizQuestionForm>) => void;
  error?: string;
}

// Fixed image dimensions for consistency
const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 150;

const QuizQuestionsEditor: React.FC<QuizQuestionsEditorProps> = ({
  questions,
  onAdd,
  onRemove,
  onUpdate,
  error,
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleImageUpload = useCallback(
    (questionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please upload an image file (JPG, PNG, GIF, etc.)");
          return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert("Image size must be less than 2MB");
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        onUpdate(questionId, {
          image: previewUrl,
          imageFile: file,
        });
      }
    },
    [onUpdate]
  );

  const handleRemoveImage = useCallback(
    (questionId: string) => {
      onUpdate(questionId, {
        image: null,
        imageFile: null,
      });
      // Reset file input
      if (fileInputRefs.current[questionId]) {
        fileInputRefs.current[questionId]!.value = "";
      }
    },
    [onUpdate]
  );

  const triggerFileInput = useCallback((questionId: string) => {
    fileInputRefs.current[questionId]?.click();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Daftar Soal</Label>
        <p className="text-xs text-gray-500">
          Tambahkan pertanyaan beserta pilihan jawaban. Anda dapat menambahkan gambar pada setiap soal.
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

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">
              Gambar Soal <span className="text-gray-400">(opsional)</span>
            </Label>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => (fileInputRefs.current[question.id] = el)}
              onChange={(e) => handleImageUpload(question.id, e)}
            />

            {question.image ? (
              /* Image Preview with fixed size */
              <div className="relative inline-block">
                <div
                  className="overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
                  style={{
                    width: IMAGE_WIDTH,
                    height: IMAGE_HEIGHT,
                  }}
                >
                  <img
                    src={question.image}
                    alt={`Gambar soal ${index + 1}`}
                    className="h-full w-full object-cover"
                    style={{
                      width: IMAGE_WIDTH,
                      height: IMAGE_HEIGHT,
                    }}
                  />
                </div>
                {/* Remove image button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                  onClick={() => handleRemoveImage(question.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              /* Upload button */
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => triggerFileInput(question.id)}
              >
                <ImagePlus className="h-4 w-4" />
                Tambah Gambar
              </Button>
            )}

            <p className="text-xs text-gray-400">
              Format: JPG, PNG, GIF. Maks: 2MB. Ukuran tampilan: {IMAGE_WIDTH}x{IMAGE_HEIGHT}px
            </p>
          </div>

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
};

export default QuizQuestionsEditor;

