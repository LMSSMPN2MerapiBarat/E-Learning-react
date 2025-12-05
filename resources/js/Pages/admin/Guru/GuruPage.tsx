import React, { useMemo, useRef, useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Plus, Upload, Download, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
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
import CreateGuru from "./Create";
import EditGuru from "./Edit";
import AdminLayout from "@/Layouts/AdminLayout";
import GuruTable from "@/Pages/Admin/components/ComponentsGuru/GuruTable";
import GuruDialogs from "@/Pages/Admin/components/ComponentsGuru/GuruDialogs";

export default function GuruPage() {
  const { props }: any = usePage();
  const initialGurus: any[] = props.gurus || [];
  const mapelOptions: any[] = props.mapels || [];

  const [guruList, setGuruList] = useState(initialGurus);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isConfirmImportOpen, setIsConfirmImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const sortedGuruList = useMemo(() => {
    return [...guruList].sort((a, b) =>
      (a.name ?? "").localeCompare(b.name ?? "", "id", { sensitivity: "base" })
    );
  }, [guruList]);

  const reloadGurus = () => {
    router.reload({
      only: ["gurus"],
      onSuccess: (page) => {
        setGuruList((page.props as any).gurus || []);
        setSelectedIds([]);
      },
    });
  };

  // ✅ Tambah, edit, hapus
  const handleAddSuccess = () => {
    toast.success("Guru berhasil ditambahkan!");
    setIsAddOpen(false);
    reloadGurus();
  };
  const handleEditSuccess = () => {
    toast.success("Perubahan tersimpan", {
      description: "Data guru berhasil diperbarui.",
    });
    setIsEditOpen(false);
    reloadGurus();
  };

  // 📤 Import
  const handleSelectImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
    if (!file) return;
    setImportFile(file);
    setIsConfirmImportOpen(true);
  };

  const resetImportState = () => {
    setImportFile(null);
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  };

  const performImport = () => {
    if (!importFile) return;
    const fileToUpload = importFile;
    setIsLoading(true);
    const toastId = toast.loading("dY Mengimpor data guru...");
    setIsConfirmImportOpen(false);

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("role", "guru");

    router.post("/admin/users/import", formData, {
      forceFormData: true,
      onSuccess: (page) => {
        const flashError = (page.props as any)?.flash?.error ?? null;
        if (flashError) {
          setImportError(flashError);
          toast.error(flashError, { id: toastId });
        } else {
          toast.success("Data guru berhasil diimpor!", { id: toastId });
          reloadGurus();
        }
      },
      onError: (errors) => {
        const message =
          (errors && (errors.file || errors.role)) || "Gagal mengimpor data guru.";
        setImportError(message);
        toast.error(message, { id: toastId });
      },
      onFinish: () => {
        setTimeout(() => setIsLoading(false), 700);
        resetImportState();
      },
    });
  };

  const handleCancelImport = () => {
    setIsConfirmImportOpen(false);
    resetImportState();
  };

  // 📦 Export
  const handleExport = () => {
    setIsLoading(true);
    const toastId = toast.loading("📦 Mengekspor data guru...");
    window.location.href = "/admin/users/export/guru";
    setTimeout(() => {
      toast.success("File guru berhasil diekspor!", { id: toastId });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AdminLayout>
      <Head title="Kelola Guru" />

      {(isBulkDeleting || isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center space-y-2 animate-fade-in">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium text-sm">
              {isBulkDeleting ? "Menghapus data guru..." : "Sedang memproses data..."}
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle className="font-normal text-base">Data Guru</CardTitle>
            <CardDescription className="text-xs">Kelola data guru dan informasi pengajaran</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
            <input
              id="importFile"
              ref={importInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleSelectImport}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => importInputRef.current?.click()}
            >
              <Upload className="w-3 h-3 mr-1.5" /> Import Excel
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="w-full sm:w-auto"
            >
              <Download className="w-3 h-3 mr-1.5" /> Export Excel
            </Button>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteConfirm(true)}
                disabled={isBulkDeleting}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-3 h-3 mr-1.5" /> Hapus Terpilih ({selectedIds.length})
              </Button>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus className="w-3 h-3 mr-1.5" /> Tambah Guru
                </Button>
              </DialogTrigger>
              <DialogContent
                className="w-full max-w-3xl max-h-[85vh] overflow-y-auto"
                onInteractOutside={(event) => event.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Tambah Guru Baru</DialogTitle>
                </DialogHeader>
                <CreateGuru onSuccess={handleAddSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <GuruTable
            guruList={sortedGuruList}
            setSelectedGuru={setSelectedGuru}
            setIsEditOpen={setIsEditOpen}
            setDeleteConfirm={setDeleteConfirm}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            mapelOptions={mapelOptions}
          />
        </CardContent>
      </Card>

      <GuruDialogs
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        selectedGuru={selectedGuru}
        handleEditSuccess={handleEditSuccess}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        bulkDeleteConfirm={bulkDeleteConfirm}
        setBulkDeleteConfirm={setBulkDeleteConfirm}
        selectedIds={selectedIds}
        reloadGurus={reloadGurus}
        setIsBulkDeleting={setIsBulkDeleting}
      />

      <AlertDialog
        open={isConfirmImportOpen}
        onOpenChange={(open) => {
          setIsConfirmImportOpen(open);
          if (!open && !isLoading) {
            resetImportState();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Import Data</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin file{" "}
              <span className="font-semibold">{importFile?.name}</span> sudah
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
        open={!!importError}
        onOpenChange={(open) => {
          if (!open) {
            setImportError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Gagal</AlertDialogTitle>
            <AlertDialogDescription>
              {importError ?? "Terjadi kesalahan saat mengimpor data guru."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setImportError(null)}>
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}


