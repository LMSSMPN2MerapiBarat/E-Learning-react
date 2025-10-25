import React, { useState } from "react";
import { router } from "@inertiajs/react";
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
import { Loader2 } from "lucide-react";

export default function EditGuru({
  guru,
  onSuccess,
  onCancel,
}: {
  guru: any;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: guru.name || "",
    email: guru.email || "",
    mapel: guru.mapel || "",
    no_telp: guru.no_telp || "",
    nip: guru.nip || "",
    role: "guru",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    router.put(`/admin/users/${guru.id}`, form, {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nama Lengkap</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div>
        <Label>NIP</Label>
        <Input name="nip" value={form.nip} onChange={handleChange} required />
      </div>
      <div>
        
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Mata Pelajaran</Label>
        <Select
          value={form.mapel}
          onValueChange={(val) => setForm({ ...form, mapel: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih mata pelajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Matematika">Matematika</SelectItem>
            <SelectItem value="IPA">IPA</SelectItem>
            <SelectItem value="IPS">IPS</SelectItem>
            <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
            <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>No. Telepon</Label>
        <Input
          name="no_telp"
          value={form.no_telp}
          onChange={handleChange}
          required
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
