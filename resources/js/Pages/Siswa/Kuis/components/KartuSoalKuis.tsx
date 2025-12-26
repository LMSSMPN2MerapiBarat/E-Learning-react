import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/Components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import type { QuizQuestion, QuizQuestionOption } from "../../types";

interface KartuSoalKuisProps {
    question: QuizQuestion;
    questionIndex: number;
    selectedAnswer?: number;
    onAnswer: (questionId: number, optionOrder: number) => void;
}

export default function KartuSoalKuis({
    question,
    questionIndex,
    selectedAnswer,
    onAnswer,
}: KartuSoalKuisProps) {
    const [imageError, setImageError] = useState(false);

    // Reset image error state when question changes
    useEffect(() => {
        setImageError(false);
    }, [question.id]);

    return (
        <Card className="border-2 border-blue-100 shadow-md">
            <CardContent className="p-5">
                <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-base font-semibold text-white shadow-md">
                        {questionIndex + 1}
                    </div>
                    <div className="flex-1">
                        <p className="pt-1 text-sm text-gray-800">
                            {question.prompt}
                        </p>
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
            </CardContent>
        </Card>
    );
}
