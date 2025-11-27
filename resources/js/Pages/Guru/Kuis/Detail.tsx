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
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit gap-2 pl-0 hover:bg-transparent hover:text-blue-600"
            onClick={() => router.visit("/guru/kuis")}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke daftar kuis
          </Button>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{quiz.mapel}</span>
              <span>•</span>
              <div className="flex gap-1">
                {quiz.kelas.map((k, i) => (
                  <span key={i} className="bg-secondary px-1.5 py-0.5 rounded text-xs text-secondary-foreground">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={quiz.status === "published" ? "default" : "secondary"}>
                {quiz.status === "published" ? "Diterbitkan" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats & Description Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Total Partisipan</p>
              <p className="text-2xl font-bold">{quiz.attempts.length}</p>
              <p className="text-xs text-muted-foreground">Siswa</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Clock className="h-8 w-8 text-orange-500 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Durasi Kuis</p>
              <p className="text-2xl font-bold">{quiz.duration}</p>
              <p className="text-xs text-muted-foreground">Menit</p>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Deskripsi
                </CardTitle>
             </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                {quiz.description || "Tidak ada deskripsi tambahan untuk kuis ini."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Student Results Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 space-y-0 pb-4">
            <div>
                <CardTitle>Hasil Pengerjaan Siswa</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Daftar nilai dan durasi pengerjaan siswa.
                </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau kelas..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Nama Siswa</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Waktu Submit</TableHead>
                    <TableHead className="text-right">Durasi</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAttempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        {search
                          ? "Tidak ada siswa yang ditemukan dengan kata kunci tersebut."
                          : "Belum ada siswa yang mengerjakan kuis ini."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                              <span>{attempt.student_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="font-normal">
                                {attempt.student_class}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                            {attempt.submitted_at}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {attempt.duration_minutes} mnt
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                                attempt.score >= 75 
                                ? "bg-green-100 text-green-700 hover:bg-green-100" 
                                : "bg-red-100 text-red-700 hover:bg-red-100"
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
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Halaman {page} dari {totalPages} | Menampilkan{" "}
                  {paginatedAttempts.length} dari {filteredAttempts.length} siswa
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Berikutnya
                    <ChevronRight className="h-4 w-4" />
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
