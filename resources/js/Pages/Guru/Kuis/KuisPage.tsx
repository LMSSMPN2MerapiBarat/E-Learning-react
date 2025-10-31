import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import { toast } from "sonner";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import QuizListHeader from "@/Pages/Guru/components/kuis/QuizListHeader";
import QuizList from "@/Pages/Guru/components/kuis/QuizList";
import QuizManagementDialogs from "@/Pages/Guru/components/kuis/QuizManagementDialogs";
import type {
  Option,
  QuizItem,
} from "@/Pages/Guru/components/kuis/formTypes";

interface QuizPageData {
  quizzes: QuizItem[];
  kelasOptions: Option[];
  mapelOptions: Option[];
}

type QuizPageInertiaProps = InertiaPageProps & QuizPageData;

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
              onEdit={setEditItem}
              onDelete={setDeleteId}
            />
          </CardContent>
        </Card>
      </div>

      <QuizManagementDialogs
        isCreateOpen={isCreateOpen}
        onCreateClose={() => setIsCreateOpen(false)}
        editItem={editItem}
        onEditClose={() => setEditItem(null)}
        deleteId={deleteId}
        onDeleteConfirm={handleDelete}
        onDeleteCancel={() => setDeleteId(null)}
        kelasOptions={kelasOptions}
        mapelOptions={mapelOptions}
      />
    </TeacherLayout>
  );
}