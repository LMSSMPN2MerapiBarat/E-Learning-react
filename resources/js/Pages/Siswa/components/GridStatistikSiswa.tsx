import { Card, CardContent } from "@/Components/ui/card";
import { BookOpen, ClipboardList, FileText, Users } from "lucide-react";
import type { StatsPayload } from "../types";
import { motion } from "motion/react";

const STAT_CONFIG = [
  {
    key: "materialCount" as const,
    label: "Materi Tersedia",
    icon: BookOpen,
    accent: "bg-blue-100 text-blue-600",
  },
  {
    key: "quizCount" as const,
    label: "Kuis Aktif",
    icon: ClipboardList,
    accent: "bg-green-100 text-green-600",
  },
  {
    key: "recentMaterialCount" as const,
    label: "Materi Baru (7 Hari)",
    icon: FileText,
    accent: "bg-purple-100 text-purple-600",
  },
  {
    key: "classmateCount" as const,
    label: "Teman Sekelas",
    icon: Users,
    accent: "bg-orange-100 text-orange-600",
  },
] satisfies Array<{
  key: keyof StatsPayload;
  label: string;
  icon: typeof BookOpen;
  accent: string;
}>;

interface StudentStatsGridProps {
  stats: StatsPayload;
}

export default function StudentStatsGrid({ stats }: StudentStatsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, accent }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="relative overflow-hidden border shadow-sm">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-400/10 to-blue-600/10" />
            <CardContent className="relative flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-gray-600">{label}</p>
                <p className="mt-1.5 text-2xl font-semibold text-gray-900">
                  {stats[key]}
                </p>
              </div>
              <div className={`rounded-md p-2.5 ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
