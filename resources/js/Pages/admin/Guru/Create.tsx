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

export default function CreateGuru({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData, post, reset, processing, errors } = useForm({
    name: "",
    nip: "",
    email: "",
    password: "",
    no_telp: "",
    mapel_ids: [] as number[],
    kelas_ids: [] as number[],
  });

  const [mapels, setMapels] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/guru", {
      onSuccess: () => {
        toast.success("Guru berhasil ditambahkan!");
        reset();
        onSuccess();
      },
      onError: () => toast.error("Gagal menambahkan guru."),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 mt-2">
      <div>
        <Label>Nama</Label>
        <Input
          placeholder="Nama lengkap"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <Label>NIP</Label>
        <Input
          type="text"
          placeholder="Masukkan NIP"
          value={data.nip}
          onChange={(e) => setData("nip", e.target.value)}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="email@sekolah.sch.id"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Minimal 6 karakter"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
      </div>

      <div>
        <Label>No. Telepon</Label>
        <Input
          type="text"
          placeholder="Contoh: 081234567890"
          value={data.no_telp}
          onChange={(e) => setData("no_telp", e.target.value)}
        />
      </div>

      <div>
        <Label>Mata Pelajaran (bisa lebih dari satu)</Label>
        <Select
          onValueChange={(val) => {
            const id = parseInt(val);
            setData(
              "mapel_ids",
              data.mapel_ids.includes(id)
                ? data.mapel_ids.filter((m) => m !== id)
                : [...data.mapel_ids, id]
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih mata pelajaran" />
          </SelectTrigger>
          <SelectContent>
            {mapels.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.nama_mapel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {data.mapel_ids.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
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
    </form>
  );
}
