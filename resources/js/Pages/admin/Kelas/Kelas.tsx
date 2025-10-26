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
import CreateKelas from "./Create";
import EditKelas from "./Edit";

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
    const toastId = toast.loading("📦 Mengekspor data kelas...");
    window.location.href = "/admin/kelas/export";
    setTimeout(() => {
      toast.success("✅ File kelas berhasil diekspor!", { id: toastId });
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
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-semibold">
              Menghapus {selectedIds.length} data kelas...
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Kelas</CardTitle>
            <CardDescription>
              Kelola data kelas, tingkat, dan tahun ajaran
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={confirmBulkDelete}
                disabled={isBulkDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Terpilih
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Tambah Kelas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Kelas Baru</DialogTitle>
                </DialogHeader>
                <CreateKelas onSuccess={handleAddSuccess} />
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
                        selectedIds.length === kelasList.length &&
                        kelasList.length > 0
                      }
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ? kelasList.map((k) => k.id) : []
                        )
                      }
                    />
                  </th>
                  <th className="p-2 text-left">Tingkat</th>
                  <th className="p-2 text-left">Nama Kelas</th>
                  <th className="p-2 text-left">Tahun Ajaran</th>
                  <th className="p-2 text-left">Jumlah Siswa</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kelasList.map((kelas) => (
                  <tr key={kelas.id} className="border-t">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(kelas.id)}
                        onChange={(e) =>
                          setSelectedIds(
                            e.target.checked
                              ? [...selectedIds, kelas.id]
                              : selectedIds.filter((id) => id !== kelas.id)
                          )
                        }
                      />
                    </td>
                    <td className="p-2">{kelas.tingkat}</td>
                    <td className="p-2">{kelas.nama_kelas}</td>
                    <td className="p-2">{kelas.tahun_ajaran}</td>
                    <td className="p-2 text-center">{kelas.siswa_count ?? 0}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedKelas(kelas);
                          setIsEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(kelas.id)}
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

      {isEditOpen && selectedKelas && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Data Kelas</DialogTitle>
            </DialogHeader>
            <EditKelas
              kelas={selectedKelas}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Kelas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus kelas ini? 
              <span className="text-red-600 font-semibold">
                {" "}Tindakan ini tidak dapat dibatalkan.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSingleDelete(deleteConfirm!)}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-700"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {selectedIds.length} Kelas Terpilih
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-semibold text-red-600">
                {selectedIds.length}
              </span>{" "}
              data kelas? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
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
