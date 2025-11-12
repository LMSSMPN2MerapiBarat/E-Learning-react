import { Card, CardContent } from "@/Components/ui/card";
import { BadgeCheck, ClipboardList, Hourglass } from "lucide-react";

interface AssignmentStatsGridProps {
  total: number;
  pending: number;
  submitted: number;
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
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-semibold">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardContent>
  </Card>
);

export default function AssignmentStatsGrid({
  total,
  pending,
  submitted,
  averageScore,
}: AssignmentStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
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
        title="Rata-Rata Nilai"
        value={averageScore !== null ? `${averageScore}%` : "-"}
        icon={BadgeCheck}
        accent="bg-emerald-500"
      />
    </div>
  );
}
