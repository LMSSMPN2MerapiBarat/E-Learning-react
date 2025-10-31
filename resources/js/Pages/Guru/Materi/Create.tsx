import { useForm } from "@inertiajs/react";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

interface Option {
  id: number;
  nama: string;
}

type CreateMateriForm = {
  judul: string;
  deskripsi: string;
  kelas_id: number | null;
  mata_pelajaran_id: number | null;
  file: File | null;
};

interface CreateMateriProps {
  kelasOptions: Option[];
  mapelOptions: Option[];
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function CreateMateri({
  kelasOptions,
  mapelOptions,
  onSuccess,
  onCancel,
}: CreateMateriProps) {
  const form = useForm<CreateMateriForm>({
    judul: "",
    deskripsi: "",
    kelas_id: null,
    mata_pelajaran_id: null,
    file: null,
  });
  const { data, setData, post, processing, reset, errors } = form;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setData("file", file ?? null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post("/guru/materi", {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Materi berhasil ditambahkan.");
        reset();
        onSuccess();
      },
      onError: () =>
        toast.error("Terjadi kesalahan saat menambahkan materi."),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="judul">Judul Materi</Label>
        <Input
          id="judul"
          value={data.judul}
          onChange={(e) => setData("judul", e.target.value)}
          placeholder="Masukkan judul materi"
        />
        {errors.judul && (
          <p className="text-xs text-red-500">{errors.judul}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea
          id="deskripsi"
          rows={4}
          value={data.deskripsi}
          onChange={(e) => setData("deskripsi", e.target.value)}
          placeholder="Tambahkan deskripsi singkat mengenai materi"
        />
        {errors.deskripsi && (
          <p className="text-xs text-red-500">{errors.deskripsi}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kelas">Kelas</Label>
          <Select
            value={data.kelas_id !== null ? String(data.kelas_id) : ""}
            onValueChange={(value: string) =>
              setData("kelas_id", value ? Number(value) : null)
            }
          >
            <SelectTrigger id="kelas">
              <SelectValue placeholder="Pilih kelas" />
            </SelectTrigger>
            <SelectContent>
              {kelasOptions.map((kelas) => (
                <SelectItem key={kelas.id} value={String(kelas.id)}>
                  {kelas.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.kelas_id && (
            <p className="text-xs text-red-500">{errors.kelas_id}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mata_pelajaran_id">Mata Pelajaran</Label>
          <Select
            value={
              data.mata_pelajaran_id !== null ? String(data.mata_pelajaran_id) : ""
            }
            onValueChange={(value: string) =>
              setData("mata_pelajaran_id", value ? Number(value) : null)
            }
          >
            <SelectTrigger id="mata_pelajaran_id">
              <SelectValue placeholder="Pilih mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              {mapelOptions.map((mapel) => (
                <SelectItem key={mapel.id} value={String(mapel.id)}>
                  {mapel.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mata_pelajaran_id && (
            <p className="text-xs text-red-500">
              {errors.mata_pelajaran_id}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File Materi</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.pps,.ppsx,.txt,.zip,.rar,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={handleFileChange}
        />
        {errors.file && (
          <p className="text-xs text-red-500">{errors.file}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan Materi"}
        </Button>
      </div>
    </form>
  );
}
