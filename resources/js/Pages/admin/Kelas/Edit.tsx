import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/Components/ui/select";
import { Loader2 } from "lucide-react";

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
    nama_kelas: kelas.nama_kelas,
    tahun_ajaran: kelas.tahun_ajaran,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.tingkat === "Kelas 7" && !form.nama_kelas.startsWith("VII-"))
      setForm({ ...form, nama_kelas: "VII-" });
    if (form.tingkat === "Kelas 8" && !form.nama_kelas.startsWith("VIII-"))
      setForm({ ...form, nama_kelas: "VIII-" });
    if (form.tingkat === "Kelas 9" && !form.nama_kelas.startsWith("IX-"))
      setForm({ ...form, nama_kelas: "IX-" });
  }, [form.tingkat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.put(`/admin/kelas/${kelas.id}`, form, {
      onSuccess: () => {
        onSuccess();
        setLoading(false);
      },
      onError: () => setLoading(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={form.nama_kelas}
          onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })}
        />
      </div>

      <div>
        <Label>Tahun Ajaran</Label>
        <Input
          value={form.tahun_ajaran}
          onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
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
    </form>
  );
}
