import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SubjectPerformanceListProps {
  subjects: string[];
  getStats: (subject: string) => { avg: number; count: number };
}

const ITEMS_PER_PAGE = 6;

const SubjectPerformanceList: React.FC<SubjectPerformanceListProps> = ({
  subjects,
  getStats,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil(subjects.length / ITEMS_PER_PAGE), [subjects.length]);

  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return subjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [subjects, currentPage]);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Performa per Mata Pelajaran</CardTitle>
            <CardDescription className="text-xs">
              Rata-rata nilai untuk setiap mata pelajaran
            </CardDescription>
          </div>
          {subjects.length > ITEMS_PER_PAGE && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-gray-600 min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-xs text-gray-500">
            Belum ada penilaian yang tercatat.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {paginatedSubjects.map((subject) => {
              const stats = getStats(subject);
              return (
                <motion.div
                  key={subject}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-md border bg-gradient-to-br from-gray-50 to-white p-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {subject}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {stats.count} penilaian
                      </p>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">
                      {stats.avg}
                    </span>
                  </div>
                  <Progress value={stats.avg} className="mt-3 h-1.5" />
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
