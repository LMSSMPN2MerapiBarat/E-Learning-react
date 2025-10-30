import { useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import StudentLayout from "@/Layouts/StudentLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import {
  Award,
  Calendar,
  FileQuestion,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Progress } from "@/Components/ui/progress";
import type { GradeItem, GradeSummary, SiswaPageProps } from "./types";

const calculateAverage = (items: GradeItem[]) => {
  if (items.length === 0) return 0;
  const sum = items.reduce((accumulator, item) => {
    if (!item.maxScore) {
      return accumulator;
    }
    return accumulator + (item.score / item.maxScore) * 100;
  }, 0);
  return Math.round(sum / items.length);
};

const getScoreColor = (score: number, maxScore: number) => {
  const percentage = maxScore ? (score / maxScore) * 100 : 0;
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBgColor = (score: number, maxScore: number) => {
  const percentage = maxScore ? (score / maxScore) * 100 : 0;
  if (percentage >= 80) return "bg-green-50 border-green-200";
  if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};

const getGradeLabel = (score: number, maxScore: number) => {
  const percentage = maxScore ? (score / maxScore) * 100 : 0;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "E";
};

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
  const [selectedPeriod, setSelectedPeriod] = useState("semester1");

  const subjects = useMemo(() => {
    if (gradeSubjects.length > 0) return gradeSubjects;
    return Array.from(new Set(grades.map((grade) => grade.subject))).sort(
      (a, b) => a.localeCompare(b),
    );
  }, [gradeSubjects, grades]);

  const summary: GradeSummary = useMemo(() => {
    if (gradeSummary) {
      return gradeSummary;
    }

    const overallAverage = calculateAverage(grades);
    const quizGrades = grades.filter((grade) => grade.type === "quiz");
    const assignmentGrades = grades.filter(
      (grade) => grade.type === "assignment",
    );

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

    const filteredOverall = calculateAverage(filteredGrades);
    const filteredQuizAverage = calculateAverage(
      filteredGrades.filter((grade) => grade.type === "quiz"),
    );
    const filteredAssignmentAverage = calculateAverage(
      filteredGrades.filter((grade) => grade.type === "assignment"),
    );

    return {
      overallAverage: filteredOverall,
      quizAverage: filteredQuizAverage,
      assignmentAverage: filteredAssignmentAverage,
      totalAssessments: filteredGrades.length,
    };
  }, [selectedSubject, summary, filteredGrades]);

  const quizGrades = filteredGrades.filter((grade) => grade.type === "quiz");
  const assignmentGrades = filteredGrades.filter(
    (grade) => grade.type === "assignment",
  );

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
              Akun Anda belum terhubung ke kelas. Hubungi admin atau guru agar
              nilai dapat ditampilkan.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Rekap Nilai
            </h2>
            <p className="text-sm text-gray-600">
              Pantau perkembangan nilai Anda sepanjang semester.
            </p>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Pilih Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semester1">Semester 1</SelectItem>
              <SelectItem value="semester2">Semester 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Rata-rata Keseluruhan",
              value: displaySummary.overallAverage,
              description: `Grade: ${getGradeLabel(displaySummary.overallAverage, 100)}`,
              icon: Award,
              gradient:
                "from-purple-500/90 to-purple-600/90",
            },
            {
              title: "Rata-rata Kuis",
              value: displaySummary.quizAverage,
              description: `${quizGrades.length} kuis`,
              icon: FileQuestion,
              gradient: "from-blue-500/90 to-blue-600/90",
            },
            {
              title: "Rata-rata Tugas",
              value: displaySummary.assignmentAverage,
              description: `${assignmentGrades.length} tugas`,
              icon: FileText,
              gradient: "from-green-500/90 to-green-600/90",
            },
            {
              title: "Total Penilaian",
              value: displaySummary.totalAssessments,
              description: "Penilaian tercatat",
              icon: TrendingUp,
              gradient: "from-orange-500/90 to-orange-600/90",
            },
          ].map(({ title, value, description, icon: Icon, gradient }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="relative overflow-hidden border shadow-sm">
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-3xl bg-gradient-to-br ${gradient} opacity-30`}
                />
                <CardContent className="relative flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                  </div>
                  <div
                    className={`rounded-lg bg-gradient-to-br ${gradient} p-3 text-white shadow`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performa per Mata Pelajaran</CardTitle>
            <CardDescription>
              Rata-rata nilai untuk setiap mata pelajaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                Belum ada penilaian yang tercatat.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {subjects.map((subject) => {
                  const stats = getSubjectStats(subject);
                  return (
                    <motion.div
                      key={subject}
                      whileHover={{ scale: 1.02 }}
                      className="rounded-lg border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {stats.count} penilaian
                          </p>
                        </div>
                        <span className="text-2xl font-semibold text-gray-900">
                          {stats.avg}
                        </span>
                      </div>
                      <Progress value={stats.avg} className="mt-4 h-2" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Riwayat Nilai</CardTitle>
                <CardDescription>
                  Detail nilai untuk setiap kuis dan tugas
                </CardDescription>
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
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  Semua ({filteredGrades.length})
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  Kuis ({quizGrades.length})
                </TabsTrigger>
                <TabsTrigger value="assignment">
                  Tugas ({assignmentGrades.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {filteredGrades.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    <Award className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    Belum ada penilaian yang sesuai.
                  </div>
                ) : (
                  filteredGrades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GradeCard grade={grade} />
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="quiz" className="space-y-3">
                {quizGrades.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    Belum ada penilaian kuis.
                  </div>
                ) : (
                  quizGrades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GradeCard grade={grade} accent="blue" />
                    </motion.div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="assignment" className="space-y-3">
                {assignmentGrades.length === 0 ? (
                  <div className="py-10 text-center text-gray-500">
                    Belum ada penilaian tugas.
                  </div>
                ) : (
                  assignmentGrades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GradeCard grade={grade} />
                    </motion.div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}

interface GradeCardProps {
  grade: GradeItem;
  accent?: "blue";
}

function GradeCard({ grade, accent }: GradeCardProps) {
  return (
    <Card
      className={`border-l-4 ${
        grade.status === "late"
          ? "border-l-red-500"
          : accent === "blue"
          ? "border-l-blue-500"
          : "border-l-green-500"
      }`}
    >
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900">{grade.title}</h3>
            <Badge variant="outline">{grade.subject}</Badge>
            <Badge variant="outline" className="capitalize">
              {grade.type === "quiz" ? (
                <span className="flex items-center gap-1">
                  <FileQuestion className="h-3 w-3" />
                  Kuis
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Tugas
                </span>
              )}
            </Badge>
            {grade.status === "late" && (
              <Badge variant="destructive">Terlambat</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(grade.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          {grade.feedback && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
              <p className="text-gray-600">Komentar Guru:</p>
              <p>{grade.feedback}</p>
            </div>
          )}
        </div>
        <div
          className={`flex w-full flex-col items-center rounded-lg border-2 p-4 md:w-48 ${getScoreBgColor(
            grade.score,
            grade.maxScore,
          )}`}
        >
          <div className={`text-3xl font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}>
            {grade.score}
          </div>
          <div className="text-sm text-gray-600">
            dari {grade.maxScore || "-"}
          </div>
          <div
            className={`mt-1 text-xl font-semibold ${getScoreColor(
              grade.score,
              grade.maxScore,
            )}`}
          >
            {getGradeLabel(grade.score, grade.maxScore)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
