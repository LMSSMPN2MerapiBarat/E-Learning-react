import { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import TeacherLayout from "@/Layouts/TeacherLayout";
import type { PageProps } from "@/types";
import { ArrowLeft, Clock, Users, Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Input } from "@/Components/ui/input";
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

interface QuizDetail {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  status: "draft" | "published";
  mapel: string;
  kelas: string[];
  attempts: QuizAttempt[];
}

export default function QuizDetailPage() {
  const { quiz } = usePage<PageProps<{ quiz: QuizDetail }>>().props;

  // Pagination & Search State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredAttempts = useMemo(() => {
    return quiz.attempts.filter((attempt) =>
      attempt.student_name.toLowerCase().includes(search.toLowerCase()) ||
      attempt.student_class.toLowerCase().includes(search.toLowerCase())
    );
  }, [quiz.attempts, search]);

  const totalPages = Math.ceil(filteredAttempts.length / ITEMS_PER_PAGE);
  const paginatedAttempts = filteredAttempts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <TeacherLayout title="Detail Kuis">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col gap-3">
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
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{quiz.mapel}</span>
              <span>•</span>
              <div className="flex gap-0.5">
                {quiz.kelas.map((k, i) => (
                  <span key={i} className="bg-secondary px-1 py-0.5 rounded text-[10px] text-secondary-foreground">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
            <div className="flex items-center gap-1.5">
              <Badge variant={quiz.status === "published" ? "default" : "secondary"} className="text-[10px]">
                {quiz.status === "published" ? "Diterbitkan" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats & Description Grid */}
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <Users className="h-6 w-6 text-blue-500 mb-1.5" />
              <p className="text-xs font-medium text-muted-foreground">Total Partisipan</p>
              <p className="text-xl font-bold">{quiz.attempts.length}</p>
              <p className="text-[10px] text-muted-foreground">Siswa</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <Clock className="h-6 w-6 text-orange-500 mb-1.5" />
              <p className="text-xs font-medium text-muted-foreground">Durasi Kuis</p>
              <p className="text-xl font-bold">{quiz.duration}</p>
              <p className="text-[10px] text-muted-foreground">Menit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1.5">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Deskripsi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
                {quiz.description || "Tidak ada deskripsi tambahan untuk kuis ini."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Student Results Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-3 space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">Hasil Pengerjaan Siswa</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daftar nilai dan durasi pengerjaan siswa.
              </p>
            </div>
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau kelas..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-7 h-8 text-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
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

            {filteredAttempts.length > 0 && (
              <div className="flex items-center justify-between pt-3">
                <p className="text-xs text-muted-foreground">
                  Halaman {page} dari {totalPages} | Menampilkan{" "}
                  {paginatedAttempts.length} dari {filteredAttempts.length} siswa
                </p>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Berikutnya
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TeacherLayout>
  );
}
