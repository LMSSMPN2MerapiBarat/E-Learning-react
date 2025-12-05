import { Card, CardContent } from "@/Components/ui/card";
import { BadgeCheck, ClipboardList, Hourglass, Clock } from "lucide-react";

interface AssignmentStatsGridProps {
  total: number;
  pending: number;
  submitted: number;
  waitingGrade: number;
  averageScore: number | null;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string | number;
  icon: typeof ClipboardList;
  accent: string;
}) => (
  <Card>
    <CardContent className="flex items-center justify-between p-4">
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
      <div className={`rounded-full p-2 ${accent}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardContent>
  </Card>
);

export default function AssignmentStatsGrid({
  total,
  pending,
  submitted,
  waitingGrade,
  averageScore,
}: AssignmentStatsGridProps) {
  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <StatCard
        title="Total Tugas"
        value={total}
        icon={ClipboardList}
        accent="bg-blue-500"
      />
      <StatCard
        title="Belum Dikumpulkan"
        value={pending}
        icon={Hourglass}
        accent="bg-amber-500"
      />
      <StatCard
        title="Sudah Dikumpulkan"
        value={submitted}
        icon={ClipboardList}
        accent="bg-sky-500"
      />
      <StatCard
        title="Menunggu Dinilai"
        value={waitingGrade}
        icon={Clock}
        accent="bg-purple-500"
      />
      <StatCard
        title="Rata-Rata Nilai"
        value={averageScore !== null ? `${averageScore}%` : "-"}
        icon={BadgeCheck}
        accent="bg-emerald-500"
      />
    </div>
  );
}
