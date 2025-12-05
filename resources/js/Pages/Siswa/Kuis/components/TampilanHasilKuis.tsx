import { motion } from "motion/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Award, CheckCircle, XCircle } from "lucide-react";
import type { QuizAttemptLite, QuizQuestion } from "../../types";

type AnswerMap = Record<number, number>;

interface TampilanHasilKuisProps {
    questions: QuizQuestion[];
    answers: AnswerMap;
    result: QuizAttemptLite | null;
    onFinish: () => void;
}

export default function TampilanHasilKuis({
    questions,
    answers,
    result,
    onFinish,
}: TampilanHasilKuisProps) {
    const totalQuestions = questions.length;

    const calculateScore = () => {
        if (!totalQuestions) return 0;
        const correct = questions.reduce((count, question) => {
            return answers[question.id] === question.correctAnswer
                ? count + 1
                : count;
        }, 0);
        return Math.round((correct / totalQuestions) * 100);
    };

    const effectiveScore = result?.score ?? calculateScore();
    const correctTotal =
        result?.correctAnswers ??
        questions.reduce(
            (count, question) =>
                answers[question.id] === question.correctAnswer ? count + 1 : count,
            0
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="mx-auto max-w-4xl">
                <Card className="shadow-xl">
                    <CardContent className="p-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="mb-8 text-center"
                        >
                            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg">
                                <Award className="h-20 w-20 text-yellow-600" />
                            </div>
                            <h2 className="mb-2 text-2xl font-semibold">
                                Kuis Selesai!
                            </h2>
                            <p className="mb-4 text-6xl font-bold text-gray-800">
                                {effectiveScore}
                            </p>
                            <p className="mb-2 text-gray-600">
                                {correctTotal} dari {totalQuestions} jawaban benar
                            </p>
                            <Badge
                                className={`px-4 py-2 text-lg ${effectiveScore >= 80
                                    ? "bg-green-500"
                                    : effectiveScore >= 60
                                        ? "bg-blue-500"
                                        : "bg-orange-500"
                                    }`}
                            >
                                {effectiveScore >= 80
                                    ? "Luar biasa!"
                                    : effectiveScore >= 60
                                        ? "Bagus!"
                                        : "Tetap semangat!"}
                            </Badge>
                        </motion.div>

                        <div className="mb-6 space-y-4">
                            <h3 className="text-lg font-semibold">
                                Review Jawaban Detail
                            </h3>
                            {questions.map((question, index) => {
                                const selectedOrder = answers[question.id];
                                const isCorrect =
                                    selectedOrder !== undefined &&
                                    selectedOrder === question.correctAnswer;
                                const isAnswered = selectedOrder !== undefined;

                                const selectedOption = isAnswered
                                    ? question.options.find(
                                        (option) => option.order === selectedOrder
                                    )
                                    : null;
                                const correctOption = question.options.find(
                                    (option) => option.order === question.correctAnswer
                                );

                                return (
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            className={`border-l-4 ${isAnswered
                                                ? isCorrect
                                                    ? "border-l-green-500 bg-green-50/30"
                                                    : "border-l-red-500 bg-red-50/30"
                                                : "border-l-gray-300"
                                                }`}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    {isAnswered ? (
                                                        isCorrect ? (
                                                            <div className="rounded-full bg-green-100 p-2">
                                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                            </div>
                                                        ) : (
                                                            <div className="rounded-full bg-red-100 p-2">
                                                                <XCircle className="h-5 w-5 text-red-600" />
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-300">
                                                            <span className="text-xs text-gray-500">?</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="mb-3 text-gray-800">
                                                            <span className="font-medium">{index + 1}.</span>{" "}
                                                            {question.prompt}
                                                        </p>
                                                        {isAnswered ? (
                                                            <div className="space-y-2 text-sm">
                                                                {selectedOption && (
                                                                    <div
                                                                        className={`rounded-lg p-3 ${isCorrect
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                            }`}
                                                                    >
                                                                        <span className="font-medium">
                                                                            Jawaban Anda:
                                                                        </span>{" "}
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                            question.options.findIndex(
                                                                                (opt) => opt.order === selectedOrder
                                                                            )
                                                                        )}
                                                                        . {selectedOption.text}
                                                                    </div>
                                                                )}
                                                                {!isCorrect && correctOption && (
                                                                    <div className="rounded-lg bg-green-100 p-3 text-green-800">
                                                                        <span className="font-medium">
                                                                            Jawaban Benar:
                                                                        </span>{" "}
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                            question.options.findIndex(
                                                                                (opt) =>
                                                                                    opt.order === question.correctAnswer
                                                                            )
                                                                        )}
                                                                        . {correctOption.text}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm italic text-gray-500">
                                                                Tidak dijawab
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <Button onClick={onFinish} className="w-full" size="lg">
                            Kembali ke Daftar Kuis
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
