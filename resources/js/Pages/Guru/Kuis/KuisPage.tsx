import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import QuizListHeader from "@/Pages/Guru/components/kuis/QuizListHeader";
import QuizList from "@/Pages/Guru/components/kuis/QuizList";
import QuizManagementDialogs from "@/Pages/Guru/components/kuis/QuizManagementDialogs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { toast } from "sonner";
import type {
  Option,
  QuizItem,
  AIQuota,
} from "@/Pages/Guru/components/kuis/formTypes";

interface QuizPageData {
  quizzes: QuizItem[];
  kelasOptions: Option[];
  mapelOptions: Option[];
  kelasMapelOptions?: Record<number, number[]>;
  aiQuota: AIQuota;
}

type QuizPageInertiaProps = InertiaPageProps & QuizPageData;

export default function KuisPage() {
  const { quizzes, kelasOptions, mapelOptions, kelasMapelOptions, aiQuota } =
    usePage<QuizPageInertiaProps>().props;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<QuizItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const filteredQuizzes = useMemo(() => {
    if (!searchTerm) return quizzes;
    const lower = searchTerm.toLowerCase();
    return quizzes.filter((quiz) => {
      const mapelName = quiz.mapel?.nama?.toLowerCase() ?? "";
      const kelasJoined = quiz.kelas
        .map((item) => item.nama.toLowerCase())
        .join(" ");
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
        setFeedback({
          title: "Kuis berhasil dihapus",
          description:
            "Kuis dan seluruh pertanyaannya telah dihapus dari daftar.",
        });
        setDeleteId(null);
      },
      onError: () => toast.error("Terjadi kesalahan saat menghapus kuis."),
    });
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    setFeedback({
      title: "Kuis baru siap digunakan",
      description: "Silahkan beritahu kelas Anda untuk mengikuti kuis.",
    });
  };

  const handleEditSuccess = () => {
    setEditItem(null);
    setFeedback({
      title: "Perubahan kuis disimpan",
      description: "Semua pengaturan kuis telah diperbarui dengan sukses.",
    });
  };

  const closeFeedback = () => setFeedback(null);

  return (
    <TeacherLayout title="Kelola Kuis">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <QuizListHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onCreateClick={() => setIsCreateOpen(true)}
            />
          </CardHeader>
          <CardContent>
            <QuizList
              quizzes={filteredQuizzes}
              onView={(quiz) => router.visit(`/guru/kuis/${quiz.id}`)}
              onEdit={setEditItem}
              onDelete={setDeleteId}
            />
          </CardContent>
        </Card>
      </div>

      <QuizManagementDialogs
        isCreateOpen={isCreateOpen}
        onCreateClose={() => setIsCreateOpen(false)}
        onCreateSuccess={handleCreateSuccess}
        editItem={editItem}
        onEditClose={() => setEditItem(null)}
        onEditSuccess={handleEditSuccess}
        deleteId={deleteId}
        onDeleteConfirm={handleDelete}
        onDeleteCancel={() => setDeleteId(null)}
        kelasOptions={kelasOptions}
        mapelOptions={mapelOptions}
        kelasMapelOptions={kelasMapelOptions}
        aiQuota={aiQuota}
      />

      <AlertDialog open={feedback !== null} onOpenChange={closeFeedback}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{feedback?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {feedback?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeFeedback}>
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  );
}
