import React, { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import MateriListHeader from "@/Pages/Guru/components/MateriListHeader";
import MateriList from "@/Pages/Guru/components/MateriList";
import MateriManagementDialogs from "@/Pages/Guru/components/MateriManagementDialogs";

import { toast } from "sonner";
import type { Option } from "@/Pages/Guru/components/kuis/formTypes";
import type { MateriItem } from "@/Pages/Guru/components/materiTypes";

interface BankMateriItem {
  id: number;
  nama: string;
  deskripsi: string | null;
  file_name: string | null;
  file_url: string | null;
  file_mime: string | null;
  file_size: number | null;
  created_at: string;
}

interface MateriPageData {
  materis: MateriItem[];
  kelasOptions: Option[];
  mapelOptions: Option[];
  kelasMapelOptions?: Record<number, number[]>;
  bankMateris?: BankMateriItem[];
}

type MateriPageInertiaProps = InertiaPageProps & MateriPageData;

export default function MateriPage() {
  const { materis, kelasOptions, mapelOptions, kelasMapelOptions, bankMateris } =
    usePage<MateriPageInertiaProps>().props;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<MateriItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");


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
        toast.success("Materi berhasil dihapus", {
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
    toast.success("Materi baru tersimpan", {
      description: "Materi siap dibagikan ke kelas yang Anda pilih.",
    });
  };

  const handleEditSuccess = () => {
    setEditItem(null);
    toast.success("Materi diperbarui", {
      description: "Perubahan materi berhasil disimpan dan langsung berlaku.",
    });
  };



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
        kelasMapelOptions={kelasMapelOptions}
        bankMateris={bankMateris}
      />


    </TeacherLayout>
  );
}
