import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Search, Upload, Download } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
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

export default function GuruPage() {
  const { props }: any = usePage();
  const initialGurus: any[] = props.gurus || [];
  const [guruList, setGuruList] = useState<any[]>(initialGurus);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false); // ✅ Tambahan untuk bulk delete
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // 🔁 Reload data guru
  const reloadGurus = () => {
    router.reload({
      only: ["gurus"],
      onSuccess: (page) => {
        const newGurus = (page.props as any).gurus || [];
        setGuruList(newGurus);
        setSelectedIds([]);
      },
    });
  };

  // 🗑️ Hapus satu guru
  const handleDelete = () => {
    if (!deleteConfirm) return;
    router.delete(`/admin/users/${deleteConfirm}`, {
      onSuccess: () => {
        toast.success("🗑️ Data guru berhasil dihapus!");
        setDeleteConfirm(null);
        reloadGurus();
      },
      onError: () => toast.error("❌ Gagal menghapus data guru."),
    });
  };

  // 🗑️ Konfirmasi & hapus banyak guru
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Pilih data guru yang ingin dihapus.");
      return;
    }
    setBulkDeleteConfirm(true); // ✅ Tampilkan dialog konfirmasi
  };

  const confirmBulkDelete = () => {
    setBulkDeleteConfirm(false);
    router.post(
      "/admin/users/bulk-delete",
      { ids: selectedIds },
      {
        onStart: () => toast.loading("Menghapus data guru..."),
        onSuccess: () => {
          toast.success("🗑️ Data guru berhasil dihapus!");
          setSelectedIds([]);
          reloadGurus();
        },
        onError: () => toast.error("❌ Gagal menghapus beberapa data."),
      }
    );
  };

  // ✅ Callback sukses tambah & edit
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

  // 📤 Import Excel
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

  // 📦 Export Excel
  const handleExport = () => {
    setIsLoading(true);
    const toastId = toast.loading("📦 Mengekspor data guru...");
    window.location.href = "/admin/users/export/guru";
    setTimeout(() => {
      toast.success("✅ File guru berhasil diekspor!", { id: toastId });
      setIsLoading(false);
    }, 1500);
  };

  // 🔍 Filter pencarian & mapel
  const filteredGurus = guruList.filter((guru) => {
    const matchSearch =
      guru.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.nip?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubject =
      selectedSubject === "all" ||
      guru.mapel?.toLowerCase() === selectedSubject.toLowerCase();
    return matchSearch && matchSubject;
  });

  // ✅ Checkbox seleksi
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredGurus.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredGurus.map((g) => g.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <AdminLayout>
      <Head title="Kelola Guru" />

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Guru</CardTitle>
            <CardDescription>
              Kelola data guru dan informasi pengajaran
            </CardDescription>
          </div>

          {/* 🧩 Tombol Aksi */}
          <div className="flex items-center gap-2">
            <input
              id="importFile"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("importFile")?.click()}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? "Mengimpor..." : "Import Excel"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Export Excel
            </Button>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Hapus Terpilih (
                {selectedIds.length})
              </Button>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Tambah Guru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Guru Baru</DialogTitle>
                </DialogHeader>
                <CreateGuru onSuccess={handleAddSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* 🔍 Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari nama, email, atau NIP guru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Mapel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mapel</SelectItem>
                <SelectItem value="Matematika">Matematika</SelectItem>
                <SelectItem value="IPA">IPA</SelectItem>
                <SelectItem value="IPS">IPS</SelectItem>
                <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 📋 Tabel Guru */}
          <div className="border rounded-lg overflow-x-auto bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredGurus.length &&
                        filteredGurus.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">NIP</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Mata Pelajaran</th>
                  <th className="p-3 text-left">No. Telepon</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredGurus.length > 0 ? (
                  filteredGurus.map((guru) => (
                    <tr key={guru.id} className="border-t">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(guru.id)}
                          onChange={() => toggleSelect(guru.id)}
                        />
                      </td>
                      <td className="p-3">{guru.name}</td>
                      <td className="p-3">{guru.nip || "-"}</td>
                      <td className="p-3">{guru.email}</td>
                      <td className="p-3">{guru.mapel || "-"}</td>
                      <td className="p-3">{guru.no_telp || "-"}</td>
                      <td className="p-3 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedGuru(guru);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(guru.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Tidak ada data guru yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ✏️ Dialog Edit Guru */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Guru</DialogTitle>
          </DialogHeader>
          {selectedGuru && (
            <EditGuru
              guru={selectedGuru}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ⚠️ Konfirmasi Hapus Satu */}
      <AlertDialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Guru</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus data guru ini? Tindakan ini tidak
              bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ⚠️ Konfirmasi Bulk Delete */}
      <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} Guru</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus {selectedIds.length} data guru
              yang dipilih? Tindakan ini tidak bisa dibatalkan.
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
