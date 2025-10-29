import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Plus, Download, Loader2, Trash2 } from "lucide-react";
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

  const confirmBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal satu mata pelajaran yang ingin dihapus!");
      return;
    }
    setBulkDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    setBulkDeleteConfirm(false);
    setIsBulkDeleting(true);
    const toastId = toast.loading("🗑️ Menghapus data terpilih...");

    router.delete("/admin/mapel/bulk-delete", {
      data: { ids: selectedIds },
      onSuccess: () => {
        toast.success("✅ Data berhasil dihapus!", { id: toastId });
        reloadMapel();
      },
      onError: () => toast.error("❌ Gagal menghapus data.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsBulkDeleting(false), 700),
    });
  };

  const handleSingleDelete = (id: number) => {
    setDeleteConfirm(null);
    const toastId = toast.loading("🗑️ Menghapus mata pelajaran...");
    router.delete(`/admin/mapel/${id}`, {
      onSuccess: () => {
        toast.success("✅ Mata pelajaran berhasil dihapus!", { id: toastId });
        reloadMapel();
      },
      onError: () => toast.error("❌ Gagal menghapus.", { id: toastId }),
    });
  };

  return (
    <AdminLayout>
      <Head title="Kelola Mata Pelajaran" />

      {isBulkDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-semibold">
              Menghapus {selectedIds.length} data...
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Mata Pelajaran</CardTitle>
            <CardDescription>Kelola data mata pelajaran sekolah</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button variant="destructive" onClick={confirmBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Terpilih
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
                  <th className="p-2 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === mapelList.length && mapelList.length > 0
                      }
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ? mapelList.map((m) => m.id) : []
                        )
                      }
                    />
                  </th>
                  <th className="p-2 text-left">Nama Mata Pelajaran</th>
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
                        onChange={(e) =>
                          setSelectedIds(
                            e.target.checked
                              ? [...selectedIds, mapel.id]
                              : selectedIds.filter((id) => id !== mapel.id)
                          )
                        }
                      />
                    </td>
                    <td className="p-2">{mapel.nama_mapel}</td>
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mata Pelajaran</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus mata pelajaran ini?{" "}
              <span className="text-red-600 font-semibold">Tindakan ini tidak dapat dibatalkan.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSingleDelete(deleteConfirm!)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
