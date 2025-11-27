import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { CalendarClock, CheckCircle, Clock, ClipboardList, User } from "lucide-react";
import type { QuizAttemptLite, QuizItem } from "../types";

interface StudentQuizListProps {
  quizzes: QuizItem[];
  onStartQuiz: (quiz: QuizItem) => void;
  resumeable?: Record<number, boolean>;
}

export default function StudentQuizList({
  quizzes,
  onStartQuiz,
  resumeable = {},
}: StudentQuizListProps) {
  const formatSchedule = (quiz: QuizItem) => {
    if (!quiz.availableFrom && !quiz.availableUntil) {
      return null;
    }

    const formatter = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });

    if (quiz.availableFrom && quiz.availableUntil) {
      return `${formatter.format(new Date(quiz.availableFrom))} - ${formatter.format(
        new Date(quiz.availableUntil),
      )}`;
    }

    if (quiz.availableFrom) {
      return `Mulai ${formatter.format(new Date(quiz.availableFrom))}`;
    }

    return `Sampai ${formatter.format(new Date(quiz.availableUntil as string))}`;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Kuis Untuk Kelas Anda</CardTitle>
        <CardDescription>
          Pilih kuis yang tersedia dan kerjakan langsung dari halaman ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {quizzes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-sm text-gray-500">
              <ClipboardList className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              Belum ada kuis yang tersedia.
            </CardContent>
          </Card>
        ) : (
          quizzes.map((quiz) => {
            const scheduleLabel = formatSchedule(quiz);
            const now = Date.now();
            const isUpcoming =
              quiz.availableFrom !== undefined &&
              quiz.availableFrom !== null &&
              new Date(quiz.availableFrom).getTime() > now;
            const isExpired =
              quiz.availableUntil !== undefined &&
              quiz.availableUntil !== null &&
              new Date(quiz.availableUntil).getTime() < now;
            const attemptsLimited =
              quiz.maxAttempts !== undefined && quiz.maxAttempts !== null;
            const attemptsUsed = quiz.attemptsUsed ?? 0;
            const remainingAttempts =
              quiz.remainingAttempts ?? (attemptsLimited ? 0 : null);
            const limitReached =
              attemptsLimited && (remainingAttempts ?? 0) <= 0;
            const canResume = resumeable[quiz.id] === true;

            return (
              <Card
                key={quiz.id}
                className="border-l-4 border-l-emerald-500 shadow-sm transition hover:border-l-emerald-600 hover:shadow-md"
              >
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {quiz.title}
                    </h3>
                    {quiz.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {quiz.description}
                      </p>
                    )}
                  </div>
                  <Badge className="border-green-200 bg-green-100 text-green-700">
                    Published
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  {quiz.subject && (
                    <Badge variant="outline">{quiz.subject}</Badge>
                  )}
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    {quiz.duration} menit
                  </Badge>
                  <Badge variant="outline">
                    <ClipboardList className="mr-1 h-3 w-3" />
                    {quiz.totalQuestions} soal
                  </Badge>
                  {quiz.teacher && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {quiz.teacher}
                    </span>
                  )}
                </div>
                {quiz.classNames.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    {quiz.classNames.map((name) => (
                      <Badge key={name} variant="secondary">
                        Kelas {name}
                      </Badge>
                    ))}
                  </div>
                )}
                {quiz.latestAttempt && (
                  <LatestAttemptBadge attempt={quiz.latestAttempt} />
                )}
                <Button
                  onClick={() => onStartQuiz(quiz)}
                  disabled={
                    quiz.questions.length === 0 ||
                    (quiz.isAvailable !== undefined && !quiz.isAvailable) ||
                    limitReached
                  }
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {quiz.questions.length === 0
                    ? "Belum ada soal"
                    : limitReached
                    ? "Batas percobaan habis"
                    : quiz.isAvailable === false && isExpired
                    ? "Sudah berakhir"
                    : quiz.isAvailable === false
                    ? "Belum tersedia"
                    : canResume
                    ? "Lanjutkan"
                    : quiz.latestAttempt
                    ? "Kerjakan Lagi"
                    : "Mulai Kuis"}
                </Button>
                {attemptsLimited && (
                  <div
                    className={`rounded-lg border p-3 text-xs ${
                      limitReached
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    {limitReached
                      ? "Anda telah menggunakan seluruh percobaan untuk kuis ini."
                      : `Sisa percobaan: ${remainingAttempts} dari ${quiz.maxAttempts} percobaan.`}
                  </div>
                )}
                {scheduleLabel && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
                    <p className="flex items-center gap-2">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {quiz.isAvailable === false && isUpcoming
                        ? `Kuis akan tersedia pada jadwal berikut: ${scheduleLabel}`
                        : quiz.isAvailable === false && isExpired
                        ? `Kuis sudah berakhir pada jadwal berikut: ${scheduleLabel}`
                        : `Jadwal ketersediaan: ${scheduleLabel}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function LatestAttemptBadge({ attempt }: { attempt: QuizAttemptLite }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
      <p className="font-medium">Nilai Terakhir: {attempt.score}</p>
      <p className="text-xs text-emerald-600">
        {attempt.correctAnswers} dari {attempt.totalQuestions} jawaban benar
      </p>
    </div>
  );
}
