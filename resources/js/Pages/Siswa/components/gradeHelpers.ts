import type { GradeItem } from "@/Pages/Siswa/types";

export const calculateAverage = (items: GradeItem[]): number => {
  if (items.length === 0) return 0;
  const sum = items.reduce((accumulator, item) => {
    if (!item.maxScore) {
      return accumulator;
    }
    return accumulator + (item.score / item.maxScore) * 100;
  }, 0);
  return Math.round(sum / items.length);
};

export const getScoreColor = (score: number, maxScore: number): string => {
  const percentage = maxScore ? (score / maxScore) * 100 : 0;
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  return "text-red-600";
};

export const getScoreBgColor = (score: number, maxScore: number): string => {
  const percentage = maxScore ? (score / maxScore) * 100 : 0;
  if (percentage >= 80) return "bg-green-50 border-green-200";
  if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
};

export const getGradeLabel = (score: number, maxScore: number): string => {
  const percentage = maxScore ? (score / maxScore) * 100 : 0;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "E";
};
