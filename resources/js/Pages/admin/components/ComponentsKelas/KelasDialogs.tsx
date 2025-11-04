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
import EditKelas from "@/Pages/Admin/Kelas/Edit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Loader2 } from "lucide-react";
import { Input } from "@/Components/ui/input";

interface KelasDialogsProps {
  isEditOpen: boolean;
  setIsEditOpen: (value: boolean) => void;
  selectedKelas: any;
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

const KelasDialogs: React.FC<KelasDialogsProps> = ({
  isEditOpen,
  setIsEditOpen,
  selectedKelas,
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

  const students = detailData?.students ?? [];

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return students;
    }

    return students.filter((student: any) => {
      const pool = [
        student.name,
        student.email,
        student.nis,
        student.jenis_kelamin,
        student.no_telp,
      ];

      return pool.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      );
    });
  }, [searchTerm, students]);

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
        <DialogContent className="max-h-[85vh] w-full max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Kelas</DialogTitle>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="flex flex-col items-center gap-3 py-12 text-gray-600">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Memuat data kelas...</p>
            </div>
          ) : detailData ? (
            <div className="space-y-6">
              <div className="grid gap-4 rounded-lg border bg-gray-50 p-4 text-sm md:grid-cols-2">
                <div>
                  <p className="text-gray-500">Tingkat</p>
                  <p className="font-semibold text-gray-800">
                    {detailData.tingkat ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Nama Kelas</p>
                  <p className="font-semibold text-gray-800">
                    {detailData.kelas ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tahun Ajaran</p>
                  <p className="font-semibold text-gray-800">
                    {detailData.tahun_ajaran ?? "-"}
                  </p>
                </div>
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-gray-500">Jumlah Siswa</p>
                      <p className="font-semibold text-gray-800">
                        {detailData.siswa_count ?? 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Jumlah Pengajar</p>
                      <p className="font-semibold text-gray-800">
                      {detailData.guru_count ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Daftar Siswa
                    </h3>
                    <p className="text-sm text-gray-500">
                      Menampilkan {filteredStudents.length} dari{" "}
                      {students.length} siswa terdaftar pada kelas ini.
                    </p>
                    {students.length > 0 && (
                      <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Cari nama, email, NIS, atau kontak siswa..."
                        className="max-w-md"
                      />
                    )}
                  </div>

                {students.length > 0 ? (
                  <div className="rounded-lg border">
                    {filteredStudents.length > 0 ? (
                      <>
                        <div className="hidden overflow-x-auto md:block">
                          <Table className="min-w-[720px]">
                            <TableHeader>
                              <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>NIS</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>No. Telepon</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredStudents.map(
                                (student: any, index: number) => (
                                  <TableRow key={student.id ?? index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{student.name ?? "-"}</TableCell>
                                    <TableCell>{student.email ?? "-"}</TableCell>
                                    <TableCell>{student.nis ?? "-"}</TableCell>
                                    <TableCell>
                                      {student.jenis_kelamin
                                        ? student.jenis_kelamin.toUpperCase()
                                        : "-"}
                                    </TableCell>
                                    <TableCell>{student.no_telp ?? "-"}</TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="space-y-3 p-4 md:hidden">
                          {filteredStudents.map((student: any, index: number) => (
                            <div
                              key={student.id ?? index}
                              className="space-y-2 rounded-lg border p-3 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">
                                    No. {index + 1}
                                  </p>
                                  <p className="text-base font-semibold text-gray-900">
                                    {student.name ?? "-"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {student.email ?? "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="grid gap-1 text-xs text-gray-600">
                                <p>
                                  <span className="font-semibold">NIS:</span>{" "}
                                  {student.nis ?? "-"}
                                </p>
                                <p>
                                  <span className="font-semibold">Jenis Kelamin:</span>{" "}
                                  {student.jenis_kelamin
                                    ? student.jenis_kelamin.toUpperCase()
                                    : "-"}
                                </p>
                                <p>
                                  <span className="font-semibold">No. Telepon:</span>{" "}
                                  {student.no_telp ?? "-"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center text-sm text-gray-500">
                        Tidak ditemukan siswa yang cocok dengan pencarian.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center text-sm text-gray-500">
                    Belum ada siswa yang terdaftar pada kelas ini.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-gray-50 p-6 text-center text-sm text-gray-500">
              Data kelas tidak ditemukan.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isEditOpen && selectedKelas && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent
            className="max-w-md"
            onInteractOutside={(event) => event.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Edit Data Kelas</DialogTitle>
            </DialogHeader>
            <EditKelas
              kelas={selectedKelas}
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
            <AlertDialogTitle>Hapus Data Kelas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus kelas ini?{" "}
              <span className="font-semibold text-red-600">
                Tindakan ini tidak dapat dibatalkan.
              </span>
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
              Hapus {selectedIds.length} Kelas Terpilih
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-semibold text-red-600">
                {selectedIds.length}
              </span>{" "}
              data kelas? Tindakan ini tidak dapat dibatalkan.
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

export default KelasDialogs;

