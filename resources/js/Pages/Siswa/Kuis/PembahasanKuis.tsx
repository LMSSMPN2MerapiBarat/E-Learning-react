import { useMemo, useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import type { PageProps } from "@/types";
import type { QuizAttemptDetail, QuizItem } from "../types";

type QuizReviewPageProps = PageProps<{
  quiz: QuizItem;
  attempt: QuizAttemptDetail;
  backUrl?: string;
  detailUrl?: string;
}>;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export default function QuizReview() {
  const { props } = usePage<QuizReviewPageProps>();
  const { quiz, attempt, backUrl, detailUrl } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [imageError, setImageError] = useState(false);

  const questions = quiz.questions ?? [];
  const currentQuestion = questions[currentIndex];

  // Reset image error state when question changes
  useEffect(() => {
    setImageError(false);
  }, [currentIndex]);

  const answerLookup = useMemo(() => {
    const lookup: Record<number, number | null | undefined> = {};
    attempt?.answers?.forEach((answer) => {
      if (answer.questionId !== undefined) {
        lookup[answer.questionId] = answer.selectedOption;
      }
    });
    return lookup;
  }, [attempt]);

  const userAnswer = currentQuestion ? answerLookup[currentQuestion.id] : undefined;
  const isAnswered = userAnswer !== undefined && userAnswer !== null;
  const isCorrect =
    isAnswered && currentQuestion
      ? userAnswer === currentQuestion.correctAnswer
      : false;

  const correctCount = useMemo(
    () =>
      questions.filter(
        (q) => answerLookup[q.id] !== undefined && answerLookup[q.id] === q.correctAnswer,
      ).length,
    [questions, answerLookup],
  );
  const wrongCount = useMemo(
    () =>
      questions.filter(
        (q) =>
          answerLookup[q.id] !== undefined &&
          answerLookup[q.id] !== null &&
          answerLookup[q.id] !== q.correctAnswer,
      ).length,
    [questions, answerLookup],
  );
  const unansweredCount = Math.max(questions.length - correctCount - wrongCount, 0);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const getQuestionStatus = (questionId: number) => {
    const selected = answerLookup[questionId];
    if (selected === undefined || selected === null) return "unanswered";
    const question = questions.find((q) => q.id === questionId);
    if (question && selected === question.correctAnswer) return "correct";
    return "wrong";
  };

  const goBack = () => {
    if (detailUrl) {
      router.visit(detailUrl);
      return;
    }
    if (backUrl) {
      router.visit(backUrl);
      return;
    }
    router.visit("/siswa/quizzes");
  };

  return (
    <StudentLayout
      title="Pembahasan Kuis"
      subtitle={`Pembahasan soal ${quiz.title}${quiz.subject ? ` • ${quiz.subject}` : ""}`}
    >
      <Head title={`Pembahasan - ${quiz.title}`} />

      <div
        className="space-y-4 md:space-y-6"
        style={{
          transform: 'scale(0.8)',
          transformOrigin: 'top left',
          width: '125%',
          marginBottom: '-15%'
        }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div className="hidden md:flex items-center gap-4 text-sm">
              {/* <span className="flex items-center gap-2 text-gray-600">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                {correctCount} Benar
              </span>
              <span className="flex items-center gap-2 text-gray-600">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                {wrongCount} Salah
              </span> */}
              {unansweredCount > 0 && (
                <span className="flex items-center gap-2 text-gray-600">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  {unansweredCount} Kosong
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pembahasan Soal</h2>
              <p className="text-sm text-gray-600">
                {quiz.title}
                {quiz.subject ? ` • ${quiz.subject}` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Soal {currentIndex + 1} dari {questions.length}
                  </span>
                  <Badge
                    className={
                      !isAnswered
                        ? "bg-gray-500"
                        : isCorrect
                          ? "bg-green-600"
                          : "bg-red-600"
                    }
                  >
                    {!isAnswered ? "Tidak Dijawab" : isCorrect ? "Benar ✓" : "Salah ✗"}
                  </Badge>
                </div>
                <Progress value={questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0} />
              </CardContent>
            </Card>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
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
                  <Card
                    className={`border-2 shadow-xl ${!isAnswered
                      ? "border-gray-300"
                      : isCorrect
                        ? "border-green-500"
                        : "border-red-500"
                      }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${!isAnswered
                            ? "bg-gray-500"
                            : isCorrect
                              ? "bg-gradient-to-br from-green-600 to-green-700"
                              : "bg-gradient-to-br from-red-600 to-red-700"
                            }`}
                        >
                          <span className="text-white text-base font-medium">{currentIndex + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-base">{currentQuestion?.prompt}</p>
                          {currentQuestion?.image && !imageError && (
                            <div className="mt-3">
                              <img
                                src={currentQuestion.image}
                                alt={`Gambar soal ${currentIndex + 1}`}
                                className="max-w-full rounded-lg border border-gray-200 object-contain shadow-sm"
                                style={{ maxHeight: 300 }}
                                onError={() => setImageError(true)}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        {currentQuestion?.options.map((option, index) => {
                          const letter = String.fromCharCode(65 + index);
                          const isUserAnswer =
                            isAnswered && userAnswer !== null ? userAnswer === option.order : false;
                          const isCorrectAnswer = currentQuestion.correctAnswer === option.order;

                          let borderColor = "border-gray-200";
                          let bgColor = "bg-white";
                          let textColor = "text-gray-700";
                          let labelBg = "bg-gray-200";
                          let labelText = "text-gray-700";

                          if (isCorrectAnswer) {
                            borderColor = "border-green-500";
                            bgColor = "bg-green-50";
                            textColor = "text-green-900";
                            labelBg = "bg-green-600";
                            labelText = "text-white";
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            borderColor = "border-red-500";
                            bgColor = "bg-red-50";
                            textColor = "text-red-900";
                            labelBg = "bg-red-600";
                            labelText = "text-white";
                          }

                          return (
                            <motion.div
                              key={option.id ?? option.order ?? index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-2.5 rounded-lg border ${borderColor} ${bgColor} transition-all`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${labelBg} ${labelText}`}
                                >
                                  {letter}
                                </span>
                                <span className={`flex-1 text-sm ${textColor}`}>{option.text ?? option}</span>
                                {isCorrectAnswer && (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <Badge className="bg-green-600">Jawaban Benar</Badge>
                                  </div>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <div className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <Badge className="bg-red-600">Jawaban Anda</Badge>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      <div
                        className={`p-3 rounded-lg border ${!isAnswered
                          ? "border-gray-300 bg-gray-50"
                          : isCorrect
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          {!isAnswered ? (
                            <>
                              <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-800 mb-1">Tidak Dijawab</p>
                                <p className="text-sm text-gray-600">
                                  Anda tidak menjawab soal ini. Jawaban yang benar adalah{" "}
                                  <span className="font-medium text-green-700">
                                    {String.fromCharCode(
                                      65 +
                                      Math.max(
                                        currentQuestion?.options.findIndex(
                                          (opt) => opt.order === currentQuestion.correctAnswer,
                                        ),
                                        0,
                                      ),
                                    )}
                                  </span>
                                  .
                                </p>
                              </div>
                            </>
                          ) : isCorrect ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-green-800 mb-1">Jawaban Benar! 🎉</p>
                                <p className="text-sm text-green-700">
                                  Selamat! Anda memilih jawaban yang tepat. Pertahankan performa Anda.
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-red-800 mb-1">Jawaban Kurang Tepat</p>
                                <p className="text-sm text-red-700">
                                  Anda memilih{" "}
                                  <span className="font-medium">
                                    {String.fromCharCode(
                                      65 +
                                      Math.max(
                                        currentQuestion?.options.findIndex((opt) => opt.order === userAnswer),
                                        0,
                                      ),
                                    )}
                                  </span>
                                  , jawaban benar adalah{" "}
                                  <span className="font-medium text-green-700">
                                    {String.fromCharCode(
                                      65 +
                                      Math.max(
                                        currentQuestion?.options.findIndex(
                                          (opt) => opt.order === currentQuestion.correctAnswer,
                                        ),
                                        0,
                                      ),
                                    )}
                                  </span>
                                  .
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentIndex === 0}
                    size="lg"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Sebelumnya
                  </Button>

                  <div className="text-sm text-gray-600">
                    Soal {currentIndex + 1} / {questions.length}
                  </div>

                  <Button onClick={nextQuestion} disabled={currentIndex === questions.length - 1} size="lg">
                    Selanjutnya
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <ClipboardList className="w-5 h-5" />
                  Navigasi Soal
                </h3>

                <div className="mb-4 p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Benar:
                    </span>
                    <span className="font-medium text-green-700">{correctCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      Salah:
                    </span>
                    <span className="font-medium text-red-700">{wrongCount}</span>
                  </div>
                  {unansweredCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                        Kosong:
                      </span>
                      <span className="font-medium text-gray-600">{unansweredCount}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 mb-6">
                  {questions.map((question, index) => {
                    const status = getQuestionStatus(question.id);
                    const isActive = index === currentIndex;

                    return (
                      <motion.button
                        key={question.id}
                        onClick={() => jumpToQuestion(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`aspect-square rounded-lg border-2 transition-all flex items-center justify-center text-sm ${isActive
                          ? "border-purple-600 bg-purple-600 text-white shadow-lg scale-110"
                          : status === "correct"
                            ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                            : status === "wrong"
                              ? "border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
                              : "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {index + 1}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border-2 border-purple-600 bg-purple-600" />
                    <span className="text-gray-600">Soal aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border-2 border-green-500 bg-green-50" />
                    <span className="text-gray-600">Jawaban benar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border-2 border-red-500 bg-red-50" />
                    <span className="text-gray-600">Jawaban salah</span>
                  </div>
                  {unansweredCount > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg border-2 border-gray-300 bg-gray-50" />
                      <span className="text-gray-600">Tidak dijawab</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button onClick={goBack} variant="outline" className="w-full" size="lg">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
