import { router } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

interface DialogKonfirmasiKuisProps {
    type: "exit" | "submit";
    open: boolean;
    onOpenChange: (open: boolean) => void;
    backUrl?: string;
    answeredCount?: number;
    totalQuestions?: number;
    isSubmitting?: boolean;
    onSubmit?: () => void;
}

export default function DialogKonfirmasiKuis({
    type,
    open,
    onOpenChange,
    backUrl = "",
    answeredCount = 0,
    totalQuestions = 0,
    isSubmitting = false,
    onSubmit,
}: DialogKonfirmasiKuisProps) {
    if (type === "exit") {
        return (
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Keluar dari Kuis?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Jika Anda keluar sekarang, jawaban Anda tidak akan disimpan dan
                            Anda harus mengerjakan dari awal lagi. Apakah Anda yakin?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => router.visit(backUrl)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Ya, Keluar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Kumpulkan Kuis?</AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="space-y-2">
                            <p>Anda akan mengumpulkan kuis dengan detail:</p>
                            <div className="rounded-lg bg-blue-50 p-3 text-sm">
                                <p>
                                    <span className="font-medium">Terjawab:</span>{" "}
                                    {answeredCount} dari {totalQuestions} soal
                                </p>
                                <p>
                                    <span className="font-medium">Belum dijawab:</span>{" "}
                                    {totalQuestions - answeredCount} soal
                                </p>
                            </div>
                            <p className="text-red-600">
                                Setelah dikumpulkan, Anda tidak dapat mengubah jawaban lagi.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Periksa Lagi</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onSubmit}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Mengumpulkan..." : "Ya, Kumpulkan"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
