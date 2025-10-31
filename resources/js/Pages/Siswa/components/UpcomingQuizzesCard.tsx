import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  Calendar,
  FileQuestion,
  Timer,
  Users,
} from "lucide-react";
import type { QuizItem } from "@/Pages/Siswa/types";

interface UpcomingQuizzesCardProps {
  items: QuizItem[];
  routeHelper?: (name: string, params?: Record<string, unknown>) => string;
}

const UpcomingQuizzesCard: React.FC<UpcomingQuizzesCardProps> = ({
  items,
  routeHelper,
}) => {
  const quizzesUrl = routeHelper ? routeHelper("siswa.quizzes") : "#";

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Kuis Untuk Dikerjakan</CardTitle>
          <p className="text-sm text-gray-500">
            Cek kuis terbaru sesuai kelas Anda.
          </p>
        </div>
        <Button variant="link" className="text-blue-600" asChild>
          <Link href={quizzesUrl}>Lihat semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
            Belum ada kuis yang tersedia.
          </div>
        ) : (
          items.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {quiz.title}
                  </p>
                  {quiz.subject && (
                    <Badge variant="outline" className="mt-1">
                      {quiz.subject}
                    </Badge>
                  )}
                </div>
              </div>
              {quiz.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {quiz.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FileQuestion className="h-3 w-3" />
                  {quiz.totalQuestions} soal
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {quiz.duration} menit
                </span>
                {quiz.latestAttempt && (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Calendar className="h-3 w-3" />
                    Nilai terakhir: {quiz.latestAttempt.score}
                  </span>
                )}
                {quiz.classNames.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {quiz.classNames.join(", ")}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingQuizzesCard;
