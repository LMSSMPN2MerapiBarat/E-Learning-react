import React from "react";
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
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import CreateSiswa from "@/Pages/Admin/Siswa/Create";
import EditSiswa from "@/Pages/Admin/Siswa/Edit";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";

interface Props {
  isAddOpen: boolean;
  setIsAddOpen: (v: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (v: boolean) => void;
  selectedStudent: any;
  handleAddSuccess: () => void;
  handleEditSuccess: () => void;
  deleteConfirm: number | null;
  setDeleteConfirm: (v: number | null) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (v: boolean) => void;
  selectedIds: number[];
  reloadStudents: () => void;
  setIsLoading: (v: boolean) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (v: boolean) => void;
  detailStudent: any | null;
}

export default function SiswaDialogs({
  isAddOpen,
  setIsAddOpen,
  isEditOpen,
  setIsEditOpen,
  selectedStudent,
  handleAddSuccess,
  handleEditSuccess,
  deleteConfirm,
  setDeleteConfirm,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedIds,
  reloadStudents,
  setIsLoading,
  isDetailOpen,
  setIsDetailOpen,
  detailStudent,
}: Props) {
  const handleDelete = () => {
    if (!deleteConfirm) return;
    setIsLoading(true);
    const toastId = toast.loading("Menghapus data siswa...");
    router.delete(`/admin/users/${deleteConfirm}`, {
      onSuccess: () => toast.success("Data siswa berhasil dihapus!", { id: toastId }),
      onError: () => toast.error("❌ Gagal menghapus data siswa.", { id: toastId }),
      onFinish: () => {
        reloadStudents();
        setIsLoading(false);
        setDeleteConfirm(null);
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setIsLoading(true);
    const toastId = toast.loading("Menghapus data siswa terpilih...");
    router.post("/admin/users/bulk-delete", { ids: selectedIds }, {
      forceFormData: true,
      onSuccess: () => toast.success(`${selectedIds.length} data siswa dihapus!`, { id: toastId }),
      onError: () => toast.error("❌ Gagal menghapus data siswa.", { id: toastId }),
      onFinish: () => {
        reloadStudents();
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <>
      {/* Detail */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl border-0 p-0 shadow-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="px-6 pt-6 text-2xl font-semibold">
              Detail Siswa
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {detailStudent ? (
              <div className="space-y-6 px-6 pb-6">
                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-2xl font-semibold text-gray-900">
                    {detailStudent.name ?? "-"}
                  </p>
                  <p className="text-sm text-gray-600">{detailStudent.email ?? "-"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detailStudent.jenis_kelamin && (
                      <Badge variant="secondary" className="capitalize">
                        {detailStudent.jenis_kelamin.replace("-", " ")}
                      </Badge>
                    )}
                    {detailStudent.kelas && (
                      <Badge variant="outline">{detailStudent.kelas}</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Informasi Siswa
                  </p>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { label: "NIS", value: detailStudent.nis ?? "-" },
                      { label: "No. Telepon", value: detailStudent.no_telp ?? "-" },
                      { label: "Tempat Lahir", value: detailStudent.tempat_lahir ?? "-" },
                      {
                        label: "Tanggal Lahir",
                        value: detailStudent.tanggal_lahir
                          ? new Date(detailStudent.tanggal_lahir).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "-",
                      },
                      { label: "Email", value: detailStudent.email ?? "-" },
                      { label: "Kelas", value: detailStudent.kelas ?? "-" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {item.label}
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="px-6 pb-6 text-center text-sm text-gray-500">
                Data siswa tidak tersedia.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Tambah */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent
          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Tambah Siswa Baru</DialogTitle>
          </DialogHeader>
          <CreateSiswa onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Data Siswa</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <EditSiswa
              student={selectedStudent}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Hapus tunggal */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Siswa</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus data siswa ini? Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-700">
                Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hapus massal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus {selectedIds.length} data siswa terpilih?
              <br />
              <span className="text-red-600 font-medium">
                Tindakan ini tidak dapat dibatalkan.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

