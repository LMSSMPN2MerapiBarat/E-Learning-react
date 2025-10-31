import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Calendar, FileQuestion, FileText } from "lucide-react";
import type { GradeItem } from "@/Pages/Siswa/types";
import { getScoreBgColor, getScoreColor, getGradeLabel } from "./gradeHelpers";

interface GradeCardProps {
  grade: GradeItem;
  accent?: "blue";
}

const GradeCard: React.FC<GradeCardProps> = ({ grade, accent }) => (
  <Card
    className={`border-l-4 ${
      grade.status === "late"
        ? "border-l-red-500"
        : accent === "blue"
        ? "border-l-blue-500"
        : "border-l-green-500"
    }`}
  >
    <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">{grade.title}</h3>
          <Badge variant="outline">{grade.subject}</Badge>
          <Badge variant="outline" className="capitalize">
            {grade.type === "quiz" ? (
              <span className="flex items-center gap-1">
                <FileQuestion className="h-3 w-3" />
                Kuis
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Tugas
              </span>
            )}
          </Badge>
          {grade.status === "late" && (
            <Badge variant="destructive">Terlambat</Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(grade.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        {grade.feedback && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-700">
            <p className="text-gray-600">Komentar Guru:</p>
            <p>{grade.feedback}</p>
          </div>
        )}
      </div>
      <div
        className={`flex w-full flex-col items-center rounded-lg border-2 p-4 md:w-48 ${getScoreBgColor(
          grade.score,
          grade.maxScore,
        )}`}
      >
        <div className={`text-3xl font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}>
          {grade.score}
        </div>
        <div className="text-sm text-gray-600">dari {grade.maxScore || "-"}</div>
        <div
          className={`mt-1 text-xl font-semibold ${getScoreColor(
            grade.score,
            grade.maxScore,
          )}`}
        >
          {getGradeLabel(grade.score, grade.maxScore)}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default GradeCard;