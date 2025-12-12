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
import EditGuru from "@/Pages/Admin/Guru/Edit";

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
  // Hapus satu guru
  const handleDelete = () => {
    if (!deleteConfirm) return;
    router.delete(`/admin/guru/${deleteConfirm}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Data guru berhasil dihapus!");
        setDeleteConfirm(null);
        reloadGurus();
      },
      onError: () => toast.error("Gagal menghapus data guru."),
    });
  };

  // Hapus banyak guru
  const confirmBulkDelete = () => {
    setBulkDeleteConfirm(false);
    setIsBulkDeleting(true);
    const toastId = toast.loading("🗑️ Menghapus data guru...");

    router.delete("/admin/guru/bulk-delete", {
      data: { ids: selectedIds },
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Beberapa guru berhasil dihapus!", { id: toastId });
        reloadGurus();
      },
      onError: () => toast.error("Gagal menghapus beberapa data.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsBulkDeleting(false), 700),
    });
  };

  return (
    <>
      {/* Dialog Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto"
          onInteractOutside={(event) => event.preventDefault()}
        >
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

      {/* Dialog Hapus Satu */}
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

      {/* Dialog Bulk Delete */}
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

