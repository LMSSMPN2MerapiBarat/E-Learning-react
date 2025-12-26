import React, { useRef, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/Components/ui/radio-group";
import { Plus, Trash2, ImagePlus, X, FileQuestion, HelpCircle, CheckCircle2 } from "lucide-react";
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
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50/50 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-gray-800">Daftar Soal</CardTitle>
            </div>
            <CardDescription>
              Kelola pertanyaan dan kunci jawaban kuis Anda
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-white px-3 py-1 text-sm font-medium shadow-sm self-start sm:self-auto">
            Total: {questions.length} Soal
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-sm">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Belum Ada Soal</h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">
              Mulai buat kuis dengan menambahkan soal secara manual atau gunakan fitur AI Generator di atas.
            </p>
            <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Soal Pertama
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    No. {index + 1}
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(question.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Pertanyaan</Label>
                    <Textarea
                      value={question.question}
                      onChange={(event) =>
                        onUpdate(question.id, { question: event.target.value })
                      }
                      placeholder="Tulis pertanyaan Anda di sini..."
                      className="min-h-[80px] text-base resize-y"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600 flex items-center justify-between">
                      <span>Gambar Pendukung</span>
                      <span className="text-xs text-gray-400 font-normal">Opsional • Max 2MB</span>
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
                      <div className="relative inline-block group/image">
                        <div
                          className="overflow-hidden rounded-md border border-gray-200 shadow-sm"
                          style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_HEIGHT,
                          }}
                        >
                          <img
                            src={question.image}
                            alt={`Gambar soal ${index + 1}`}
                            className="h-full w-full object-contain bg-gray-50"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -right-2 -top-2 h-7 w-7 rounded-full p-0 shadow-md opacity-0 group-hover/image:opacity-100 transition-all scale-90 hover:scale-100"
                          onClick={() => handleRemoveImage(question.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50"
                        onClick={() => triggerFileInput(question.id)}
                      >
                        <ImagePlus className="mr-2 h-3.5 w-3.5" />
                        Upload Gambar
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3 rounded-lg bg-gray-50/50 p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-700">Pilihan Jawaban</Label>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium">
                        Pilih satu jawaban benar
                      </span>
                    </div>

                    <RadioGroup
                      value={String(question.correct_answer)}
                      onValueChange={(value) =>
                        onUpdate(question.id, { correct_answer: Number(value) })
                      }
                      className="space-y-3"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={`${question.id}-${optionIndex}`}
                          className={`flex items-center gap-3 p-2 rounded-md transition-colors ${question.correct_answer === optionIndex ? "bg-green-50 border border-green-200" : "hover:bg-white"}`}
                        >
                          <RadioGroupItem
                            value={String(optionIndex)}
                            id={`correct-${question.id}-${optionIndex}`}
                            className={question.correct_answer === optionIndex ? "text-green-600 border-green-600" : ""}
                          />
                          <Label
                            htmlFor={`correct-${question.id}-${optionIndex}`}
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-bold shadow-sm transition-all ${question.correct_answer === optionIndex
                              ? "bg-green-600 text-white shadow-green-200"
                              : "bg-white border border-gray-200 text-gray-600"
                              }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </Label>
                          <Input
                            value={option}
                            onChange={(event) => {
                              const nextOptions = [...question.options];
                              nextOptions[optionIndex] = event.target.value;
                              onUpdate(question.id, { options: nextOptions });
                            }}
                            placeholder={`Tulis pilihan jawaban ${String.fromCharCode(65 + optionIndex)}...`}
                            className={`flex-1 ${question.correct_answer === optionIndex ? "border-green-200 focus-visible:ring-green-500" : ""}`}
                          />
                          {question.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                              onClick={() => {
                                const nextOptions = question.options.filter((_, i) => i !== optionIndex);
                                let newCorrectAnswer = question.correct_answer;
                                if (question.correct_answer === optionIndex) {
                                  newCorrectAnswer = 0;
                                } else if (question.correct_answer > optionIndex) {
                                  newCorrectAnswer = question.correct_answer - 1;
                                }
                                onUpdate(question.id, {
                                  options: nextOptions,
                                  correct_answer: newCorrectAnswer
                                });
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </RadioGroup>

                    {question.options.length < 6 && (
                      <div className="pl-12 pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            const nextOptions = [...question.options, ""];
                            onUpdate(question.id, { options: nextOptions });
                          }}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Tambah Pilihan Jawaban ({String.fromCharCode(65 + question.options.length)})
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={onAdd}
              className="w-full bg-white border-2 border-dashed border-gray-200 text-gray-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 h-14"
            >
              <Plus className="mr-2 h-5 w-5" />
              Tambah Soal Baru (No. {questions.length + 1})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizQuestionsEditor;


