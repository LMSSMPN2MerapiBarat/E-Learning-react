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
import CreateQuiz from "@/Pages/Guru/Kuis/Create";
import EditQuiz from "@/Pages/Guru/Kuis/Edit";
import type { Option, QuizItem } from "@/Pages/Guru/components/kuis/formTypes";

interface QuizManagementDialogsProps {
  isCreateOpen: boolean;
  onCreateClose: () => void;
  editItem: QuizItem | null;
  onEditClose: () => void;
  deleteId: number | null;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  kelasOptions: Option[];
  mapelOptions: Option[];
}

const QuizManagementDialogs: React.FC<QuizManagementDialogsProps> = ({
  isCreateOpen,
  onCreateClose,
  editItem,
  onEditClose,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel,
  kelasOptions,
  mapelOptions,
}) => (
  <>
    <Dialog open={isCreateOpen} onOpenChange={onCreateClose}>
      <DialogContent
        className="max-h-[90vh] max-w-3xl overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Buat Kuis Baru</DialogTitle>
        </DialogHeader>
        <CreateQuiz
          kelasOptions={kelasOptions}
          mapelOptions={mapelOptions}
          onSuccess={onCreateClose}
          onCancel={onCreateClose}
        />
      </DialogContent>
    </Dialog>

    <Dialog open={!!editItem} onOpenChange={onEditClose}>
      <DialogContent
        className="max-h-[90vh] max-w-3xl overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Kuis</DialogTitle>
        </DialogHeader>
        {editItem && (
          <EditQuiz
            quiz={editItem}
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            onSuccess={onEditClose}
            onCancel={onEditClose}
          />
        )}
      </DialogContent>
    </Dialog>

    <AlertDialog open={deleteId !== null} onOpenChange={onDeleteCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kuis</AlertDialogTitle>
          <AlertDialogDescription>
            Kuis akan dihapus permanen beserta seluruh pertanyaannya. Lanjutkan?
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

export default QuizManagementDialogs;
