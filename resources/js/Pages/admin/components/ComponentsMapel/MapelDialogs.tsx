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
import EditMapel from "@/Pages/admin/Mapel/Edit";

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
}) => {
  return (
    <>
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
