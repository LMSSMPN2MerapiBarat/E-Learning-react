import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { FileText, Search, Check, Archive } from "lucide-react";
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

function getFileIcon(mime: string | null) {
    if (mime?.includes("pdf")) {
        return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (mime?.includes("word") || mime?.includes("document")) {
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
    if (mime?.includes("presentation") || mime?.includes("powerpoint")) {
        return <FileText className="w-5 h-5 text-orange-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
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
        item.nama.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (item: BankMateriItem) => {
        onSelect(item);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Archive className="w-5 h-5" />
                        Pilih dari Bank Materi
                    </DialogTitle>
                </DialogHeader>

                <div className="relative mb-3">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Cari file..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1">
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Archive className="w-10 h-10 text-gray-300 mb-2" />
                            <p className="text-gray-500 text-sm">
                                {search
                                    ? "Tidak ada file yang sesuai pencarian"
                                    : "Belum ada file di Bank Materi"}
                            </p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                                    selectedId === item.id
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    {getFileIcon(item.file_mime)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-900 truncate">
                                            {item.nama}
                                        </span>
                                        {selectedId === item.id && (
                                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        {item.file_size && (
                                            <span>{formatFileSize(item.file_size)}</span>
                                        )}
                                        {item.file_name && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate">{item.file_name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
