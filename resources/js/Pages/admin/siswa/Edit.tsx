import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";

interface Kelas {
  id: number;
  tingkat: string;
  nama_kelas: string;
  tahun_ajaran: string;
}

interface StudentData {
  id: number;
  name: string;
  email: string;
  kelas_id?: string;
  kelas?: string;
  no_telp: string;
  nis: string;
}

interface EditSiswaProps {
  student?: StudentData;
  onSuccess: (updatedStudent?: StudentData) => void;
  onCancel: () => void;
}

export default function EditSiswa({
  student,
  onSuccess,
  onCancel,
}: EditSiswaProps) {
  if (!student) {
    return <p className="text-gray-500 text-sm">Memuat data siswa...</p>;
  }

  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  // ✅ Sinkronkan kelas_id awal agar dropdown langsung menampilkan pilihan sebelumnya
  const [form, setForm] = useState({
    name: student.name || "",
    email: student.email || "",
    kelas_id: student.kelas_id ? String(student.kelas_id) : "",
    no_telp: student.no_telp || "",
    nis: student.nis || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/admin/kelas/list")
      .then((res) => res.json())
      .then((data) => setKelasList(data))
      .catch((err) => console.error("Gagal memuat kelas:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: Record<string, any> = {
      name: form.name,
      email: form.email,
      kelas_id: form.kelas_id || null,
      no_telp: form.no_telp,
      nis: form.nis,
      role: "siswa",
    };

    if (form.password.trim() !== "") {
      payload.password = form.password;
    }

    router.put(`/admin/users/${student.id}`, payload, {
      onSuccess: () => {
        setLoading(false);
        onSuccess({ ...student, ...form });
      },
      onError: (errors) => {
        console.error(errors);
        setLoading(false);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-lg shadow-sm"
    >
      <div>
        <Label>Nama</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Kelas</Label>
        <Select
          value={form.kelas_id} // ✅ menampilkan pilihan kelas sebelumnya
          onValueChange={(v) => setForm({ ...form, kelas_id: v })}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                form.kelas_id
                  ? kelasList.find((k) => String(k.id) === form.kelas_id)?.nama_kelas
                  : "Pilih kelas"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {kelasList.length > 0 ? (
              kelasList.map((k) => (
                <SelectItem key={k.id} value={String(k.id)}>
                  {k.tingkat} - {k.nama_kelas} ({k.tahun_ajaran})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Tidak ada kelas
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>NIS</Label>
        <Input
          value={form.nis}
          onChange={(e) => setForm({ ...form, nis: e.target.value })}
        />
      </div>

      <div>
        <Label>No. Telepon</Label>
        <Input
          value={form.no_telp}
          onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
        />
      </div>

      <div>
        <Label>Password (opsional)</Label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Kosongkan jika tidak ingin mengubah password"
        />
      </div>

      <div className="flex justify-end gap-2 pt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
