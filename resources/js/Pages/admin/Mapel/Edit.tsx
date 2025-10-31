import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
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

export default function EditMapel({
  mapel,
  onSuccess,
  onCancel,
}: {
  mapel: any;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    nama_mapel: mapel.nama_mapel || "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    setLoading(true);
    router.put(`/admin/mapel/${mapel.id}`, form, {
      onSuccess: () => {
        toast.success("Mata pelajaran berhasil diperbarui!");
        setLoading(false);
        onSuccess();
      },
      onError: (formErrors) => {
        setLoading(false);
        const message =
          formErrors?.nama_mapel ?? "Gagal memperbarui mata pelajaran.";
        toast.error(message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nama Mata Pelajaran</Label>
        <Input
          value={form.nama_mapel}
          onChange={(e) => setForm({ ...form, nama_mapel: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi penyimpanan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah data sudah benar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={loading}>
              Ya, benar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
