// cspell:ignore Tugas
import { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Card, CardContent } from "@/Components/ui/card";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useToast } from "@/Components/ui/use-toast";
import AssignmentToolbar from "@/Pages/Guru/components/tugas/AssignmentToolbar";
import AssignmentTable from "@/Pages/Guru/components/tugas/AssignmentTable";
import CreateAssignment from "@/Pages/Guru/Tugas/Create";
import EditAssignment from "@/Pages/Guru/Tugas/Edit";
import type { AssignmentItem, Option } from "@/Pages/Guru/components/tugas/types";
import type { PageProps } from "@/types";

interface TugasPageProps extends Record<string, unknown> {
  assignments: AssignmentItem[];
  kelasOptions: Option[];
  mapelOptions: Option[];
  fileTypeOptions: string[];
}

export default function TugasPage() {
  const { assignments, kelasOptions, mapelOptions, fileTypeOptions } =
    usePage<PageProps<TugasPageProps>>().props;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState<AssignmentItem | null>(null);
  const [deleteAssignment, setDeleteAssignment] = useState<AssignmentItem | null>(null);
  const { toast } = useToast();

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchSearch =
        !search ||
        assignment.title.toLowerCase().includes(search.toLowerCase()) ||
        (assignment.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || assignment.status === statusFilter;
      const matchKelas =
        kelasFilter === "all" ||
        assignment.kelasIds.includes(Number(kelasFilter));
      return matchSearch && matchStatus && matchKelas;
    });
  }, [assignments, search, statusFilter, kelasFilter]);

  const handleDelete = () => {
    if (!deleteAssignment) return;
    router.delete(`/guru/tugas/${deleteAssignment.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Tugas dihapus",
          description: "Data tugas berhasil dihapus.",
        });
        setDeleteAssignment(null);
      },
      onError: () =>
        toast({
          title: "Gagal menghapus tugas",
          description: "Silakan coba lagi.",
          variant: "destructive",
        }),
    });
  };

  return (
    <TeacherLayout title="Kelola Tugas">
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            <AssignmentToolbar
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              kelasFilter={kelasFilter}
              onKelasChange={setKelasFilter}
              kelasOptions={kelasOptions}
              onCreate={() => setIsCreateOpen(true)}
            />
            <AssignmentTable
              assignments={filteredAssignments}
              onView={(item) => {
                router.visit(`/guru/tugas/${item.id}`);
              }}
              onEdit={(item) => setEditAssignment(item)}
              onDelete={(item) => setDeleteAssignment(item)}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent
          className="max-w-4xl w-[95vw] overflow-hidden p-0"
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader className="text-left">
              <DialogTitle>Buat Tugas Baru</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-3">
              <div className="pb-2">
                <CreateAssignment
                  kelasOptions={kelasOptions}
                  mapelOptions={mapelOptions}
                  fileTypeOptions={fileTypeOptions}
                  onSuccess={() => setIsCreateOpen(false)}
                  onCancel={() => setIsCreateOpen(false)}
                />
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editAssignment !== null} onOpenChange={(open) => !open && setEditAssignment(null)}>
        <DialogContent
          className="max-w-4xl w-[95vw] overflow-hidden p-0"
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader className="text-left">
              <DialogTitle>Edit Tugas</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-3">
              <div className="pb-2">
                {editAssignment && (
                  <EditAssignment
                    assignment={editAssignment}
                    kelasOptions={kelasOptions}
                    mapelOptions={mapelOptions}
                    fileTypeOptions={fileTypeOptions}
                    onSuccess={() => setEditAssignment(null)}
                    onCancel={() => setEditAssignment(null)}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteAssignment !== null} onOpenChange={(open) => !open && setDeleteAssignment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tugas?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data pengumpulan siswa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TeacherLayout>
  );
}
