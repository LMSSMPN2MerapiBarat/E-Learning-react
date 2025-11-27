import { useCallback, useEffect, useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import {
  AlertCircle,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClipboardList,
  X,
  XCircle,
} from "lucide-react";
import type {
  QuizAttemptLite,
  QuizItem,
  QuizQuestion,
  QuizQuestionOption,
} from "./types";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface QuizExamPageProps extends InertiaPageProps {
  quiz: QuizItem;
  backUrl: string;
}

type AnswerMap = Record<number, number>;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function QuizExam({ quiz, backUrl }: QuizExamPageProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [showResults, setShowResults] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Math.max(quiz.duration, 1) * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizAttemptLite | null>(null);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  useEffect(() => {
    setHasStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setShowExitConfirm(false);
    setShowSubmitConfirm(false);
    setIsTimerActive(false);
    setTimeLeft(Math.max(quiz.duration, 1) * 60);
    setDirection(1);
    setIsSubmitting(false);
    setSubmitError(null);
    setResult(null);
    setShouldAutoSubmit(false);
  }, [quiz.id, quiz.duration]);

  useEffect(() => {
    if (!isTimerActive || showResults || !hasStarted) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsTimerActive(false);
          setShouldAutoSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isTimerActive, showResults, hasStarted]);

  const startQuiz = () => {
    setHasStarted(true);
    setIsTimerActive(true);
  };

  const submitQuiz = useCallback(
    async (autoSubmit = false) => {
      if (isSubmitting || showResults) {
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);
      setIsTimerActive(false);

      try {
        const payload = {
          answers: quiz.questions.map((question) => {
            const selectedOrder = answers[question.id];
            return {
              question_id: question.id,
              selected_option:
                selectedOrder !== undefined ? selectedOrder : null,
            };
          }),
          duration_seconds:
            Math.max(quiz.duration, 1) * 60 - Math.max(timeLeft, 0),
        };

        const response = await axios.post(
          `/siswa/quizzes/${quiz.id}/attempts`,
          payload,
        );

        const backendAttempt = response.data?.attempt ?? null;
        const normalizedAttempt: QuizAttemptLite | null = backendAttempt
          ? {
              id: backendAttempt.id,
              score: backendAttempt.score,
              correctAnswers:
                backendAttempt.correct_answers ??
                backendAttempt.correctAnswers ??
                0,
              totalQuestions:
                backendAttempt.total_questions ??
                backendAttempt.totalQuestions ??
                quiz.questions.length,
              submittedAt:
                backendAttempt.submitted_at ??
                backendAttempt.submittedAt ??
                null,
            }
          : null;

        setResult(normalizedAttempt);
        setShowResults(true);
        setIsTimerActive(false);
        setShowSubmitConfirm(false);
        if (!autoSubmit) {
          setShowExitConfirm(false);
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.errors?.quiz?.[0] ||
          "Terjadi kesalahan saat mengirim jawaban.";
        setSubmitError(message);
        if (!autoSubmit) {
          setIsTimerActive(true);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, quiz.id, quiz.duration, quiz.questions, timeLeft, isSubmitting, showResults],
  );

  useEffect(() => {
    if (shouldAutoSubmit) {
      void submitQuiz(true);
      setShouldAutoSubmit(false);
    }
  }, [shouldAutoSubmit, submitQuiz]);

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );

  const handleAnswer = (questionId: number, optionOrder: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionOrder,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setDirection(index > currentQuestionIndex ? 1 : -1);
    setCurrentQuestionIndex(index);
  };

  const calculateScore = useCallback(() => {
    if (!quiz.questions.length) {
      return 0;
    }

    const correct = quiz.questions.reduce((count, question) => {
      return answers[question.id] === question.correctAnswer
        ? count + 1
        : count;
    }, 0);

    return Math.round((correct / quiz.questions.length) * 100);
  }, [answers, quiz.questions]);

  const getTimeColor = () => {
    if (timeLeft <= 60) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (timeLeft <= 300) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getQuestionStatus = (questionId: number) =>
    answers[questionId] !== undefined ? "answered" : "unanswered";

  const finishQuiz = () => {
    router.visit(backUrl);
  };

  const activeQuestion = quiz.questions[currentQuestionIndex];

  const effectiveScore = result?.score ?? calculateScore();
  const correctTotal =
    result?.correctAnswers ??
    quiz.questions.reduce(
      (count, question) =>
        answers[question.id] === question.correctAnswer ? count + 1 : count,
      0,
    );

  if (!hasStarted && !showResults) {
    return (
      <>
        <Head title={quiz.title} />
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <Card className="max-w-2xl w-full shadow-xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                {quiz.subject && (
                  <p className="text-gray-600">{quiz.subject}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Guru Pengampu</p>
                  <p className="font-medium">{quiz.teacher || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Durasi Pengerjaan</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    {quiz.duration} Menit
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Jumlah Soal</p>
                  <p className="font-medium">{quiz.questions.length} Soal</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Batas Percobaan</p>
                  <p className="font-medium">
                    {quiz.maxAttempts ? `${quiz.maxAttempts}x` : "Tidak terbatas"}
                  </p>
                </div>
              </div>

              {quiz.description && (
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                  <p className="font-semibold mb-1">Deskripsi:</p>
                  <p>{quiz.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  className="w-full text-lg h-12" 
                  onClick={startQuiz}
                >
                  Mulai Kerjakan Sekarang
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.visit(backUrl)}
                >
                  Kembali
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={quiz.title} />
      {showResults ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
          <div className="mx-auto max-w-4xl">
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mb-8 text-center"
                >
                  <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg">
                    <Award className="h-20 w-20 text-yellow-600" />
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold">
                    Kuis Selesai!
                  </h2>
                  <p className="mb-4 text-6xl font-bold text-gray-800">
                    {effectiveScore}
                  </p>
                  <p className="mb-2 text-gray-600">
                    {correctTotal} dari {quiz.questions.length} jawaban benar
                  </p>
                  <Badge
                    className={`px-4 py-2 text-lg ${
                      effectiveScore >= 80
                        ? "bg-green-500"
                        : effectiveScore >= 60
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {effectiveScore >= 80
                      ? "Luar biasa!"
                      : effectiveScore >= 60
                      ? "Bagus!"
                      : "Tetap semangat!"}
                  </Badge>
                </motion.div>

                <div className="mb-6 space-y-4">
                  <h3 className="text-lg font-semibold">
                    Review Jawaban Detail
                  </h3>
                  {quiz.questions.map((question, index) => {
                    const selectedOrder = answers[question.id];
                    const isCorrect =
                      selectedOrder !== undefined &&
                      selectedOrder === question.correctAnswer;
                    const isAnswered = selectedOrder !== undefined;

                    const selectedOption = isAnswered
                      ? question.options.find(
                          (option) => option.order === selectedOrder,
                        )
                      : null;
                    const correctOption = question.options.find(
                      (option) => option.order === question.correctAnswer,
                    );

                    return (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`border-l-4 ${
                            isAnswered
                              ? isCorrect
                                ? "border-l-green-500 bg-green-50/30"
                                : "border-l-red-500 bg-red-50/30"
                              : "border-l-gray-300"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {isAnswered ? (
                                isCorrect ? (
                                  <div className="rounded-full bg-green-100 p-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="rounded-full bg-red-100 p-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  </div>
                                )
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300">
                                  <span className="text-xs text-gray-500">
                                    ?
                                  </span>
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="mb-3 text-gray-800">
                                  <span className="font-medium">
                                    {index + 1}.
                                  </span>{" "}
                                  {question.prompt}
                                </p>
                                {isAnswered ? (
                                  <div className="space-y-2 text-sm">
                                    {selectedOption && (
                                      <div
                                        className={`rounded-lg p-3 ${
                                          isCorrect
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        <span className="font-medium">
                                          Jawaban Anda:
                                        </span>{" "}
                                        {String.fromCharCode(
                                          65 +
                                            question.options.findIndex(
                                              (opt) =>
                                                opt.order === selectedOrder,
                                            ),
                                        )}
                                        . {selectedOption.text}
                                      </div>
                                    )}
                                    {!isCorrect && correctOption && (
                                      <div className="rounded-lg bg-green-100 p-3 text-green-800">
                                        <span className="font-medium">
                                          Jawaban Benar:
                                        </span>{" "}
                                        {String.fromCharCode(
                                          65 +
                                            question.options.findIndex(
                                              (opt) =>
                                                opt.order ===
                                                question.correctAnswer,
                                            ),
                                        )}
                                        . {correctOption.text}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm italic text-gray-500">
                                    Tidak dijawab
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <Button onClick={finishQuiz} className="w-full" size="lg">
                  Kembali ke Daftar Kuis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50">
          <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-2">
                    <ClipboardList className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {quiz.title}
                    </h2>
                    {quiz.subject && (
                      <p className="text-sm text-gray-600">{quiz.subject}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 ${getTimeColor()}`}
                  >
                    <Clock className="h-5 w-5" />
                    <span className="text-xl font-semibold">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExitConfirm(true)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-6">
            {submitError && (
              <Alert className="mb-4 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {submitError}
                </AlertDescription>
              </Alert>
            )}
            {timeLeft <= 60 && timeLeft > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert className="border-red-500 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    ⚠️ Waktu tersisa kurang dari 1 menit!
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                      <span>
                        Soal {currentQuestionIndex + 1} dari{" "}
                        {quiz.questions.length}
                      </span>
                      <span>{answeredCount} terjawab</span>
                    </div>
                    <Progress
                      value={
                        quiz.questions.length > 0
                          ? ((currentQuestionIndex + 1) /
                              quiz.questions.length) *
                            100
                          : 0
                      }
                    />
                  </CardContent>
                </Card>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeQuestion.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <Card className="border-2 border-blue-100 shadow-lg">
                      <CardContent className="p-8">
                        <div className="mb-6 flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-xl font-semibold text-white shadow-md">
                            {currentQuestionIndex + 1}
                          </div>
                          <p className="flex-1 pt-2 text-lg text-gray-800">
                            {activeQuestion.prompt}
                          </p>
                        </div>

                        <RadioGroup
                          value={
                            answers[activeQuestion.id] !== undefined
                              ? String(answers[activeQuestion.id])
                              : ""
                          }
                          onValueChange={(value) =>
                            handleAnswer(
                              activeQuestion.id,
                              Number.parseInt(value, 10),
                            )
                          }
                          className="space-y-3"
                        >
                          {activeQuestion.options.map(
                            (option: QuizQuestionOption, index: number) => {
                              const isSelected =
                                answers[activeQuestion.id] === option.order;
                              const optionId = `answer-${activeQuestion.id}-${option.order}`;
                              return (
                                <motion.div
                                  key={optionId}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                >
                                  <div
                                    className={`flex items-center space-x-3 rounded-xl border-2 p-4 transition-all ${
                                      isSelected
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      value={String(option.order)}
                                      id={optionId}
                                    />
                                    <Label
                                      htmlFor={optionId}
                                      className="flex flex-1 cursor-pointer items-center gap-3"
                                    >
                                      <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                          isSelected
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                      >
                                        {String.fromCharCode(65 + index)}
                                      </span>
                                      <span className="text-sm text-gray-800">
                                        {option.text}
                                      </span>
                                    </Label>
                                  </div>
                                </motion.div>
                              );
                            },
                          )}
                        </RadioGroup>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                <Card>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <Button
                      variant="outline"
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      size="lg"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Sebelumnya
                    </Button>

                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                      <Button onClick={nextQuestion} size="lg">
                        Selanjutnya
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setShowSubmitConfirm(true)}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Mengumpulkan..." : "Selesai & Kumpulkan"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-24 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <ClipboardList className="h-5 w-5" />
                      Navigasi Soal
                    </h3>

                    <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm">
                      <div className="mb-1 flex justify-between">
                        <span className="text-gray-600">Terjawab:</span>
                        <span className="font-medium">
                          {answeredCount}/{quiz.questions.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Belum dijawab:</span>
                        <span className="font-medium">
                          {quiz.questions.length - answeredCount}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 grid grid-cols-5 gap-2">
                      {quiz.questions.map((question: QuizQuestion, index) => {
                        const status = getQuestionStatus(question.id);
                        const isActive = index === currentQuestionIndex;

                        return (
                          <motion.button
                            key={question.id}
                            onClick={() => jumpToQuestion(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex aspect-square items-center justify-center rounded-lg border-2 transition-all ${
                              isActive
                                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                : status === "answered"
                                ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                            }`}
                          >
                            {index + 1}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg border-2 border-blue-600 bg-blue-600" />
                        <span className="text-gray-600">Soal aktif</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg border-2 border-green-500 bg-green-50" />
                        <span className="text-gray-600">Sudah dijawab</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg border-2 border-gray-300 bg-white" />
                        <span className="text-gray-600">Belum dijawab</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowSubmitConfirm(true)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Mengumpulkan..." : "Kumpulkan Kuis"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar dari Kuis?</AlertDialogTitle>
            <AlertDialogDescription>
              Jika Anda keluar sekarang, jawaban Anda tidak akan disimpan dan
              Anda harus mengerjakan dari awal lagi. Apakah Anda yakin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.visit(backUrl)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ya, Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kumpulkan Kuis?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>Anda akan mengumpulkan kuis dengan detail:</p>
                <div className="rounded-lg bg-blue-50 p-3 text-sm">
                  <p>
                    <span className="font-medium">Terjawab:</span>{" "}
                    {answeredCount} dari {quiz.questions.length} soal
                  </p>
                  <p>
                    <span className="font-medium">Belum dijawab:</span>{" "}
                    {quiz.questions.length - answeredCount} soal
                  </p>
                </div>
                <p className="text-red-600">
                  Setelah dikumpulkan, Anda tidak dapat mengubah jawaban lagi.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Periksa Lagi</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void submitQuiz(false)}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengumpulkan..." : "Ya, Kumpulkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
