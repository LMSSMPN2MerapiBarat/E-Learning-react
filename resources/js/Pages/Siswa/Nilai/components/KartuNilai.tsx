import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Calendar, ClipboardList, FileText } from "lucide-react";
import type { GradeItem } from "@/Pages/Siswa/types";
import { getScoreBgColor, getScoreColor, getGradeLabel } from "./helperNilai";

interface GradeCardProps {
  grade: GradeItem;
  accent?: "blue";
}

const GradeCard: React.FC<GradeCardProps> = ({ grade, accent }) => (
  <Card
    className={`border-l-4 ${grade.status === "late"
        ? "border-l-red-500"
        : accent === "blue"
          ? "border-l-blue-500"
          : "border-l-green-500"
      }`}
  >
    <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="text-xs font-medium text-gray-900">{grade.title}</h3>
          <Badge variant="outline" className="text-[10px]">{grade.subject}</Badge>
          <Badge variant="outline" className="capitalize text-[10px]">
            {grade.type === "quiz" ? (
              <span className="flex items-center gap-0.5">
                <ClipboardList className="h-2.5 w-2.5" />
                Kuis
              </span>
            ) : (
              <span className="flex items-center gap-0.5">
                <FileText className="h-2.5 w-2.5" />
                Tugas
              </span>
            )}
          </Badge>
          {grade.status === "late" && (
            <Badge variant="destructive" className="text-[10px]">Terlambat</Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(grade.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        {grade.feedback && (
          <div className="rounded-md bg-blue-50 p-2 text-xs text-gray-700">
            <p className="text-gray-600">Komentar Guru:</p>
            <p>{grade.feedback}</p>
          </div>
        )}
      </div>
      <div
        className={`flex w-full flex-col items-center rounded-md border-2 p-3 md:w-40 ${getScoreBgColor(
          grade.score,
          grade.maxScore,
        )}`}
      >
        <div className={`text-2xl font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}>
          {grade.score}
        </div>
        <div className="text-xs text-gray-600">dari {grade.maxScore || "-"}</div>
        <div
          className={`mt-0.5 text-base font-semibold ${getScoreColor(
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