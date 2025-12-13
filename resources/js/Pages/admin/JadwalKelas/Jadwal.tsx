import { useEffect, useMemo, useState } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import ScheduleHeader from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleHeader";
import ScheduleFilters from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleFilters";
import ScheduleTabs from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleTabs";
import ScheduleForm from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleForm";
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
import type { ScheduleFormValues, ScheduleItem, ScheduleReference, ScheduleStats } from "./types";
import type { PageProps } from "@/types";

interface JadwalPageProps extends PageProps {
  schedules: ScheduleItem[];
  reference: ScheduleReference;
  stats: ScheduleStats;
}

const DEFAULT_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

export default function Jadwal() {
  const { props } = usePage<JadwalPageProps>();
  const schedules = props.schedules ?? [];
  const reference: ScheduleReference = props.reference ?? {
    teachers: [],
    subjects: [],
    classes: [],
    days: DEFAULT_DAYS,
  };
  const dayList = reference.days.length > 0 ? reference.days : DEFAULT_DAYS;

  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterDay, setFilterDay] = useState<string>("all");
  const [activeDay, setActiveDay] = useState<string>(dayList[0] ?? "Senin");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScheduleItem | null>(null);

  const defaultFormValues: ScheduleFormValues = {
    guru_id: "",
    mata_pelajaran_id: "",
    kelas_id: "",
    day: "",
    start_time: "",
    end_time: "",
    room: "",
  };

  const createForm = useForm<ScheduleFormValues>(defaultFormValues);
  const editForm = useForm<ScheduleFormValues>(defaultFormValues);

  useEffect(() => {
    if (filterDay !== "all") {
      setActiveDay(filterDay);
    }
  }, [filterDay]);

  useEffect(() => {
    if (!dayList.includes(activeDay)) {
      setActiveDay(dayList[0] ?? "Senin");
    }
  }, [dayList, activeDay]);

  const filteredSchedules = useMemo(() => {
    return schedules
      .filter((schedule) => {
        const matchClass =
          filterClass === "all" || schedule.class.id.toString() === filterClass;
        const matchDay = filterDay === "all" || schedule.day === filterDay;
        return matchClass && matchDay;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, filterClass, filterDay]);

  const groupedSchedules = useMemo(() => {
    return dayList.reduce<Record<string, ScheduleItem[]>>((acc, day) => {
      acc[day] = filteredSchedules.filter((schedule) => schedule.day === day);
      return acc;
    }, {});
  }, [filteredSchedules, dayList]);

  const openCreateModal = () => {
    createForm.reset();
    setIsCreateOpen(true);
  };

  const openEditModal = (schedule: ScheduleItem) => {
    setSelectedSchedule(schedule);
    editForm.setData({
      guru_id: schedule.teacher.id,
      mata_pelajaran_id: schedule.subject.id,
      kelas_id: schedule.class.id,
      day: schedule.day,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      room: schedule.room ?? "",
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createForm.post("/admin/jadwal-kelas", {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Jadwal baru berhasil ditambahkan.");
        setIsCreateOpen(false);
        createForm.reset();
      },
      onError: () => toast.error("Gagal menyimpan jadwal."),
    });
  };

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSchedule) return;
    editForm.put(`/admin/jadwal-kelas/${selectedSchedule.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Jadwal berhasil diperbarui.");
        setIsEditOpen(false);
      },
      onError: () => toast.error("Gagal memperbarui jadwal."),
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/jadwal-kelas/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success("Jadwal berhasil dihapus."),
      onError: () => toast.error("Gagal menghapus jadwal."),
      onFinish: () => setDeleteTarget(null),
    });
  };

  return (
    <AdminLayout>
      <Head title="Kelola Jadwal Kelas" />

      <div className="space-y-4">
        <ScheduleHeader stats={props.stats} onCreate={openCreateModal} />
        <ScheduleFilters
          classes={reference.classes}
          days={dayList}
          selectedClass={filterClass}
          selectedDay={filterDay}
          onClassChange={setFilterClass}
          onDayChange={setFilterDay}
        />
        <ScheduleTabs
          days={dayList}
          groupedSchedules={groupedSchedules}
          activeDay={activeDay}
          onDayChange={setActiveDay}
          onEdit={openEditModal}
          onDelete={setDeleteTarget}
        />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Baru</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            reference={reference}
            values={createForm.data}
            errors={createForm.errors}
            processing={createForm.processing}
            submitLabel="Simpan Jadwal"
            onChange={(field, value) => createForm.setData(field, value)}
            onSubmit={handleCreateSubmit}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Jadwal</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <ScheduleForm
              reference={reference}
              values={editForm.data}
              errors={editForm.errors}
              processing={editForm.processing}
              submitLabel="Perbarui Jadwal"
              onChange={(field, value) => editForm.setData(field, value)}
              onSubmit={handleEditSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
            <AlertDialogDescription>
              Hapus jadwal{" "}
              <span className="font-semibold">
                {deleteTarget?.subject.name} - {deleteTarget?.class.label}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-700"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
