import { useState, useMemo } from "react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Download, FileSpreadsheet } from "lucide-react";

interface KelasOption {
    id: number;
    tingkat: string;
    kelas: string;
}

interface ExportKelasDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kelasList: KelasOption[];
    exportUrl: string;
}

export default function ExportKelasDialog({
    open,
    onOpenChange,
    kelasList,
    exportUrl,
}: ExportKelasDialogProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const allSelected = useMemo(
        () => kelasList.length > 0 && selectedIds.length === kelasList.length,
        [kelasList.length, selectedIds.length]
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(kelasList.map((k) => k.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleClassToggle = (classId: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, classId]);
        } else {
            setSelectedIds((prev) => prev.filter((id) => id !== classId));
        }
    };

    const handleExport = () => {
        const idsParam = selectedIds.join(",");
        const url = selectedIds.length > 0
            ? `${exportUrl}?kelas_ids=${idsParam}`
            : exportUrl;

        const link = document.createElement("a");
        link.href = url;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onOpenChange(false);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setSelectedIds(kelasList.map((k) => k.id));
        }
        onOpenChange(isOpen);
    };

    const getKelasLabel = (k: KelasOption) => {
        return `${k.tingkat} ${k.kelas}`.trim();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <FileSpreadsheet className="h-4 w-4" />
                        Export Data Kelas & Siswa
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Pilih kelas yang ingin di-export. Setiap kelas akan menjadi sheet terpisah dalam file Excel.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-3">
                    <div className="mb-3 flex items-center gap-2 border-b pb-2">
                        <Checkbox
                            id="select-all"
                            checked={allSelected}
                            onCheckedChange={(checked) => handleSelectAll(checked === true)}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-sm font-medium cursor-pointer"
                        >
                            Pilih Semua
                        </label>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {selectedIds.length} dari {kelasList.length} kelas dipilih
                        </span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {kelasList.map((kelas) => (
                            <div
                                key={kelas.id}
                                className="flex items-center gap-2 rounded-md border p-2 hover:bg-muted/50 transition-colors"
                            >
                                <Checkbox
                                    id={`kelas-${kelas.id}`}
                                    checked={selectedIds.includes(kelas.id)}
                                    onCheckedChange={(checked) =>
                                        handleClassToggle(kelas.id, checked === true)
                                    }
                                />
                                <label
                                    htmlFor={`kelas-${kelas.id}`}
                                    className="text-sm cursor-pointer flex-1"
                                >
                                    {getKelasLabel(kelas)}
                                </label>
                            </div>
                        ))}
                    </div>

                    {kelasList.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            Tidak ada kelas yang tersedia.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleExport}
                        disabled={selectedIds.length === 0}
                        className="border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                    >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Export ({selectedIds.length} kelas)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
