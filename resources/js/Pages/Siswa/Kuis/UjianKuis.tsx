import { useCallback, useEffect, useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import type { QuizAttemptLite, QuizItem } from "../types";
import type { PageProps } from "@/types";
import LayarMulaiKuis from "./components/LayarMulaiKuis";
import HeaderUjianKuis from "./components/HeaderUjianKuis";
import KartuSoalKuis from "./components/KartuSoalKuis";
import PanelNavigasiSoal from "./components/PanelNavigasiSoal";

import DialogKonfirmasiKuis from "./components/DialogKonfirmasiKuis";

type QuizExamPageProps = PageProps<{ quiz: QuizItem; backUrl: string }>;
type AnswerMap = Record<number, number>;
type MarkedSet = Set<number>;

const createSeededRandom = (seed: number) => {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};

const shuffleArray = <T,>(items: T[], seed: number) => {
  const random = createSeededRandom(seed);
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 }),
};

export default function QuizExam({ quiz, backUrl }: QuizExamPageProps) {
  const { props } = usePage<QuizExamPageProps>();
  const currentUserId = props?.auth?.user?.id ?? 0;
  const durationSeconds = useMemo(() => Math.max(quiz.duration, 1) * 60, [quiz.duration]);
  const shuffleSeed = useMemo(() => {
    const baseSeed = quiz.id * 1009 + currentUserId * 101;
    return baseSeed === 0 ? 1 : baseSeed;
  }, [quiz.id, currentUserId]);

  const questions = useMemo(
    () => shuffleArray(quiz.questions, shuffleSeed).map((q, i) => ({
      ...q, options: shuffleArray(q.options, shuffleSeed + i + 1),
    })),
    [quiz.questions, shuffleSeed]
  );

  const totalQuestions = questions.length;
  const storageKey = useMemo(() => `quiz-progress-${quiz.id}-${currentUserId}`, [quiz.id, currentUserId]);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [markedQuestions, setMarkedQuestions] = useState<MarkedSet>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizAttemptLite | null>(null);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  const clearSavedProgress = useCallback(() => {
    try { window.localStorage.removeItem(storageKey); } catch { }
  }, [storageKey]);

  const ensureStartTime = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      if (!parsed?.startTime) {
        window.localStorage.setItem(storageKey, JSON.stringify({ startTime: Date.now(), answers: {}, currentQuestionIndex: 0 }));
      }
    } catch { }
  }, [storageKey]);

  useEffect(() => {
    setHasStarted(false); setCurrentQuestionIndex(0); setAnswers({});
    setShowResults(false); setShowExitConfirm(false); setShowSubmitConfirm(false);
    setIsTimerActive(false); setTimeLeft(durationSeconds); setDirection(1);
    setIsSubmitting(false); setSubmitError(null); setResult(null); setShouldAutoSubmit(false);

    const urlParams = new URLSearchParams(window.location.search);
    const shouldAutoStart = urlParams.get("autostart") === "1";

    try {
      const savedRaw = window.localStorage.getItem(storageKey);
      if (!savedRaw) {
        if (shouldAutoStart) { ensureStartTime(); setHasStarted(true); setIsTimerActive(true); }
        return;
      }
      const saved = JSON.parse(savedRaw);
      if (!saved?.startTime) {
        if (shouldAutoStart) { ensureStartTime(); setHasStarted(true); setIsTimerActive(true); }
        return;
      }
      const remaining = Math.max(durationSeconds - Math.floor((Date.now() - saved.startTime) / 1000), 0);
      setAnswers(saved.answers ?? {});
      setCurrentQuestionIndex(Math.min(Math.max(saved.currentQuestionIndex ?? 0, 0), Math.max(totalQuestions - 1, 0)));
      setHasStarted(true); setTimeLeft(remaining);
      if (remaining > 0) setIsTimerActive(true); else setShouldAutoSubmit(true);
    } catch {
      if (shouldAutoStart) { ensureStartTime(); setHasStarted(true); setIsTimerActive(true); }
    }
  }, [durationSeconds, storageKey, totalQuestions, ensureStartTime]);

  useEffect(() => {
    if (!hasStarted) return;
    try {
      const existingRaw = window.localStorage.getItem(storageKey);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const startTime = existing?.startTime && Number.isFinite(existing.startTime) ? existing.startTime : Date.now();
      window.localStorage.setItem(storageKey, JSON.stringify({ startTime, answers, currentQuestionIndex }));
    } catch { }
  }, [hasStarted, answers, currentQuestionIndex, storageKey]);

  useEffect(() => {
    if (!isTimerActive || showResults || !hasStarted) return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { window.clearInterval(interval); setIsTimerActive(false); setShouldAutoSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTimerActive, showResults, hasStarted]);

  const submitQuiz = useCallback(async (autoSubmit = false) => {
    if (isSubmitting || showResults) return;
    setIsSubmitting(true); setSubmitError(null); setIsTimerActive(false);
    try {
      const payload = {
        answers: questions.map((q) => ({ question_id: q.id, selected_option: answers[q.id] ?? null })),
        duration_seconds: durationSeconds - Math.max(timeLeft, 0),
      };
      const response = await axios.post(`/siswa/quizzes/${quiz.id}/attempts`, payload);
      const a = response.data?.attempt ?? null;
      clearSavedProgress();
      setShowSubmitConfirm(false);
      // Redirect directly to quiz detail page
      if (a?.id) {
        let detailUrl = `/siswa/quizzes/${quiz.id}/attempts/${a.id}`;
        try {
          if (typeof route === "function") {
            detailUrl = route("siswa.quizzes.attempts.show", { quiz: quiz.id, attempt: a.id });
          }
        } catch { }
        router.visit(detailUrl);
      } else {
        router.visit(backUrl);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.response?.data?.errors?.quiz?.[0] || "Terjadi kesalahan saat mengirim jawaban.";
      setSubmitError(msg); if (!autoSubmit) setIsTimerActive(true);
    } finally { setIsSubmitting(false); }
  }, [answers, quiz.id, durationSeconds, questions, timeLeft, isSubmitting, showResults, clearSavedProgress, totalQuestions]);

  useEffect(() => { if (shouldAutoSubmit) { void submitQuiz(true); setShouldAutoSubmit(false); } }, [shouldAutoSubmit, submitQuiz]);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const handleAnswer = (qId: number, order: number) => setAnswers((prev) => ({ ...prev, [qId]: order }));
  const clearAnswer = (qId: number) => setAnswers((prev) => {
    const next = { ...prev };
    delete next[qId];
    return next;
  });
  const toggleMark = (qId: number) => setMarkedQuestions((prev) => {
    const next = new Set(prev);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);
    return next;
  });
  const nextQuestion = () => { if (currentQuestionIndex < totalQuestions - 1) { setDirection(1); setCurrentQuestionIndex((p) => p + 1); } };
  const previousQuestion = () => { if (currentQuestionIndex > 0) { setDirection(-1); setCurrentQuestionIndex((p) => p - 1); } };
  const jumpToQuestion = (i: number) => { setDirection(i > currentQuestionIndex ? 1 : -1); setCurrentQuestionIndex(i); };
  const startQuiz = () => { ensureStartTime(); setHasStarted(true); setIsTimerActive(true); };
  const finishQuiz = () => {
    clearSavedProgress();
    if (result?.id) {
      // Redirect to quiz detail page with attempt ID
      let detailUrl = `/siswa/quizzes/${quiz.id}/attempts/${result.id}`;
      try {
        if (typeof route === "function") {
          detailUrl = route("siswa.quizzes.attempts.show", { quiz: quiz.id, attempt: result.id });
        }
      } catch { }
      router.visit(detailUrl);
    } else {
      router.visit(backUrl);
    }
  };

  if (!hasStarted && !showResults) {
    return (<><Head title={quiz.title} /><LayarMulaiKuis quiz={quiz} totalQuestions={totalQuestions} backUrl={backUrl} onStart={startQuiz} /></>);
  }



  const activeQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Head title={quiz.title} />
      <div className="min-h-screen bg-gray-50">
        <HeaderUjianKuis quiz={quiz} timeLeft={timeLeft} onExit={() => setShowExitConfirm(true)} />
        <div className="container mx-auto px-3 py-4">
          {submitError && (<Alert className="mb-3 border-red-500 bg-red-50"><AlertCircle className="h-3.5 w-3.5 text-red-600" /><AlertDescription className="text-xs text-red-600">{submitError}</AlertDescription></Alert>)}
          {timeLeft <= 60 && timeLeft > 0 && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4"><Alert className="border-red-500 bg-red-50"><AlertCircle className="h-3.5 w-3.5 text-red-600" /><AlertDescription className="text-xs text-red-600">Waktu tersisa kurang dari 1 menit!</AlertDescription></Alert></motion.div>)}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card><CardContent className="p-3"><div className="mb-1.5 flex items-center justify-between text-xs text-gray-600"><span>Soal {currentQuestionIndex + 1} dari {totalQuestions}</span><span>{answeredCount} terjawab</span></div><Progress value={totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0} /></CardContent></Card>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={activeQuestion.id} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}>
                  <KartuSoalKuis
                    question={activeQuestion}
                    questionIndex={currentQuestionIndex}
                    selectedAnswer={answers[activeQuestion.id]}
                    isMarked={markedQuestions.has(activeQuestion.id)}
                    onAnswer={handleAnswer}
                    onClearAnswer={clearAnswer}
                    onToggleMark={toggleMark}
                  />
                </motion.div>
              </AnimatePresence>
              <Card><CardContent className="flex items-center justify-between gap-3 p-3">
                <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0} size="sm" className="text-xs"><ChevronLeft className="mr-1 h-3.5 w-3.5" />Sebelumnya</Button>
                {currentQuestionIndex < totalQuestions - 1 ? (<Button onClick={nextQuestion} size="sm" className="text-xs">Selanjutnya<ChevronRight className="ml-1 h-3.5 w-3.5" /></Button>) : (<Button onClick={() => setShowSubmitConfirm(true)} size="sm" className="bg-green-600 hover:bg-green-700 text-xs" disabled={isSubmitting}><CheckCircle className="mr-1 h-3.5 w-3.5" />{isSubmitting ? "Mengumpulkan..." : "Selesai & Kumpulkan"}</Button>)}
              </CardContent></Card>
            </div>
            <div className="lg:col-span-1"><PanelNavigasiSoal questions={questions} answers={answers} markedQuestions={markedQuestions} currentQuestionIndex={currentQuestionIndex} isSubmitting={isSubmitting} onJumpToQuestion={jumpToQuestion} onSubmit={() => setShowSubmitConfirm(true)} /></div>
          </div>
        </div>
      </div>
      <DialogKonfirmasiKuis type="exit" open={showExitConfirm} onOpenChange={setShowExitConfirm} backUrl={backUrl} />
      <DialogKonfirmasiKuis type="submit" open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm} answeredCount={answeredCount} totalQuestions={totalQuestions} isSubmitting={isSubmitting} onSubmit={() => void submitQuiz(false)} />
    </>
  );
}
