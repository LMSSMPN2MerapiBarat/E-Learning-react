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
import CreateMateri from "@/Pages/Guru/Materi/Create";
import EditMateri from "@/Pages/Guru/Materi/Edit";
import type { Option } from "@/Pages/Guru/components/kuis/formTypes";
import type { MateriItem } from "@/Pages/Guru/components/materiTypes";

interface MateriManagementDialogsProps {
  isCreateOpen: boolean;
  onCreateClose: () => void;
  onCreateSuccess: () => void;
  editItem: MateriItem | null;
  onEditClose: () => void;
  onEditSuccess: () => void;
  deleteId: number | null;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  kelasOptions: Option[];
  mapelOptions: Option[];
}

const MateriManagementDialogs: React.FC<MateriManagementDialogsProps> = ({
  isCreateOpen,
  onCreateClose,
  onCreateSuccess,
  editItem,
  onEditClose,
  onEditSuccess,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel,
  kelasOptions,
  mapelOptions,
}) => (
  <>
    <Dialog open={isCreateOpen} onOpenChange={onCreateClose}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Unggah Materi Baru</DialogTitle>
        </DialogHeader>
        <CreateMateri
          kelasOptions={kelasOptions}
          mapelOptions={mapelOptions}
          onSuccess={onCreateSuccess}
          onCancel={onCreateClose}
        />
      </DialogContent>
    </Dialog>

    <Dialog open={!!editItem} onOpenChange={onEditClose}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Materi</DialogTitle>
        </DialogHeader>
        {editItem && (
          <EditMateri
            materi={editItem}
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            onSuccess={onEditSuccess}
            onCancel={onEditClose}
          />
        )}
      </DialogContent>
    </Dialog>

    <AlertDialog open={deleteId !== null} onOpenChange={onDeleteCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Materi</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus materi ini? Tindakan tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);

export default MateriManagementDialogs;
