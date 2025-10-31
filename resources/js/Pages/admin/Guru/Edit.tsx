import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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

// 🧩 Type definitions
type GuruType = {
  id: number;
  name: string;
  email: string;
  nip?: string;
  no_telp?: string;
  mapel_ids?: number[];
  kelas_ids?: number[];
};

type Mapel = {
  id: number;
  nama_mapel: string;
};

type Kelas = {
  id: number;
  tingkat?: string;
  kelas?: string;
};

interface EditGuruProps {
  guru: GuruType;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditGuru({ guru, onSuccess, onCancel }: EditGuruProps) {
  const [form, setForm] = useState<GuruType>({
    id: guru.id,
    name: guru.name || "",
    email: guru.email || "",
    nip: guru.nip || "",
    no_telp: guru.no_telp || "",
    mapel_ids: guru.mapel_ids || [],
    kelas_ids: guru.kelas_ids || [],
  });

  const [loading, setLoading] = useState(false);
  const [mapels, setMapels] = useState<Mapel[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 🔄 Ambil data mapel dari backend
  useEffect(() => {
    fetch("/admin/mapel/list")
      .then((res) => res.json())
      .then((data: Mapel[]) => setMapels(data))
      .catch(() => toast.error("Gagal memuat daftar mapel."));

    fetch("/admin/kelas/list")
      .then((res) => res.json())
      .then((data: Kelas[]) => setKelasList(data))
      .catch(() => toast.error("Gagal memuat daftar kelas."));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "nip") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 18);
      setForm({ ...form, nip: digitsOnly });
      return;
    }
    if (name === "no_telp") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
      setForm({ ...form, no_telp: digitsOnly });
      return;
    }
    if (name === "name") {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
      setForm({ ...form, name: lettersOnly });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleMapelSelect = (id: number) => {
    const selected = form.mapel_ids?.includes(id)
      ? form.mapel_ids.filter((m) => m !== id)
      : [...(form.mapel_ids || []), id];

    setForm({ ...form, mapel_ids: selected });
  };

  const handleKelasSelect = (id: number) => {
    const selected = form.kelas_ids?.includes(id)
      ? form.kelas_ids.filter((kelasId) => kelasId !== id)
      : [...(form.kelas_ids || []), id];

    setForm({ ...form, kelas_ids: selected });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    setLoading(true);

    router.put(`/admin/guru/${guru.id}`, form, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("✅ Data guru berhasil diperbarui!");
        setLoading(false);
        onSuccess();
      },
      onError: () => {
        toast.error("❌ Terjadi kesalahan saat memperbarui data.");
        setLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nama Lengkap</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap (huruf saja)"
            pattern="[A-Za-z\s]+"
            title="Nama hanya boleh berisi huruf dan spasi."
            required
          />
        </div>

        <div className="space-y-2">
          <Label>NIP</Label>
          <Input
            name="nip"
            value={form.nip}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern="[0-9]{18}"
            maxLength={18}
            minLength={18}
            placeholder="Masukkan 18 digit NIP"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>No. Telepon</Label>
          <Input
            name="no_telp"
            value={form.no_telp}
            onChange={handleChange}
            placeholder="Masukkan 9-12 digit nomor telepon"
            inputMode="numeric"
            pattern="[0-9]{9,12}"
            minLength={9}
            maxLength={12}
            title="No. telepon harus 9-12 digit angka."
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Mata Pelajaran (bisa pilih lebih dari satu)</Label>
        <div className="flex flex-wrap gap-2 rounded-md border p-2">
          {mapels.length === 0 && (
            <p className="text-sm text-gray-500">
              Tidak ada data mata pelajaran.
            </p>
          )}
          {mapels.map((m: Mapel) => (
            <button
              type="button"
              key={m.id}
              onClick={() => handleMapelSelect(m.id)}
              className={`rounded-md border px-3 py-1 text-sm transition ${
                form.mapel_ids?.includes(m.id)
                  ? "border-blue-700 bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {m.nama_mapel}
            </button>
          ))}
        </div>

        {form.mapel_ids && form.mapel_ids.length > 0 && (
          <p className="text-sm text-gray-500">
            Dipilih: {form.mapel_ids.length} mapel
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Kelas yang Diajar</Label>
        <div className="flex flex-wrap gap-2 rounded-md border p-2">
          {kelasList.map((kelas: Kelas) => {
            const namaKelas =
              `${kelas.tingkat ?? ""} ${kelas.kelas ?? ""}`.trim() ||
              kelas.kelas ||
              "Tanpa Nama";
            const isSelected = form.kelas_ids?.includes(kelas.id);

            return (
              <button
                type="button"
                key={kelas.id}
                onClick={() => handleKelasSelect(kelas.id)}
                className={`rounded-md border px-3 py-1 text-sm transition ${
                  isSelected
                    ? "border-blue-700 bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {namaKelas}
              </button>
            );
          })}
          {kelasList.length === 0 && (
            <p className="text-sm text-gray-500">Tidak ada data kelas.</p>
          )}
        </div>

        {form.kelas_ids && form.kelas_ids.length > 0 && (
          <p className="text-sm text-gray-500">
            Dipilih: {form.kelas_ids.length} kelas
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} type="button">
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
