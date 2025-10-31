import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { Progress } from "@/Components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileQuestion,
} from "lucide-react";
import axios from "axios";
import type { QuizAttemptLite, QuizItem } from "../types";
import { Alert, AlertDescription } from "@/Components/ui/alert";

interface QuizAttemptDialogProps {
  quiz: QuizItem;
  onClose: () => void;
  onSubmitted?: (attempt: QuizAttemptLite) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function QuizAttemptDialog({
  quiz,
  onClose,
  onSubmitted,
}: QuizAttemptDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(Math.max(quiz.duration, 1) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizAttemptLite | null>(null);

  const totalQuestions = quiz.questions.length;

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(Math.max(quiz.duration, 1) * 60);
    setIsSubmitting(false);
    setHasSubmitted(false);
    setSubmitError(null);
    setResult(null);
  }, [quiz.id, quiz.duration]);

  useEffect(() => {
    if (hasSubmitted || isSubmitting) {
      return;
    }

    if (timeLeft <= 0) {
      if (!submitError) {
        void submitQuiz(true);
      }
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          if (!submitError) {
            void submitQuiz(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timeLeft, hasSubmitted, isSubmitting, submitError]);

  const progressValue =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  const handleAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) =>
      Math.min(prev + 1, totalQuestions - 1),
    );
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const submitQuiz = async (autoSubmit = false) => {
    if (isSubmitting || hasSubmitted) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const durationSeconds =
        Math.max(quiz.duration, 1) * 60 - Math.max(timeLeft, 0);

      const payload = {
        answers: quiz.questions.map((question) => {
          const selectedIndex = answers[question.id];
          const option = selectedIndex !== undefined ? question.options[selectedIndex] : undefined;

          return {
            question_id: question.id,
            selected_option: option ? option.order : null,
          };
        }),
        duration_seconds: durationSeconds > 0 ? durationSeconds : null,
      };

      const response = await axios.post(
        `/siswa/quizzes/${quiz.id}/attempts`,
        payload,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );

      const backendAttempt = response.data.attempt ?? {};
      const normalized: QuizAttemptLite = {
        id: backendAttempt.id,
        score: backendAttempt.score,
        correctAnswers:
          backendAttempt.correct_answers ??
          backendAttempt.correctAnswers ??
          0,
        totalQuestions:
          backendAttempt.total_questions ??
          backendAttempt.totalQuestions ??
          totalQuestions,
        submittedAt:
          backendAttempt.submitted_at ?? backendAttempt.submittedAt ?? null,
      };

      setResult(normalized);
      setHasSubmitted(true);
      setIsSubmitting(false);
      if (!autoSubmit) {
        setTimeLeft(0);
      }
      onSubmitted?.(normalized);
    } catch (error: any) {
      const response = error?.response;
      let message =
        response?.data?.message ??
        "Terjadi kesalahan saat menyimpan hasil kuis.";

      if (response?.data?.errors) {
        const firstError = Object.values(response.data.errors)
          .flat()
          .find(Boolean);
        if (typeof firstError === "string") {
          message = firstError;
        }
      }

      setSubmitError(message);
      setIsSubmitting(false);
    }
  };

  const displayScore = result?.score ?? 0;
  const displayCorrectAnswers = result?.correctAnswers ?? 0;
  const displayTotalQuestions = result?.totalQuestions ?? totalQuestions;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{quiz.title}</DialogTitle>
        </DialogHeader>

        {totalQuestions === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-sm text-gray-500">
              <FileQuestion className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              Belum ada soal yang tersedia untuk kuis ini.
            </CardContent>
          </Card>
        ) : hasSubmitted && result ? (
          <div className="space-y-4">
            <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <CardContent className="space-y-3 p-8 text-center">
                <div className="text-sm text-gray-600">Nilai Anda</div>
                <div className="text-5xl font-semibold text-gray-900">
                  {displayScore}
                </div>
                <div className="text-sm text-gray-600">
                  {displayCorrectAnswers} dari {displayTotalQuestions} jawaban benar
                </div>
              </CardContent>
            </Card>
            <Button onClick={onClose} className="w-full">
              Selesai
            </Button>
          </div>
        ) : (
          <>
            {submitError && (
              <Alert className="border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {submitError}
                </AlertDescription>
              </Alert>
            )}
            {timeLeft <= 60 && (
              <Alert className="border-amber-500 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-600">
                  Waktu tersisa kurang dari 1 menit. Periksa kembali jawaban Anda!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Soal {currentQuestionIndex + 1} dari {totalQuestions}
              </span>
              <span>
                <Clock className="mr-1 inline h-4 w-4" />
                {formatTime(timeLeft)}
              </span>
            </div>
            <Progress className="mt-2 h-2" value={progressValue} />

            <Card className="border-2 border-blue-100">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                    {currentQuestionIndex + 1}
                  </div>
                  <p className="text-base text-gray-800">
                    {quiz.questions[currentQuestionIndex].prompt}
                  </p>
                </div>

                <RadioGroup
                  value={
                    answers[quiz.questions[currentQuestionIndex].id] !==
                    undefined
                      ? String(
                          answers[quiz.questions[currentQuestionIndex].id],
                        )
                      : ""
                  }
                  onValueChange={(value) =>
                    handleAnswer(
                      quiz.questions[currentQuestionIndex].id,
                      Number(value),
                    )
                  }
                  className="space-y-3"
                >
                  {quiz.questions[currentQuestionIndex].options.map(
                    (option, index) => {
                      const selected =
                        answers[
                          quiz.questions[currentQuestionIndex].id
                        ] === index;
                      const letter = String.fromCharCode(65 + index);
                      const optionId = `option-${quiz.questions[currentQuestionIndex].id}-${index}`;

                      return (
                        <div
                          key={optionId}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${
                            selected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem id={optionId} value={String(index)} />
                          <Label
                            htmlFor={optionId}
                            className="flex flex-1 items-center gap-3 text-sm"
                          >
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                selected
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {letter}
                            </span>
                            <span>{option.text}</span>
                          </Label>
                        </div>
                      );
                    },
                  )}
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex >= totalQuestions - 1}
                >
                  Berikutnya
                </Button>
              </div>
              <Button
                onClick={() => void submitQuiz()}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isSubmitting ? "Mengumpulkan..." : "Kumpulkan"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
