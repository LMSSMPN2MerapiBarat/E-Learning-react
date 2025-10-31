import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  getFileExtension,
  getFileTypeColor,
  type RecentMateriItem,
} from "./dashboardHelpers";

interface RecentMateriCardProps {
  items: RecentMateriItem[];
}

const RecentMateriCard: React.FC<RecentMateriCardProps> = ({ items }) => (
  <Card>
    <CardHeader>
      <CardTitle>Materi Terbaru</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-gray-500">Belum ada materi yang diunggah.</p>
      )}
      {items.map((materi) => {
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
    </CardContent>
  </Card>
);

export default RecentMateriCard;
