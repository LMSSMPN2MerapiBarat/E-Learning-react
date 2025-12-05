import React from "react";
import { Link } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { BookOpen, ClipboardList, FileText } from "lucide-react";

interface QuickActionsCardProps {
  routeHelper?: (name: string, params?: Record<string, unknown>) => string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ routeHelper }) => {
  const materialsUrl = routeHelper ? routeHelper("siswa.materials") : "#";
  const quizzesUrl = routeHelper ? routeHelper("siswa.quizzes") : "#";
  const gradesUrl = routeHelper ? routeHelper("siswa.grades") : "#";

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Kegiatan Cepat</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-3">
        <Button asChild variant="outline" size="sm" className="justify-start gap-2 text-xs">
          <Link href={materialsUrl}>
            <BookOpen className="h-4 w-4 text-blue-600" />
            Lihat Materi Pembelajaran
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="justify-start gap-2 text-xs">
          <Link href={quizzesUrl}>
            <ClipboardList className="h-4 w-4 text-emerald-600" />
            Kerjakan Kuis Tersedia
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="justify-start gap-2 text-xs">
          <Link href={gradesUrl}>
            <FileText className="h-4 w-4 text-purple-600" />
            Lihat Nilai Saya
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
