import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

interface StudentData {
  id: number;
  name: string;
  email: string;
  kelas: string;
  no_telp: string;
  nis: string;
}

interface EditSiswaProps {
  student?: StudentData;
  onSuccess: (updatedStudent?: StudentData) => void;
  onCancel: () => void;
}

export default function EditSiswa({ student, onSuccess, onCancel }: EditSiswaProps) {
  if (!student) {
    return <p className="text-gray-500 text-sm">Memuat data siswa...</p>;
  }

  const [form, setForm] = useState<Omit<StudentData, 'id'>>({
    name: student.name || '',
    email: student.email || '',
    kelas: student.kelas || '',
    no_telp: student.no_telp || '',
    nis: student.nis || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✅ pastikan dikirim sebagai objek biasa (plain object)
    const payload = { ...form };

    router.put(`/admin/users/${student.id}`, payload as Record<string, any>, {
      onSuccess: () => {
        setLoading(false);
        onSuccess({ ...student, ...form }); // gabungkan data baru dengan lama
      },
      onError: (errors) => {
        console.error(errors);
        setLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="kelas">Kelas</Label>
        <Input
          id="kelas"
          value={form.kelas}
          onChange={(e) => setForm({ ...form, kelas: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="nis">NIS</Label>
        <Input
          id="nis"
          value={form.nis}
          onChange={(e) => setForm({ ...form, nis: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="no_telp">No. Telepon</Label>
        <Input
          id="no_telp"
          value={form.no_telp}
          onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
