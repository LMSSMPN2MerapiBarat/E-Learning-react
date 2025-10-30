import { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import StudentQuizList from "./components/StudentQuizList";
import QuizAttemptDialog from "./components/QuizAttemptDialog";
import type { QuizAttemptLite, QuizItem, SiswaPageProps } from "./types";

export default function Quizzes() {
  const { props } = usePage<SiswaPageProps>();
  const { student, hasClass, quizzes = [] } = props;
  const [quizList, setQuizList] = useState<QuizItem[]>(quizzes);
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);

  useEffect(() => {
    setQuizList(quizzes);
  }, [quizzes]);

  const startQuiz = (quiz: QuizItem) => {
    if (quiz.questions.length === 0) return;
    setActiveQuiz(quiz);
  };

  const closeQuiz = () => setActiveQuiz(null);

  const handleAttemptSubmitted = (attempt: QuizAttemptLite) => {
    if (!activeQuiz) return;

    setQuizList((prev) =>
      prev.map((item) =>
        item.id === activeQuiz.id
          ? {
              ...item,
              latestAttempt: attempt,
            }
          : item,
      ),
    );

    setActiveQuiz((prev) =>
      prev
        ? {
            ...prev,
            latestAttempt: attempt,
          }
        : prev,
    );
  };

  return (
    <StudentLayout
      title="Kuis Interaktif"
      subtitle={
        student.className
          ? `Kelas ${student.className} - Kerjakan kuis yang dibagikan guru`
          : "Silakan hubungi admin atau guru untuk penempatan kelas."
      }
    >
      <Head title="Kuis Interaktif" />

      <div className="space-y-6">
        {!hasClass && (
          <Alert className="border-l-4 border-l-amber-500">
            <AlertDescription>
              Akun Anda belum terhubung ke kelas. Hubungi admin atau guru agar
              bisa mengikuti kuis.
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StudentQuizList quizzes={quizList} onStartQuiz={startQuiz} />
        </motion.div>
      </div>

      {activeQuiz && (
        <QuizAttemptDialog
          quiz={activeQuiz}
          onClose={closeQuiz}
          onSubmitted={handleAttemptSubmitted}
        />
      )}
    </StudentLayout>
  );
}
