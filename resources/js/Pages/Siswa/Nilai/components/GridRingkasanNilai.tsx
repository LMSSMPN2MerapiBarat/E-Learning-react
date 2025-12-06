import React from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
} from "@/Components/ui/card";
import {
  Award,
  ClipboardList,
  FileText,
  TrendingUp,
} from "lucide-react";
import type { GradeSummary } from "@/Pages/Siswa/types";
import { getGradeLabel } from "./helperNilai";

interface GradeSummaryGridProps {
  summary: GradeSummary;
  quizCount: number;
  assignmentCount: number;
}

const summaryConfig = [
  {
    key: "overallAverage" as const,
    title: "Rata-rata Keseluruhan",
    description: (value: number, _total?: number) =>
      `Grade: ${getGradeLabel(value, 100)}`,
    icon: Award,
    gradient: "from-purple-500/90 to-purple-600/90",
  },
  {
    key: "quizAverage" as const,
    title: "Rata-rata Kuis",
    description: (_value: number, total: number) => `${total} kuis`,
    icon: ClipboardList,
    gradient: "from-blue-500/90 to-blue-600/90",
  },
  {
    key: "assignmentAverage" as const,
    title: "Rata-rata Tugas",
    description: (_value: number, total: number) => `${total} tugas`,
    icon: FileText,
    gradient: "from-green-500/90 to-green-600/90",
  },
  {
    key: "totalAssessments" as const,
    title: "Total Penilaian",
    description: (_value: number, _total?: number) => "Penilaian tercatat",
    icon: TrendingUp,
    gradient: "from-orange-500/90 to-orange-600/90",
  },
];

const GradeSummaryGrid: React.FC<GradeSummaryGridProps> = ({
  summary,
  quizCount,
  assignmentCount,
}) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {summaryConfig.map(({ key, title, description, icon: Icon, gradient }, index) => {
        const value = summary[key];
        const descriptionText =
          key === "quizAverage"
            ? description(value, quizCount)
            : key === "assignmentAverage"
              ? description(value, assignmentCount)
              : description(value, summary.totalAssessments);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="relative overflow-hidden border shadow-sm">
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-2xl bg-gradient-to-br ${gradient} opacity-30`}
              />
              <CardContent className="relative flex items-center justify-between p-4">
                <div>
                  <p className="text-xs text-gray-600">{title}</p>
                  <p className="mt-1.5 text-2xl font-semibold text-gray-900">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{descriptionText}</p>
                </div>
                <div
                  className={`rounded-md bg-gradient-to-br ${gradient} p-2 text-white shadow`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GradeSummaryGrid;
