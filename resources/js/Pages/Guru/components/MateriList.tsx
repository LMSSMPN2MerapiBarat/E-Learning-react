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

import { Separator } from "@/Components/ui/separator";

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
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg sm:max-w-xl md:max-w-2xl max-h-[85vh] overflow-y-auto mx-auto p-0 gap-0">
          <DialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              Detail Materi
            </DialogTitle>
          </DialogHeader>

          <Separator />

          {detailItem && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    {detailItem.judul}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                    <Badge variant="secondary" className="font-normal text-gray-600">
                      <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                      {detailItem.mapel?.nama || "-"}
                    </Badge>
                    <Badge variant="secondary" className="font-normal text-gray-600">
                      <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                      Kelas {detailItem.kelas?.nama || "-"}
                    </Badge>
                    <Badge variant="secondary" className="font-normal text-gray-600">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      {detailItem.created_at
                        ? new Date(detailItem.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        : "-"}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                  {detailItem.deskripsi || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider text-[11px] sm:text-xs text-gray-500">
                  Lampiran & Media
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {/* File Materi */}
                  {detailItem.file_url ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors gap-3 group">
                      <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <FileIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {detailItem.file_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {getFileExtension(detailItem.file_name, detailItem.file_mime)?.toUpperCase()} • {formatFileSize(detailItem.file_size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8 text-xs" asChild>
                          <a href={detailItem.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Lihat
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-8 text-xs" asChild>
                          <a href={detailItem.file_url} download rel="noopener noreferrer">
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            Unduh
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {/* Video */}
                  {detailItem.video_url ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                          <Video className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {detailItem.video_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            VIDEO • {formatFileSize(detailItem.video_size)}
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full sm:w-auto h-8 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100" asChild>
                        <a href={detailItem.video_url} target="_blank" rel="noopener noreferrer">
                          <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
                          Putar Video
                        </a>
                      </Button>
                    </div>
                  ) : null}

                  {/* YouTube */}
                  {detailItem.youtube_url ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors gap-3">
                      <div className="flex items-start gap-3 min-w-0 w-full sm:w-auto">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
                          <Youtube className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            Video YouTube
                          </p>
                          <p className="text-xs text-blue-500 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                            {detailItem.youtube_url}
                          </p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full sm:w-auto h-8 text-xs bg-red-50 text-red-700 hover:bg-red-100 border-red-100" asChild>
                        <a href={detailItem.youtube_url} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="mr-1.5 h-3.5 w-3.5" />
                          Buka Tautan
                        </a>
                      </Button>
                    </div>
                  ) : null}

                  {!detailItem.file_url && !detailItem.video_url && !detailItem.youtube_url && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                      <p className="text-sm text-gray-500 italic">Tidak ada lampiran materi</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <Button variant="outline" className="h-9" onClick={() => setDetailItem(null)}>
                  Tutup
                </Button>
                <Button className="h-9" onClick={() => {
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


