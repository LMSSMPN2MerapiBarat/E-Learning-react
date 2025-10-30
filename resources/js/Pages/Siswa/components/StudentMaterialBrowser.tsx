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
import { Download, Eye, FileText, Search, User, Calendar } from "lucide-react";
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

export default function StudentMaterialBrowser({
  materials,
  subjects,
}: StudentMaterialBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

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

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Materi Pembelajaran</CardTitle>
        <CardDescription>
          Cari dan akses materi yang dibagikan guru sesuai kelas Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-72">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari judul, deskripsi, atau nama guru..."
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <Select
            value={subjectFilter}
            onValueChange={(value) => setSubjectFilter(value)}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Semua mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject === "all" ? "Semua Mata Pelajaran" : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredMaterials.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-sm text-gray-500">
              <FileText className="mx-auto mb-3 h-10 w-10 text-gray-400" />
              Tidak ada materi yang sesuai dengan pencarian.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMaterials.map((material) => {
              const extension = getFileExtension(
                material.fileName,
                material.fileMime,
              );
              const badgeClass = getFileBadgeClass(extension);
              const dateLabel = formatDate(material.createdAt);
              const previewHref = material.previewUrl ?? material.fileUrl ?? undefined;
              const downloadHref = material.downloadUrl ?? material.fileUrl ?? undefined;

              return (
                <Card
                  key={material.id}
                  className="border-l-4 border-l-blue-500 shadow-sm transition hover:border-l-blue-600 hover:shadow-md"
                >
                  <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">
                        {material.title}
                      </h3>
                      {material.description && (
                        <p className="mt-1 text-sm text-gray-600">
                          {material.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {material.subject && (
                          <Badge variant="outline">{material.subject}</Badge>
                        )}
                        {material.className && (
                          <Badge variant="outline">
                            Kelas {material.className}
                          </Badge>
                        )}
                        <Badge className={`${badgeClass} border`}>
                          {extension ? extension.toUpperCase() : "FILE"}
                        </Badge>
                        {material.fileSize && (
                          <Badge variant="outline">
                            {(material.fileSize / (1024 * 1024)).toFixed(2)} MB
                          </Badge>
                        )}
                        {material.teacher && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {material.teacher}
                          </span>
                        )}
                        {dateLabel && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {dateLabel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-2 md:w-48">
                      {previewHref || downloadHref ? (
                        <>
                          <Button size="sm" asChild disabled={!previewHref}>
                            <a
                              href={previewHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-disabled={!previewHref}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Buka Materi
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild disabled={!downloadHref}>
                            <a
                              href={downloadHref}
                              download={downloadHref ? material.fileName ?? undefined : undefined}
                              aria-disabled={!downloadHref}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Unduh
                            </a>
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" disabled>
                          File tidak tersedia
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
