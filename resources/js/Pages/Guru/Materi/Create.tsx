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
  video: File | null;
  youtube_url: string;
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
    video: null,
    youtube_url: "",
  });
  const { data, setData, post, processing, reset, errors } = form;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setData("file", file ?? null);
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setData("video", file ?? null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post("/guru/materi", {
      forceFormData: true,
      onSuccess: () => {
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
        <Label htmlFor="judul">Judul Materi <span className="text-red-500">*</span></Label>
        <Input
          id="judul"
          value={data.judul}
          onChange={(e) => setData("judul", e.target.value)}
          placeholder="Masukkan judul materi"
          required
        />
        {errors.judul && (
          <p className="text-xs text-red-500">{errors.judul}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi <span className="text-red-500">*</span></Label>
        <Textarea
          id="deskripsi"
          rows={4}
          value={data.deskripsi}
          onChange={(e) => setData("deskripsi", e.target.value)}
          placeholder="Tambahkan deskripsi singkat mengenai materi"
          required
        />
        {errors.deskripsi && (
          <p className="text-xs text-red-500">{errors.deskripsi}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kelas">Kelas <span className="text-red-500">*</span></Label>
          <Select
            value={data.kelas_id !== null ? String(data.kelas_id) : ""}
            onValueChange={(value: string) =>
              setData("kelas_id", value ? Number(value) : null)
            }
            required
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
          <input
            type="text"
            value={data.kelas_id ?? ""}
            required
            className="sr-only"
            tabIndex={-1}
          />
          {errors.kelas_id && (
            <p className="text-xs text-red-500">{errors.kelas_id}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mata_pelajaran_id">Mata Pelajaran <span className="text-red-500">*</span></Label>
          <Select
            value={
              data.mata_pelajaran_id !== null ? String(data.mata_pelajaran_id) : ""
            }
            onValueChange={(value: string) =>
              setData("mata_pelajaran_id", value ? Number(value) : null)
            }
            required
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
          <input
            type="text"
            value={data.mata_pelajaran_id ?? ""}
            required
            className="sr-only"
            tabIndex={-1}
          />
          {errors.mata_pelajaran_id && (
            <p className="text-xs text-red-500">
              {errors.mata_pelajaran_id}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File Materi <span className="text-red-500">*</span></Label>
        <Input
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.pps,.ppsx,.txt,.zip,.rar,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={handleFileChange}
          required
        />
        {errors.file && (
          <p className="text-xs text-red-500">{errors.file}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="video">File Video (opsional)</Label>
        <Input
          id="video"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />
        {errors.video && (
          <p className="text-xs text-red-500">{errors.video}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="youtube_url">Tautan YouTube (opsional)</Label>
        <Input
          id="youtube_url"
          type="url"
          inputMode="url"
          value={data.youtube_url}
          onChange={(e) => setData("youtube_url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-xs text-gray-500">
          Masukkan URL video YouTube jika ingin membagikan video secara langsung.
        </p>
        {errors.youtube_url && (
          <p className="text-xs text-red-500">{errors.youtube_url}</p>
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
