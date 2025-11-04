import React, { useEffect, useMemo, useState } from "react";
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
import EditMapel from "@/Pages/Admin/Mapel/Edit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Loader2 } from "lucide-react";

interface MapelDialogsProps {
  isEditOpen: boolean;
  setIsEditOpen: (value: boolean) => void;
  selectedMapel: any;
  onEditSuccess: () => void;
  deleteConfirm: number | null;
  setDeleteConfirm: (value: number | null) => void;
  onDelete: (id: number) => void;
  bulkDeleteConfirm: boolean;
  setBulkDeleteConfirm: (value: boolean) => void;
  selectedIds: number[];
  onBulkDelete: () => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (value: boolean) => void;
  detailData: any | null;
  isDetailLoading: boolean;
}

const MapelDialogs: React.FC<MapelDialogsProps> = ({
  isEditOpen,
  setIsEditOpen,
  selectedMapel,
  onEditSuccess,
  deleteConfirm,
  setDeleteConfirm,
  onDelete,
  bulkDeleteConfirm,
  setBulkDeleteConfirm,
  selectedIds,
  onBulkDelete,
  isDetailOpen,
  setIsDetailOpen,
  detailData,
  isDetailLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const gurus = detailData?.gurus ?? [];

  const filteredGurus = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return gurus;
    }

    return gurus.filter((guru: any) => {
      const kelas = Array.isArray(guru.kelas) ? guru.kelas.join(" ") : "";
      const pool = [guru.name, guru.email, guru.no_telp, kelas];

      return pool.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      );
    });
  }, [gurus, searchTerm]);

  useEffect(() => {
    if (!isDetailOpen) {
      setSearchTerm("");
    }
  }, [isDetailOpen]);

  useEffect(() => {
    if (detailData) {
      setSearchTerm("");
    }
  }, [detailData?.id]);

  return (
    <>
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[85vh] w-full max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Mata Pelajaran</DialogTitle>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-600">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Memuat data mata pelajaran...</p>
            </div>
          ) : detailData ? (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-lg border bg-gray-50 p-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-gray-500">Nama Mata Pelajaran</p>
                  <p className="font-semibold text-gray-800">
                    {detailData.nama_mapel ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Total Guru Pengampu</p>
                  <p className="font-semibold text-gray-800">
                    {detailData.total_guru ?? 0}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Daftar Guru Pengampu
                  </h3>
                  <p className="text-sm text-gray-500">
                    Menampilkan {filteredGurus.length} dari {gurus.length} guru.
                  </p>
                  {gurus.length > 0 && (
                    <Input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Cari nama, email, atau kelas yang diajar..."
                      className="max-w-md"
                    />
                  )}
                </div>

                {gurus.length > 0 ? (
                  filteredGurus.length > 0 ? (
                    <div className="rounded-lg border">
                      <div className="hidden overflow-x-auto md:block">
                        <Table className="min-w-[680px]">
                          <TableHeader>
                            <TableRow>
                              <TableHead>No</TableHead>
                              <TableHead>Nama Guru</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>No. Telepon</TableHead>
                              <TableHead>Kelas Diampu</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredGurus.map((guru: any, index: number) => (
                              <TableRow key={guru.id ?? index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{guru.name ?? "-"}</TableCell>
                                <TableCell>{guru.email ?? "-"}</TableCell>
                                <TableCell>{guru.no_telp ?? "-"}</TableCell>
                                <TableCell>
                                  {Array.isArray(guru.kelas) && guru.kelas.length > 0
                                    ? guru.kelas.join(", ")
                                    : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="space-y-3 p-4 md:hidden">
                        {filteredGurus.map((guru: any, index: number) => (
                          <div
                            key={guru.id ?? index}
                            className="space-y-2 rounded-lg border p-3 shadow-sm"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                No. {index + 1}
                              </p>
                              <p className="text-base font-semibold text-gray-900">
                                {guru.name ?? "-"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {guru.email ?? "-"}
                              </p>
                            </div>
                            <div className="grid gap-1 text-xs text-gray-600">
                              <p>
                                <span className="font-semibold">No. Telepon:</span>{" "}
                                {guru.no_telp ?? "-"}
                              </p>
                              <p>
                                <span className="font-semibold">Kelas:</span>{" "}
                                {Array.isArray(guru.kelas) && guru.kelas.length > 0
                                  ? guru.kelas.join(", ")
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center text-sm text-gray-500">
                      Tidak ditemukan guru yang cocok dengan pencarian.
                    </div>
                  )
                ) : (
                  <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center text-sm text-gray-500">
                    Belum ada guru yang terhubung dengan mata pelajaran ini.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center text-sm text-gray-500">
              Data mata pelajaran tidak ditemukan.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isEditOpen && selectedMapel && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent
            className="max-w-md"
            onInteractOutside={(event) => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Edit Mata Pelajaran</DialogTitle>
            </DialogHeader>
            <EditMapel
              mapel={selectedMapel}
              onSuccess={onEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus data mata pelajaran ini? Tindakan
              ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && onDelete(deleteConfirm)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={bulkDeleteConfirm}
        onOpenChange={setBulkDeleteConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {selectedIds.length} Mata Pelajaran
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus {selectedIds.length} data mata
              pelajaran yang dipilih? Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onBulkDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Ya, Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MapelDialogs;

