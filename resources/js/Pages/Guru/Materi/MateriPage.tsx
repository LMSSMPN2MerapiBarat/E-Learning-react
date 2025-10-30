import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import { toast } from "sonner";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Badge } from "@/Components/ui/badge";
import { Plus, FileText, Download, Trash2, Pencil } from "lucide-react";
import CreateMateri from "./Create";
import EditMateri from "./Edit";

interface Option {
  id: number;
  nama: string;
}

interface MateriItem {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kelas_id?: number | null;
  kelas?: {
    id: number;
    nama: string;
    tingkat?: string | null;
  } | null;
  mata_pelajaran_id?: number | null;
  mapel?: {
    id: number;
    nama: string;
  } | null;
  file_name?: string | null;
  file_mime?: string | null;
  file_url?: string | null;
  created_at?: string | null;
}

interface MateriPageData {
  materis: MateriItem[];
  kelasOptions: Option[];
  mapelOptions: Option[];
}

interface MateriPageInertiaProps extends InertiaPageProps, MateriPageData {}

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

const getFileTypeColor = (extension: string) => {
  switch (extension) {
    case "pdf":
      return "bg-red-100 text-red-800";
    case "doc":
    case "docx":
      return "bg-blue-100 text-blue-800";
    case "ppt":
    case "pptx":
      return "bg-orange-100 text-orange-800";
    case "xls":
    case "xlsx":
      return "bg-emerald-100 text-emerald-800";
    case "txt":
      return "bg-green-100 text-green-800";
    case "zip":
    case "rar":
      return "bg-slate-200 text-slate-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function MateriPage() {
  const { materis, kelasOptions, mapelOptions } =
    usePage<MateriPageInertiaProps>().props;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<MateriItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMateri = useMemo(() => {
    if (!searchTerm) return materis;
    const lower = searchTerm.toLowerCase();
    return materis.filter((item) => {
      const kelasLabel = item.kelas?.nama?.toLowerCase() ?? "";
      const mapelLabel = item.mapel?.nama?.toLowerCase() ?? "";
      return (
        item.judul.toLowerCase().includes(lower) ||
        kelasLabel.includes(lower) ||
        mapelLabel.includes(lower)
      );
    });
  }, [materis, searchTerm]);

  const handleDelete = () => {
    if (!deleteId) return;

    router.delete(`/guru/materi/${deleteId}`, {
      onSuccess: () => {
        toast.success("Materi berhasil dihapus.");
        setDeleteId(null);
      },
      onError: () => toast.error("Terjadi kesalahan saat menghapus materi."),
    });
  };

  return (
    <TeacherLayout title="Kelola Materi Pembelajaran">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Materi Pembelajaran</CardTitle>
              <CardDescription>
                Unggah dan kelola materi yang dapat diakses oleh siswa di kelas
                yang Anda pilih.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="search"
                placeholder="Cari materi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Unggah Materi
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMateri.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Belum ada materi yang diunggah.</p>
                  <p className="text-sm">
                    Klik tombol &quot;Unggah Materi&quot; untuk menambahkan.
                  </p>
                </div>
              ) : (
                filteredMateri.map((materi) => {
                  const extension = getFileExtension(
                    materi.file_name,
                    materi.file_mime,
                  );
                  const fileTypeLabel = extension
                    ? extension.toUpperCase()
                    : "FILE";
                  const fileTypeClass = extension
                    ? getFileTypeColor(extension)
                    : getFileTypeColor("default");

                  return (
                    <Card
                      key={materi.id}
                      className="border hover:shadow-sm transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-800">
                                  {materi.judul}
                                </h3>
                                {materi.deskripsi && (
                                  <p className="mt-1 text-sm text-gray-600">
                                    {materi.deskripsi}
                                  </p>
                                )}
                                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                                  {materi.mapel?.nama && (
                                    <Badge variant="outline">
                                      {materi.mapel.nama}
                                    </Badge>
                                  )}
                                  {materi.kelas?.nama && (
                                    <Badge variant="outline">
                                      Kelas {materi.kelas.nama}
                                    </Badge>
                                  )}
                                  {extension && (
                                    <Badge className={fileTypeClass}>
                                      {fileTypeLabel}
                                    </Badge>
                                  )}
                                  {materi.created_at && (
                                    <span>
                                      Diunggah:{" "}
                                      {new Date(
                                        materi.created_at,
                                      ).toLocaleDateString("id-ID")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {materi.file_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={materi.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Unduh
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditItem(materi)}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteId(materi.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Unggah Materi Baru</DialogTitle>
          </DialogHeader>
          <CreateMateri
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            onSuccess={() => setIsCreateOpen(false)}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Materi</DialogTitle>
          </DialogHeader>
          {editItem && (
            <EditMateri
              materi={editItem}
              kelasOptions={kelasOptions}
              mapelOptions={mapelOptions}
              onSuccess={() => setEditItem(null)}
              onCancel={() => setEditItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Materi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus materi ini? Tindakan tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  );
}
