import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
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

interface Kelas {
  id: number;
  tingkat: string;
  kelas: string;
  tahun_ajaran: string;
}

interface CreateSiswaProps {
  onSuccess?: (newStudent?: any) => void;
}

export default function CreateSiswa({ onSuccess }: CreateSiswaProps) {
  const { data, setData, post, processing, reset } = useForm({
    name: "",
    email: "",
    password: "",
    role: "siswa",
    nis: "",
    kelas_id: "",
    no_telp: "",
  });

  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  useEffect(() => {
    fetch("/admin/kelas/list")
      .then((res) => res.json())
      .then((data) => setKelasList(data))
      .catch((err) => console.error("Gagal memuat kelas:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/admin/users", {
      onSuccess: (page) => {
        const newStudent = (page.props as any)?.newStudent;
        if (onSuccess) onSuccess(newStudent);
        reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Nama Lengkap</Label>
        <Input
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
      </div>

      <div>
        <Label>Password</Label>
        <Input
          type="password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
        />
      </div>

      <div>
        <Label>NIS</Label>
        <Input
          value={data.nis}
          onChange={(e) => setData("nis", e.target.value)}
        />
      </div>

      <div>
        <Label>Kelas</Label>
        <Select
          value={data.kelas_id}
          onValueChange={(v) => setData("kelas_id", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kelas" />
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
        <Label>No. Telepon</Label>
        <Input
          value={data.no_telp}
          onChange={(e) => setData("no_telp", e.target.value)}
        />
      </div>

      <Button type="submit" disabled={processing} className="w-full mt-2">
        Simpan
      </Button>
    </form>
  );
}
