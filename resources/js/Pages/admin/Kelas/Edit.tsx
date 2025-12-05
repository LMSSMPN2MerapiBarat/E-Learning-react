import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/Components/ui/select";
import { Loader2 } from "lucide-react";
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

export default function EditKelas({
  kelas,
  onSuccess,
  onCancel,
}: {
  kelas: any;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    tingkat: kelas.tingkat,
    kelas: kelas.kelas,
    tahun_ajaran: kelas.tahun_ajaran,
  });
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (form.tingkat === "Kelas 7" && !form.kelas.startsWith("VII-"))
      setForm({ ...form, kelas: "VII-" });
    if (form.tingkat === "Kelas 8" && !form.kelas.startsWith("VIII-"))
      setForm({ ...form, kelas: "VIII-" });
    if (form.tingkat === "Kelas 9" && !form.kelas.startsWith("IX-"))
      setForm({ ...form, kelas: "IX-" });
  }, [form.tingkat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    setLoading(true);
    router.put(`/admin/kelas/${kelas.id}`, form, {
      onSuccess: () => {
        setLoading(false);
        onSuccess();
      },
      onError: (formErrors) => {
        setLoading(false);
        const message =
          formErrors?.kelas ?? "Gagal memperbarui data kelas.";
        let toastId: string | number;
        toastId = toast.error("Data tidak valid", {
          description: message,
          duration: 6000,
          dismissible: true,
          action: { label: "Tutup", onClick: () => toast.dismiss(toastId) },
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Tingkat</Label>
        <Select
          value={form.tingkat}
          onValueChange={(val) => setForm({ ...form, tingkat: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih Tingkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Kelas 7">Kelas 7</SelectItem>
            <SelectItem value="Kelas 8">Kelas 8</SelectItem>
            <SelectItem value="Kelas 9">Kelas 9</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Nama Kelas</Label>
        <Input
          value={form.kelas}
          onChange={(e) => setForm({ ...form, kelas: e.target.value })}
        />
      </div>

      <div>
        <Label>Tahun Ajaran</Label>
        <Input
          value={form.tahun_ajaran}
          onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-1.5 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel} type="button">
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
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
