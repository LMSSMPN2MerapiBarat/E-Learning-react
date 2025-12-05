import { useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import {
  Download,
  Eye,
  FileText,
  Search,
  User,
  Calendar,
  PlayCircle,
  Youtube,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { MaterialItem } from "../types";

const getFileExtension = (
  fileName?: string | null,
  mimeType?: string | null,
): string | null => {
  if (fileName) {
    const parts = fileName.split(".");
    const ext = parts.pop();
    if (ext) {
      return ext.toLowerCase();
    }
  }

  if (mimeType) {
    const [, subtype] = mimeType.split("/");
    if (subtype) {
      return subtype.toLowerCase();
    }
  }

  return null;
};

const getFileBadgeClass = (extension: string | null) => {
  switch (extension) {
    case "pdf":
      return "bg-red-100 text-red-600 border-red-200";
    case "doc":
    case "docx":
      return "bg-blue-100 text-blue-600 border-blue-200";
    case "ppt":
    case "pptx":
      return "bg-orange-100 text-orange-600 border-orange-200";
    case "xls":
    case "xlsx":
      return "bg-green-100 text-green-600 border-green-200";
    case "mp4":
    case "mov":
      return "bg-purple-100 text-purple-600 border-purple-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

interface StudentMaterialBrowserProps {
  materials: MaterialItem[];
  subjects: string[];
}

const ITEMS_PER_PAGE = 6;

export default function StudentMaterialBrowser({
  materials,
  subjects,
}: StudentMaterialBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const subjectOptions = useMemo(() => {
    const unique = Array.from(new Set(subjects.filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b));
    return ["all", ...unique];
  }, [subjects]);

  const filteredMaterials = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return materials.filter((material) => {
      const subjectOk =
        subjectFilter === "all" || material.subject === subjectFilter;

      if (!subjectOk) {
        return false;
      }

      if (!term) {
        return true;
      }

      const pool = [
        material.title,
        material.description ?? "",
        material.teacher ?? "",
        material.subject ?? "",
        material.className ?? "",
      ];

      return pool.some((value) => value.toLowerCase().includes(term));
    });
  }, [materials, searchTerm, subjectFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
  const paginatedMaterials = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMaterials.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMaterials, currentPage]);

  // Reset page ketika filter berubah
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSubjectChange = (value: string) => {
    setSubjectFilter(value);
    setCurrentPage(1);
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Materi Pembelajaran</CardTitle>
        <CardDescription className="text-xs">
          Cari dan akses materi yang dibagikan guru sesuai kelas Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-64">
            <Input
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Cari judul, deskripsi, atau nama guru..."
              className="pl-8 text-xs h-8"
            />
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
          <Select
            value={subjectFilter}
            onValueChange={(value) => handleSubjectChange(value)}
          >
            <SelectTrigger className="w-full md:w-56 h-8 text-xs">
              <SelectValue placeholder="Semua mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((subject) => (
                <SelectItem key={subject} value={subject} className="text-xs">
                  {subject === "all" ? "Semua Mata Pelajaran" : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredMaterials.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-xs text-gray-500">
              <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              Tidak ada materi yang sesuai dengan pencarian.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {paginatedMaterials.map((material) => {
                const extension = getFileExtension(
                  material.fileName,
                  material.fileMime,
                );
                const documentBadgeClass = getFileBadgeClass(extension);
                const documentBadgeLabel = extension
                  ? extension.toUpperCase()
                  : "FILE";
                const dateLabel = formatDate(material.createdAt);
                const previewHref =
                  material.previewUrl ?? material.fileUrl ?? undefined;
                const downloadHref =
                  material.downloadUrl ?? material.fileUrl ?? undefined;
                const hasDocumentLinks = Boolean(previewHref || downloadHref);
                const hasVideoFile = Boolean(material.videoUrl);
                const hasYoutube = Boolean(material.youtubeEmbedUrl);

                return (
                  <Card
                    key={material.id}
                    className="overflow-hidden shadow-sm transition hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b bg-gradient-to-r from-white to-gray-50 p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-lg">
                          📚
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                            {material.title}
                          </h3>
                          <p className="text-[10px] text-gray-500 line-clamp-1">
                            {material.subject ?? "Materi Umum"}
                          </p>
                          {dateLabel && (
                            <p className="text-[10px] text-gray-400">{dateLabel}</p>
                          )}
                        </div>
                      </div>
                      {(hasVideoFile || hasYoutube) && (
                        <Badge className="shrink-0 border-pink-200 bg-pink-100 text-pink-600 text-[10px]">
                          Video
                        </Badge>
                      )}
                    </div>

                    <CardContent className="space-y-2 p-3">
                      {/* File info with buttons */}
                      {hasDocumentLinks && material.fileName && (
                        <div className="flex items-center justify-between rounded-md border bg-gray-50 p-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-[10px] text-gray-600">
                                {material.fileName}
                              </span>
                              <div className="flex items-center gap-1">
                                <Badge className={`${documentBadgeClass} border text-[9px] px-1.5`}>
                                  {documentBadgeLabel}
                                </Badge>
                                {material.fileSize && (
                                  <span className="text-[9px] text-gray-400">
                                    {(material.fileSize / (1024 * 1024)).toFixed(1)} MB
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" asChild disabled={!previewHref}>
                              <a href={previewHref} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-1 h-3 w-3" />
                                Lihat
                              </a>
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" asChild disabled={!downloadHref}>
                              <a href={downloadHref} download={material.fileName ?? undefined}>
                                <Download className="mr-1 h-3 w-3" />
                                Unduh
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* YouTube embed - smaller */}
                      {material.youtubeEmbedUrl && (
                        <div className="aspect-video max-h-36 w-full overflow-hidden rounded-md bg-black">
                          <iframe
                            src={`${material.youtubeEmbedUrl}?rel=0`}
                            title={`Video YouTube ${material.title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="h-full w-full"
                          />
                        </div>
                      )}

                      {/* Video file - smaller */}
                      {material.videoUrl && (
                        <video
                          controls
                          preload="metadata"
                          className="max-h-36 w-full rounded-md border border-gray-200"
                        >
                          <source src={material.videoUrl} />
                          Browser Anda tidak mendukung pemutaran video.
                        </video>
                      )}

                      {/* YouTube button */}
                      {material.youtubeUrl && (
                        <Button variant="outline" size="sm" className="h-6 w-full text-[10px]" asChild>
                          <a href={material.youtubeUrl} target="_blank" rel="noopener noreferrer">
                            <Youtube className="mr-1 h-3 w-3" />
                            Buka di YouTube
                          </a>
                        </Button>
                      )}

                      {/* No content fallback */}
                      {!hasDocumentLinks && !hasVideoFile && !material.youtubeUrl && (
                        <div className="flex items-center justify-center rounded-md border border-dashed py-4 text-[10px] text-gray-400">
                          Materi tidak tersedia
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {filteredMaterials.length > ITEMS_PER_PAGE && (
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
