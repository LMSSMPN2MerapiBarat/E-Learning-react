import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import KelasHeader from "@/Pages/admin/components/ComponentsKelas/KelasHeader";
import KelasTable from "@/Pages/admin/components/ComponentsKelas/KelasTable";
import KelasDialogs from "@/Pages/admin/components/ComponentsKelas/KelasDialogs";

export default function KelasPage() {
  const { props }: any = usePage();
  const initialKelas: any[] = props.kelas || [];

  const [kelasList, setKelasList] = useState(initialKelas);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const reloadKelas = () => {
    router.reload({
      only: ["kelas"],
      onSuccess: (page) => {
        setKelasList((page.props as any).kelas || []);
        setSelectedIds([]);
      },
    });
  };

  const handleAddSuccess = () => {
    toast.success("✅ Kelas berhasil ditambahkan!");
    setIsAddOpen(false);
    reloadKelas();
  };

  const handleEditSuccess = () => {
    toast.success("✏️ Data kelas berhasil diperbarui!");
    setIsEditOpen(false);
    reloadKelas();
  };

  const handleExport = () => {
    const toastId = toast.loading("Mengekspor data kelas...");
    const exportUrl =
      typeof route === "function"
        ? route("admin.kelas.export")
        : "/admin/kelas/export";

    window.location.href = exportUrl;
    setTimeout(() => {
      toast.success("File kelas berhasil diekspor!", { id: toastId });
    }, 1000);
  };

  const confirmBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal satu kelas yang ingin dihapus!");
      return;
    }
    setBulkDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    setBulkDeleteConfirm(false);
    setIsBulkDeleting(true);
    const toastId = toast.loading("🗑️ Menghapus kelas terpilih...");

    router.delete("/admin/kelas/bulk-delete", {
      data: { ids: selectedIds },
      onSuccess: () => {
        toast.success("✅ Kelas terpilih berhasil dihapus!", { id: toastId });
        reloadKelas();
      },
      onError: () =>
        toast.error("❌ Gagal menghapus data kelas.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsBulkDeleting(false), 700),
    });
  };

  const handleSingleDelete = (id: number) => {
    setDeleteConfirm(null);
    const toastId = toast.loading("🗑️ Menghapus kelas...");
    router.delete(`/admin/kelas/${id}`, {
      onSuccess: () => {
        toast.success("✅ Kelas berhasil dihapus!", { id: toastId });
        reloadKelas();
      },
      onError: () => toast.error("❌ Gagal menghapus kelas.", { id: toastId }),
    });
  };

  return (
    <AdminLayout>
      <Head title="Kelola Kelas" />

      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-8 py-6 shadow-xl">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="font-semibold text-gray-700">
              Menghapus {selectedIds.length} data kelas...
            </p>
          </div>
        </div>
      )}

      <Card>
        <KelasHeader
          selectedIds={selectedIds}
          isBulkDeleting={isBulkDeleting}
          onBulkDeleteRequest={confirmBulkDelete}
          onExport={handleExport}
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          onAddSuccess={handleAddSuccess}
        />
        <CardContent>
          <KelasTable
            kelasList={kelasList}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setSelectedKelas={setSelectedKelas}
            setIsEditOpen={setIsEditOpen}
            setDeleteConfirm={setDeleteConfirm}
          />
        </CardContent>
      </Card>

      <KelasDialogs
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        selectedKelas={selectedKelas}
        onEditSuccess={handleEditSuccess}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        onDelete={handleSingleDelete}
        bulkDeleteConfirm={bulkDeleteConfirm}
        setBulkDeleteConfirm={setBulkDeleteConfirm}
        selectedIds={selectedIds}
        onBulkDelete={handleBulkDelete}
      />
    </AdminLayout>
  );
}
