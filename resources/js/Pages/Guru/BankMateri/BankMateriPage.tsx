import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Search,
    Plus,
    ChevronRight,
    Home,
    FileText,
    Upload,
} from "lucide-react";
import BankMateriCard from "./components/BankMateriCard";
import UploadMateriDialog from "./components/UploadMateriDialog";
import EditMateriDialog from "./components/EditMateriDialog";
import { cn } from "@/Components/ui/utils";

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

interface Props {
    bankMateris: BankMateriItem[];
}

export default function BankMateriPage({ bankMateris }: Props) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<"all" | "pdf" | "word" | "ppt">(
        "all"
    );

    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editItem, setEditItem] = useState<BankMateriItem | null>(null);

    const filteredItems = bankMateris.filter((item) => {
        const matchesSearch = item.nama
            .toLowerCase()
            .includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (filterType === "all") return true;
        if (filterType === "pdf") return item.file_mime?.includes("pdf");
        if (filterType === "word") return item.file_mime?.includes("word") || item.file_mime?.includes("document");
        if (filterType === "ppt") return item.file_mime?.includes("presentation") || item.file_mime?.includes("powerpoint");

        return true;
    });

    const handleEdit = (item: BankMateriItem) => {
        setEditItem(item);
        setIsEditOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
            router.delete(`/guru/bank-materi/${id}`, {
                onSuccess: () => {
                    toast.success("Materi berhasil dihapus");
                },
                onError: () => {
                    toast.error("Gagal menghapus materi");
                },
            });
        }
    };

    const tabs = [
        { id: "all", label: "Semua" },
        { id: "pdf", label: "PDF" },
        { id: "word", label: "Word" },
        { id: "ppt", label: "PowerPoint" },
    ] as const;

    return (
        <TeacherLayout title="Bank Materi">
            <Head title="Bank Materi" />

            <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 space-y-4">
                        {/* Header & Controls */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div>
                                    <h1 className="text-base font-semibold text-gray-900">Bank Materi</h1>
                                    <p className="text-gray-500 text-sm mt-0.5">
                                        Kelola koleksi materi pembelajaran Anda di satu tempat.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setIsUploadOpen(true)}
                                    size="sm"
                                    className="bg-black hover:bg-blue-700 shadow-sm transition-all hover:shadow-md"
                                >
                                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                                    Upload Materi
                                </Button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-gray-50/50 p-1.5 rounded-lg border border-gray-100">
                                <div className="flex gap-0.5 bg-white p-0.5 rounded-md border border-gray-200 shadow-sm w-full md:w-auto">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setFilterType(tab.id)}
                                            className={cn(
                                                "flex-1 md:flex-none px-3 py-1 rounded text-xs font-medium transition-all duration-200",
                                                filterType === tab.id
                                                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-56">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <Input
                                        placeholder="Cari materi..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-8 h-8 text-sm bg-white border-gray-200 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        {filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/30">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-gray-100">
                                    <FileText className="w-6 h-6 text-gray-300" />
                                </div>
                                <h3 className="text-base font-medium text-gray-900 mb-1">Tidak ada materi ditemukan</h3>
                                <p className="text-gray-500 text-xs max-w-xs text-center mb-4">
                                    {search || filterType !== 'all'
                                        ? "Coba ubah kata kunci pencarian atau filter tipe file Anda."
                                        : "Mulai dengan mengunggah materi pertama Anda ke Bank Materi."}
                                </p>
                                {!search && filterType === 'all' && (
                                    <Button onClick={() => setIsUploadOpen(true)} variant="outline" size="sm">
                                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                                        Upload Materi Baru
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredItems.map((item) => (
                                    <BankMateriCard
                                        key={item.id}
                                        item={item}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <UploadMateriDialog
                open={isUploadOpen}
                onOpenChange={setIsUploadOpen}
                onSuccess={() => {
                    // Refresh logic usually handled by Inertia reactivity, 
                    // but we can add specific handling if needed.
                }}
            />

            <EditMateriDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                item={editItem}
                onSuccess={() => setEditItem(null)}
            />
        </TeacherLayout>
    );
}
