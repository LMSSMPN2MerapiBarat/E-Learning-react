import { motion } from "motion/react";
import { Calendar, Layers, Users, Plus, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import type { ScheduleStats } from "@/Pages/Admin/JadwalKelas/types";

interface ScheduleHeaderProps {
  stats?: ScheduleStats | null;
  onCreate?: () => void;
}

export default function ScheduleHeader({ stats, onCreate }: ScheduleHeaderProps) {
  const safeStats: ScheduleStats = stats ?? {
    total: 0,
    distinctClass: 0,
    distinctGuru: 0,
  };

  const statItems = [
    {
      label: "Total Jadwal",
      value: safeStats.total,
      icon: Calendar,
      accent: "from-blue-500 to-blue-700",
    },
    {
      label: "Kelas Terjadwal",
      value: safeStats.distinctClass,
      icon: Layers,
      accent: "from-green-500 to-green-700",
    },
    {
      label: "Guru Aktif",
      value: safeStats.distinctGuru,
      icon: Users,
      accent: "from-purple-500 to-purple-700",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden border-l-4 border-l-blue-600">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-1.5 text-base">
              <Clock className="h-4 w-4 text-blue-600" />
              Kelola Jadwal Pelajaran
            </CardTitle>
            <CardDescription className="text-xs">
              Atur hubungan guru, mata pelajaran, kelas, dan jam belajar.
            </CardDescription>
          </div>
          <Button type="button" size="sm" onClick={onCreate}>
            <Plus className="mr-1.5 h-3 w-3" />
            Tambah Jadwal
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                </div>
                <div
                  className={`rounded-lg bg-gradient-to-br ${item.accent} p-2 text-white shadow`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
