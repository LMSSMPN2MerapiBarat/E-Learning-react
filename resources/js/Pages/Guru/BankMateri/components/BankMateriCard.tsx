import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    FileText,
    MoreVertical,
    Download,
    Pencil,
    Trash2,
    Calendar,
    HardDrive,
} from "lucide-react";

interface BankMateriItem {
    id: number;
    nama: string;
    deskripsi: string | null;
    file_name: string | null;
    file_url: string | null;
    file_mime: string | null;
    file_size: number | null;
    status: "published" | "draft";
    created_at: string;
}

interface BankMateriCardProps {
    item: BankMateriItem;
    onEdit: (item: BankMateriItem) => void;
    onDelete: (id: number) => void;
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileColor(mime: string | null) {
    if (mime?.includes("pdf")) return "bg-red-50 text-red-600 border-red-100";
    if (mime?.includes("word") || mime?.includes("document"))
        return "bg-blue-50 text-blue-600 border-blue-100";
    if (mime?.includes("presentation") || mime?.includes("powerpoint"))
        return "bg-orange-50 text-orange-600 border-orange-100";
    return "bg-gray-50 text-gray-600 border-gray-100";
}

function getFileExtension(mime: string | null, fileName: string | null): string {
    if (mime?.includes("pdf")) return "PDF";
    if (mime?.includes("wordprocessingml") || mime?.includes("msword")) {
        return fileName?.endsWith(".docx") ? "DOCX" : "DOC";
    }
    if (mime?.includes("presentationml") || mime?.includes("powerpoint")) {
        return fileName?.endsWith(".pptx") ? "PPTX" : "PPT";
    }
    // Fallback: extract from filename
    if (fileName) {
        const ext = fileName.split(".").pop()?.toUpperCase();
        return ext || "FILE";
    }
    return "FILE";
}

function getExtensionBadgeColor(mime: string | null) {
    if (mime?.includes("pdf")) return "bg-red-100 text-red-700";
    if (mime?.includes("word") || mime?.includes("document")) return "bg-blue-100 text-blue-700";
    if (mime?.includes("presentation") || mime?.includes("powerpoint")) return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
}

export default function BankMateriCard({
    item,
    onEdit,
    onDelete,
}: BankMateriCardProps) {
    return (
        <div className="group bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
            <div className="p-3 flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                        className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center border ${getFileColor(
                            item.file_mime
                        )}`}
                    >
                        <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-semibold ${getExtensionBadgeColor(item.file_mime)}`}>
                            {getFileExtension(item.file_mime, item.file_name)}
                        </span>
                        <Badge
                            variant={item.status === "published" ? "default" : "secondary"}
                            className={`text-[9px] px-1.5 py-0 h-4 font-normal ${item.status === "published"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"
                                }`}
                        >
                            {item.status === "published" ? "Publik" : "Draft"}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {item.file_url && (
                                    <DropdownMenuItem asChild>
                                        <a
                                            href={`/guru/bank-materi/${item.id}/download`}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <Download className="w-4 h-4" /> Download
                                        </a>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => onEdit(item)}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(item.id)}
                                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" /> Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <h3 className="font-semibold text-sm text-gray-900 leading-tight mb-0.5 line-clamp-2" title={item.nama}>
                    {item.nama}
                </h3>

                <p className="text-[11px] text-gray-500 line-clamp-2 mb-2 h-7">
                    {item.deskripsi || <span className="italic text-gray-400">Tidak ada deskripsi</span>}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-auto">
                    <div className="flex items-center gap-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>
                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <HardDrive className="w-3 h-3" />
                        <span>{formatFileSize(item.file_size)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
