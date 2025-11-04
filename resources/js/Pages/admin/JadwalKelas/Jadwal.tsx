import { useEffect, useMemo, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import ScheduleHeader from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleHeader";
import ScheduleFilters from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleFilters";
import ScheduleTabs from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleTabs";
import type { ScheduleItem, ScheduleReference, ScheduleStats } from "./types";
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

  const handleEdit = (schedule: ScheduleItem) => {
    router.visit(`/admin/jadwal-kelas/${schedule.id}/Edit`);
  };

  const handleDelete = (schedule: ScheduleItem) => {
    const confirmed = window.confirm(
      `Hapus jadwal ${schedule.subject.name} untuk kelas ${schedule.class.label}?`,
    );

    if (!confirmed) return;

    router.delete(`/admin/jadwal-kelas/${schedule.id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success("Jadwal berhasil dihapus."),
      onError: () => toast.error("Gagal menghapus jadwal."),
    });
  };

  return (
    <AdminLayout>
      <Head title="Kelola Jadwal Kelas" />

      <div className="space-y-6">
        <ScheduleHeader stats={props.stats} createHref="/admin/jadwal-kelas/Create" />
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
}
