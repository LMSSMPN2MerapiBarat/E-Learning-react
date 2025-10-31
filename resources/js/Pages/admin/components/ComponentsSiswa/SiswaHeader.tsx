import React, { useRef, useState } from "react";
import { Upload, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
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
interface Props {
  selectedIds: number[];
  setIsAddOpen: (v: boolean) => void;
  setIsDeleteDialogOpen: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  reloadStudents: () => void;
  setSelectedIds: (v: number[]) => void;
}
export default function SiswaHeader({
  selectedIds,
  setIsAddOpen,
  setIsDeleteDialogOpen,
  setIsLoading,
  reloadStudents,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const resetImportState = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (!file) return;

    setSelectedFile(file);
    setIsConfirmOpen(true);
  };

  const performImport = () => {
    if (!selectedFile) return;
    const fileToUpload = selectedFile;

    setIsImporting(true);
    setIsLoading(true);
    setIsConfirmOpen(false);

    const toastId = toast.loading("📤 Mengimpor data siswa...");
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("role", "siswa");

    router.post("/admin/users/import", formData, {
      forceFormData: true,
      onSuccess: (page) => {
        const flashError = (page.props as any)?.flash?.error ?? null;
        if (flashError) {
          setErrorMessage(flashError);
          toast.error(flashError, { id: toastId });
        } else {
          toast.success("✅ Data siswa berhasil diimpor!", { id: toastId });
          reloadStudents();
        }
      },
      onError: (errors) => {
        const message =
          (errors && (errors.file || errors.role)) || "❌ Gagal mengimpor data siswa.";
        setErrorMessage(message);
        toast.error(message, { id: toastId });
      },
      onFinish: () => {
        setTimeout(() => {
          setIsImporting(false);
          setIsLoading(false);
        }, 700);
        resetImportState();
      },
    });
  };

  const handleCancelImport = () => {
    setIsConfirmOpen(false);
    if (!isImporting) {
      resetImportState();
    }
  };

  const handleExport = () => {
    setIsLoading(true);
    const toastId = toast.loading("📤 Mengekspor data siswa...");
    window.location.href = "/admin/users/export/siswa";
    setTimeout(() => {
      toast.success("✅ File berhasil diekspor!", { id: toastId });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          className="relative overflow-hidden w-full sm:w-auto"
          asChild
        >
          <label className="cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
            <input
              ref={fileInputRef}
              type="file"
              accept=".xls,.xlsx"
              onChange={handleSelectFile}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </Button>
        <Button
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Download className="w-4 h-4" /> Export
        </Button>
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Terpilih ({selectedIds.length})
          </Button>
        )}
        <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> Tambah
        </Button>
      </div>
      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open);
          if (!open && !isImporting) {
            resetImportState();
          }
        }}
      >
        <AlertDialogContent onInteractOutside={(event) => event.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Import Data</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin file{" "}
              <span className="font-semibold">{selectedFile?.name}</span> sudah
              benar dan siap diimpor?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelImport}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={performImport}>
              Ya, Import
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={!!errorMessage}
        onOpenChange={(open) => {
          if (!open) {
            setErrorMessage(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Gagal</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage ?? "Terjadi kesalahan saat mengimpor data siswa."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

