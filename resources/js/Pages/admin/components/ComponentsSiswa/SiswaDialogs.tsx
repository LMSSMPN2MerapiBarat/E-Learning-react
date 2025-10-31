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
import CreateSiswa from "@/Pages/admin/siswa/Create";
import EditSiswa from "@/Pages/admin/siswa/Edit";

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
}: Props) {
  const handleDelete = () => {
    if (!deleteConfirm) return;
    setIsLoading(true);
    const toastId = toast.loading("Menghapus data siswa...");
    router.delete(`/admin/users/${deleteConfirm}`, {
      onSuccess: () => toast.success("✅ Data siswa berhasil dihapus!", { id: toastId }),
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
      onSuccess: () => toast.success(`✅ ${selectedIds.length} data siswa dihapus!`, { id: toastId }),
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
      {/* Tambah */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent onInteractOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Tambah Siswa Baru</DialogTitle>
          </DialogHeader>
          <CreateSiswa onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onInteractOutside={(event) => event.preventDefault()}>
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
