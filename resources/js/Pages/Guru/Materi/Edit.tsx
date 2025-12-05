import { useForm } from "@inertiajs/react";
import { ChangeEvent, useRef } from "react";
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

interface MateriData {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kelas_id?: number | null;
  mata_pelajaran_id?: number | null;
  file_name?: string | null;
  youtube_url?: string | null;
  video_name?: string | null;
  video_url?: string | null;
}

type EditMateriForm = {
  judul: string;
  deskripsi: string;
  kelas_id: number | null;
  mata_pelajaran_id: number | null;
  file: File | null;
  video: File | null;
  youtube_url: string;
  remove_video: boolean;
  _method: "PUT";
};

interface EditMateriProps {
  materi: MateriData;
  kelasOptions: Option[];
  mapelOptions: Option[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditMateri({
  materi,
  kelasOptions,
  mapelOptions,
  onSuccess,
  onCancel,
}: EditMateriProps) {
  const form = useForm<EditMateriForm>({
    judul: materi.judul,
    deskripsi: materi.deskripsi ?? "",
    kelas_id: materi.kelas_id ?? null,
    mata_pelajaran_id: materi.mata_pelajaran_id ?? null,
    file: null,
    video: null,
    youtube_url: materi.youtube_url ?? "",
    remove_video: false,
    _method: "PUT",
  });
  const { data, setData, post, processing, errors } = form;
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setData("file", file ?? null);
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setData("video", file ?? null);
    if (file) {
      setData("remove_video", false);
    }
  };

  const toggleRemoveCurrentVideo = () => {
    const nextValue = !data.remove_video;
    setData("remove_video", nextValue);
    if (nextValue) {
      setData("video", null);
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    post(`/guru/materi/${materi.id}`, {
      forceFormData: true,
      onSuccess: () => {
        onSuccess();
      },
      onError: () =>
        toast.error("Terjadi kesalahan saat memperbarui materi."),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="judul_edit">Judul Materi <span className="text-red-500">*</span></Label>
        <Input
          id="judul_edit"
          value={data.judul}
          onChange={(e) => setData("judul", e.target.value)}
          placeholder="Masukkan judul materi"
          required
        />
        {errors.judul && (
          <p className="text-xs text-red-500">{errors.judul}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="deskripsi_edit">Deskripsi <span className="text-red-500">*</span></Label>
        <Textarea
          id="deskripsi_edit"
          rows={3}
          value={data.deskripsi}
          onChange={(e) => setData("deskripsi", e.target.value)}
          placeholder="Tambahkan deskripsi singkat mengenai materi"
          required
        />
        {errors.deskripsi && (
          <p className="text-xs text-red-500">{errors.deskripsi}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="kelas_edit">Kelas <span className="text-red-500">*</span></Label>
          <Select
            value={data.kelas_id !== null ? String(data.kelas_id) : ""}
            onValueChange={(value: string) =>
              setData("kelas_id", value ? Number(value) : null)
            }
            required
          >
            <SelectTrigger id="kelas_edit">
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

        <div className="space-y-1">
          <Label htmlFor="mapel_edit">Mata Pelajaran <span className="text-red-500">*</span></Label>
          <Select
            value={
              data.mata_pelajaran_id !== null ? String(data.mata_pelajaran_id) : ""
            }
            onValueChange={(value: string) =>
              setData("mata_pelajaran_id", value ? Number(value) : null)
            }
            required
          >
            <SelectTrigger id="mapel_edit">
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

      <div className="space-y-1">
        <Label htmlFor="file_edit">File Materi (opsional)</Label>
        <Input
          id="file_edit"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.pps,.ppsx,.txt,.zip,.rar,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={handleFileChange}
        />
        {materi.file_name && (
          <p className="text-xs text-gray-500">
            File saat ini: {materi.file_name}
          </p>
        )}
        {errors.file && (
          <p className="text-xs text-red-500">{errors.file}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="video_edit">File Video (opsional)</Label>
        <Input
          id="video_edit"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          ref={videoInputRef}
          disabled={data.remove_video}
        />
        {materi.video_name && materi.video_url && (
          <div className="space-y-1 text-xs text-gray-500">
            <p>
              Video saat ini:{" "}
              <a
                className="text-blue-600 underline"
                href={materi.video_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {materi.video_name}
              </a>
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={data.remove_video ? "outline" : "destructive"}
                onClick={toggleRemoveCurrentVideo}
              >
                {data.remove_video ? "Batalkan penghapusan" : "Hapus video saat ini"}
              </Button>
              {data.remove_video && (
                <span className="text-amber-600">
                  Video akan dihapus ketika Anda menyimpan perubahan.
                </span>
              )}
            </div>
          </div>
        )}
        {errors.video && (
          <p className="text-xs text-red-500">{errors.video}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="youtube_url_edit">Tautan YouTube (opsional)</Label>
        <Input
          id="youtube_url_edit"
          type="url"
          inputMode="url"
          value={data.youtube_url}
          onChange={(e) => setData("youtube_url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {materi.youtube_url && (
          <p className="text-xs text-gray-500 break-all">
            Tautan saat ini: {materi.youtube_url}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Kosongkan jika tidak ingin membagikan video YouTube.
        </p>
        {errors.youtube_url && (
          <p className="text-xs text-red-500">{errors.youtube_url}</p>
        )}
      </div>

      <div className="flex justify-end gap-1.5 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={processing}>
          {processing ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
