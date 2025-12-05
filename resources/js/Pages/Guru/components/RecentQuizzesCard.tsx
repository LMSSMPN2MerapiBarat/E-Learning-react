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
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Kuis Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && (
          <p className="text-xs text-gray-500">Belum ada kuis yang dibuat.</p>
        )}
        {paginatedItems.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-lg border p-3 transition hover:bg-gray-50"
          >
            <h3 className="text-sm font-medium text-gray-800">{quiz.judul}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
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
              <div className="mt-2 flex flex-wrap gap-1.5">
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
          <div className="flex items-center justify-between border-t pt-3">
            <p className="text-xs text-gray-500">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, items.length)} dari {items.length}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs font-medium">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentQuizzesCard;

