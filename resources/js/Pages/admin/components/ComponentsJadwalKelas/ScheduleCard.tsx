import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Edit,
  GraduationCap,
  MapPin,
  Trash2,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import type { ScheduleItem } from "@/Pages/Admin/JadwalKelas/types";

const dayAccentMap: Record<string, string> = {
  Senin: "from-blue-500 to-blue-700",
  Selasa: "from-green-500 to-green-700",
  Rabu: "from-amber-500 to-amber-700",
  Kamis: "from-purple-500 to-purple-700",
  Jumat: "from-pink-500 to-pink-700",
  Sabtu: "from-slate-500 to-slate-700",
};

interface ScheduleCardProps {
  schedule: ScheduleItem;
  onEdit: (schedule: ScheduleItem) => void;
  onDelete: (schedule: ScheduleItem) => void;
}

export default function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  const accent = dayAccentMap[schedule.day] ?? "from-gray-500 to-gray-700";

  return (
    <motion.div className="w-full" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
      <Card className="w-full overflow-hidden border-l-4 border-l-blue-600 shadow-sm transition hover:shadow-lg">
        <CardContent className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white`}>
                  <Clock className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{schedule.subject.name}</h3>
                    <Badge variant="secondary">{schedule.class.label}</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoRow icon={User} label="Guru" value={schedule.teacher.name} />
                    <InfoRow
                      icon={Clock}
                      label="Jam"
                      value={`${schedule.startTime} - ${schedule.endTime}`}
                    />
                    <InfoRow icon={GraduationCap} label="Kelas" value={schedule.class.label} />
                    <InfoRow icon={MapPin} label="Ruangan" value={schedule.room ?? "-"} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button className="flex-1 sm:flex-none" variant="outline" size="sm" onClick={() => onEdit(schedule)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button className="flex-1 sm:flex-none" variant="outline" size="sm" onClick={() => onDelete(schedule)}>
                <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                Hapus
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-gray-400" />
      <div>
        <p className="text-[11px] uppercase text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-700">{value}</p>
      </div>
    </div>
  );
}
