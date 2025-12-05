import React, { useEffect, useMemo, useState } from "react";
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
    jenis_kelamin: "",
    email: "",
    password: "",
    role: "siswa",
    nis: "",
    kelas_id: "",
    no_telp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
  });

  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  useEffect(() => {
    fetch("/admin/kelas/list")
      .then((res) => res.json())
      .then((data) => setKelasList(data))
      .catch((err) => console.error("Gagal memuat kelas:", err));
  }, []);

  useEffect(() => {
    if (errors.nis) {
      setErrorDialog(errors.nis);
    }
  }, [errors.nis]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    post("/admin/users", {
      onSuccess: (page) => {
        const newStudent = (page.props as any)?.newStudent;
        setErrorDialog(null);
        if (onSuccess) onSuccess(newStudent);
        reset();
      },
    });
  };

  const handleNisChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setData("nis", digitsOnly);
  };

  const handleNameChange = (value: string) => {
    const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
    setData("name", lettersOnly);
  };

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
    setData("no_telp", digitsOnly);
  };

  const handleBirthPlaceChange = (value: string) => {
    const lettersOnly = value.replace(/[^A-Za-z\s]/g, "");
    setData("tempat_lahir", lettersOnly);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label>Nama Lengkap</Label>
          <Input
            value={data.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Contoh: Andi Saputra"
            pattern="[A-Za-z\s]+"
            title="Nama hanya boleh berisi huruf dan spasi."
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Jenis Kelamin</Label>
          <Select
            value={data.jenis_kelamin}
            onValueChange={(value) => setData("jenis_kelamin", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laki-laki">Laki-laki</SelectItem>
              <SelectItem value="perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          {errors.jenis_kelamin && (
            <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Tempat Lahir</Label>
          <Input
            value={data.tempat_lahir}
            onChange={(e) => handleBirthPlaceChange(e.target.value)}
            placeholder="Contoh: Jakarta"
            pattern="[A-Za-z\s]+"
            title="Tempat lahir hanya boleh berisi huruf dan spasi."
          />
          {errors.tempat_lahir && (
            <p className="text-red-500 text-sm">{errors.tempat_lahir}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Tanggal Lahir</Label>
          <Input
            type="date"
            value={data.tanggal_lahir}
            onChange={(e) => setData("tanggal_lahir", e.target.value)}
            max={today}
          />
          {errors.tanggal_lahir && (
            <p className="text-red-500 text-sm">{errors.tanggal_lahir}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            placeholder="contoh: siswa@sekolah.sch.id"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            placeholder="Minimal 8 karakter"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>NISN</Label>
          <Input
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            value={data.nis}
            onChange={(e) => handleNisChange(e.target.value)}
            placeholder="Masukkan 10 digit NISN"
            required
          />
          {errors.nis && (
            <p className="text-red-500 text-sm">{errors.nis}</p>
          )}
        </div>

        <div className="space-y-1">
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
          {errors.kelas_id && (
            <p className="text-red-500 text-sm">{errors.kelas_id}</p>
          )}
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label>No. Telepon</Label>
          <Input
            value={data.no_telp}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Masukkan 9-12 digit nomor telepon"
            inputMode="numeric"
            pattern="[0-9]{9,12}"
            minLength={9}
            maxLength={12}
            title="No. telepon harus 9-12 digit angka."
          />
          {errors.no_telp && (
            <p className="text-red-500 text-sm">{errors.no_telp}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={processing} className="w-full md:w-auto">
          Simpan
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
            <AlertDialogCancel disabled={processing}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={processing}>
              Ya, benar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={errorDialog !== null} onOpenChange={(open) => !open && setErrorDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Data tidak valid</AlertDialogTitle>
            <AlertDialogDescription>{errorDialog}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialog(null)}>Mengerti</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
