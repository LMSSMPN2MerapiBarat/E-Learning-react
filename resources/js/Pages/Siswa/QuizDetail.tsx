import { useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  FileQuestion,
  Calendar,
  Trophy,
  ArrowLeft,
  Target,
  BookOpen,
} from "lucide-react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import type {
  QuizAttemptAnswerDetail,
  QuizAttemptDetail,
  QuizItem,
  SiswaPageProps,
} from "./types";

type QuizDetailPageProps = SiswaPageProps & {
  quiz: QuizItem;
  attempt: QuizAttemptDetail;
  backUrl?: string;
  reviewUrl?: string | null;
};

interface ScoreGrade {
  label: string;
  color: string;
  bgColor: string;
}

const resolveBackRoute = (backUrl?: string) => {
  if (backUrl) return backUrl;
  if (typeof route === "function") {
    try {
      return route("siswa.quizzes");
    } catch {
      // Ignore Ziggy resolution failure, fall back to static path.
    }
  }
  return "/siswa/quizzes";
};

const getScoreGrade = (score: number): ScoreGrade => {
  if (score >= 90) {
    return { label: "Sempurna!", color: "text-purple-600", bgColor: "bg-purple-100" };
  }
  if (score >= 80) {
    return { label: "Luar Biasa!", color: "text-green-600", bgColor: "bg-green-100" };
  }
  if (score >= 70) {
    return { label: "Bagus!", color: "text-blue-600", bgColor: "bg-blue-100" };
  }
  if (score >= 60) {
    return { label: "Cukup Baik", color: "text-yellow-600", bgColor: "bg-yellow-100" };
  }
  return { label: "Perlu Belajar Lagi", color: "text-orange-600", bgColor: "bg-orange-100" };
};

export default function QuizDetail() {
  const { props } = usePage<QuizDetailPageProps>();
  const { quiz, attempt, backUrl, reviewUrl } = props;

  const questions = quiz.questions ?? [];
  const totalQuestions =
    attempt?.totalQuestions ??
    quiz.totalQuestions ??
    questions.length;
  const answers = attempt?.answers ?? [];

  const answerLookup = useMemo(() => {
    return answers.reduce<Record<number, QuizAttemptAnswerDetail>>((acc, answer) => {
      if (typeof answer.questionId === "number") {
        acc[answer.questionId] = answer;
      }
      return acc;
    }, {});
  }, [answers]);

  const answeredCount = useMemo(
    () =>
      Object.values(answerLookup).filter(
        (answer) =>
          answer.selectedOption !== null &&
          answer.selectedOption !== undefined,
      ).length,
    [answerLookup],
  );

  const computedCorrectAnswers = useMemo(() => {
    return questions.reduce((count, question) => {
      const answer = answerLookup[question.id];
      const selected = answer?.selectedOption;
      const isCorrect =
        answer?.isCorrect ??
        (selected !== null &&
          selected !== undefined &&
          selected === question.correctAnswer);
      return count + (isCorrect ? 1 : 0);
    }, 0);
  }, [questions, answerLookup]);

  const correctAnswers = attempt?.correctAnswers ?? computedCorrectAnswers;
  const wrongAnswers = Math.max(answeredCount - correctAnswers, 0);
  const unansweredCount = Math.max(totalQuestions - answeredCount, 0);
  const score =
    attempt?.score ??
    (totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0);
  const accuracy =
    answeredCount > 0
      ? Math.round((correctAnswers / answeredCount) * 100)
      : 0;
  const grade = getScoreGrade(score);
  const completedLabel = attempt?.submittedAt
    ? new Date(attempt.submittedAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    : null;
  const durationMinutes = attempt?.durationSeconds
    ? Math.max(Math.round(attempt.durationSeconds / 60), 1)
    : quiz.duration;
  const hasReviewLink = Boolean(reviewUrl);

  const handleBack = () => {
    router.visit(resolveBackRoute(backUrl));
  };

  const handleViewReview = () => {
    if (reviewUrl) {
      router.visit(reviewUrl);
      return;
    }
    router.visit(resolveBackRoute(backUrl));
  };

  return (
    <StudentLayout
      title="Detail Kuis"
      subtitle={`Hasil pengerjaan ${quiz.title}${quiz.subject ? ` • ${quiz.subject}` : ""}`}
    >
      <Head title={`Hasil Kuis - ${quiz.title}`} />

      <div className="relative left-1/2 right-1/2 w-screen -mx-[50vw] px-4 md:px-8 space-y-4 md:space-y-6 transform origin-top scale-[0.9]">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-3 rounded-lg">
            <FileQuestion className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Detail Hasil Kuis</h2>
            <p className="text-sm text-gray-600">
              {quiz.title}
              {quiz.subject ? ` • ${quiz.subject}` : ""}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className={`${grade.bgColor} w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Award className={`w-20 h-20 ${grade.color}`} />
                  </div>
                  <p className="text-7xl mb-2 font-bold text-gray-900">{score}</p>
                  <Badge className={`text-lg px-6 py-2 ${grade.bgColor} ${grade.color}`}>
                    {grade.label}
                  </Badge>
                </div>

                <div className="space-y-4 flex flex-col justify-center">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">Jawaban Benar</span>
                    </div>
                    <span className="text-2xl font-semibold">{correctAnswers}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-gray-700 text-sm">Jawaban Salah</span>
                    </div>
                    <span className="text-2xl font-semibold">{wrongAnswers}</span>
                  </div>

                  {unansweredCount > 0 && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <FileQuestion className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-gray-700 text-sm">Tidak Dijawab</span>
                      </div>
                      <span className="text-2xl font-semibold text-gray-500">{unansweredCount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700 text-sm">Total Soal</span>
                    </div>
                    <span className="text-2xl font-semibold">{totalQuestions}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>Durasi: {durationMinutes} menit</span>
                </div>
                {completedLabel && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Dikerjakan: {completedLabel}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className={`h-full border-2 border-purple-200 transition-all group hover:shadow-lg ${hasReviewLink ? "hover:border-purple-400 cursor-pointer" : "opacity-90"}`}
              onClick={hasReviewLink ? handleViewReview : undefined}
            >
              <CardContent className="p-6 h-full flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 group-hover:text-purple-600 transition-colors">
                      Lihat Pembahasan Detail
                    </h3>
                    <p className="text-sm text-gray-600">
                      Pelajari pembahasan lengkap untuk setiap soal dan tingkatkan pemahaman Anda.
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  disabled={!hasReviewLink}
                  onClick={handleViewReview}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {hasReviewLink ? "Buka Pembahasan" : "Pembahasan belum tersedia"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Trophy className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2">Performa Anda</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tingkat Kelulusan</span>
                        <Badge className={score >= 60 ? "bg-green-600" : "bg-red-600"}>
                          {score >= 60 ? "Lulus" : "Belum Lulus"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Akurasi Jawaban</span>
                        <span className="font-medium">
                          {accuracy}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Soal Terjawab</span>
                        <span className="font-medium">{answeredCount}/{totalQuestions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        </div>
    </StudentLayout>
  );
}
