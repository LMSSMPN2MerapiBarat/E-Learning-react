import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/Components/ui/button";
import type { GradeItem } from "@/Pages/Siswa/types";
import GradeCard from "./GradeCard";

interface GradeHistoryTabsProps {
  allGrades: GradeItem[];
  quizGrades: GradeItem[];
  assignmentGrades: GradeItem[];
}

const ITEMS_PER_PAGE = 5;

const GradeHistoryTabs: React.FC<GradeHistoryTabsProps> = ({
  allGrades,
  quizGrades,
  assignmentGrades,
}) => {
  const [allPage, setAllPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [assignmentPage, setAssignmentPage] = useState(1);

  const allTotalPages = Math.ceil(allGrades.length / ITEMS_PER_PAGE);
  const quizTotalPages = Math.ceil(quizGrades.length / ITEMS_PER_PAGE);
  const assignmentTotalPages = Math.ceil(assignmentGrades.length / ITEMS_PER_PAGE);

  const paginatedAll = useMemo(() => {
    const start = (allPage - 1) * ITEMS_PER_PAGE;
    return allGrades.slice(start, start + ITEMS_PER_PAGE);
  }, [allGrades, allPage]);

  const paginatedQuiz = useMemo(() => {
    const start = (quizPage - 1) * ITEMS_PER_PAGE;
    return quizGrades.slice(start, start + ITEMS_PER_PAGE);
  }, [quizGrades, quizPage]);

  const paginatedAssignment = useMemo(() => {
    const start = (assignmentPage - 1) * ITEMS_PER_PAGE;
    return assignmentGrades.slice(start, start + ITEMS_PER_PAGE);
  }, [assignmentGrades, assignmentPage]);

  return (
    <Tabs defaultValue="all" className="space-y-3">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all" className="text-xs">Semua ({allGrades.length})</TabsTrigger>
        <TabsTrigger value="quiz" className="text-xs">Kuis ({quizGrades.length})</TabsTrigger>
        <TabsTrigger value="assignment" className="text-xs">
          Tugas ({assignmentGrades.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-2">
        {allGrades.length === 0 ? (
          <EmptyState message="Belum ada penilaian yang sesuai." />
        ) : (
          <>
            {paginatedAll.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GradeCard grade={grade} />
              </motion.div>
            ))}
            {allGrades.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={allPage}
                totalPages={allTotalPages}
                onPrev={() => setAllPage((p) => Math.max(p - 1, 1))}
                onNext={() => setAllPage((p) => Math.min(p + 1, allTotalPages))}
              />
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="quiz" className="space-y-2">
        {quizGrades.length === 0 ? (
          <EmptyState message="Belum ada penilaian kuis." />
        ) : (
          <>
            {paginatedQuiz.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GradeCard grade={grade} accent="blue" />
              </motion.div>
            ))}
            {quizGrades.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={quizPage}
                totalPages={quizTotalPages}
                onPrev={() => setQuizPage((p) => Math.max(p - 1, 1))}
                onNext={() => setQuizPage((p) => Math.min(p + 1, quizTotalPages))}
              />
            )}
          </>
        )}
      </TabsContent>

      <TabsContent value="assignment" className="space-y-2">
        {assignmentGrades.length === 0 ? (
          <EmptyState message="Belum ada penilaian tugas." />
        ) : (
          <>
            {paginatedAssignment.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GradeCard grade={grade} />
              </motion.div>
            ))}
            {assignmentGrades.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={assignmentPage}
                totalPages={assignmentTotalPages}
                onPrev={() => setAssignmentPage((p) => Math.max(p - 1, 1))}
                onNext={() => setAssignmentPage((p) => Math.min(p + 1, assignmentTotalPages))}
              />
            )}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
};

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="py-8 text-center text-xs text-gray-500">
    <Award className="mx-auto mb-2 h-10 w-10 text-gray-400" />
    {message}
  </div>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-center gap-2 pt-2">
    <Button
      variant="outline"
      size="sm"
      onClick={onPrev}
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
      onClick={onNext}
      disabled={currentPage === totalPages}
      className="h-7 w-7 p-0"
    >
      <ChevronRight className="h-3.5 w-3.5" />
    </Button>
  </div>
);

export default GradeHistoryTabs;