import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import axios from "axios";
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

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
    toast.success("Mata pelajaran berhasil ditambahkan!");
    setIsAddOpen(false);
    reloadMapel();
  };

  const handleEditSuccess = () => {
    toast.success("Data mata pelajaran berhasil diperbarui!");
    setIsEditOpen(false);
    reloadMapel();
  };

  const handleDelete = (id: number) => {
    router.delete(`/admin/mapel/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Mata pelajaran berhasil dihapus!");
        reloadMapel();
      },
      onError: () => toast.error("Gagal menghapus mata pelajaran."),
    });
  };

  const confirmBulkDelete = () => {
    setBulkDeleteConfirm(false);
    setIsBulkDeleting(true);
    const toastId = toast.loading("Menghapus data mata pelajaran...");

    router.delete("/admin/mapel/bulk-delete", {
      data: { ids: selectedIds },
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Beberapa mata pelajaran berhasil dihapus!", { id: toastId });
        reloadMapel();
      },
      onError: () => toast.error("Gagal menghapus beberapa data.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsBulkDeleting(false), 700),
    });
  };

  const handleViewDetail = async (id: number) => {
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    setDetailData(null);

    try {
      const detailUrl =
        typeof route === "function"
          ? route("admin.mapel.detail", id)
          : `/admin/mapel/${id}/detail`;

      const response = await axios.get(detailUrl);
      setDetailData(response.data);
    } catch (error) {
      toast.error("Gagal memuat detail mata pelajaran.");
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
      <Head title="Kelola Mata Pelajaran" />

      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center space-y-3 rounded-xl bg-white p-6 shadow-lg animate-fade-in">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="font-medium text-gray-700">Menghapus data mapel...</p>
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
            onViewDetail={handleViewDetail}
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
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={handleCloseDetail}
        detailData={detailData}
        isDetailLoading={isDetailLoading}
      />
    </AdminLayout>
  );
}
