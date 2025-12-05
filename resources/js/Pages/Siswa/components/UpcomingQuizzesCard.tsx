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
  ClipboardList,
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
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Kuis Untuk Dikerjakan</CardTitle>
          <p className="text-xs text-gray-500">
            Cek kuis terbaru sesuai kelas Anda.
          </p>
        </div>
        <Button variant="link" className="text-blue-600 text-xs" asChild>
          <Link href={quizzesUrl}>Lihat semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-xs text-gray-500">
            Belum ada kuis yang tersedia.
          </div>
        ) : (
          items.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-md border border-emerald-100 bg-emerald-50/40 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {quiz.title}
                  </p>
                  {quiz.subject && (
                    <Badge variant="outline" className="mt-0.5 text-[10px]">
                      {quiz.subject}
                    </Badge>
                  )}
                </div>
              </div>
              {quiz.description && (
                <p className="mt-1.5 line-clamp-2 text-xs text-gray-600">
                  {quiz.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-500">
                <span className="flex items-center gap-0.5">
                  <ClipboardList className="h-2.5 w-2.5" />
                  {quiz.totalQuestions} soal
                </span>
                <span className="flex items-center gap-0.5">
                  <Timer className="h-2.5 w-2.5" />
                  {quiz.duration} menit
                </span>
                {quiz.latestAttempt && (
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <Calendar className="h-2.5 w-2.5" />
                    Nilai terakhir: {quiz.latestAttempt.score}
                  </span>
                )}
                {quiz.classNames.length > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Users className="h-2.5 w-2.5" />
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
