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

interface CreateSiswaProps {
  onSuccess?: (newStudent?: any) => void;
}

export default function CreateSiswa({ onSuccess }: CreateSiswaProps) {
  const { data, setData, post, processing, reset, errors } = useForm({
    name: "",
    email: "",
    password: "",
    role: "siswa",
    nis: "",
    kelas_id: "",
    no_telp: "",
  });

  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    post("/admin/users", {
      onSuccess: (page) => {
        const newStudent = (page.props as any)?.newStudent;
        if (onSuccess) onSuccess(newStudent);
        reset();
      },
    });
  };

  const handleNisChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setData("nis", digitsOnly);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Nama Lengkap</Label>
        <Input
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          required
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
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
        <Label>NISN</Label>
        <Input
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          value={data.nis}
          onChange={(e) => handleNisChange(e.target.value)}
          required
        />
        {errors.nis && <p className="text-red-500 text-sm">{errors.nis}</p>}
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
        {errors.no_telp && (
          <p className="text-red-500 text-sm">{errors.no_telp}</p>
        )}
      </div>

      <Button type="submit" disabled={processing} className="w-full mt-2">
        Simpan
      </Button>
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
