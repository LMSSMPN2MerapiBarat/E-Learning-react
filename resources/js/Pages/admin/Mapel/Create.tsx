import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function CreateMapel({ onSuccess }: { onSuccess: () => void }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    nama_mapel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/admin/mapel", {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nama Mata Pelajaran</Label>
        <Input
          value={data.nama_mapel}
          onChange={(e) => setData("nama_mapel", e.target.value)}
          required
        />
        {errors.nama_mapel && (
          <p className="text-red-600 text-sm">{errors.nama_mapel}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
