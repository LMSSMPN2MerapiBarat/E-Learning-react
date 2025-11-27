import { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import StudentQuizList from "./components/StudentQuizList";
import type { QuizItem, SiswaPageProps } from "./types";
import { toast } from "sonner";

export default function Quizzes() {
  const { props } = usePage<SiswaPageProps>();
  const { student, hasClass, quizzes = [] } = props;
  const [quizList, setQuizList] = useState<QuizItem[]>(quizzes);
  const [pendingQuiz, setPendingQuiz] = useState<QuizItem | null>(null);
  const [pendingTargetUrl, setPendingTargetUrl] = useState<string | null>(null);

  useEffect(() => {
    setQuizList(quizzes);
  }, [quizzes]);

  const startQuiz = (quiz: QuizItem) => {
    if (quiz.questions.length === 0) {
      toast.error("Kuis belum memiliki soal untuk dikerjakan.");
      return;
    }
    if (quiz.maxAttempts !== undefined && quiz.maxAttempts !== null) {
      const remaining = quiz.remainingAttempts ?? 0;
      if (remaining <= 0) {
        toast.error("Anda sudah menggunakan seluruh percobaan untuk kuis ini.");
        return;
      }
    }
    if (quiz.isAvailable === false) {
      const now = Date.now();
      const isExpired =
        quiz.availableUntil !== undefined &&
        quiz.availableUntil !== null &&
        new Date(quiz.availableUntil).getTime() < now;
      toast.error(
        isExpired
          ? "Kuis ini sudah melewati batas waktu pengerjaan."
          : "Kuis belum tersedia pada waktu ini.",
      );
      return;
    }
    let targetUrl = `/siswa/quizzes/${quiz.id}`;
    try {
      if (typeof route === "function") {
        targetUrl = route("siswa.quizzes.show", quiz.id);
      }
    } catch (error) {
      console.warn("Ziggy route siswa.quizzes.show tidak ditemukan, fallback ke URL manual.", error);
    }

    setPendingQuiz(quiz);
    setPendingTargetUrl(targetUrl);
  };

  const closeConfirmation = () => {
    setPendingQuiz(null);
    setPendingTargetUrl(null);
  };

  const confirmStartQuiz = () => {
    if (!pendingTargetUrl) {
      closeConfirmation();
      return;
    }

    router.visit(pendingTargetUrl);
    closeConfirmation();
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

      <AlertDialog
        open={pendingQuiz !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeConfirmation();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mulai mengerjakan kuis?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan membuka kuis
              {pendingQuiz?.title ? ` "${pendingQuiz.title}"` : ""}. Pastikan
              sudah siap mengerjakan karena waktu akan berjalan setelah Anda
              masuk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStartQuiz}
              className="bg-green-600 hover:bg-green-700"
            >
              Ya, mulai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </StudentLayout>
  );
}
