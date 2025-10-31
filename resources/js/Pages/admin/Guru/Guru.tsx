import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Plus, Upload, Download, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import CreateGuru from "./Create";
import EditGuru from "./Edit";
import AdminLayout from "@/Layouts/AdminLayout";
import GuruTable from "@/Pages/admin/components/ComponentsGuru/GuruTable";
import GuruDialogs from "@/Pages/admin/components/ComponentsGuru/GuruDialogs";

export default function GuruPage() {
  const { props }: any = usePage();
  const initialGurus: any[] = props.gurus || [];

  const [guruList, setGuruList] = useState(initialGurus);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

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
    toast.success("✅ Guru berhasil ditambahkan!");
    setIsAddOpen(false);
    reloadGurus();
  };
  const handleEditSuccess = () => {
    toast.success("✏️ Data guru berhasil diperbarui!");
    setIsEditOpen(false);
    reloadGurus();
  };

  // 📤 Import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const toastId = toast.loading("📤 Mengimpor data guru...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", "guru");

    router.post("/admin/users/import", formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("✅ Data guru berhasil diimpor!", { id: toastId });
        reloadGurus();
      },
      onError: () => toast.error("❌ Gagal mengimpor data guru.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsLoading(false), 700),
    });
  };

  // 📦 Export
  const handleExport = () => {
    setIsLoading(true);
    const toastId = toast.loading("📦 Mengekspor data guru...");
    window.location.href = "/admin/users/export/guru";
    setTimeout(() => {
      toast.success("✅ File guru berhasil diekspor!", { id: toastId });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AdminLayout>
      <Head title="Kelola Guru" />

      {(isBulkDeleting || isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-3 animate-fade-in">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium">
              {isBulkDeleting ? "Menghapus data guru..." : "Sedang memproses data..."}
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Guru</CardTitle>
            <CardDescription>Kelola data guru dan informasi pengajaran</CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto md:justify-end">
            <input id="importFile" type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById("importFile")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" /> Import Excel
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteConfirm(true)}
                disabled={isBulkDeleting}
                className="w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Hapus Terpilih ({selectedIds.length})
              </Button>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" /> Tambah Guru
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-3xl max-h-[85vh] overflow-y-auto">
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
            guruList={guruList}
            setSelectedGuru={setSelectedGuru}
            setIsEditOpen={setIsEditOpen}
            setDeleteConfirm={setDeleteConfirm}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
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
    </AdminLayout>
  );
}
