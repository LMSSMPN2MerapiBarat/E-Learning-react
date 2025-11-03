import { useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import type { GradeItem, GradeSummary, SiswaPageProps } from "@/Pages/Siswa/types";
import GradeSummaryGrid from "@/Pages/Siswa/components/GradeSummaryGrid";
import SubjectPerformanceList from "@/Pages/Siswa/components/SubjectPerformanceList";
import GradeHistoryTabs from "@/Pages/Siswa/components/GradeHistoryTabs";
import { calculateAverage } from "@/Pages/Siswa/components/gradeHelpers";

export default function Grades() {
  const { props } = usePage<SiswaPageProps>();
  const {
    student,
    hasClass,
    grades = [],
    gradeSubjects = [],
    gradeSummary,
  } = props;

  const [selectedSubject, setSelectedSubject] = useState("all");

  const subjects = useMemo(() => {
    if (gradeSubjects.length > 0) return gradeSubjects;
    return Array.from(new Set(grades.map((grade) => grade.subject))).sort((a, b) => a.localeCompare(b));
  }, [gradeSubjects, grades]);

  const summary: GradeSummary = useMemo(() => {
    if (gradeSummary) {
      return gradeSummary;
    }

    const overallAverage = calculateAverage(grades);
    const quizGrades = grades.filter((grade) => grade.type === "quiz");
    const assignmentGrades = grades.filter((grade) => grade.type === "assignment");

    return {
      overallAverage,
      quizAverage: calculateAverage(quizGrades),
      assignmentAverage: calculateAverage(assignmentGrades),
      totalAssessments: grades.length,
    };
  }, [gradeSummary, grades]);

  const filteredGrades = useMemo(() => {
    if (selectedSubject === "all") {
      return grades;
    }
    return grades.filter((grade) => grade.subject === selectedSubject);
  }, [grades, selectedSubject]);

  const displaySummary = useMemo(() => {
    if (selectedSubject === "all") {
      return summary;
    }

    const subjectGrades = grades.filter((grade) => grade.subject === selectedSubject);
    const quizGrades = subjectGrades.filter((grade) => grade.type === "quiz");
    const assignmentGrades = subjectGrades.filter((grade) => grade.type === "assignment");

    return {
      overallAverage: calculateAverage(subjectGrades),
      quizAverage: calculateAverage(quizGrades),
      assignmentAverage: calculateAverage(assignmentGrades),
      totalAssessments: subjectGrades.length,
    };
  }, [grades, selectedSubject, summary]);

  const quizGrades = filteredGrades.filter((grade) => grade.type === "quiz");
  const assignmentGrades = filteredGrades.filter((grade) => grade.type === "assignment");

  const getSubjectStats = (subject: string) => {
    const subjectGrades = grades.filter((grade) => grade.subject === subject);
    return {
      avg: calculateAverage(subjectGrades),
      count: subjectGrades.length,
    };
  };

  return (
    <StudentLayout
      title="Nilai Saya"
      subtitle={
        student.className
          ? `Kelas ${student.className} - Riwayat nilai kuis dan tugas`
          : "Silakan hubungi admin atau guru untuk penempatan kelas."
      }
    >
      <Head title="Nilai Saya" />

      <div className="space-y-6">
        {!hasClass && (
          <Alert className="border-l-4 border-l-amber-500">
            <AlertDescription>
              Akun Anda belum terhubung ke kelas. Hubungi admin atau guru agar nilai dapat ditampilkan.
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Rekap Nilai</h2>
              <p className="text-sm text-gray-600">
                Pantau perkembangan nilai Anda sepanjang semester.
              </p>
            </div>
          </div>
        </motion.div>

        <GradeSummaryGrid
          summary={displaySummary}
          quizCount={quizGrades.length}
          assignmentCount={assignmentGrades.length}
        />

        <SubjectPerformanceList
          subjects={subjects}
          getStats={getSubjectStats}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Riwayat Nilai</h3>
              <p className="text-sm text-gray-600">
                Detail nilai untuk setiap kuis dan tugas
              </p>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Semua Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <GradeHistoryTabs
          allGrades={filteredGrades}
          quizGrades={quizGrades}
          assignmentGrades={assignmentGrades}
        />
      </div>
    </StudentLayout>
  );
}
