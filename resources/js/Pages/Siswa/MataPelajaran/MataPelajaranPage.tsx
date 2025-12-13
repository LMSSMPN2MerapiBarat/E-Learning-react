import { useMemo, useState } from "react";
import { Head } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  User,
  ClipboardList,
  Layers,
  Search,
} from "lucide-react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import type { SiswaPageProps, StudentSubject } from "@/Pages/Siswa/types";
import DetailMapel from "./components/DetailMapel";

interface SubjectsPageProps extends SiswaPageProps {
  classSubjects?: StudentSubject[];
}

const ITEMS_PER_PAGE = 6;

export default function Subjects({
  hasClass,
  classSubjects = [],
  student,
  ...rest
}: SubjectsPageProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const enhancedSubjects = useMemo(() => {
    return classSubjects.map((subject, index) => ({
      key: `${subject.id}-${subject.teacherId ?? "teacher"}`,
      data: subject,
      decoration: subjectDecoration(index),
    }));
  }, [classSubjects]);

  const selectedSubject = enhancedSubjects.find((item) => item.key === selectedKey);

  // Filter berdasarkan search
  const filteredSubjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return enhancedSubjects;

    return enhancedSubjects.filter((item) => {
      const { name, teacher, description, schedule } = item.data;
      const pool = [name, teacher ?? "", description ?? "", schedule ?? ""];
      return pool.some((value) => value.toLowerCase().includes(term));
    });
  }, [enhancedSubjects, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubjects, currentPage]);

  // Reset page ketika search berubah
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

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
          <CardContent className="py-10 text-center text-xs text-gray-500">
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
        <DetailMapel
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
      <Head title="Mata Pelajaran" />
      {enhancedSubjects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-xs text-gray-500">
            Belum ada mata pelajaran yang terdaftar untuk kelasmu.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 text-white shadow">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kelas aktif</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student?.className ?? "Tidak diketahui"}
                  </p>
                </div>
              </div>
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Cari mata pelajaran atau guru..."
                  className="pl-8 text-xs h-8"
                />
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-3 md:grid-cols-3"
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

          {filteredSubjects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center text-xs text-gray-500">
                <Search className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                Tidak ada mata pelajaran yang sesuai dengan pencarian.
              </CardContent>
            </Card>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
              >
                {paginatedSubjects.map(({ key, data, decoration }, index) => (
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
                      <div className={`h-1.5 ${decoration.background}`} />
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-lg bg-gradient-to-br ${decoration.background} p-2 text-xl text-white shadow`}
                            >
                              {decoration.icon}
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">
                                {data.name}
                              </h3>
                              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500">
                                <User className="h-2.5 w-2.5" />
                                <span className="line-clamp-1">
                                  {data.teacher ?? "Guru belum ditentukan"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 transition group-hover:text-indigo-500" />
                        </div>

                        <p className="min-h-[32px] text-xs text-gray-600 line-clamp-2">
                          {data.description ??
                            "Materi dan kuis terbaru dari guru pengampu mata pelajaran ini."}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
                          <span>📅 {data.schedule ?? "Belum dijadwalkan"}</span>
                        </div>

                        <div className="mt-3 flex gap-1.5 border-t pt-3">
                          <Badge variant="outline" className="flex flex-1 items-center justify-center gap-0.5 text-[10px]">
                            <FileText className="h-2.5 w-2.5" />
                            {data.materialCount} Materi
                          </Badge>
                          <Badge variant="outline" className="flex flex-1 items-center justify-center gap-0.5 text-[10px]">
                            <ClipboardList className="h-2.5 w-2.5" />
                            {data.quizCount} Kuis
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {filteredSubjects.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs text-gray-600 min-w-[60px] text-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </>
          )}
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
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="rounded-md bg-gray-100 p-2 text-gray-600">
          <Icon className="h-5 w-5" />
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

