import React, { useRef, useState } from "react";
import { Upload, Download, Plus, Trash, Trash2, FileSpreadsheet } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

interface Props {
  selectedIds: number[];
  setIsAddOpen: (v: boolean) => void;
  setIsDeleteDialogOpen: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  reloadStudents: () => void;
  setSelectedIds: (v: number[]) => void;
  hasStudents: boolean;
}

export default function SiswaHeader({
  selectedIds,
  setIsAddOpen,
  setIsDeleteDialogOpen,
  setIsLoading,
  reloadStudents,
  setSelectedIds,
  hasStudents,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const resetImportState = () => {
    setSelectedFile(null);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // File selection handler (both click and drag-drop)
  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const validExtensions = ['.xlsx', '.xls'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      toast.error("Format file tidak valid. Gunakan file Excel (.xlsx atau .xls)");
      return;
    }

    setSelectedFile(file);
    setIsImportModalOpen(false);
    setIsConfirmOpen(true);
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    handleFileSelect(file ?? null);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file ?? null);
  };

  const performImport = () => {
    if (!selectedFile) return;
    const fileToUpload = selectedFile;

    setIsImporting(true);
    setIsLoading(true);
    setIsConfirmOpen(false);

    const toastId = toast.loading("Mengimpor data siswa...");
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("role", "siswa");

    router.post("/admin/users/import", formData, {
      forceFormData: true,
      onSuccess: (page) => {
        const flashError = (page.props as any)?.flash?.error ?? null;
        const importSummary = (page.props as any)?.flash?.import_summary ?? null;

        // Debug log
        console.log('Import Summary:', importSummary);

        if (flashError) {
          setErrorMessage(flashError);
          toast.error(flashError, { id: toastId });
        } else {
          const created = importSummary?.created ?? 0;
          const skipped = importSummary?.skipped ?? 0;
          const notes = importSummary?.notes ?? [];

          // Show toast based on results
          if (created > 0 && skipped === 0) {
            // All data imported successfully
            toast.success(`${created} data siswa berhasil diimpor!`, { id: toastId });
          } else if (created > 0 && skipped > 0) {
            // Some imported, some skipped
            toast.success(`${created} data siswa berhasil diimpor!`, { id: toastId });
          } else if (created === 0 && skipped > 0) {
            // All data skipped
            toast.dismiss(toastId);
          } else {
            // No data processed
            toast.info('Tidak ada data yang diproses.', { id: toastId });
          }

          // Show warning toast for skipped data
          if (skipped > 0) {
            const skippedNotes = notes as Array<{ row: any; reason: string }>;
            const duplicateMessages = skippedNotes
              .map((note) => {
                const nama = note.row?.nama || note.row?.Nama || 'Tidak diketahui';
                const reason = note.reason.includes('NIS')
                  ? 'NIS sudah terdaftar'
                  : note.reason.includes('Email')
                    ? 'Email sudah terdaftar'
                    : note.reason;
                return `• ${nama}: ${reason}`;
              });

            if (duplicateMessages.length > 0) {
              toast.warning(
                `${skipped} data dilewati`,
                {
                  description: duplicateMessages.slice(0, 5).join('\n') +
                    (duplicateMessages.length > 5 ? `\n... dan ${duplicateMessages.length - 5} lainnya` : ''),
                  duration: 8000,
                }
              );
            } else {
              toast.warning(`${skipped} data dilewati karena sudah terdaftar.`, {
                duration: 5000,
              });
            }
          }

          reloadStudents();
        }
      },
      onError: (errors) => {
        const message =
          (errors && (errors.file || errors.role)) || "Gagal mengimpor data siswa.";
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
    const toastId = toast.loading("Mengekspor data siswa...");
    window.location.href = "/admin/users/export/siswa";
    setTimeout(() => {
      toast.success("File berhasil diekspor!", { id: toastId });
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteAll = () => {
    setIsClearingAll(true);
    setIsLoading(true);

    router.delete("/admin/siswa/delete-all", {
      preserveScroll: true,
      onSuccess: (page) => {
        const flash = (page.props as any)?.flash ?? {};
        if (flash.success) {
          toast.success(flash.success);
        } else if (flash.info) {
          toast.info(flash.info);
        } else {
          toast.success("Semua data siswa berhasil dihapus.");
        }
        setSelectedIds([]);
        reloadStudents();
        setIsDeleteAllOpen(false);
      },
      onError: () => {
        toast.error("Gagal menghapus semua data siswa.");
      },
      onFinish: () => {
        setTimeout(() => setIsLoading(false), 400);
        setIsClearingAll(false);
      },
    });
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = "/admin/users/template/siswa"}
          className="w-full sm:w-auto"
        >
          <Download className="w-3 h-3 mr-1.5" /> Download Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto border-green-400 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
          onClick={() => setIsImportModalOpen(true)}
        >
          <Upload className="w-3 h-3 mr-1.5" /> Import Excel
        </Button>
        <Button
          variant="outline"
          onClick={handleExport}
          className="flex items-center gap-2 w-full sm:w-auto border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        >
          <Download className="w-3 h-3" /> Export
        </Button>
        {hasStudents && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteAllOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
            disabled={isClearingAll}
          >
            <Trash className="w-3 h-3" />
            Hapus Semua
          </Button>
        )}
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Trash2 className="w-3 h-3" />
            Hapus Terpilih ({selectedIds.length})
          </Button>
        )}
        <Button size="sm" onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-3 h-3 mr-1.5" /> Tambah
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
        <AlertDialogContent>
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
        open={isDeleteAllOpen}
        onOpenChange={(open) => {
          if (!isClearingAll) {
            setIsDeleteAllOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Semua Data Siswa</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus seluruh data siswa beserta akun
              penggunanya. Langkah ini tidak dapat dibatalkan. Apakah Anda yakin
              ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearingAll}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-red-600 hover:bg-red-700"
              disabled={isClearingAll}
            >
              {isClearingAll ? "Menghapus..." : "Ya, Hapus Semua"}
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

      {/* Import Modal with Drag & Drop */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Import Data Siswa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center
                transition-all duration-200 cursor-pointer
                ${isDragOver
                  ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleSelectFile}
              />
              <div className="flex flex-col items-center gap-3">
                <div className={`
                  p-4 rounded-full transition-colors duration-200
                  ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  <Upload className={`
                    w-8 h-8 transition-colors duration-200
                    ${isDragOver ? 'text-blue-600' : 'text-gray-500'}
                  `} />
                </div>
                <div>
                  <p className={`
                    font-medium transition-colors duration-200
                    ${isDragOver ? 'text-blue-700' : 'text-gray-700'}
                  `}>
                    {isDragOver ? 'Lepas file di sini...' : 'Drag & drop file Excel di sini'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    atau <span className="text-blue-600 font-medium">klik untuk memilih file</span>
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Format yang didukung: .xlsx, .xls
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/admin/users/template/siswa"}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download Template
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImportModalOpen(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
