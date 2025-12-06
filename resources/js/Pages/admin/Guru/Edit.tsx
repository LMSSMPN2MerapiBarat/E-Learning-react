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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

// 🧩 Type definitions
type GuruType = {
  id: number;
  name: string;
  email: string;
  jenis_kelamin?: string;
  nip?: string;
  no_telp?: string;
  mapel_ids?: number[];
  kelas_ids?: number[];
  kelas_mapel?: Record<number, number[]>; // { kelas_id: [mapel_ids] }
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
    jenis_kelamin: guru.jenis_kelamin || "",
    nip: guru.nip || "",
    no_telp: guru.no_telp || "",
    mapel_ids: guru.mapel_ids || [],
    kelas_ids: guru.kelas_ids || [],
    kelas_mapel: guru.kelas_mapel || {},
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "nip") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 18);
      setForm({ ...form, nip: digitsOnly });
      clearFieldError("nip");
      return;
    }
    if (name === "no_telp") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
      setForm({ ...form, no_telp: digitsOnly });
      clearFieldError("no_telp");
      return;
    }
    if (name === "name") {
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
      setForm({ ...form, name: lettersOnly });
      clearFieldError("name");
      return;
    }
    setForm({ ...form, [name]: value });
    clearFieldError(name);
  };

  const handleGenderChange = (value: string) => {
    setForm({ ...form, jenis_kelamin: value });
    clearFieldError("jenis_kelamin");
  };

  const handleMapelSelect = (id: number) => {
    const selected = form.mapel_ids?.includes(id)
      ? form.mapel_ids.filter((m) => m !== id)
      : [...(form.mapel_ids || []), id];

    setForm({ ...form, mapel_ids: selected });
  };

  const handleKelasSelect = (kelasId: number) => {
    const isSelected = form.kelas_ids?.includes(kelasId);
    let newKelasIds: number[];
    let newKelasMapel = { ...form.kelas_mapel };

    if (isSelected) {
      // Remove kelas and its mapel assignments
      newKelasIds = form.kelas_ids?.filter((id) => id !== kelasId) || [];
      delete newKelasMapel[kelasId];
    } else {
      // Add kelas with all selected mapel as default
      newKelasIds = [...(form.kelas_ids || []), kelasId];
      newKelasMapel[kelasId] = form.mapel_ids || [];
    }

    setForm({ ...form, kelas_ids: newKelasIds, kelas_mapel: newKelasMapel });
  };

  const handleKelasMapelToggle = (kelasId: number, mapelId: number) => {
    const currentMapels = form.kelas_mapel?.[kelasId] || [];
    const isSelected = currentMapels.includes(mapelId);

    const newMapels = isSelected
      ? currentMapels.filter((id) => id !== mapelId)
      : [...currentMapels, mapelId];

    setForm({
      ...form,
      kelas_mapel: {
        ...form.kelas_mapel,
        [kelasId]: newMapels,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    setLoading(true);
    setFieldErrors({});

    router.put(`/admin/guru/${guru.id}`, form, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        setFieldErrors({});
        onSuccess();
      },
      onError: (errors) => {
        const err = errors as Record<string, string>;
        setFieldErrors(err);
        const description =
          err?.nip ??
          err?.email ??
          "Terjadi kesalahan saat memperbarui data.";
        let toastId: string | number;
        toastId = toast.error("Data tidak valid", {
          description,
          duration: 6000,
          dismissible: true,
          action: { label: "Tutup", onClick: () => toast.dismiss(toastId) },
        });
        setLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
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

        <div className="space-y-1">
          <Label>Jenis Kelamin</Label>
          <Select
            value={form.jenis_kelamin ?? ""}
            onValueChange={handleGenderChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laki-laki">Laki-laki</SelectItem>
              <SelectItem value="perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
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
          {fieldErrors.nip && (
            <p className="text-red-500 text-sm">{fieldErrors.nip}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
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

      <div className="space-y-1">
        <Label className="text-xs">Mata Pelajaran (bisa pilih lebih dari satu)</Label>
        <div className="flex flex-wrap gap-1.5 rounded-md border p-1.5">
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
              className={`rounded-md border px-2 py-0.5 text-xs transition ${form.mapel_ids?.includes(m.id)
                ? "border-blue-700 bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {m.nama_mapel}
            </button>
          ))}
        </div>

        {form.mapel_ids && form.mapel_ids.length > 0 && (
          <p className="text-xs text-gray-500">
            Dipilih: {form.mapel_ids.length} mapel
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Kelas yang Diajar & Penugasan Mapel</Label>
        <div className="flex flex-wrap gap-1.5 rounded-md border p-1.5">
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
                className={`rounded-md border px-2 py-0.5 text-xs transition ${isSelected
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
          <p className="text-xs text-gray-500">
            Dipilih: {form.kelas_ids.length} kelas
          </p>
        )}

        {/* Mapel per Kelas Assignment */}
        {form.kelas_ids && form.kelas_ids.length > 0 && form.mapel_ids && form.mapel_ids.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-xs font-medium text-gray-700">
              Pilih mapel yang diajarkan di setiap kelas:
            </p>
            <div className="space-y-2 rounded-md border bg-gray-50 p-2">
              {form.kelas_ids.map((kelasId) => {
                const kelas = kelasList.find((k) => k.id === kelasId);
                const namaKelas = kelas
                  ? `${kelas.tingkat ?? ""} ${kelas.kelas ?? ""}`.trim() || kelas.kelas || "Tanpa Nama"
                  : `Kelas ${kelasId}`;
                const selectedMapelsForKelas = form.kelas_mapel?.[kelasId] || [];

                return (
                  <div key={kelasId} className="rounded-md border bg-white p-2">
                    <p className="mb-1.5 text-xs font-semibold text-gray-800">{namaKelas}</p>
                    <div className="flex flex-wrap gap-1">
                      {form.mapel_ids?.map((mapelId) => {
                        const mapel = mapels.find((m) => m.id === mapelId);
                        const isMapelSelected = selectedMapelsForKelas.includes(mapelId);

                        return (
                          <button
                            type="button"
                            key={mapelId}
                            onClick={() => handleKelasMapelToggle(kelasId, mapelId)}
                            className={`rounded border px-1.5 py-0.5 text-[11px] transition ${isMapelSelected
                              ? "border-green-600 bg-green-500 text-white"
                              : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                              }`}
                          >
                            {mapel?.nama_mapel || `Mapel ${mapelId}`}
                          </button>
                        );
                      })}
                    </div>
                    {selectedMapelsForKelas.length === 0 && (
                      <p className="mt-1 text-[10px] text-orange-600">
                        ⚠️ Belum ada mapel dipilih untuk kelas ini
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-1.5 pt-1">
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
