import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { Upload, Sparkles, FileText, Loader2, Info, ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/Components/ui/utils";
import { toast } from "sonner";
import type { QuizQuestionForm, AIQuizResponse, AIQuota } from "./formTypes";

interface QuizAIGeneratorProps {
    onQuestionsGenerated: (questions: QuizQuestionForm[]) => void;
    initialQuota: AIQuota;
}

export default function QuizAIGenerator({ onQuestionsGenerated, initialQuota }: QuizAIGeneratorProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number | string>(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quota, setQuota] = useState<AIQuota>(initialQuota);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Validate file type
            const validTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];

            if (!validTypes.includes(selectedFile.type)) {
                setError("Format file tidak didukung. Gunakan file Word (.doc, .docx) atau PDF.");
                setFile(null);
                return;
            }

            // Validate file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("Ukuran file terlalu besar. Maksimal 10MB.");
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setError(null);
        }
    };

    const handleGenerate = async () => {
        if (!file) {
            setError("Silakan pilih file terlebih dahulu.");
            return;
        }

        const numQuestions = Number(numberOfQuestions);
        if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 50) {
            setError("Jumlah soal harus antara 1-50.");
            return;
        }

        // Check quota before starting
        if (quota && quota.remaining <= 0) {
            setError("Kuota harian habis. Coba lagi besok.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        const formData = new FormData();
        formData.append("document", file);
        formData.append("number_of_questions", numQuestions.toString());

        try {
            const response = await axios.post<AIQuizResponse>("/guru/kuis/generate-from-document", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const result = response.data;

            if (result.success && result.data) {
                // Update quota
                if (result.quota) {
                    setQuota(result.quota);
                }

                toast.success(`Berhasil membuat ${result.data.questions.length} soal dari dokumen!`);
                onQuestionsGenerated(result.data.questions);

                // Reset form
                setFile(null);
                setNumberOfQuestions(5);
                setIsExpanded(false);

                // Reset file input
                const fileInput = document.getElementById("document-upload") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            } else {
                throw new Error(result.message || "Gagal membuat kuis");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat membuat kuis";

            // Update quota if provided in error response (429)
            if (err.response?.data?.quota) {
                setQuota(err.response.data.quota);
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    // Collapsed state - show button only
    if (!isExpanded) {
        return (
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 flex-shrink-0">
                                <Sparkles className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Buat Kuis dengan AI</h3>
                                <p className="text-xs text-gray-500">Upload dokumen materi untuk membuat soal otomatis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Badge
                                variant={quota.remaining > 10 ? "default" : quota.remaining > 0 ? "secondary" : "destructive"}
                                className={cn(
                                    "font-semibold whitespace-nowrap text-xs flex-shrink-0",
                                    quota.remaining <= 10 && quota.remaining > 0 && "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent"
                                )}
                            >
                                {quota.remaining}/{quota.limit}
                            </Badge>
                            <Button
                                onClick={() => setIsExpanded(true)}
                                className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-initial"
                                size="sm"
                            >
                                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Buat Soal dengan AI</span>
                                <span className="sm:hidden">Gunakan AI</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Expanded state - show full interface
    return (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg">Buat Kuis dengan AI</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <CardDescription>
                    Upload dokumen materi pembelajaran (Word/PDF) untuk membuat kuis otomatis menggunakan AI
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-blue-900">Kuota Harian AI</span>
                    </div>
                    <Badge
                        variant={quota.remaining > 10 ? "default" : quota.remaining > 0 ? "secondary" : "destructive"}
                        className={cn(
                            "font-semibold whitespace-nowrap",
                            quota.remaining <= 10 && quota.remaining > 0 && "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent"
                        )}
                    >
                        {quota.remaining}/{quota.limit} tersisa
                    </Badge>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                        <Label htmlFor="document-upload" className="flex items-center gap-2 font-medium">
                            <FileText className="h-4 w-4" />
                            Dokumen Materi
                        </Label>

                        <div className="relative group">
                            <Input
                                id="document-upload"
                                type="file"
                                accept=".doc,.docx,.pdf"
                                onChange={handleFileChange}
                                disabled={isGenerating}
                                className="hidden"
                            />
                            <label
                                htmlFor="document-upload"
                                className={cn(
                                    "flex flex-col items-center justify-center w-full min-h-[120px] px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                                    "border-gray-300 bg-gray-50 hover:bg-purple-50 hover:border-purple-400",
                                    isGenerating && "opacity-50 cursor-not-allowed",
                                    file && "border-purple-500 bg-purple-50"
                                )}
                            >
                                {file ? (
                                    <div className="text-center">
                                        <FileText className="h-10 w-10 text-purple-600 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-purple-700 break-all">{file.name}</p>
                                        <p className="text-xs text-purple-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                        <p className="text-xs text-gray-500 mt-2">Klik untuk ganti file</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2 group-hover:text-purple-500 transition-colors" />
                                        <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                                            Klik untuk upload dokumen
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Word (.doc, .docx) atau PDF (Mak. 10MB)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="num-questions" className="font-medium">Jumlah Soal</Label>
                        <div className="relative">
                            <Input
                                id="num-questions"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={numberOfQuestions}
                                onChange={(e) => {
                                    const val = e.target.value;

                                    // Allow empty string to let user delete everything
                                    if (val === "") {
                                        setNumberOfQuestions("" as any);
                                        return;
                                    }

                                    // Check if it's a valid number
                                    if (!/^\d+$/.test(val)) return;

                                    const num = parseInt(val);

                                    // Logic: if > 50, cap at 50. If 0, allow it temporarily or set to 1? 
                                    // User said "minim 1", usually we correct on blur, but let's cap max immediately for better UX
                                    if (num > 50) {
                                        setNumberOfQuestions(50);
                                    } else {
                                        setNumberOfQuestions(num);
                                    }
                                }}
                                onBlur={() => {
                                    // Set default validation on blur
                                    if (numberOfQuestions === "" || (typeof numberOfQuestions === 'number' && numberOfQuestions < 1)) {
                                        setNumberOfQuestions(1);
                                    } else if (typeof numberOfQuestions === 'number' && numberOfQuestions > 50) {
                                        setNumberOfQuestions(50);
                                    }
                                }}
                                disabled={isGenerating}
                                className="h-12 text-lg"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                                Soal
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Masukkan jumlah soal yang diinginkan (1-50)
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsExpanded(false)}
                        disabled={isGenerating}
                        className="flex-1 sm:flex-none"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={!file || isGenerating}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sedang membuat kuis...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Kuis dengan AI
                            </>
                        )}
                    </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                    AI akan menganalisis materi dan membuat soal sesuai bahasa dokumen
                </p>
            </CardContent>
        </Card>
    );
}

