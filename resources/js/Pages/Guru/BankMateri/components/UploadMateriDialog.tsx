import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { useState, useCallback, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/Components/ui/progress";
import { cn } from "@/Components/ui/utils";

interface UploadMateriDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function UploadMateriDialog({
    open,
    onOpenChange,
    onSuccess,
}: UploadMateriDialogProps) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, reset, errors, progress } = useForm({
        nama: "",
        deskripsi: "",
        file: null as File | null,
        status: "published" as "published" | "draft",
    });

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                validateAndSetFile(file);
            }
        },
        []
    );

    const validateAndSetFile = (file: File) => {
        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];

        if (!validTypes.includes(file.type)) {
            toast.error("Format file tidak didukung", {
                description: "Hanya file PDF, Word, dan PowerPoint yang diperbolehkan.",
            });
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            toast.error("Ukuran file terlalu besar", {
                description: "Maksimal ukuran file adalah 20MB.",
            });
            return;
        }

        setData("file", file);
        if (!data.nama) {
            const nameWithoutExt = file.name.split(".").slice(0, -1).join(".");
            setData((prev) => ({ ...prev, nama: nameWithoutExt, file: file }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setData("file", null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/guru/bank-materi", {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Berhasil mengunggah materi", {
                    description: "Materi baru telah ditambahkan ke bank materi.",
                });
                reset();
                onSuccess();
                onOpenChange(false);
            },
            onError: () => {
                toast.error("Gagal mengunggah materi", {
                    description: "Silakan periksa kembali inputan Anda.",
                });
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-base">Upload Materi Baru</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-1">
                    {/* File Upload Area */}
                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-lg p-5 transition-all duration-200 text-center cursor-pointer",
                            dragActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                            data.file ? "border-solid border-blue-200 bg-blue-50/50" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => !data.file && inputRef.current?.click()}
                    >
                        <Input
                            ref={inputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            onChange={handleChange}
                        />

                        {data.file ? (
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-left">
                                    <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-xs text-gray-900 truncate max-w-[180px]">
                                            {data.file.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {(data.file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFile();
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-medium text-gray-700">
                                    <span className="text-blue-600 hover:underline">
                                        Klik untuk upload
                                    </span>{" "}
                                    atau drag & drop
                                </p>
                                <p className="text-[10px] text-gray-500">
                                    PDF, Word, atau PowerPoint (Maks. 20MB)
                                </p>
                            </div>
                        )}
                    </div>
                    {errors.file && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> {errors.file}
                        </p>
                    )}

                    {/* Progress Bar */}
                    {progress && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Mengunggah...</span>
                                <span>{progress.percentage}%</span>
                            </div>
                            <Progress value={progress.percentage} className="h-2" />
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="nama" className="text-xs">Judul Materi</Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData("nama", e.target.value)}
                                placeholder="Contoh: Modul Bahasa Indonesia Bab 1"
                                className="h-8 text-sm"
                                required
                            />
                            {errors.nama && (
                                <p className="text-[10px] text-red-500">{errors.nama}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="deskripsi" className="text-xs">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                                placeholder="Tambahkan catatan singkat tentang materi ini..."
                                rows={2}
                                className="resize-none text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-md border bg-gray-50/50">
                            <div className="space-y-0">
                                <Label className="text-sm">Publikasikan Materi</Label>
                                <p className="text-[10px] text-gray-500">
                                    Materi akan langsung tersedia untuk digunakan jika aktif.
                                </p>
                            </div>
                            <Switch
                                checked={data.status === "published"}
                                onCheckedChange={(checked) =>
                                    setData("status", checked ? "published" : "draft")
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" size="sm" disabled={processing || !data.file}>
                            {processing ? "Mengunggah..." : "Upload Materi"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
