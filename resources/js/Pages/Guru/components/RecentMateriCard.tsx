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
import {
  getFileExtension,
  getFileTypeColor,
  type RecentMateriItem,
} from "./dashboardHelpers";

const ITEMS_PER_PAGE = 5;

interface RecentMateriCardProps {
  items: RecentMateriItem[];
}

const RecentMateriCard: React.FC<RecentMateriCardProps> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Materi Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">Belum ada materi yang diunggah.</p>
        )}
        {paginatedItems.map((materi) => {
          const extension = getFileExtension(materi.file_name, materi.file_mime);
          const fileTypeLabel = extension ? extension.toUpperCase() : null;
          const fileTypeClass = extension
            ? getFileTypeColor(extension)
            : getFileTypeColor("default");

          return (
            <div
              key={materi.id}
              className="rounded-lg border p-4 transition hover:bg-gray-50"
            >
              <h3 className="text-base font-medium text-gray-800">
                {materi.judul}
              </h3>
              {materi.deskripsi && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {materi.deskripsi}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                {materi.mapel && (
                  <Badge variant="outline">{materi.mapel}</Badge>
                )}
                {materi.kelas && (
                  <Badge variant="outline">Kelas {materi.kelas}</Badge>
                )}
                {fileTypeLabel && (
                  <Badge className={fileTypeClass}>{fileTypeLabel}</Badge>
                )}
                {materi.created_at && (
                  <span>
                    {new Date(materi.created_at).toLocaleDateString("id-ID")}
                  </span>
                )}
                {materi.file_url && (
                  <a
                    href={materi.file_url}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {materi.file_name ?? "Unduh Materi"}
                  </a>
                )}
              </div>
            </div>
          );
        })}

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

export default RecentMateriCard;

