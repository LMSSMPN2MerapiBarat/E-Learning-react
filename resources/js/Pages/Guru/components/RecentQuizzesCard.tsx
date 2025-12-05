import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { RecentQuizItem } from "./dashboardHelpers";

const ITEMS_PER_PAGE = 5;

interface RecentQuizzesCardProps {
  items: RecentQuizItem[];
}

const RecentQuizzesCard: React.FC<RecentQuizzesCardProps> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kuis Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">Belum ada kuis yang dibuat.</p>
        )}
        {paginatedItems.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-lg border p-4 transition hover:bg-gray-50"
          >
            <h3 className="text-base font-medium text-gray-800">{quiz.judul}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {quiz.mapel && <Badge variant="outline">{quiz.mapel}</Badge>}
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
              <Badge variant="outline">{quiz.pertanyaan} Pertanyaan</Badge>
              {quiz.created_at && (
                <span>
                  {new Date(quiz.created_at).toLocaleDateString("id-ID")}
                </span>
              )}
            </div>
            {quiz.kelas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {quiz.kelas.map((kelas) => (
                  <Badge key={kelas} variant="secondary">
                    {kelas}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-gray-500">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, items.length)} dari {items.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentQuizzesCard;

