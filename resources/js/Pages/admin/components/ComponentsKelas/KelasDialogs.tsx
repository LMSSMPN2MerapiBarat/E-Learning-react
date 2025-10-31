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
import EditKelas from "@/Pages/admin/Kelas/Edit";

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
}) => {
  return (
    <>
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
