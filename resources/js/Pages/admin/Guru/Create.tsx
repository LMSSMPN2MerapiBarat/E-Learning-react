import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
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

export default function CreateGuru({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData, post, reset, processing, errors } = useForm({
    name: "",
    jenis_kelamin: "",
    nip: "",
    email: "",
    password: "",
    no_telp: "",
    mapel_ids: [] as number[],
    kelas_ids: [] as number[],
  });

  const [mapels, setMapels] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetch("/admin/mapel/list")
      .then((res) => res.json())
      .then((data) => setMapels(data))
      .catch(() => toast.error("Gagal memuat daftar mapel."));

    fetch("/admin/kelas/list")
      .then((res) => res.json())
      .then((data) => setKelasList(data))
      .catch(() => toast.error("Gagal memuat daftar kelas."));
  }, []);

  useEffect(() => {
    if (errors.nip) {
    }
  }, [errors.nip]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    post("/admin/guru", {
      onSuccess: () => {
        toast.success("Guru berhasil ditambahkan!");
        reset();
        onSuccess();
      },
      onError: (formErrors) => {
        const errors = formErrors as Record<string, string>;
        const message =
          errors?.nip ??
          errors?.email ??
          errors?.name ??
          "Gagal menambahkan guru.";
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

  const handleNameChange = (value: string) => {
    const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
    setData("name", lettersOnly);
  };

  const handleNipChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 18);
    setData("nip", digitsOnly);
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
    setData("no_telp", digitsOnly);
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-2">
      <div>
        <Label>Nama</Label>
        <Input
          placeholder="Masukkan nama lengkap (huruf saja)"
          value={data.name}
          onChange={(e) => handleNameChange(e.target.value)}
          pattern="[A-Za-z\s]+"
          title="Nama hanya boleh berisi huruf dan spasi."
          required
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <Label>Jenis Kelamin</Label>
        <Select
          value={data.jenis_kelamin}
          onValueChange={(value) => setData("jenis_kelamin", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis kelamin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="laki-laki">Laki-laki</SelectItem>
            <SelectItem value="perempuan">Perempuan</SelectItem>
          </SelectContent>
        </Select>
        {errors.jenis_kelamin && (
          <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>
        )}
      </div>

      <div>
        <Label>NIP</Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{18}"
          maxLength={18}
          placeholder="Masukkan 18 digit NIP"
          value={data.nip}
          onChange={(e) => handleNipChange(e.target.value)}
          required
        />
        {errors.nip && <p className="text-red-500 text-sm">{errors.nip}</p>}
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="email@sekolah.sch.id"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Minimal 8 karakter"
          minLength={8}
          autoComplete="new-password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div>
        <Label>No. Telepon</Label>
        <Input
          type="text"
          placeholder="Masukkan 9-12 digit nomor telepon"
          inputMode="numeric"
          pattern="[0-9]{9,12}"
          minLength={9}
          maxLength={12}
          value={data.no_telp}
          onChange={(e) => handlePhoneChange(e.target.value)}
          title="No. telepon harus 9-12 digit angka."
        />
        {errors.no_telp && (
          <p className="text-red-500 text-sm">{errors.no_telp}</p>
        )}
      </div>

      <div>
        <Label>Mata Pelajaran (bisa lebih dari satu)</Label>
        <div className="flex flex-wrap gap-2 rounded-md border p-2">
          {mapels.length === 0 && (
            <p className="text-sm text-gray-500">
              Tidak ada data mata pelajaran.
            </p>
          )}
          {mapels.map((m) => {
            const mapelId = m.id;
            const isSelected = data.mapel_ids.includes(mapelId);

            return (
              <button
                type="button"
                key={mapelId}
                onClick={() =>
                  setData(
                    "mapel_ids",
                    isSelected
                      ? data.mapel_ids.filter((id) => id !== mapelId)
                      : [...data.mapel_ids, mapelId]
                  )
                }
                className={`rounded-md border px-3 py-1 text-sm transition ${
                  isSelected
                    ? "border-blue-700 bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {m.nama_mapel}
              </button>
            );
          })}
        </div>
        {data.mapel_ids.length > 0 && (
          <p className="mt-1 text-sm text-gray-600">
            Dipilih: {data.mapel_ids.length} mapel
          </p>
        )}
      </div>

      <div>
        <Label>Kelas yang Diajar</Label>
        <div className="flex flex-wrap gap-2 border rounded-md p-2">
          {kelasList.length === 0 && (
            <p className="text-sm text-gray-500">Tidak ada data kelas.</p>
          )}
          {kelasList.map((kelas: any) => {
            const kelasId = kelas.id;
            const namaKelas = `${kelas.tingkat ?? ""} ${kelas.kelas ?? ""}`.trim() || kelas.kelas;
            const isSelected = data.kelas_ids.includes(kelasId);

            return (
              <button
                key={kelasId}
                type="button"
                onClick={() =>
                  setData(
                    "kelas_ids",
                    isSelected
                      ? data.kelas_ids.filter((id) => id !== kelasId)
                      : [...data.kelas_ids, kelasId]
                  )
                }
                className={`px-3 py-1 rounded-md border text-sm transition ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {namaKelas || "Tanpa Nama"}
              </button>
            );
          })}
        </div>
        {data.kelas_ids.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Dipilih: {data.kelas_ids.length} kelas
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
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
