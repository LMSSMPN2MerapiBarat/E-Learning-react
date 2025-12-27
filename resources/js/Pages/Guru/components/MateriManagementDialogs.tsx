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

interface BankMateriItem {
  id: number;
  nama: string;
  deskripsi: string | null;
  file_name: string | null;
  file_url: string | null;
  file_mime: string | null;
  file_size: number | null;
  created_at: string;
}

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
  kelasMapelOptions?: Record<number, number[]>;
  bankMateris?: BankMateriItem[];
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
  kelasMapelOptions,
  bankMateris = [],
}) => (
  <>
    <Dialog open={isCreateOpen} onOpenChange={onCreateClose}>
      <DialogContent
        className="w-[95vw] max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden mx-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b bg-white shrink-0">
          <DialogTitle className="text-base">Unggah Materi Baru</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          <CreateMateri
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            kelasMapelOptions={kelasMapelOptions}
            bankMateris={bankMateris}
            onSuccess={onCreateSuccess}
            onCancel={onCreateClose}
          />
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={!!editItem} onOpenChange={onEditClose}>
      <DialogContent
        className="w-[95vw] max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden mx-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b bg-white shrink-0">
          <DialogTitle className="text-base">Edit Materi</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          {editItem && (
            <EditMateri
              materi={editItem}
              kelasOptions={kelasOptions}
              mapelOptions={mapelOptions}
              kelasMapelOptions={kelasMapelOptions}
              onSuccess={onEditSuccess}
              onCancel={onEditClose}
            />
          )}
        </div>
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
