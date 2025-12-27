import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ClipboardList, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { QuizItem } from "@/Pages/Guru/components/kuis/formTypes";

const ITEMS_PER_PAGE = 5;

interface QuizListProps {
  quizzes: QuizItem[];
  onView: (quiz: QuizItem) => void;
  onEdit: (quiz: QuizItem) => void;
  onDelete: (id: number) => void;
}

const formatSchedule = (from?: string | null, until?: string | null) => {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });

  if (from && until) {
    return `${formatter.format(new Date(from))} - ${formatter.format(
      new Date(until),
    )}`;
  }

  if (from) {
    return `Mulai ${formatter.format(new Date(from))}`;
  }

  if (until) {
    return `Sampai ${formatter.format(new Date(until))}`;
  }

  return null;
};

const QuizList: React.FC<QuizListProps> = ({ quizzes, onView, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(quizzes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuizzes = quizzes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset ke halaman 1 jika quizzes berubah dan currentPage melebihi totalPages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [quizzes.length, totalPages, currentPage]);

  return (
    <div className="space-y-4">
      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-gray-500">
            Belum ada kuis yang dibuat.
          </CardContent>
        </Card>
      ) : (
        <>
          {paginatedQuizzes.map((quiz) => {
            const scheduleLabel = formatSchedule(
              quiz.available_from,
              quiz.available_until,
            );

            return (
              <Card key={quiz.id}>
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-1 gap-4">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <ClipboardList className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-base font-semibold text-gray-800">
                        {quiz.judul}
                      </h3>
                      {quiz.deskripsi && (
                        <p className="text-sm text-gray-600 line-clamp-2">{quiz.deskripsi}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {quiz.mapel?.nama && (
                          <Badge variant="outline">{quiz.mapel.nama}</Badge>
                        )}
                        <Badge variant="outline">{quiz.durasi} Menit</Badge>
                        <Badge
                          className={
                            quiz.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {quiz.status === "published" ? "Aktif" : "Draft"}
                        </Badge>
                        <Badge variant="outline">
                          {quiz.questions.length} Soal
                        </Badge>
                        <Badge variant="outline">
                          {quiz.max_attempts === null
                            ? "Percobaan: Tak terbatas"
                            : `Percobaan: ${quiz.max_attempts}x`}
                        </Badge>
                        {quiz.created_at && (
                          <span>
                            Dibuat:{" "}
                            {new Date(quiz.created_at).toLocaleDateString("id-ID")}
                          </span>
                        )}
                      </div>
                      {scheduleLabel && (
                        <div className="rounded-md bg-gray-50 p-2 text-xs text-gray-600">
                          Batas waktu: {scheduleLabel}
                        </div>
                      )}
                      {quiz.kelas.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {quiz.kelas.map((kelas) => (
                            <Badge key={kelas.id} variant="secondary">
                              {kelas.nama}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onView(quiz)} title="Detail">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(quiz)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDelete(quiz.id)}
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500 text-center sm:text-left">
                Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, quizzes.length)} dari {quizzes.length} kuis
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </Button>
                <span className="text-xs font-medium px-2 min-w-[50px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizList;

