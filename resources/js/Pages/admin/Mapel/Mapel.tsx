import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import MapelHeader from "@/Pages/admin/components/ComponentsMapel/MapelHeader";
import MapelTable from "@/Pages/admin/components/ComponentsMapel/MapelTable";
import MapelDialogs from "@/Pages/admin/components/ComponentsMapel/MapelDialogs";

export default function MapelPage() {
  const { props }: any = usePage();
  const initialMapel: any[] = props.mapels || [];

  const [mapelList, setMapelList] = useState(initialMapel);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const reloadMapel = () => {
    router.reload({
      only: ["mapels"],
      onSuccess: (page) => {
        setMapelList((page.props as any).mapels || []);
        setSelectedIds([]);
      },
    });
  };

  const handleAddSuccess = () => {
    toast.success("✅ Mata pelajaran berhasil ditambahkan!");
    setIsAddOpen(false);
    reloadMapel();
  };

  const handleEditSuccess = () => {
    toast.success("✏️ Data mata pelajaran berhasil diperbarui!");
    setIsEditOpen(false);
    reloadMapel();
  };

  const handleDelete = (id: number) => {
    router.delete(`/admin/mapel/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("🗑️ Mata pelajaran berhasil dihapus!");
        reloadMapel();
      },
      onError: () => toast.error("❌ Gagal menghapus mata pelajaran."),
    });
  };

  const confirmBulkDelete = () => {
    setBulkDeleteConfirm(false);
    setIsBulkDeleting(true);
    const toastId = toast.loading("🗑️ Menghapus data mata pelajaran...");

    router.delete("/admin/mapel/bulk-delete", {
      data: { ids: selectedIds },
      preserveScroll: true,
      onSuccess: () => {
        toast.success("✅ Beberapa mata pelajaran berhasil dihapus!", { id: toastId });
        reloadMapel();
      },
      onError: () => toast.error("❌ Gagal menghapus beberapa data.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsBulkDeleting(false), 700),
    });
  };

  return (
    <AdminLayout>
      <Head title="Kelola Mata Pelajaran" />

      {(isBulkDeleting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-3 animate-fade-in">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium">Menghapus data mapel...</p>
          </div>
        </div>
      )}

      <Card>
        <MapelHeader
          selectedIds={selectedIds}
          isBulkDeleting={isBulkDeleting}
          setBulkDeleteConfirm={setBulkDeleteConfirm}
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          onAddSuccess={handleAddSuccess}
        />
        <CardContent>
          <MapelTable
            mapelList={mapelList}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setSelectedMapel={setSelectedMapel}
            setIsEditOpen={setIsEditOpen}
            setDeleteConfirm={setDeleteConfirm}
          />
        </CardContent>
      </Card>

      <MapelDialogs
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        selectedMapel={selectedMapel}
        onEditSuccess={handleEditSuccess}
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        onDelete={handleDelete}
        bulkDeleteConfirm={bulkDeleteConfirm}
        setBulkDeleteConfirm={setBulkDeleteConfirm}
        selectedIds={selectedIds}
        onBulkDelete={confirmBulkDelete}
      />
    </AdminLayout>
  );
}
