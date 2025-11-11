import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  ChevronRight,
  FileQuestion,
  FileText,
  GraduationCap,
  User,
  ClipboardList,
  Layers,
} from "lucide-react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import type { SiswaPageProps, StudentSubject } from "@/Pages/Siswa/types";
import SubjectDetail from "@/Pages/Siswa/components/SubjectDetail";

interface SubjectsPageProps extends SiswaPageProps {
  classSubjects?: StudentSubject[];
}

export default function Subjects({
  hasClass,
  classSubjects = [],
  student,
  ...rest
}: SubjectsPageProps) {
  const enhancedSubjects = useMemo(() => {
    return classSubjects.map((subject, index) => ({
      key: `${subject.id}-${subject.teacherId ?? "teacher"}`,
      data: subject,
      decoration: subjectDecoration(index),
    }));
  }, [classSubjects]);

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selectedSubject = enhancedSubjects.find((item) => item.key === selectedKey);

  const stats = useMemo(() => {
    return {
      subjectCount: enhancedSubjects.length,
      totalMaterials: enhancedSubjects.reduce(
        (sum, subject) => sum + subject.data.materialCount,
        0,
      ),
      totalQuizzes: enhancedSubjects.reduce(
        (sum, subject) => sum + subject.data.quizCount,
        0,
      ),
    };
  }, [enhancedSubjects]);

  if (!hasClass) {
    return (
      <StudentLayout
        title="Mata Pelajaran"
        subtitle="Gabung ke kelas lebih dulu untuk melihat daftar mata pelajaran."
        {...rest}
      >
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-gray-500">
            Kamu belum terdaftar pada kelas mana pun. Hubungi admin atau wali kelas
            untuk penjadwalan.
          </CardContent>
        </Card>
      </StudentLayout>
    );
  }

  if (selectedSubject) {
    return (
      <StudentLayout
        title="Detail Mata Pelajaran"
        subtitle={`Pelajari materi dan kuis untuk ${selectedSubject.data.name}.`}
        {...rest}
      >
        <SubjectDetail
          subject={selectedSubject.data}
          onBack={() => setSelectedKey(null)}
        />
      </StudentLayout>
    );
  }

  return (
    <StudentLayout
      title="Mata Pelajaran"
      subtitle={
        student?.className
          ? `Daftar pelajaran untuk kelas ${student.className}.`
          : "Daftar pelajaran yang kamu ikuti."
      }
      {...rest}
    >
      {enhancedSubjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-gray-500">
            Belum ada mata pelajaran yang terdaftar untuk kelasmu.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 p-3 text-white shadow">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kelas aktif</p>
                <p className="text-base font-semibold text-gray-900">
                  {student?.className ?? "Tidak diketahui"}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 md:grid-cols-3"
          >
            <StatCard
              icon={Layers}
              label="Total Mata Pelajaran"
              value={stats.subjectCount}
              accent="border-l-indigo-500"
            />
            <StatCard
              icon={BookOpen}
              label="Total Materi"
              value={stats.totalMaterials}
              accent="border-l-blue-500"
            />
            <StatCard
              icon={ClipboardList}
              label="Total Kuis"
              value={stats.totalQuizzes}
              accent="border-l-green-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {enhancedSubjects.map(({ key, data, decoration }, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border-2 border-transparent transition hover:border-indigo-200 hover:shadow-lg"
                  onClick={() => setSelectedKey(key)}
                >
                  <div className={`h-2 ${decoration.background}`} />
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-xl bg-gradient-to-br ${decoration.background} p-3 text-2xl text-white shadow`}
                        >
                          {decoration.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {data.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span className="line-clamp-1">
                              {data.teacher ?? "Guru belum ditentukan"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 transition group-hover:text-indigo-500" />
                    </div>

                    <p className="min-h-[40px] text-sm text-gray-600 line-clamp-2">
                      {data.description ??
                        "Materi dan kuis terbaru dari guru pengampu mata pelajaran ini."}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <span>📅 {data.schedule ?? "Belum dijadwalkan"}</span>
                    </div>

                    <div className="mt-4 flex gap-2 border-t pt-4">
                      <Badge variant="outline" className="flex flex-1 items-center justify-center gap-1">
                        <FileText className="h-3 w-3" />
                        {data.materialCount} Materi
                      </Badge>
                      <Badge variant="outline" className="flex flex-1 items-center justify-center gap-1">
                        <FileQuestion className="h-3 w-3" />
                        {data.quizCount} Kuis
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </StudentLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className={`border-l-4 ${accent}`}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-3 text-gray-600">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function subjectDecoration(index: number) {
  const palette = [
    { background: "bg-gradient-to-r from-indigo-500 to-indigo-700", icon: "📘" },
    { background: "bg-gradient-to-r from-pink-500 to-rose-700", icon: "📗" },
    { background: "bg-gradient-to-r from-amber-500 to-orange-600", icon: "📙" },
    { background: "bg-gradient-to-r from-emerald-500 to-green-600", icon: "📒" },
    { background: "bg-gradient-to-r from-blue-500 to-blue-700", icon: "📔" },
  ];
  return palette[index % palette.length];
}
