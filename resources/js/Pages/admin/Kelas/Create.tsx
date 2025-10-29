import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateKelas({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    tingkat: "",
    kelas: "",
    tahun_ajaran: "",
  });

  const [prefix, setPrefix] = useState("");

  useEffect(() => {
    if (data.tingkat === "Kelas 7") setPrefix("VII-");
    else if (data.tingkat === "Kelas 8") setPrefix("VIII-");
    else if (data.tingkat === "Kelas 9") setPrefix("IX-");
    else setPrefix("");
  }, [data.tingkat]);

  useEffect(() => {
    const tahun = new Date().getFullYear();
    setData("tahun_ajaran", `${tahun}/${tahun + 1}`);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("admin.kelas.store"), {
      onSuccess: () => {
        toast.success("✅ Kelas berhasil disimpan!");
        reset();
        onSuccess();
      },
      onError: () => toast.error("❌ Gagal menyimpan data kelas."),
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
                <Input
                  id="kelas"
                  type="text"
                  placeholder="contoh: VII-A"
                  value={`${prefix}${data.kelas.replace(prefix, "")}`}
                  onChange={(e) =>
                    setData("kelas", `${prefix}${e.target.value.replace(prefix, "")}`)
                  }
                  required
                />
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
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
