import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/Components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Flag, X } from "lucide-react";
import type { QuizQuestion, QuizQuestionOption } from "../../types";

interface KartuSoalKuisProps {
    question: QuizQuestion;
    questionIndex: number;
    selectedAnswer?: number;
    isMarked?: boolean;
    onAnswer: (questionId: number, optionOrder: number) => void;
    onClearAnswer?: (questionId: number) => void;
    onToggleMark?: (questionId: number) => void;
}

export default function KartuSoalKuis({
    question,
    questionIndex,
    selectedAnswer,
    isMarked = false,
    onAnswer,
    onClearAnswer,
    onToggleMark,
}: KartuSoalKuisProps) {
    const [imageError, setImageError] = useState(false);

    // Reset image error state when question changes
    useEffect(() => {
        setImageError(false);
    }, [question.id]);

    return (
        <Card className={`border-2 shadow-md ${isMarked ? 'border-orange-400 bg-orange-50/30' : 'border-blue-100'}`}>
            <CardContent className="p-5">
                <div className="mb-4 flex items-start gap-3">
                    <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-base font-semibold text-white shadow-md ${isMarked ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-blue-600 to-blue-700'}`}>
                        {questionIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2">
                            <p className="pt-1 text-sm text-gray-800 flex-1">
                                {question.prompt}
                            </p>
                            {isMarked && (
                                <span className="text-[10px] text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                                    <Flag className="h-3 w-3" />
                                    Ditandai
                                </span>
                            )}
                        </div>
                        {question.image && !imageError && (
                            <div className="mt-3">
                                <img
                                    src={question.image}
                                    alt={`Gambar soal ${questionIndex + 1}`}
                                    className="max-w-full rounded-lg border border-gray-200 object-contain shadow-sm"
                                    style={{
                                        maxHeight: 300,
                                    }}
                                    onError={() => setImageError(true)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <RadioGroup
                    value={
                        selectedAnswer !== undefined
                            ? String(selectedAnswer)
                            : ""
                    }
                    onValueChange={(value) =>
                        onAnswer(question.id, Number.parseInt(value, 10))
                    }
                    className="space-y-2"
                >
                    {question.options.map((option: QuizQuestionOption, index: number) => {
                        const isSelected = selectedAnswer === option.order;
                        const optionId = `answer-${question.id}-${option.order}`;
                        return (
                            <motion.div
                                key={optionId}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => onAnswer(question.id, option.order)}
                                className="cursor-pointer"
                            >
                                <div
                                    className={`flex items-center space-x-2.5 rounded-lg border-2 p-3 transition-all ${isSelected
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                        }`}
                                >
                                    <RadioGroupItem
                                        value={String(option.order)}
                                        id={optionId}
                                        className="pointer-events-none"
                                    />
                                    <Label
                                        htmlFor={optionId}
                                        className="flex flex-1 cursor-pointer items-center gap-2 pointer-events-none"
                                    >
                                        <span
                                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isSelected
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span className="text-xs text-gray-800">
                                            {option.text}
                                        </span>
                                    </Label>
                                </div>
                            </motion.div>
                        );
                    })}
                </RadioGroup>

                {/* Action buttons */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`text-xs w-full sm:w-auto ${isMarked ? 'border-orange-400 bg-orange-50 text-orange-600 hover:bg-orange-100' : 'text-gray-600 hover:text-orange-600'}`}
                        onClick={() => onToggleMark?.(question.id)}
                    >
                        <Flag className="mr-1.5 h-3 w-3" />
                        {isMarked ? 'Hapus Tandai' : 'Tandai Soal'}
                    </Button>
                    {selectedAnswer !== undefined && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                            onClick={() => onClearAnswer?.(question.id)}
                        >
                            <X className="mr-1.5 h-3 w-3" />
                            Batalkan Jawaban
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

