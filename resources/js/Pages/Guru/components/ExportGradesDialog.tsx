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

interface ClassOption {
    id: number;
    nama: string;
}

interface ExportGradesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    exportUrl: string;
    classes: ClassOption[];
}

export default function ExportGradesDialog({
    open,
    onOpenChange,
    title,
    exportUrl,
    classes,
}: ExportGradesDialogProps) {
    const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);

    const allSelected = useMemo(
        () => classes.length > 0 && selectedClassIds.length === classes.length,
        [classes.length, selectedClassIds.length]
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedClassIds(classes.map((c) => c.id));
        } else {
            setSelectedClassIds([]);
        }
    };

    const handleClassToggle = (classId: number, checked: boolean) => {
        if (checked) {
            setSelectedClassIds((prev) => [...prev, classId]);
        } else {
            setSelectedClassIds((prev) => prev.filter((id) => id !== classId));
        }
    };

    const handleExport = () => {
        // Send all selected class IDs to backend
        // Backend will create ZIP if multiple classes, or single Excel if one class
        const idsParam = selectedClassIds.join(",");
        const url = selectedClassIds.length > 0
            ? `${exportUrl}?kelas_ids=${idsParam}`
            : exportUrl;

        // Use anchor element to trigger download
        const link = document.createElement("a");
        link.href = url;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        onOpenChange(false);
    };

    // Reset selection when dialog opens
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            // Select all by default when opening
            setSelectedClassIds(classes.map((c) => c.id));
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <FileSpreadsheet className="h-4 w-4" />
                        Export Nilai
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Pilih kelas yang ingin di-export untuk {title}
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
                            {selectedClassIds.length} dari {classes.length} kelas dipilih
                        </span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {classes.map((kelas) => (
                            <div
                                key={kelas.id}
                                className="flex items-center gap-2 rounded-md border p-2 hover:bg-muted/50 transition-colors"
                            >
                                <Checkbox
                                    id={`class-${kelas.id}`}
                                    checked={selectedClassIds.includes(kelas.id)}
                                    onCheckedChange={(checked) =>
                                        handleClassToggle(kelas.id, checked === true)
                                    }
                                />
                                <label
                                    htmlFor={`class-${kelas.id}`}
                                    className="text-sm cursor-pointer flex-1"
                                >
                                    {kelas.nama}
                                </label>
                            </div>
                        ))}
                    </div>

                    {classes.length === 0 && (
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
                        disabled={selectedClassIds.length === 0}
                    >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Export ({selectedClassIds.length} kelas)
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
