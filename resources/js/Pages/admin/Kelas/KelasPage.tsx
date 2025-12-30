import React, { useMemo, useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import KelasHeader from "@/Pages/admin/components/ComponentsKelas/KelasHeader";
import KelasTable from "@/Pages/admin/components/ComponentsKelas/KelasTable";
import KelasDialogs from "@/Pages/admin/components/ComponentsKelas/KelasDialogs";
import ExportKelasDialog from "@/Pages/admin/components/ComponentsKelas/ExportKelasDialog";

const TINGKAT_ORDER: Record<string, number> = {
  "Kelas 7": 0,
  "Kelas 8": 1,
  "Kelas 9": 2,
};

const getTingkatOrder = (tingkat?: string) => {
  if (!tingkat) {
    return Number.MAX_SAFE_INTEGER;
  }
  const order = TINGKAT_ORDER[tingkat];
  return typeof order === "number" ? order : Number.MAX_SAFE_INTEGER;
};

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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const sortedKelasList = useMemo(() => {
    return [...kelasList].sort((a, b) => {
      const tingkatDiff = getTingkatOrder(a?.tingkat) - getTingkatOrder(b?.tingkat);
      if (tingkatDiff !== 0) {
        return tingkatDiff;
      }
      return (a?.kelas ?? "").localeCompare(b?.kelas ?? "", "id", {
        sensitivity: "base",
      });
    });
  }, [kelasList]);

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
    toast.success("Kelas berhasil ditambahkan!");
    setIsAddOpen(false);
    reloadKelas();
  };

  const handleEditSuccess = () => {
    toast.success("Perubahan tersimpan", {
      description: "Data kelas berhasil diperbarui.",
    });
    setIsEditOpen(false);
    reloadKelas();
  };

  const handleExport = () => {
    setIsExportOpen(true);
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
    const toastId = toast.loading("Menghapus kelas terpilih...");

    router.delete("/admin/kelas/bulk-delete", {
      data: { ids: selectedIds },
      onSuccess: () => {
        toast.success("Kelas terpilih berhasil dihapus!", { id: toastId });
        reloadKelas();
      },
      onError: () =>
        toast.error("Gagal menghapus data kelas.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsBulkDeleting(false), 700),
    });
  };

  const handleSingleDelete = (id: number) => {
    setDeleteConfirm(null);
    const toastId = toast.loading("Menghapus kelas...");
    router.delete(`/admin/kelas/${id}`, {
      onSuccess: () => {
        toast.success("Kelas berhasil dihapus!", { id: toastId });
        reloadKelas();
      },
      onError: () => toast.error("Gagal menghapus kelas.", { id: toastId }),
    });
  };

  const handleViewDetail = async (id: number) => {
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    setDetailData(null);

    try {
      const detailUrl =
        typeof route === "function"
          ? route("admin.kelas.detail", id)
          : `/admin/kelas/${id}/detail`;

      const response = await axios.get(detailUrl);
      setDetailData(response.data);
    } catch (error) {
      toast.error("Gagal memuat detail kelas.");
      setIsDetailOpen(false);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleCloseDetail = (open: boolean) => {
    setIsDetailOpen(open);
    if (!open) {
      setDetailData(null);
      setIsDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head title="Kelola Kelas" />

      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 rounded-xl bg-white px-6 py-4 shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="font-semibold text-gray-700 text-sm">
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
            kelasList={sortedKelasList}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setSelectedKelas={setSelectedKelas}
            setIsEditOpen={setIsEditOpen}
            setDeleteConfirm={setDeleteConfirm}
            onViewDetail={handleViewDetail}
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
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={handleCloseDetail}
        detailData={detailData}
        isDetailLoading={isDetailLoading}
      />

      <ExportKelasDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        kelasList={sortedKelasList}
        exportUrl="/admin/kelas/export"
      />
    </AdminLayout>
  );
}

