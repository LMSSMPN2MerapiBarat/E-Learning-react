import { Button } from "@/Components/ui/button";
import { ClipboardList, Clock, X } from "lucide-react";
import type { QuizItem } from "../../types";

interface HeaderUjianKuisProps {
    quiz: QuizItem;
    timeLeft: number;
    onExit: () => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};

const getTimeColor = (timeLeft: number) => {
    if (timeLeft <= 60) {
        return "bg-red-100 text-red-700 border-red-200";
    }
    if (timeLeft <= 300) {
        return "bg-orange-100 text-orange-700 border-orange-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
};

export default function HeaderUjianKuis({
    quiz,
    timeLeft,
    onExit,
}: HeaderUjianKuisProps) {
    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="container mx-auto px-3 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-md bg-gradient-to-br from-blue-600 to-blue-700 p-1.5">
                            <ClipboardList className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                {quiz.title}
                            </h2>
                            {quiz.subject && (
                                <p className="text-xs text-gray-600">{quiz.subject}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 ${getTimeColor(timeLeft)}`}
                        >
                            <Clock className="h-4 w-4" />
                            <span className="text-base font-semibold">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onExit}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
