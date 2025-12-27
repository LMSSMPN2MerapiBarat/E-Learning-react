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
import type { Option, QuizItem, AIQuota } from "@/Pages/Guru/components/kuis/formTypes";

interface QuizManagementDialogsProps {
  isCreateOpen: boolean;
  onCreateClose: () => void;
  onCreateSuccess: () => void;
  editItem: QuizItem | null;
  onEditClose: () => void;
  onEditSuccess: () => void;
  deleteId: number | null;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  kelasOptions: Option[];
  mapelOptions: Option[];
  kelasMapelOptions?: Record<number, number[]>;
  aiQuota: AIQuota;
}

const QuizManagementDialogs: React.FC<QuizManagementDialogsProps> = ({
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
  aiQuota,
}) => (
  <>
    <Dialog open={isCreateOpen} onOpenChange={onCreateClose}>
      <DialogContent
        className="max-h-[90vh] max-w-3xl flex flex-col p-0 gap-0 overflow-hidden"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b bg-white shrink-0">
          <DialogTitle>Buat Kuis Baru</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          <CreateQuiz
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            kelasMapelOptions={kelasMapelOptions}
            onSuccess={onCreateSuccess}
            onCancel={onCreateClose}
            aiQuota={aiQuota}
          />
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={!!editItem} onOpenChange={onEditClose}>
      <DialogContent
        className="max-h-[90vh] max-w-3xl flex flex-col p-0 gap-0 overflow-hidden"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b bg-white shrink-0">
          <DialogTitle>Edit Kuis</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          {editItem && (
            <EditQuiz
              quiz={editItem}
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
