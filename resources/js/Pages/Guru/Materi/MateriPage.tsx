import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import MateriListHeader from "@/Pages/Guru/components/MateriListHeader";
import MateriList from "@/Pages/Guru/components/MateriList";
import MateriManagementDialogs from "@/Pages/Guru/components/MateriManagementDialogs";
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
import type { Option } from "@/Pages/Guru/components/kuis/formTypes";
import type { MateriItem } from "@/Pages/Guru/components/materiTypes";

interface MateriPageData {
  materis: MateriItem[];
  kelasOptions: Option[];
  mapelOptions: Option[];
}

type MateriPageInertiaProps = InertiaPageProps & MateriPageData;

export default function MateriPage() {
  const { materis, kelasOptions, mapelOptions } =
    usePage<MateriPageInertiaProps>().props;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<MateriItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const filteredMateri = useMemo(() => {
    if (!searchTerm) return materis;
    const lower = searchTerm.toLowerCase();
    return materis.filter((item) => {
      const kelasLabel = item.kelas?.nama?.toLowerCase() ?? "";
      const mapelLabel = item.mapel?.nama?.toLowerCase() ?? "";
      return (
        item.judul.toLowerCase().includes(lower) ||
        kelasLabel.includes(lower) ||
        mapelLabel.includes(lower)
      );
    });
  }, [materis, searchTerm]);

  const handleDelete = () => {
    if (!deleteId) return;

    router.delete(`/guru/materi/${deleteId}`, {
      onSuccess: () => {
        setFeedback({
          title: "Materi berhasil dihapus",
          description:
            "Materi dan seluruh lampiran terkait telah dihapus dari daftar.",
        });
        setDeleteId(null);
      },
      onError: () => toast.error("Terjadi kesalahan saat menghapus materi."),
    });
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    setFeedback({
      title: "Materi baru tersimpan",
      description: "Materi siap dibagikan ke kelas yang Anda pilih.",
    });
  };

  const handleEditSuccess = () => {
    setEditItem(null);
    setFeedback({
      title: "Materi diperbarui",
      description: "Perubahan materi berhasil disimpan dan langsung berlaku.",
    });
  };

  const closeFeedback = () => setFeedback(null);

  return (
    <TeacherLayout title="Kelola Materi Pembelajaran">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <MateriListHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onCreateClick={() => setIsCreateOpen(true)}
            />
          </CardHeader>
          <CardContent>
            <MateriList
              items={filteredMateri}
              onEdit={setEditItem}
              onDelete={setDeleteId}
            />
          </CardContent>
        </Card>
      </div>

      <MateriManagementDialogs
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
