import React from "react";
import { Upload, Download, Plus, Trash2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

interface Props {
  selectedIds: number[];
  setIsAddOpen: (v: boolean) => void;
  setIsDeleteDialogOpen: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  reloadStudents: () => void;
  setSelectedIds: (v: number[]) => void;
}

export default function SiswaHeader({
  selectedIds,
  setIsAddOpen,
  setIsDeleteDialogOpen,
  setIsLoading,
  reloadStudents,
}: Props) {
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const toastId = toast.loading("📤 Mengimpor data siswa...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", "siswa");

    router.post("/admin/users/import", formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("✅ Data siswa berhasil diimpor!", { id: toastId });
        reloadStudents();
      },
      onError: () => toast.error("❌ Gagal mengimpor data siswa.", { id: toastId }),
      onFinish: () => setTimeout(() => setIsLoading(false), 700),
    });
  };

  const handleExport = () => {
    setIsLoading(true);
    const toastId = toast.loading("📦 Mengekspor data siswa...");
    window.location.href = "/admin/users/export/siswa";
    setTimeout(() => {
      toast.success("✅ File berhasil diekspor!", { id: toastId });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="relative overflow-hidden" asChild>
        <label className="cursor-pointer flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Import
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleImport}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </Button>

      <Button
        variant="outline"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" /> Export
      </Button>

      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Hapus Terpilih ({selectedIds.length})
        </Button>
      )}

      <Button onClick={() => setIsAddOpen(true)}>
        <Plus className="w-4 h-4 mr-2" /> Tambah
      </Button>
    </div>
  );
}
