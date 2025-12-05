import { motion } from "motion/react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import type { StudentScheduleItem } from "@/Pages/Siswa/types";

interface StudentScheduleListProps {
  day: string;
  schedules: StudentScheduleItem[];
  todayName: string;
  currentTime: string;
}

const DAY_COLORS: Record<string, string> = {
  Senin: "from-blue-500 to-blue-700",
  Selasa: "from-green-500 to-green-700",
  Rabu: "from-yellow-500 to-yellow-700",
  Kamis: "from-purple-500 to-purple-700",
  Jumat: "from-pink-500 to-pink-700",
  Sabtu: "from-slate-500 to-slate-700",
};

const SUBJECT_EMOJIS: Record<string, string> = {
  Matematika: "📐",
  "Bahasa Indonesia": "📚",
  "Bahasa Inggris": "🌍",
  IPA: "🔬",
  IPS: "🌏",
  "Pendidikan Agama Islam": "🕌",
  "Pendidikan Jasmani": "⚽",
  "Seni Budaya": "🎨",
};

const formatEmoji = (subject?: string | null) => {
  if (!subject) return "📖";
  return SUBJECT_EMOJIS[subject] ?? "📖";
};

const isTimeBetween = (current: string, start: string, end: string) => {
  return current >= start && current <= end;
};

const isTimeBefore = (current: string, start: string) => {
  return current < start;
};

export default function StudentScheduleList({
  day,
  schedules,
  todayName,
  currentTime,
}: StudentScheduleListProps) {
  const hasSchedules = schedules.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-2"
    >
      {hasSchedules ? (
        schedules.map((schedule, index) => {
          const { startTime, endTime } = schedule;
          const isToday = schedule.day === todayName;
          const isActive = isToday && isTimeBetween(currentTime, startTime, endTime);
          const isNext = isToday && !isActive && isTimeBefore(currentTime, startTime);

          return (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card
                className={`border-l-4 transition-all hover:shadow-lg ${isActive
                    ? "border-l-green-600 bg-green-50/60 shadow-md"
                    : isNext
                      ? "border-l-blue-600 bg-blue-50/40"
                      : "border-l-gray-200"
                  }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    <div
                      className={`flex min-w-[90px] flex-col items-center justify-center rounded-lg bg-gradient-to-br ${DAY_COLORS[day] ?? "from-gray-500 to-gray-700"
                        } p-3 text-white shadow-md`}
                    >
                      <Clock className="mb-1.5 h-4 w-4" />
                      <div className="text-center">
                        <p className="text-xs font-semibold">{startTime}</p>
                        <p className="text-[10px] opacity-80">-</p>
                        <p className="text-xs font-semibold">{endTime}</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{formatEmoji(schedule.subject)}</span>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {schedule.subject ?? "Tanpa Mata Pelajaran"}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {schedule.className ?? "Kelas"}
                            </p>
                          </div>
                        </div>
                        {isActive && (
                          <Badge className="bg-green-600 text-white text-[10px]">Sedang berlangsung</Badge>
                        )}
                        {!isActive && isNext && (
                          <Badge className="bg-blue-600 text-white text-[10px]">Berikutnya</Badge>
                        )}
                      </div>
                      <div className="grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-gray-500" />
                          <span>{schedule.teacher ?? "-"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          <span>{schedule.room ?? "Belum ditentukan"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-gray-900">Tidak Ada Jadwal</h3>
              <p className="text-xs">Tidak ada jadwal pelajaran untuk hari {day}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

