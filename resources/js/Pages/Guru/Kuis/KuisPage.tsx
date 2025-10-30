import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import { toast } from "sonner";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
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
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Plus, FileQuestion, Trash2, Pencil } from "lucide-react";
import CreateQuiz from "./Create";
import EditQuiz from "./Edit";

interface Option {
  id: number;
  nama: string;
}

interface QuizItem {
  id: number;
  judul: string;
  deskripsi?: string | null;
  mata_pelajaran_id?: number | null;
  mapel?: {
    id: number;
    nama: string;
  } | null;
  durasi: number;
  status: "draft" | "published";
  kelas: { id: number; nama: string }[];
  kelas_ids?: number[];
  questions: {
    id: string | number;
    question: string;
    options: string[];
    correct_answer: number;
  }[];
  created_at?: string | null;
}

interface QuizPageData {
  quizzes: QuizItem[];
  kelasOptions: Option[];
  mapelOptions: Option[];
}

interface QuizPageInertiaProps extends InertiaPageProps, QuizPageData {}

export default function KuisPage() {
  const { quizzes, kelasOptions, mapelOptions } =
    usePage<QuizPageInertiaProps>().props;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<QuizItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = useMemo(() => {
    if (!searchTerm) return quizzes;
    const lower = searchTerm.toLowerCase();
    return quizzes.filter((quiz) => {
      const mapelName = quiz.mapel?.nama?.toLowerCase() ?? "";
      const kelasJoined = quiz.kelas.map((item) => item.nama.toLowerCase()).join(" ");
      return (
        quiz.judul.toLowerCase().includes(lower) ||
        mapelName.includes(lower) ||
        kelasJoined.includes(lower)
      );
    });
  }, [quizzes, searchTerm]);

  const handleDelete = () => {
    if (!deleteId) return;
    router.delete(`/guru/kuis/${deleteId}`, {
      onSuccess: () => {
        toast.success("Kuis berhasil dihapus.");
        setDeleteId(null);
      },
      onError: () => toast.error("Terjadi kesalahan saat menghapus kuis."),
    });
  };

  return (
    <TeacherLayout title="Kelola Kuis">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Daftar Kuis</CardTitle>
              <CardDescription>
                Buat kuis interaktif dan bagikan hanya kepada kelas yang Anda ampu.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Cari kuis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Buat Kuis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuizzes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileQuestion className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Belum ada kuis yang dibuat.</p>
                  <p className="text-sm">
                    Klik tombol &quot;Buat Kuis&quot; untuk menambahkan.
                  </p>
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="border hover:shadow-sm transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <FileQuestion className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <h3 className="text-base font-semibold text-gray-800">
                                {quiz.judul}
                              </h3>
                              {quiz.deskripsi && (
                                <p className="text-sm text-gray-600">
                                  {quiz.deskripsi}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                {quiz.mapel?.nama && (
                                  <Badge variant="outline">{quiz.mapel.nama}</Badge>
                                )}
                                <Badge variant="outline">{quiz.durasi} Menit</Badge>
                                <Badge
                                  className={
                                    quiz.status === "published"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }
                                >
                                  {quiz.status === "published" ? "Aktif" : "Draft"}
                                </Badge>
                                <Badge variant="outline">
                                  {quiz.questions.length} Soal
                                </Badge>
                                {quiz.created_at && (
                                  <span>
                                    Dibuat:{" "}
                                    {new Date(quiz.created_at).toLocaleDateString("id-ID")}
                                  </span>
                                )}
                              </div>
                              {quiz.kelas.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {quiz.kelas.map((kelas) => (
                                    <Badge key={kelas.id} variant="secondary">
                                      {kelas.nama}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditItem(quiz)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(quiz.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Kuis Baru</DialogTitle>
          </DialogHeader>
          <CreateQuiz
            kelasOptions={kelasOptions}
            mapelOptions={mapelOptions}
            onSuccess={() => setIsCreateOpen(false)}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Kuis</DialogTitle>
          </DialogHeader>
          {editItem && (
            <EditQuiz
              quiz={editItem}
              kelasOptions={kelasOptions}
              mapelOptions={mapelOptions}
              onSuccess={() => setEditItem(null)}
              onCancel={() => setEditItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kuis</AlertDialogTitle>
            <AlertDialogDescription>
              Kuis akan dihapus permanen beserta seluruh pertanyaannya. Lanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  );
}
