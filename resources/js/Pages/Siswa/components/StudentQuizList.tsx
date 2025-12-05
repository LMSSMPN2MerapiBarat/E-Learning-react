import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { CalendarClock, CheckCircle, Clock, ClipboardList, User, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { QuizAttemptLite, QuizItem } from "../types";

const ITEMS_PER_PAGE = 5;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter berdasarkan search
  const filteredQuizzes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return quizzes;

    return quizzes.filter((quiz) => {
      const pool = [
        quiz.title,
        quiz.description ?? "",
        quiz.subject ?? "",
        quiz.teacher ?? "",
        ...quiz.classNames,
      ];
      return pool.some((value) => value.toLowerCase().includes(term));
    });
  }, [quizzes, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredQuizzes.length / ITEMS_PER_PAGE);
  const paginatedQuizzes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQuizzes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuizzes, currentPage]);

  // Reset page ketika search berubah
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Kuis Untuk Kelas Anda</CardTitle>
            <CardDescription className="text-xs">
              Pilih kuis yang tersedia dan kerjakan langsung dari halaman ini.
            </CardDescription>
          </div>
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Input
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari kuis..."
              className="pl-8 text-xs h-8"
            />
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredQuizzes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-xs text-gray-500">
              {quizzes.length === 0 ? (
                <>
                  <ClipboardList className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  Belum ada kuis yang tersedia.
                </>
              ) : (
                <>
                  <Search className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                  Tidak ada kuis yang sesuai dengan pencarian.
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {paginatedQuizzes.map((quiz) => {
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
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="mt-0.5 text-xs text-gray-600">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                      <Badge className="border-green-200 bg-green-100 text-green-700 text-[10px]">
                        Published
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                      {quiz.subject && (
                        <Badge variant="outline" className="text-[10px]">{quiz.subject}</Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        <Clock className="mr-0.5 h-2.5 w-2.5" />
                        {quiz.duration} menit
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        <ClipboardList className="mr-0.5 h-2.5 w-2.5" />
                        {quiz.totalQuestions} soal
                      </Badge>
                      {quiz.teacher && (
                        <span className="flex items-center gap-0.5">
                          <User className="h-2.5 w-2.5" />
                          {quiz.teacher}
                        </span>
                      )}
                    </div>
                    {quiz.classNames.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-500">
                        {quiz.classNames.map((name) => (
                          <Badge key={name} variant="secondary" className="text-[10px]">
                            Kelas {name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {quiz.latestAttempt && (
                      <LatestAttemptBadge attempt={quiz.latestAttempt} />
                    )}
                    <Button
                      size="sm"
                      className={`text-xs ${canResume ? "bg-green-600 hover:bg-green-700" : ""}`}
                      onClick={() => onStartQuiz(quiz)}
                      disabled={
                        quiz.questions.length === 0 ||
                        (quiz.isAvailable !== undefined && !quiz.isAvailable) ||
                        limitReached
                      }
                    >
                      <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
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
                        className={`rounded-md border p-2 text-[10px] ${limitReached
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
                      <div className="rounded-md border border-blue-100 bg-blue-50 p-2 text-[10px] text-blue-700">
                        <p className="flex items-center gap-1.5">
                          <CalendarClock className="h-3 w-3" />
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
            })}

            {/* Pagination */}
            {filteredQuizzes.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-gray-600 min-w-[60px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LatestAttemptBadge({ attempt }: { attempt: QuizAttemptLite }) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
      <p className="font-medium">Nilai Terakhir: {attempt.score}</p>
      <p className="text-[10px] text-emerald-600">
        {attempt.correctAnswers} dari {attempt.totalQuestions} jawaban benar
      </p>
    </div>
  );
}

