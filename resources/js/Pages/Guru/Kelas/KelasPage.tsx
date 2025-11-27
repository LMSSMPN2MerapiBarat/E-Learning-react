import { useEffect, useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import TeacherLayout from "@/Layouts/TeacherLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Input } from "@/Components/ui/input";
import { cn } from "@/Components/ui/utils";
import { X } from "lucide-react";

interface StudentItem {
  id: number;
  nama: string | null;
  nis: string | null;
  email: string | null;
  no_telp: string | null;
}

interface TeacherClassItem {
  id: number;
  nama: string;
  tingkat: string | null;
  kelas: string | null;
  tahun_ajaran: string | null;
  deskripsi: string | null;
  jumlah_siswa: number;
  students: StudentItem[];
}

interface KelasPageProps {
  classes: TeacherClassItem[];
}

type GuruKelasPageInertiaProps = InertiaPageProps & KelasPageProps;

export default function KelasPage() {
  const { classes: rawClasses } =
    usePage<GuruKelasPageInertiaProps>().props ?? {};
  const classes: TeacherClassItem[] = Array.isArray(rawClasses)
    ? (rawClasses as TeacherClassItem[])
    : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(() =>
    classes.length > 0 ? classes[0].id : null,
  );
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClasses = useMemo<TeacherClassItem[]>(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === "") {
      return classes;
    }

    const matches = (value?: string | null) =>
      value ? value.toLowerCase().includes(term) : false;

    return classes.filter((kelas) => {
      const classMatch =
        matches(kelas.nama) ||
        matches(kelas.tingkat) ||
        matches(kelas.kelas) ||
        matches(kelas.tahun_ajaran) ||
        matches(kelas.deskripsi);

      const studentMatch = kelas.students?.some(
        (student) =>
          matches(student.nama) ||
          matches(student.nis) ||
          matches(student.email) ||
          matches(student.no_telp),
      );

      return classMatch || studentMatch;
    });
  }, [classes, searchTerm]);

  useEffect(() => {
    if (classes.length === 0) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }

    if (selectedId === null) {
      setSelectedId(classes[0].id);
    }
  }, [classes, selectedId]);

  useEffect(() => {
    if (filteredClasses.length === 0) {
      if (selectedId !== null) {
        setSelectedId(null);
      }
      return;
    }

    if (!filteredClasses.some((item) => item.id === selectedId)) {
      setSelectedId(filteredClasses[0].id);
    }
  }, [filteredClasses, selectedId]);

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedId) ?? null,
    [classes, selectedId],
  );

  const hasFilteredResults = filteredClasses.length > 0;

  useEffect(() => {
    setStudentSearchTerm("");
    setCurrentPage(1);
  }, [selectedId]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [studentSearchTerm]);

  const filteredStudents = useMemo(() => {
    if (!selectedClass) {
      return [];
    }

    const term = studentSearchTerm.trim().toLowerCase();
    if (term === "") {
      return selectedClass.students;
    }

    const matches = (value?: string | null) =>
      value ? value.toLowerCase().includes(term) : false;

    return selectedClass.students.filter(
      (student) =>
        matches(student.nama) ||
        matches(student.nis) ||
        matches(student.email) ||
        matches(student.no_telp),
    );
  }, [selectedClass, studentSearchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <TeacherLayout title="Kelas Saya">
      {classes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Tidak ada kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Anda belum memiliki kelas yang terdaftar. Silakan hubungi admin
              untuk menugaskan kelas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
          <Card className="h-full">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle>Daftar Kelas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Pilih kelas untuk melihat daftar siswanya.
                </p>
              </div>
              {classes.length > 0 && (
                <div className="relative max-w-sm">
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cari kelas..."
                    aria-label="Cari kelas atau siswa"
                    className="pr-10"
                  />
                  {searchTerm !== "" && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      aria-label="Bersihkan pencarian kelas"
                      className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[420px] pr-2">
                <div className="space-y-2">
                  {filteredClasses.length === 0 ? (
                    <p className="px-2 text-sm text-muted-foreground">
                      {searchTerm.trim()
                        ? "Tidak ada kelas yang cocok dengan pencarian."
                        : "Belum ada kelas yang tersedia."}
                    </p>
                  ) : (
                    filteredClasses.map((kelas) => (
                      <button
                        key={kelas.id}
                        type="button"
                        onClick={() => setSelectedId(kelas.id)}
                        className={cn(
                          "w-full rounded-lg border px-4 py-3 text-left transition",
                          selectedClass?.id === kelas.id
                            ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                            : "border-transparent bg-gray-50 hover:border-gray-200 hover:bg-white",
                        )}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold">{kelas.nama}</p>
                            {kelas.tahun_ajaran && (
                              <p className="text-xs text-muted-foreground">
                                Tahun Ajaran {kelas.tahun_ajaran}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary">
                            {kelas.jumlah_siswa} Siswa
                          </Badge>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle>
                  {hasFilteredResults
                    ? selectedClass
                      ? selectedClass.nama
                      : "Pilih kelas"
                    : "Tidak ada hasil"}
                </CardTitle>
                {hasFilteredResults && selectedClass?.deskripsi && (
                  <p className="text-sm text-muted-foreground">
                    {selectedClass.deskripsi}
                  </p>
                )}
                {hasFilteredResults && selectedClass && (
                  <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
                    {selectedClass.tingkat && (
                      <Badge variant="outline">
                        Tingkat {selectedClass.tingkat}
                      </Badge>
                    )}
                    {selectedClass.kelas && (
                      <Badge variant="outline">
                        Rombel {selectedClass.kelas}
                      </Badge>
                    )}
                    {selectedClass.tahun_ajaran && (
                      <Badge variant="outline">
                        {selectedClass.tahun_ajaran}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              {hasFilteredResults &&
                selectedClass &&
                selectedClass.students.length > 0 && (
                  <div className="relative max-w-sm">
                    <Input
                      value={studentSearchTerm}
                      onChange={(event) =>
                        setStudentSearchTerm(event.target.value)
                      }
                      placeholder="Cari siswa berdasarkan nama, NIS, email, atau telepon..."
                      aria-label="Cari siswa pada kelas ini"
                      className="pr-10"
                    />
                    {studentSearchTerm !== "" && (
                      <button
                        type="button"
                        onClick={() => setStudentSearchTerm("")}
                        aria-label="Bersihkan pencarian siswa"
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
            </CardHeader>
            <CardContent>
              {!hasFilteredResults ? (
                <p className="text-sm text-muted-foreground">
                  {searchTerm.trim()
                    ? "Tidak ada kelas yang cocok dengan pencarian."
                    : "Belum ada kelas yang tersedia."}
                </p>
              ) : !selectedClass ? (
                <p className="text-sm text-muted-foreground">
                  Silakan pilih kelas dari daftar untuk melihat data siswa.
                </p>
              ) : selectedClass.students.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Belum ada siswa yang terdaftar pada kelas ini.
                </p>
              ) : filteredStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Tidak ada siswa yang cocok dengan pencarian.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">
                          Nama
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">
                          NIS
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">
                          No. Telepon
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {paginatedStudents.map((student, index) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-900">
                            {student.nama ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {student.nis ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {student.email ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {student.no_telp ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  {filteredStudents.length > itemsPerPage && (
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-4">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        ← Sebelumnya
                      </button>
                      <p className="text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages} | Menampilkan{" "}
                        {paginatedStudents.length} dari {filteredStudents.length}{" "}
                        siswa
                      </p>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Berikutnya →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </TeacherLayout>
  );
}
