import { motion } from "motion/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { CheckCircle, ClipboardList } from "lucide-react";
import type { QuizQuestion } from "../../types";

type AnswerMap = Record<number, number>;

interface PanelNavigasiSoalProps {
    questions: QuizQuestion[];
    answers: AnswerMap;
    currentQuestionIndex: number;
    isSubmitting: boolean;
    onJumpToQuestion: (index: number) => void;
    onSubmit: () => void;
}

export default function PanelNavigasiSoal({
    questions,
    answers,
    currentQuestionIndex,
    isSubmitting,
    onJumpToQuestion,
    onSubmit,
}: PanelNavigasiSoalProps) {
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;

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
                </div>

                <div className="mb-4 grid grid-cols-5 gap-1.5">
                    {questions.map((question: QuizQuestion, index) => {
                        const status = getQuestionStatus(question.id);
                        const isActive = index === currentQuestionIndex;

                        return (
                            <motion.button
                                key={question.id}
                                onClick={() => onJumpToQuestion(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex aspect-square items-center justify-center rounded-md border-2 text-xs transition-all ${isActive
                                    ? "border-blue-600 bg-blue-600 text-white shadow-md"
                                    : status === "answered"
                                        ? "border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                                    }`}
                            >
                                {index + 1}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="mb-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-md border-2 border-blue-600 bg-blue-600" />
                        <span className="text-gray-600">Soal aktif</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-md border-2 border-green-500 bg-green-50" />
                        <span className="text-gray-600">Sudah dijawab</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-md border-2 border-gray-300 bg-white" />
                        <span className="text-gray-600">Belum dijawab</span>
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
