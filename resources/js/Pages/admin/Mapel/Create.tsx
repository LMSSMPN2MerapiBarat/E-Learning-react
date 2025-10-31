import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
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

export default function CreateMapel({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    nama_mapel: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    post("/admin/mapel", {
      onSuccess: () => {
        toast.success("Mata pelajaran berhasil ditambahkan!");
        reset();
        onSuccess();
      },
      onError: (formErrors) => {
        const message =
          formErrors.nama_mapel ?? "Gagal menambahkan mata pelajaran.";
        toast.error(message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nama Mata Pelajaran</Label>
        <Input
          value={data.nama_mapel}
          onChange={(e) => setData("nama_mapel", e.target.value)}
          required
        />
        {errors.nama_mapel && (
          <p className="text-red-600 text-sm">{errors.nama_mapel}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan"}
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
            <AlertDialogCancel disabled={processing}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={processing}>
              Ya, benar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
