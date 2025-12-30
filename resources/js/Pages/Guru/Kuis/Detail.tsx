import { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import TeacherLayout from "@/Layouts/TeacherLayout";
import type { PageProps } from "@/types";
import { ArrowLeft, Clock, Users, Search, ChevronLeft, ChevronRight, FileText, Calendar, Timer, Download } from "lucide-react";
import { Input } from "@/Components/ui/input";
import ExportGradesDialog from "@/Pages/Guru/components/ExportGradesDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

interface QuizAttempt {
  id: number;
  student_name: string;
  student_class: string;
  score: number;
  duration_minutes: number;
  submitted_at: string;
}

interface KelasItem {
  id: number;
  nama: string;
}

interface QuizDetail {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  status: "draft" | "published";
  mapel: string;
  kelas: KelasItem[];
  attempts: QuizAttempt[];
}

export default function QuizDetailPage() {
  const { quiz } = usePage<PageProps<{ quiz: QuizDetail }>>().props;

  // Class Tab State
  const [activeClassTab, setActiveClassTab] = useState("all");
  const hasMultipleClasses = quiz.kelas.length > 1;

  // Pagination & Search State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // Get attempt counts per class
  const attemptCountsByClass = useMemo(() => {
    const counts: Record<string, number> = { all: quiz.attempts.length };
    quiz.kelas.forEach((k) => {
      counts[String(k.id)] = quiz.attempts.filter((attempt) => attempt.student_class === k.nama).length;
    });
    return counts;
  }, [quiz.attempts, quiz.kelas]);

  const filteredAttempts = useMemo(() => {
    let attempts = quiz.attempts;

    // Filter by class tab first
    if (activeClassTab !== "all") {
      const selectedClass = quiz.kelas.find((k) => String(k.id) === activeClassTab);
      if (selectedClass) {
        attempts = attempts.filter((attempt) => attempt.student_class === selectedClass.nama);
      }
    }

    // Then filter by search
    return attempts.filter((attempt) =>
      attempt.student_name.toLowerCase().includes(search.toLowerCase()) ||
      attempt.student_class.toLowerCase().includes(search.toLowerCase())
    );
  }, [quiz.attempts, activeClassTab, search]);

  const totalPages = Math.ceil(filteredAttempts.length / ITEMS_PER_PAGE);
  const paginatedAttempts = filteredAttempts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Reset page when search or tab changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveClassTab(value);
    setPage(1);
  };

  return (
    <TeacherLayout title="Detail Kuis">
      <div className="space-y-4 px-1 sm:px-0">
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit gap-1.5 pl-0 hover:bg-transparent hover:text-blue-600 text-xs"
            onClick={() => router.visit("/guru/kuis")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke daftar kuis
          </Button>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>{quiz.mapel}</span>
              <span>•</span>
              <div className="flex flex-wrap gap-0.5">
                {quiz.kelas.map((k) => (
                  <span key={k.id} className="bg-secondary px-1.5 py-0.5 rounded text-[10px] text-secondary-foreground">
                    {k.nama}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight break-words">{quiz.title}</h1>
            <div className="flex items-center gap-1.5">
              <Badge variant={quiz.status === "published" ? "default" : "secondary"} className="text-[10px]">
                {quiz.status === "published" ? "Diterbitkan" : "Draft"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="mr-1 h-3 w-3" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Stats & Description Grid - Responsive */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
          <Card className="col-span-1">
            <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mb-1 sm:mb-1.5" />
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Total Partisipan</p>
              <p className="text-lg sm:text-xl font-bold">{quiz.attempts.length}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Siswa</p>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mb-1 sm:mb-1.5" />
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Durasi Kuis</p>
              <p className="text-lg sm:text-xl font-bold">{quiz.duration}</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Menit</p>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardHeader className="pb-1 sm:pb-1.5 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm flex items-center gap-1.5">
                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Deskripsi
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
                {quiz.description || "Tidak ada deskripsi tambahan untuk kuis ini."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Student Results */}
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:gap-3 space-y-0 pb-2 sm:pb-3 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-center sm:text-left">
                <CardTitle className="text-sm sm:text-base">Hasil Pengerjaan Siswa</CardTitle>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  Daftar nilai dan durasi pengerjaan siswa.
                </p>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau kelas..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-7 h-8 text-xs w-full"
                />
              </div>
            </div>
            {hasMultipleClasses && (
              <Tabs value={activeClassTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
                  <TabsTrigger
                    value="all"
                    className="h-7 rounded-full px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Semua Kelas ({attemptCountsByClass.all})
                  </TabsTrigger>
                  {quiz.kelas.map((k) => (
                    <TabsTrigger
                      key={k.id}
                      value={String(k.id)}
                      className="h-7 rounded-full px-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {k.nama} ({attemptCountsByClass[String(k.id)] ?? 0})
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            {/* Desktop Table View */}
            <div className="hidden sm:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] text-xs">Nama Siswa</TableHead>
                    <TableHead className="text-xs">Kelas</TableHead>
                    <TableHead className="text-xs">Waktu Submit</TableHead>
                    <TableHead className="text-right text-xs">Durasi</TableHead>
                    <TableHead className="text-right text-xs">Nilai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAttempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-20 text-center text-muted-foreground text-xs">
                        {search
                          ? "Tidak ada siswa yang ditemukan dengan kata kunci tersebut."
                          : "Belum ada siswa yang mengerjakan kuis ini."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell className="font-medium text-xs">
                          <div className="flex flex-col">
                            <span>{attempt.student_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal text-[10px]">
                            {attempt.student_class}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {attempt.submitted_at}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs">
                          {attempt.duration_minutes} mnt
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                              attempt.score >= 75
                                ? "bg-green-100 text-green-700 hover:bg-green-100 text-[10px]"
                                : "bg-red-100 text-red-700 hover:bg-red-100 text-[10px]"
                            }
                          >
                            {attempt.score}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-2">
              {paginatedAttempts.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-xs">
                  {search
                    ? "Tidak ada siswa yang ditemukan dengan kata kunci tersebut."
                    : "Belum ada siswa yang mengerjakan kuis ini."}
                </div>
              ) : (
                paginatedAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-lg border bg-card p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{attempt.student_name}</p>
                        <Badge variant="outline" className="font-normal text-[10px] mt-1">
                          {attempt.student_class}
                        </Badge>
                      </div>
                      <Badge
                        className={
                          attempt.score >= 75
                            ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1"
                            : "bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1"
                        }
                      >
                        {attempt.score}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{attempt.submitted_at}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        <span>{attempt.duration_minutes} mnt</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredAttempts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left order-2 sm:order-1">
                  Halaman {page} dari {totalPages} | Menampilkan{" "}
                  {paginatedAttempts.length} dari {filteredAttempts.length} siswa
                </p>
                <div className="flex gap-1.5 order-1 sm:order-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 sm:h-7 text-xs flex-1 sm:flex-initial"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden xs:inline">Sebelumnya</span>
                    <span className="xs:hidden">Prev</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 sm:h-7 text-xs flex-1 sm:flex-initial"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <span className="hidden xs:inline">Berikutnya</span>
                    <span className="xs:hidden">Next</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ExportGradesDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        title={quiz.title}
        exportUrl={`/guru/kuis/${quiz.id}/export`}
        classes={quiz.kelas}
      />
    </TeacherLayout>
  );
}
