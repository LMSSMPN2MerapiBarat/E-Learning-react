import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import type { RecentQuizItem } from "./dashboardHelpers";

interface RecentQuizzesCardProps {
  items: RecentQuizItem[];
}

const RecentQuizzesCard: React.FC<RecentQuizzesCardProps> = ({ items }) => (
  <Card>
    <CardHeader>
      <CardTitle>Kuis Terbaru</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-gray-500">Belum ada kuis yang dibuat.</p>
      )}
      {items.map((quiz) => (
        <div
          key={quiz.id}
          className="rounded-lg border p-4 transition hover:bg-gray-50"
        >
          <h3 className="text-base font-medium text-gray-800">{quiz.judul}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {quiz.mapel && <Badge variant="outline">{quiz.mapel}</Badge>}
            <Badge variant="outline">{quiz.durasi} Menit</Badge>
            <Badge
              className={
                quiz.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            >
              {quiz.status === "published" ? "Aktif" : "Draft"}
            </Badge>
            <Badge variant="outline">{quiz.pertanyaan} Pertanyaan</Badge>
            {quiz.created_at && (
              <span>
                {new Date(quiz.created_at).toLocaleDateString("id-ID")}
              </span>
            )}
          </div>
          {quiz.kelas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {quiz.kelas.map((kelas) => (
                <Badge key={kelas} variant="secondary">
                  {kelas}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

export default RecentQuizzesCard;
