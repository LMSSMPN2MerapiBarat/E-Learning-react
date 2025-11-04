import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { Calendar, Layers, Users, Plus, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import type { ScheduleStats } from "@/Pages/Admin/JadwalKelas/types";

interface ScheduleHeaderProps {
  stats?: ScheduleStats | null;
  createHref: string;
}

export default function ScheduleHeader({ stats, createHref }: ScheduleHeaderProps) {
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
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-5 w-5 text-blue-600" />
              Kelola Jadwal Pelajaran
            </CardTitle>
            <CardDescription>
              Atur hubungan guru, mata pelajaran, kelas, dan jam belajar.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href={createHref}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Jadwal
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                </div>
                <div
                  className={`rounded-xl bg-gradient-to-br ${item.accent} p-3 text-white shadow`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
