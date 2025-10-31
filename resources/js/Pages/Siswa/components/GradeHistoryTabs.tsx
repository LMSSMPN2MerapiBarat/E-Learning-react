import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Award } from "lucide-react";
import { motion } from "motion/react";
import type { GradeItem } from "@/Pages/Siswa/types";
import GradeCard from "./GradeCard";

interface GradeHistoryTabsProps {
  allGrades: GradeItem[];
  quizGrades: GradeItem[];
  assignmentGrades: GradeItem[];
}

const GradeHistoryTabs: React.FC<GradeHistoryTabsProps> = ({
  allGrades,
  quizGrades,
  assignmentGrades,
}) => (
  <Tabs defaultValue="all" className="space-y-4">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="all">Semua ({allGrades.length})</TabsTrigger>
      <TabsTrigger value="quiz">Kuis ({quizGrades.length})</TabsTrigger>
      <TabsTrigger value="assignment">
        Tugas ({assignmentGrades.length})
      </TabsTrigger>
    </TabsList>

    <TabsContent value="all" className="space-y-3">
      {allGrades.length === 0 ? (
        <EmptyState message="Belum ada penilaian yang sesuai." />
      ) : (
        allGrades.map((grade, index) => (
          <motion.div
            key={grade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GradeCard grade={grade} />
          </motion.div>
        ))
      )}
    </TabsContent>

    <TabsContent value="quiz" className="space-y-3">
      {quizGrades.length === 0 ? (
        <EmptyState message="Belum ada penilaian kuis." />
      ) : (
        quizGrades.map((grade, index) => (
          <motion.div
            key={grade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GradeCard grade={grade} accent="blue" />
          </motion.div>
        ))
      )}
    </TabsContent>

    <TabsContent value="assignment" className="space-y-3">
      {assignmentGrades.length === 0 ? (
        <EmptyState message="Belum ada penilaian tugas." />
      ) : (
        assignmentGrades.map((grade, index) => (
          <motion.div
            key={grade.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GradeCard grade={grade} />
          </motion.div>
        ))
      )}
    </TabsContent>
  </Tabs>
);

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="py-10 text-center text-gray-500">
    <Award className="mx-auto mb-3 h-12 w-12 text-gray-400" />
    {message}
  </div>
);

export default GradeHistoryTabs;