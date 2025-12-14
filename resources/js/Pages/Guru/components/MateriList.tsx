import React, { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  FileText,
  Download,
  Edit,
  Trash2,
  PlayCircle,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  BookOpen,
  GraduationCap,
  FileIcon,
  Video,
  Link as LinkIcon,
} from "lucide-react";
import type { MateriItem } from "@/Pages/Guru/components/materiTypes";
import { getFileExtension, getFileTypeColor } from "@/Pages/Guru/components/materiHelpers";

const ITEMS_PER_PAGE = 5;

interface MateriListProps {
  items: MateriItem[];
  onEdit: (materi: MateriItem) => void;
  onDelete: (id: number) => void;
}

// Helper untuk format ukuran file
const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MateriList: React.FC<MateriListProps> = ({ items, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [detailItem, setDetailItem] = useState<MateriItem | null>(null);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset ke halaman 1 jika items berubah dan currentPage melebihi totalPages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, totalPages, currentPage]);

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <FileText className="mx-auto mb-2 h-10 w-10 text-gray-400" />
            <p className="text-sm">Belum ada materi yang diunggah.</p>
            <p className="text-xs">
              Klik tombol "Unggah Materi" untuk menambahkan.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {paginatedItems.map((materi) => {
            const extension = getFileExtension(materi.file_name, materi.file_mime);
            const documentBadgeClass = extension
              ? getFileTypeColor(extension ?? "default")
              : getFileTypeColor("default");
            const documentBadgeLabel = extension
              ? extension.toUpperCase()
              : "FILE";
            const hasDocument = Boolean(materi.file_url);
            const hasVideoFile = Boolean(materi.video_url);
            const hasYoutube = Boolean(materi.youtube_url);

            return (
              <Card key={materi.id} className="border transition-shadow hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <div className="rounded-lg bg-blue-100 p-1.5">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-800">
                            {materi.judul}
                          </h3>
                          {materi.deskripsi && (
                            <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">
                              {materi.deskripsi}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-gray-500">
                            {materi.mapel?.nama && (
                              <Badge variant="outline">{materi.mapel.nama}</Badge>
                            )}
                            {materi.kelas?.nama && (
                              <Badge variant="outline">Kelas {materi.kelas.nama}</Badge>
                            )}
                            {hasDocument && (
                              <Badge className={documentBadgeClass}>{documentBadgeLabel}</Badge>
                            )}
                            {hasVideoFile && (
                              <Badge className="border-purple-200 bg-purple-100 text-purple-600">
                                Video
                              </Badge>
                            )}
                            {hasYoutube && (
                              <Badge className="border-red-200 bg-red-100 text-red-600">
                                YouTube
                              </Badge>
                            )}
                            {materi.created_at && (
                              <span>
                                Diunggah: {new Date(materi.created_at).toLocaleDateString("id-ID")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setDetailItem(materi)}
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Detail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => onDelete(materi.id)}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5 text-red-600" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500 text-center sm:text-left">
                Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, items.length)} dari {items.length} materi
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

      {/* Dialog Detail Materi */}
      <Dialog open={detailItem !== null} onOpenChange={() => setDetailItem(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Detail Materi
            </DialogTitle>
          </DialogHeader>

          {detailItem && (
            <div className="space-y-6">
              {/* Judul */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {detailItem.judul}
                </h3>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <BookOpen className="h-4 w-4" />
                  Deskripsi
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {detailItem.deskripsi || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
                </p>
              </div>

              {/* Kelas & Mata Pelajaran */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <GraduationCap className="h-4 w-4" />
                    Kelas
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {detailItem.kelas?.nama || <span className="italic text-gray-400">-</span>}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <BookOpen className="h-4 w-4" />
                    Mata Pelajaran
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {detailItem.mapel?.nama || <span className="italic text-gray-400">-</span>}
                  </p>
                </div>
              </div>

              {/* File Materi */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileIcon className="h-4 w-4" />
                  File Materi
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {detailItem.file_url ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{detailItem.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {getFileExtension(detailItem.file_name, detailItem.file_mime)?.toUpperCase()} • {formatFileSize(detailItem.file_size)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={detailItem.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={detailItem.file_url} download rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Unduh
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">Tidak ada file</p>
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Video className="h-4 w-4" />
                  Video
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {detailItem.video_url ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{detailItem.video_name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(detailItem.video_size)}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={detailItem.video_url} target="_blank" rel="noopener noreferrer">
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Putar
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">Tidak ada video</p>
                  )}
                </div>
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Youtube className="h-4 w-4" />
                  Tautan YouTube
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {detailItem.youtube_url ? (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-blue-600 truncate flex-1">{detailItem.youtube_url}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={detailItem.youtube_url} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Buka
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">Tidak ada tautan YouTube</p>
                  )}
                </div>
              </div>

              {/* Tanggal Upload */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Tanggal Diunggah
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {detailItem.created_at
                    ? new Date(detailItem.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    : <span className="italic text-gray-400">-</span>}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailItem(null)}>
                  Tutup
                </Button>
                <Button onClick={() => {
                  onEdit(detailItem);
                  setDetailItem(null);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Materi
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MateriList;


