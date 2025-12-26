// cspell:ignore Tugas
import { useMemo, useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { toast } from "sonner";
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
  kelasMapelOptions?: Record<number, number[]>;
  fileTypeOptions: string[];
}

export default function TugasPage() {
  const { assignments, kelasOptions, mapelOptions, kelasMapelOptions, fileTypeOptions } =
    usePage<PageProps<TugasPageProps>>().props;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kelasFilter, setKelasFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState<AssignmentItem | null>(null);
  const [deleteAssignment, setDeleteAssignment] = useState<AssignmentItem | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE);
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, kelasFilter]);

  const handleDelete = () => {
    if (!deleteAssignment) return;
    router.delete(`/guru/tugas/${deleteAssignment.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Tugas dihapus", {
          description: "Data tugas berhasil dihapus.",
        });
        setDeleteAssignment(null);
      },
      onError: () =>
        toast.error("Gagal menghapus tugas", {
          description: "Silakan coba lagi.",
        }),
    });
  };

  return (
    <TeacherLayout title="Kelola Tugas">
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-4 pt-4">
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
              assignments={paginatedAssignments}
              onView={(item) => {
                router.visit(`/guru/tugas/${item.id}`);
              }}
              onEdit={(item) => setEditAssignment(item)}
              onDelete={(item) => setDeleteAssignment(item)}
            />

            {filteredAssignments.length > 0 && (
              <div className="flex flex-col gap-2 pt-3 border-t sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  Halaman {currentPage} dari {totalPages} | Menampilkan{" "}
                  {paginatedAssignments.length} dari {filteredAssignments.length} tugas
                </p>
                <div className="flex justify-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <span className="text-xs font-medium px-2 min-w-[50px] text-center flex items-center justify-center">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline">Berikutnya</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent
          className="max-w-3xl w-[95vw] overflow-hidden p-0"
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-3 p-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base">Buat Tugas Baru</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[65vh] pr-3">
              <div className="pb-2">
                <CreateAssignment
                  kelasOptions={kelasOptions}
                  mapelOptions={mapelOptions}
                  kelasMapelOptions={kelasMapelOptions}
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
          className="max-w-3xl w-[95vw] overflow-hidden p-0"
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <div className="flex flex-col gap-3 p-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base">Edit Tugas</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[65vh] pr-3">
              <div className="pb-2">
                {editAssignment && (
                  <EditAssignment
                    assignment={editAssignment}
                    kelasOptions={kelasOptions}
                    mapelOptions={mapelOptions}
                    kelasMapelOptions={kelasMapelOptions}
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
