import { useEffect, useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import StudentScheduleNavigator from "./components/StudentScheduleNavigator";
import StudentScheduleList from "./components/StudentScheduleList";
import type { SiswaPageProps } from "./types";

const DEFAULT_DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_NAMES_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const getCurrentDayName = () => DAY_NAMES_ID[new Date().getDay()];

const formatTimeNow = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Schedule() {
  const { props } = usePage<SiswaPageProps>();
  const { student, hasClass, schedule } = props;

  const dayOptions = useMemo(() => {
    const source = schedule?.days?.length ? schedule.days : DEFAULT_DAYS;
    return source.filter((day, index) => source.indexOf(day) === index);
  }, [schedule]);

  const groupedSchedules = schedule?.byDay ?? {};

  const initialDay = useMemo(() => {
    const today = getCurrentDayName();
    if (dayOptions.includes(today)) {
      return today;
    }
    return dayOptions[0] ?? "Senin";
  }, [dayOptions]);

  const [currentDay, setCurrentDay] = useState(initialDay);

  useEffect(() => {
    if (!dayOptions.includes(currentDay) && dayOptions.length > 0) {
      setCurrentDay(dayOptions[0]);
    }
  }, [dayOptions, currentDay]);

  const currentTime = formatTimeNow();
  const todayName = getCurrentDayName();
  const todaysSchedules = groupedSchedules[currentDay] ?? [];
  const totalClassesToday = todaysSchedules.length;

  const handleNavigate = (direction: "prev" | "next") => {
    if (dayOptions.length === 0) return;
    const currentIndex = dayOptions.indexOf(currentDay);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    if (direction === "prev") {
      const nextIndex = safeIndex > 0 ? safeIndex - 1 : dayOptions.length - 1;
      setCurrentDay(dayOptions[nextIndex]);
    } else {
      const nextIndex = safeIndex < dayOptions.length - 1 ? safeIndex + 1 : 0;
      setCurrentDay(dayOptions[nextIndex]);
    }
  };

  return (
    <StudentLayout
      title="Jadwal Pelajaran"
      subtitle={
        student.className
          ? `Kelas ${student.className}`
          : "Terhubung otomatis dengan jadwal kelas Anda."
      }
    >
      <Head title="Jadwal Pelajaran" />

      <div className="space-y-6">
        {!hasClass && (
          <Alert className="border-l-4 border-l-amber-500">
            <AlertDescription>
              Akun Anda belum terhubung ke kelas. Hubungi admin atau wali kelas agar jadwal
              dapat ditampilkan.
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-3 text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Jadwal Pelajaran</h2>
              <p className="text-sm text-gray-600">
                {student.className
                  ? `Kelas ${student.className}`
                  : "Belum ada kelas terdaftar"}
              </p>
            </div>
          </div>
        </motion.div>

        <StudentScheduleNavigator
          currentDay={currentDay}
          days={dayOptions}
          onSelectDay={setCurrentDay}
          onNavigate={handleNavigate}
          totalClasses={totalClassesToday}
        />

        <StudentScheduleList
          day={currentDay}
          schedules={todaysSchedules}
          todayName={todayName}
          currentTime={currentTime}
        />

      </div>
    </StudentLayout>
  );
}
