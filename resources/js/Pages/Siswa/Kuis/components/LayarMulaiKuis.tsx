import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { ClipboardList, Clock } from "lucide-react";
import type { QuizItem } from "../../types";

interface LayarMulaiKuisProps {
    quiz: QuizItem;
    totalQuestions: number;
    backUrl: string;
    onStart: () => void;
}

export default function LayarMulaiKuis({
    quiz,
    totalQuestions,
    backUrl,
    onStart,
}: LayarMulaiKuisProps) {
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <Card className="max-w-2xl w-full shadow-xl">
                <CardContent className="p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <ClipboardList className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                        {quiz.subject && (
                            <p className="text-gray-600">{quiz.subject}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Guru Pengampu</p>
                            <p className="font-medium">{quiz.teacher || "-"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Durasi Pengerjaan</p>
                            <p className="font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-500" />
                                {quiz.duration} Menit
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Jumlah Soal</p>
                            <p className="font-medium">{totalQuestions} Soal</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500">Batas Percobaan</p>
                            <p className="font-medium">
                                {quiz.maxAttempts ? `${quiz.maxAttempts}x` : "Tidak terbatas"}
                            </p>
                        </div>
                    </div>

                    {quiz.description && (
                        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                            <p className="font-semibold mb-1">Deskripsi:</p>
                            <p>{quiz.description}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            className="w-full text-lg h-12"
                            onClick={onStart}
                        >
                            Mulai Kerjakan Sekarang
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.visit(backUrl)}
                        >
                            Kembali
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
