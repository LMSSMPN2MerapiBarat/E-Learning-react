import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";

interface SubjectPerformanceListProps {
  subjects: string[];
  getStats: (subject: string) => { avg: number; count: number };
}

const SubjectPerformanceList: React.FC<SubjectPerformanceListProps> = ({
  subjects,
  getStats,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performa per Mata Pelajaran</CardTitle>
        <CardDescription>
          Rata-rata nilai untuk setiap mata pelajaran
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
            Belum ada penilaian yang tercatat.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => {
              const stats = getStats(subject);
              return (
                <motion.div
                  key={subject}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-lg border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.count} penilaian
                      </p>
                    </div>
                    <span className="text-2xl font-semibold text-gray-900">
                      {stats.avg}
                    </span>
                  </div>
                  <Progress value={stats.avg} className="mt-4 h-2" />
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectPerformanceList;
