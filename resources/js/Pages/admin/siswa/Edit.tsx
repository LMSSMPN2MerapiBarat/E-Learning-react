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

interface Kelas {
  id: number;
  tingkat: string;
  kelas: string;
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
  if (!student) return null;

  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [form, setForm] = useState({
    name: student.name || "",
    email: student.email || "",
    kelas_id: student.kelas_id ? String(student.kelas_id) : "",
    no_telp: student.no_telp || "",
    nis: student.nis || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleNisChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, nis: digitsOnly });
  };

  const handleNameChange = (value: string) => {
    const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
    setForm({ ...form, name: lettersOnly });
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
    setForm({ ...form, no_telp: digitsOnly });
  };

  useEffect(() => {
    fetch("/admin/kelas/list")
      .then((res) => res.json())
      .then((data) => setKelasList(data))
      .catch((err) => console.error("Gagal memuat kelas:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
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
      onError: () => setLoading(false),
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
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Contoh: Andi Saputra"
          pattern="[A-Za-z\s]+"
          title="Nama hanya boleh berisi huruf dan spasi."
          required
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="contoh: siswa@sekolah.sch.id"
          required
        />
      </div>

      <div>
        <Label>Kelas</Label>
        <Select
          value={form.kelas_id}
          onValueChange={(v) => setForm({ ...form, kelas_id: v })}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                form.kelas_id
                  ? kelasList.find((k) => String(k.id) === form.kelas_id)?.kelas
                  : "Pilih kelas"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {kelasList.map((k) => (
              <SelectItem key={k.id} value={String(k.id)}>
                {k.tingkat} - {k.kelas} ({k.tahun_ajaran})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>NISN</Label>
        <Input
          value={form.nis}
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          minLength={10}
          onChange={(e) => handleNisChange(e.target.value)}
          placeholder="Masukkan 10 digit NISN"
        />
      </div>

      <div>
        <Label>No. Telepon</Label>
        <Input
          value={form.no_telp}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="Masukkan 9-12 digit nomor telepon"
          inputMode="numeric"
          pattern="[0-9]{9,12}"
          minLength={9}
          maxLength={12}
          title="No. telepon harus 9-12 digit angka."
        />
      </div>

      <div>
        <Label>Password (opsional)</Label>
        <Input
          type="password"
          minLength={8}
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
