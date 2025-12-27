import { useForm } from "@inertiajs/react";
import { ChangeEvent, useMemo, useState } from "react";
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
import {
  Archive,
  Upload,
  X,
  FileText,
  Video,
  Youtube,
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
} from "lucide-react";
import BankMateriPicker from "../components/BankMateriPicker";
import { cn } from "@/Components/ui/utils";

interface Option {
  id: number;
  nama: string;
}

interface BankMateriItem {
  id: number;
  nama: string;
  deskripsi: string | null;
  file_name: string | null;
  file_url: string | null;
  file_mime: string | null;
  file_size: number | null;
  created_at: string;
}

type CreateMateriForm = {
  judul: string;
  deskripsi: string;
  kelas_id: number | null;
  mata_pelajaran_id: number | null;
  file: File | null;
  video: File | null;
  youtube_url: string;
  bank_materi_id: number | null;
};

interface CreateMateriProps {
  kelasOptions: Option[];
  mapelOptions: Option[];
  kelasMapelOptions?: Record<number, number[]>;
  bankMateris?: BankMateriItem[];
  onSuccess: () => void;
  onCancel?: () => void;
}

type FileSource = "upload" | "bank";

export default function CreateMateri({
  kelasOptions,
  mapelOptions,
  kelasMapelOptions = {},
  bankMateris = [],
  onSuccess,
  onCancel,
}: CreateMateriProps) {
  const [fileSource, setFileSource] = useState<FileSource>("upload");
  const [selectedBankFile, setSelectedBankFile] = useState<BankMateriItem | null>(null);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<CreateMateriForm>({
    judul: "",
    deskripsi: "",
    kelas_id: null,
    mata_pelajaran_id: null,
    file: null,
    video: null,
    youtube_url: "",
    bank_materi_id: null,
  });
  const { data, setData, post, processing, reset, errors } = form;

  const filteredMapelOptions = useMemo(() => {
    if (!data.kelas_id || !kelasMapelOptions[data.kelas_id]) {
      return mapelOptions;
    }
    const allowedMapelIds = kelasMapelOptions[data.kelas_id];
    return mapelOptions.filter((m) => allowedMapelIds.includes(m.id));
  }, [data.kelas_id, kelasMapelOptions, mapelOptions]);

  const handleKelasChange = (value: string) => {
    const kelasId = value ? Number(value) : null;
    setData((prev) => ({
      ...prev,
      kelas_id: kelasId,
      mata_pelajaran_id: null,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Max 5MB untuk dokumen
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar", {
          description: "Maksimal ukuran file dokumen adalah 5MB.",
        });
        event.target.value = "";
        return;
      }
    }
    setData("file", file ?? null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Max 5MB untuk dokumen
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar", {
          description: "Maksimal ukuran file dokumen adalah 5MB.",
        });
        return;
      }
      setData("file", file);
    }
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Max 10MB untuk video
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar", {
          description: "Maksimal ukuran file video adalah 10MB.",
        });
        event.target.value = "";
        return;
      }
    }
    setData("video", file ?? null);
  };

  const handleSelectBankFile = (item: BankMateriItem) => {
    setSelectedBankFile(item);
    setData("bank_materi_id", item.id);
  };

  const handleClearBankFile = () => {
    setSelectedBankFile(null);
    setData("bank_materi_id", null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post("/guru/materi", {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setFileSource("upload");
        setSelectedBankFile(null);
        onSuccess();
      },
      onError: () =>
        toast.error("Terjadi kesalahan saat menambahkan materi."),
    });
  };

  const isFormValid = data.judul && data.kelas_id && data.mata_pelajaran_id &&
    (data.file || data.bank_materi_id);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Informasi Dasar */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Informasi Materi</span>
          </div>

          <div className="bg-gray-50/50 rounded-lg border border-gray-100 p-3 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="judul" className="text-xs">
                Judul Materi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="judul"
                value={data.judul}
                onChange={(e) => setData("judul", e.target.value)}
                placeholder="Contoh: Persamaan Linear Satu Variabel"
                className="h-9 text-sm"
                required
              />
              {errors.judul && (
                <p className="text-[10px] text-red-500">{errors.judul}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="deskripsi" className="text-xs">
                Deskripsi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="deskripsi"
                rows={2}
                value={data.deskripsi}
                onChange={(e) => setData("deskripsi", e.target.value)}
                placeholder="Jelaskan singkat tentang materi yang akan dibagikan..."
                className="text-sm resize-none"
                required
              />
              {errors.deskripsi && (
                <p className="text-[10px] text-red-500">{errors.deskripsi}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Kelas & Mapel */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Target Pembelajaran</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="kelas" className="text-xs">
                Kelas <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.kelas_id !== null ? String(data.kelas_id) : ""}
                onValueChange={handleKelasChange}
                required
              >
                <SelectTrigger id="kelas" className="h-9 text-sm">
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
              <input type="text" value={data.kelas_id ?? ""} required readOnly className="sr-only" tabIndex={-1} />
              {errors.kelas_id && <p className="text-[10px] text-red-500">{errors.kelas_id}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="mata_pelajaran_id" className="text-xs">
                Mata Pelajaran <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.mata_pelajaran_id !== null ? String(data.mata_pelajaran_id) : ""}
                onValueChange={(value: string) => setData("mata_pelajaran_id", value ? Number(value) : null)}
                required
                disabled={!data.kelas_id}
              >
                <SelectTrigger id="mata_pelajaran_id" className="h-9 text-sm">
                  <SelectValue placeholder={data.kelas_id ? "Pilih mapel" : "Pilih kelas dulu"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredMapelOptions.length === 0 ? (
                    <div className="px-2 py-1.5 text-xs text-gray-500">Tidak ada mapel</div>
                  ) : (
                    filteredMapelOptions.map((mapel) => (
                      <SelectItem key={mapel.id} value={String(mapel.id)}>{mapel.nama}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <input type="text" value={data.mata_pelajaran_id ?? ""} required readOnly className="sr-only" tabIndex={-1} />
              {errors.mata_pelajaran_id && <p className="text-[10px] text-red-500">{errors.mata_pelajaran_id}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: File Materi */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>File Materi</span>
            <span className="text-red-500 text-xs">*</span>
          </div>

          {/* Toggle Pills */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => { setFileSource("upload"); handleClearBankFile(); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                fileSource === "upload"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => { setFileSource("bank"); setData("file", null); }}
              disabled={bankMateris.length === 0}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                fileSource === "bank"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
                bankMateris.length === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              <Archive className="w-3.5 h-3.5" />
              Bank Materi
            </button>
          </div>

          {fileSource === "upload" ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                data.file && "border-solid border-green-200 bg-green-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
              />
              {data.file ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{data.file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-gray-400 hover:text-red-500"
                    onClick={(e) => { e.stopPropagation(); setData("file", null); }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 mx-auto text-gray-400" />
                  <p className="text-xs text-gray-600">
                    <span className="text-blue-600 font-medium">Klik</span> atau drag & drop
                  </p>
                  <p className="text-[10px] text-gray-400">PDF, Word, PowerPoint (Maks. 5MB)</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {selectedBankFile ? (
                <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="flex-1 text-xs font-medium text-blue-900 truncate">{selectedBankFile.nama}</span>
                  <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={handleClearBankFile}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setIsFilePickerOpen(true)}>
                  <Archive className="w-3.5 h-3.5 mr-1.5" />
                  Pilih dari Bank Materi ({bankMateris.length} file)
                </Button>
              )}
              <input type="text" value={data.bank_materi_id ?? ""} required={fileSource === "bank"} readOnly className="sr-only" tabIndex={-1} />
            </div>
          )}
          {errors.file && <p className="text-[10px] text-red-500">{errors.file}</p>}
        </div>

        {/* Section 4: Optional Content */}
        <div className="border-t pt-3">
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors w-full"
          >
            {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>Konten Tambahan (Video/YouTube)</span>
            <span className="ml-auto text-[10px] text-gray-400">Opsional</span>
          </button>

          {showOptional && (
            <div className="mt-3 space-y-3 bg-gray-50/50 rounded-lg border border-gray-100 p-3">
              <div className="space-y-1">
                <Label htmlFor="video" className="text-xs flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-500" />
                  File Video
                  <span className="text-[10px] text-gray-400 font-normal">(Maks. 10MB)</span>
                </Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="h-8 text-xs"
                />
                {data.video && (
                  <p className="text-[10px] text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {data.video.name}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="youtube_url" className="text-xs flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  Tautan YouTube
                </Label>
                <Input
                  id="youtube_url"
                  type="url"
                  value={data.youtube_url}
                  onChange={(e) => setData("youtube_url", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="h-8 text-xs"
                />
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Siswa dapat menonton video langsung di halaman materi
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-[10px] text-gray-400">
            {isFormValid ? (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Siap disimpan
              </span>
            ) : (
              <span>Lengkapi field yang wajib (*)</span>
            )}
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                Batal
              </Button>
            )}
            <Button type="submit" size="sm" disabled={processing || !isFormValid}>
              {processing ? "Menyimpan..." : "Simpan Materi"}
            </Button>
          </div>
        </div>
      </form>

      <BankMateriPicker
        open={isFilePickerOpen}
        onOpenChange={setIsFilePickerOpen}
        items={bankMateris}
        onSelect={handleSelectBankFile}
        selectedId={data.bank_materi_id}
      />
    </>
  );
}
