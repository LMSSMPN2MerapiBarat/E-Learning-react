import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { FileQuestion, Pencil, Trash2 } from "lucide-react";
import type { QuizItem } from "@/Pages/Guru/components/kuis/formTypes";

interface QuizListProps {
  quizzes: QuizItem[];
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

const QuizList: React.FC<QuizListProps> = ({ quizzes, onEdit, onDelete }) => (
  <div className="space-y-4">
    {quizzes.length === 0 ? (
      <Card>
        <CardContent className="py-12 text-center text-sm text-gray-500">
          Belum ada kuis yang dibuat.
        </CardContent>
      </Card>
    ) : (
      quizzes.map((quiz) => {
        const scheduleLabel = formatSchedule(
          quiz.available_from,
          quiz.available_until,
        );

        return (
          <Card key={quiz.id}>
            <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-1 gap-4">
                <div className="rounded-lg bg-green-100 p-2">
                  <FileQuestion className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-base font-semibold text-gray-800">
                    {quiz.judul}
                  </h3>
                  {quiz.deskripsi && (
                    <p className="text-sm text-gray-600">{quiz.deskripsi}</p>
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
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(quiz)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(quiz.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })
    )}
  </div>
);

export default QuizList;
