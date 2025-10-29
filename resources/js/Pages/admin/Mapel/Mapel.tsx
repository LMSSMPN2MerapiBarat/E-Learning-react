import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import AdminLayout from "@/Layouts/AdminLayout";
import CreateMapel from "./Create";
import EditMapel from "./Edit";

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

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === mapelList.length) setSelectedIds([]);
    else setSelectedIds(mapelList.map((m) => m.id));
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
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Mata Pelajaran</CardTitle>
            <CardDescription>Kelola daftar mata pelajaran dan guru pengajar</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteConfirm(true)}
                disabled={isBulkDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Hapus Terpilih ({selectedIds.length})
              </Button>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Tambah Mapel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
                </DialogHeader>
                <CreateMapel onSuccess={handleAddSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === mapelList.length && mapelList.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-2 text-left">Nama Mata Pelajaran</th>
                  <th className="p-2 text-left">Jumlah Guru</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mapelList.map((mapel) => (
                  <tr key={mapel.id} className="border-t">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(mapel.id)}
                        onChange={() => toggleSelect(mapel.id)}
                      />
                    </td>
                    <td className="p-2">{mapel.nama_mapel}</td>
                    <td className="p-2">{mapel.gurus_count ?? 0}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMapel(mapel);
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(mapel.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
                {mapelList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      Tidak ada data mata pelajaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Edit */}
      {isEditOpen && selectedMapel && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Mata Pelajaran</DialogTitle>
            </DialogHeader>
            <EditMapel
              mapel={selectedMapel}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog Konfirmasi Hapus Satu */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus data mata pelajaran ini? Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(deleteConfirm!)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Konfirmasi Bulk Delete */}
      <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} Mata Pelajaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus {selectedIds.length} data mata pelajaran yang dipilih?
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
