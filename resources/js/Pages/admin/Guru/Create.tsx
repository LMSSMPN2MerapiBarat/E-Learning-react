import React from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function CreateGuru({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData, post, reset, processing, errors } = useForm({
    name: "",
    nip: "",
    email: "",
    password: "",
    no_telp: "",
    role: "guru", // wajib dikirim
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/users", {
      onSuccess: () => {
        toast.success("Guru berhasil ditambahkan!");
        reset();
        onSuccess(); // tutup modal + reload data
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
        {errors.nip && <p className="text-red-500 text-sm">{errors.nip}</p>}
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="email@sekolah.sch.id"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Minimal 6 karakter"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div>
        <Label>No. Telepon</Label>
        <Input
          type="text"
          placeholder="Contoh: 081234567890"
          value={data.no_telp}
          onChange={(e) => setData("no_telp", e.target.value)}
        />
        {errors.no_telp && (
          <p className="text-red-500 text-sm">{errors.no_telp}</p>
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
