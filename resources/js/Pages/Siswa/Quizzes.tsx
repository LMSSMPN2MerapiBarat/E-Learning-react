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
  const { student, hasClass, quizzes = [], auth } = props;
  const [quizList, setQuizList] = useState<QuizItem[]>(quizzes);
  const [resumeable, setResumeable] = useState<Record<number, boolean>>({});
  const [pendingQuiz, setPendingQuiz] = useState<QuizItem | null>(null);
  const [pendingTargetUrl, setPendingTargetUrl] = useState<string | null>(null);
  const currentUserId = auth?.user?.id ?? 0;

  useEffect(() => {
    setQuizList(quizzes);
  }, [quizzes]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updated: Record<number, boolean> = {};
    quizzes.forEach((quiz) => {
      const storageKey = `quiz-progress-${quiz.id}-${currentUserId}`;
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return;
        const saved = JSON.parse(raw) as { startTime?: number };
        if (!saved?.startTime) {
          window.localStorage.removeItem(storageKey);
          return;
        }
        const elapsedSeconds = Math.floor((Date.now() - saved.startTime) / 1000);
        const remaining = quiz.duration * 60 - elapsedSeconds;
        if (remaining > 0) {
          updated[quiz.id] = true;
        } else {
          window.localStorage.removeItem(storageKey);
        }
      } catch (error) {
        console.warn("Gagal membaca progres kuis untuk daftar kuis siswa.", error);
      }
    });
    setResumeable(updated);
  }, [quizzes, currentUserId]);

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

    if (resumeable[quiz.id]) {
      router.visit(targetUrl);
      return;
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

    // Tambahkan parameter autostart agar langsung mulai tanpa start screen
    const urlWithAutostart = pendingTargetUrl.includes("?")
      ? `${pendingTargetUrl}&autostart=1`
      : `${pendingTargetUrl}?autostart=1`;
    router.visit(urlWithAutostart);
    closeConfirmation();
  };

  return (
    <StudentLayout
      title="Kuis"
      subtitle={
        student.className
          ? `Kelas ${student.className} - Kerjakan kuis yang dibagikan guru`
          : "Silakan hubungi admin atau guru untuk penempatan kelas."
      }
    >
      <Head title="Kuis" />

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
          <StudentQuizList
            quizzes={quizList}
            onStartQuiz={startQuiz}
            resumeable={resumeable}
          />
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
