import { motion } from "motion/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { CheckCircle, ClipboardList, Flag } from "lucide-react";
import type { QuizQuestion } from "../../types";

type AnswerMap = Record<number, number>;
type MarkedSet = Set<number>;

interface PanelNavigasiSoalProps {
    questions: QuizQuestion[];
    answers: AnswerMap;
    markedQuestions?: MarkedSet;
    currentQuestionIndex: number;
    isSubmitting: boolean;
    onJumpToQuestion: (index: number) => void;
    onSubmit: () => void;
}

export default function PanelNavigasiSoal({
    questions,
    answers,
    markedQuestions = new Set(),
    currentQuestionIndex,
    isSubmitting,
    onJumpToQuestion,
    onSubmit,
}: PanelNavigasiSoalProps) {
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const markedCount = markedQuestions.size;

    const getQuestionStatus = (questionId: number) =>
        answers[questionId] !== undefined ? "answered" : "unanswered";

    return (
        <Card className="sticky top-20 shadow-md">
            <CardContent className="p-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-800">
                    <ClipboardList className="h-4 w-4" />
                    Navigasi Soal
                </h3>

                <div className="mb-3 rounded-md bg-blue-50 p-2 text-xs">
                    <div className="mb-0.5 flex justify-between">
                        <span className="text-gray-600">Terjawab:</span>
                        <span className="font-medium">
                            {answeredCount}/{totalQuestions}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Belum dijawab:</span>
                        <span className="font-medium">
                            {totalQuestions - answeredCount}
                        </span>
                    </div>
                    {markedCount > 0 && (
                        <div className="flex justify-between text-orange-600">
                            <span>Ditandai:</span>
                            <span className="font-medium">{markedCount}</span>
                        </div>
                    )}
                </div>

                <div className="mb-3 grid grid-cols-8 gap-1">
                    {questions.map((question: QuizQuestion, index) => {
                        const status = getQuestionStatus(question.id);
                        const isActive = index === currentQuestionIndex;
                        const isMarked = markedQuestions.has(question.id);

                        return (
                            <motion.button
                                key={question.id}
                                onClick={() => onJumpToQuestion(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative flex h-7 w-7 items-center justify-center rounded text-[11px] font-medium transition-all ${isActive
                                    ? "border border-blue-600 bg-blue-600 text-white shadow-sm"
                                    : isMarked
                                        ? "border border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                        : status === "answered"
                                            ? "border border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                                            : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                    }`}
                            >
                                {index + 1}
                                {isMarked && !isActive && (
                                    <Flag className="absolute -top-0.5 -right-0.5 h-2 w-2 text-orange-500" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="mb-3 flex flex-wrap gap-2 text-[10px]">
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded border border-blue-600 bg-blue-600" />
                        <span className="text-gray-600">Aktif</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded border border-green-500 bg-green-50" />
                        <span className="text-gray-600">Dijawab</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded border border-orange-400 bg-orange-50" />
                        <span className="text-gray-600">Ditandai</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-4 rounded border border-gray-300 bg-white" />
                        <span className="text-gray-600">Belum</span>
                    </div>
                </div>

                <Button
                    onClick={onSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-xs"
                    size="sm"
                    disabled={isSubmitting}
                >
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                    {isSubmitting ? "Mengumpulkan..." : "Kumpulkan Kuis"}
                </Button>
            </CardContent>
        </Card>
    );
}

