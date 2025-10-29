import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.put(`/admin/mapel/${mapel.id}`, form, {
      onSuccess: () => {
        setLoading(false);
        onSuccess();
      },
      onError: () => setLoading(false),
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
    </form>
  );
}
