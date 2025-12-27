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
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { useEffect } from "react";
import { FileText } from "lucide-react";

interface BankMateriItem {
    id: number;
    nama: string;
    deskripsi: string | null;
    file_name: string | null;
    status: "published" | "draft";
}

interface EditMateriDialogProps {
    item: BankMateriItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditMateriDialog({
    item,
    open,
    onOpenChange,
    onSuccess,
}: EditMateriDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: "",
        deskripsi: "",
        file: null as File | null,
        status: "published" as "published" | "draft",
        _method: "PUT",
    });

    useEffect(() => {
        if (item) {
            setData({
                nama: item.nama,
                deskripsi: item.deskripsi || "",
                file: null,
                status: item.status,
                _method: "PUT",
            });
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!item) return;

        post(`/guru/bank-materi/${item.id}`, {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Materi berhasil diperbarui");
                onSuccess();
                onOpenChange(false);
                reset();
            },
            onError: () => {
                toast.error("Gagal memperbarui materi");
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-base">Edit Materi</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-1">
                    {/* Read-only File Info */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-white border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                                {item?.file_name}
                            </p>
                            <p className="text-[10px] text-gray-500">File saat ini</p>
                        </div>
                    </div>

                    {/* Option to replace file */}
                    <div className="space-y-1">
                        <Label htmlFor="new_file" className="text-xs">Ganti File (Opsional)</Label>
                        <Input
                            id="new_file"
                            type="file"
                            accept=".pdf,.doc,.docx,.ppt,.pptx"
                            onChange={(e) => setData("file", e.target.files?.[0] || null)}
                            className="cursor-pointer h-8 text-sm"
                        />
                        <p className="text-[9px] text-gray-400">
                            Biarkan kosong jika tidak ingin mengganti file.
                        </p>
                        {errors.file && (
                            <p className="text-[10px] text-red-500">{errors.file}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label htmlFor="edit_nama" className="text-xs">Judul Materi</Label>
                            <Input
                                id="edit_nama"
                                value={data.nama}
                                onChange={(e) => setData("nama", e.target.value)}
                                placeholder="Nama materi"
                                className="h-8 text-sm"
                                required
                            />
                            {errors.nama && (
                                <p className="text-[10px] text-red-500">{errors.nama}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit_deskripsi" className="text-xs">Deskripsi</Label>
                            <Textarea
                                id="edit_deskripsi"
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                                rows={2}
                                placeholder="Deskripsi materi..."
                                className="resize-none text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-md border bg-gray-50/50">
                            <div className="space-y-0">
                                <Label className="text-sm">Status Publikasi</Label>
                                <p className="text-[10px] text-gray-500">
                                    {data.status === 'published' ? 'Materi dapat digunakan.' : 'Materi disimpan sebagai draft.'}
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
                        <Button type="submit" size="sm" disabled={processing}>
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
