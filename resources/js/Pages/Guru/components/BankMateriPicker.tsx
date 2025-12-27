import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { FileText, Search, Check, Archive, Calendar, HardDrive, File } from "lucide-react";
import { cn } from "@/Components/ui/utils";

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

interface BankMateriPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: BankMateriItem[];
    onSelect: (item: BankMateriItem) => void;
    selectedId?: number | null;
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeInfo(mime: string | null, fileName: string | null) {
    if (mime?.includes("pdf")) {
        return { icon: <FileText className="w-5 h-5" />, color: "text-red-500", bg: "bg-red-50", label: "PDF" };
    }
    if (mime?.includes("word") || mime?.includes("document")) {
        const ext = fileName?.endsWith(".docx") ? "DOCX" : "DOC";
        return { icon: <FileText className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-50", label: ext };
    }
    if (mime?.includes("presentation") || mime?.includes("powerpoint")) {
        const ext = fileName?.endsWith(".pptx") ? "PPTX" : "PPT";
        return { icon: <FileText className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-50", label: ext };
    }
    return { icon: <File className="w-5 h-5" />, color: "text-gray-500", bg: "bg-gray-50", label: "FILE" };
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function BankMateriPicker({
    open,
    onOpenChange,
    items,
    onSelect,
    selectedId,
}: BankMateriPickerProps) {
    const [search, setSearch] = useState("");

    const filteredItems = items.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.file_name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (item: BankMateriItem) => {
        onSelect(item);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-4 pb-3 border-b bg-white shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-base font-normal">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Archive className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <div>Pilih dari Bank Materi</div>
                            <div className="text-xs font-normal text-gray-500">
                                {items.length} file tersedia
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Search Bar */}
                <div className="p-4 pb-3 bg-gray-50/50 border-b shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Cari file berdasarkan nama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 h-9 bg-white border-gray-200 focus:border-blue-500"
                        />
                    </div>
                    {search && (
                        <div className="mt-2 text-xs text-gray-500">
                            Menampilkan {filteredItems.length} dari {items.length} file
                        </div>
                    )}
                </div>

                {/* Scrollable File List */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0" style={{ maxHeight: "400px" }}>
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Archive className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                                {search ? "Tidak ada hasil" : "Bank Materi kosong"}
                            </h3>
                            <p className="text-xs text-gray-500 max-w-xs">
                                {search
                                    ? `Tidak ada file yang cocok dengan "${search}"`
                                    : "Belum ada file di Bank Materi. Upload file terlebih dahulu."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredItems.map((item) => {
                                const fileInfo = getFileTypeInfo(item.file_mime, item.file_name);
                                const isSelected = selectedId === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleSelect(item)}
                                        className={cn(
                                            "w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200",
                                            isSelected
                                                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                                        )}
                                    >
                                        {/* File Icon */}
                                        <div className={cn(
                                            "flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center",
                                            fileInfo.bg, fileInfo.color
                                        )}>
                                            {fileInfo.icon}
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm text-gray-900 truncate">
                                                            {item.nama}
                                                        </span>
                                                        <span className={cn(
                                                            "flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded font-bold",
                                                            fileInfo.bg, fileInfo.color
                                                        )}>
                                                            {fileInfo.label}
                                                        </span>
                                                    </div>
                                                    {item.deskripsi && (
                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                                            {item.deskripsi}
                                                        </p>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                                                {item.file_size && (
                                                    <div className="flex items-center gap-1">
                                                        <HardDrive className="w-3 h-3" />
                                                        <span>{formatFileSize(item.file_size)}</span>
                                                    </div>
                                                )}
                                                {item.created_at && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDate(item.created_at)}</span>
                                                    </div>
                                                )}
                                                {item.file_name && (
                                                    <span className="truncate max-w-[150px] text-gray-400">
                                                        {item.file_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t bg-gray-50/50 shrink-0">
                    <div className="text-xs text-gray-500">
                        {selectedId ? (
                            <span className="text-blue-600 font-medium">1 file dipilih</span>
                        ) : (
                            "Klik file untuk memilih"
                        )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
