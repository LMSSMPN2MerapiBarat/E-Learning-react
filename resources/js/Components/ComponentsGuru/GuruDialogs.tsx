import React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
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
import EditGuru from "@/Pages/admin/Guru/Edit";

export default function GuruDialogs({
  isEditOpen,
  setIsEditOpen,
  selectedGuru,
  handleEditSuccess,
  deleteConfirm,
  setDeleteConfirm,
  bulkDeleteConfirm,
  setBulkDeleteConfirm,
  selectedIds,
  reloadGurus,
  setIsBulkDeleting,
}: any) {
  const handleDelete = () => {
    if (!deleteConfirm) return;
    router.delete(`/admin/users/${deleteConfirm}`, {
      onSuccess: () => {
        toast.success("🗑️ Data guru berhasil dihapus!");
        setDeleteConfirm(null);
        reloadGurus();
      },
      onError: () => toast.error("❌ Gagal menghapus data guru."),
    });
  };

  const confirmBulkDelete = () => {
    setBulkDeleteConfirm(false);
    setIsBulkDeleting(true);
    const toastId = toast.loading("🗑️ Menghapus data guru...");

    router.post(
      "/admin/users/bulk-delete",
      { ids: selectedIds },
      {
        onSuccess: () => {
          toast.success("✅ Data guru berhasil dihapus!", { id: toastId });
          reloadGurus();
        },
        onError: () => toast.error("❌ Gagal menghapus beberapa data.", { id: toastId }),
        onFinish: () => setTimeout(() => setIsBulkDeleting(false), 700),
      }
    );
  };

  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Guru</DialogTitle>
          </DialogHeader>
          {selectedGuru && (
            <EditGuru
              guru={selectedGuru}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Hapus satu */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Guru</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus data guru ini? Tindakan ini tidak bisa dibatalkan.
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

      {/* Bulk delete */}
      <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} Guru</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus {selectedIds.length} data guru yang dipilih?  
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
