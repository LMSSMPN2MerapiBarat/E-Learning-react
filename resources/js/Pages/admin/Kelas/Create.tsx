import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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

const TINGKAT_PREFIX_MAP: Record<string, string> = {
  "Kelas 7": "VII-",
  "Kelas 8": "VIII-",
  "Kelas 9": "IX-",
};

export default function CreateKelas({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    tingkat: "",
    kelas: "",
    tahun_ajaran: "",
  });

  const [prefix, setPrefix] = useState("");
  const [classSuffix, setClassSuffix] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setPrefix(TINGKAT_PREFIX_MAP[data.tingkat] ?? "");
  }, [data.tingkat]);

  useEffect(() => {
    if (!data.tingkat) {
      setClassSuffix("");
    }
  }, [data.tingkat]);

  useEffect(() => {
    setData("kelas", prefix ? `${prefix}${classSuffix}` : classSuffix);
  }, [prefix, classSuffix, setData]);

  useEffect(() => {
    const tahun = new Date().getFullYear();
    setData("tahun_ajaran", `${tahun}/${tahun + 1}`);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    post(route("admin.kelas.store"), {
      onSuccess: () => {
        toast.success("Kelas berhasil disimpan!");
        reset();
        setClassSuffix("");
        setPrefix("");
        onSuccess();
      },
      onError: (formErrors) => {
        const message =
          formErrors?.kelas ?? "Gagal menyimpan data kelas.";
        let toastId: string | number;
        toastId = toast.error("Data tidak valid", {
          description: message,
          duration: 6000,
          dismissible: true,
          action: { label: "Tutup", onClick: () => toast.dismiss(toastId) },
        });
      },
    });
  };

  return (
    <>
      <Head title="Tambah Kelas" />
      <div className="flex justify-center mt-8">
        <Card className="w-full max-w-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Tambah Data Kelas
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tingkat">Tingkat</Label>
                <select
                  id="tingkat"
                  value={data.tingkat}
                  onChange={(e) => setData("tingkat", e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">-- Pilih Tingkat --</option>
                  <option value="Kelas 7">Kelas 7</option>
                  <option value="Kelas 8">Kelas 8</option>
                  <option value="Kelas 9">Kelas 9</option>
                </select>
                {errors.tingkat && (
                  <p className="text-sm text-red-500 mt-1">{errors.tingkat}</p>
                )}
              </div>

              <div>
                <Label htmlFor="kelas">Nama Kelas</Label>
                <div className="flex rounded-md shadow-sm">
                  {prefix && (
                    <span className="inline-flex items-center rounded-l-md border border-r-0 bg-gray-100 px-3 text-sm font-semibold text-gray-600">
                      {prefix}
                    </span>
                  )}
                  <Input
                    id="kelas"
                    type="text"
                    placeholder={
                      prefix ? "contoh: 1 atau 2" : "Pilih tingkat terlebih dahulu"
                    }
                    className={prefix ? "rounded-l-none" : undefined}
                    value={classSuffix}
                    onChange={(e) => setClassSuffix(e.target.value.toUpperCase())}
                    disabled={!prefix}
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Pilih tingkat untuk mendapatkan kode kelas (mis. VII-) lalu isi akhiran kelas.
                </p>
                {errors.kelas && (
                  <p className="text-sm text-red-500 mt-1">{errors.kelas}</p>
                )}
              </div>

              <div>
                <Label htmlFor="tahun_ajaran">Tahun Ajaran</Label>
                <Input
                  id="tahun_ajaran"
                  type="text"
                  value={data.tahun_ajaran}
                  onChange={(e) => setData("tahun_ajaran", e.target.value)}
                  required
                />
                {errors.tahun_ajaran && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.tahun_ajaran}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
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
                    <AlertDialogAction
                      onClick={confirmSubmit}
                      disabled={processing}
                    >
                      Ya, benar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
