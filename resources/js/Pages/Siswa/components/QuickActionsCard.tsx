import React from "react";
import { Link } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { BookOpen, FileQuestion, FileText } from "lucide-react";

interface QuickActionsCardProps {
  routeHelper?: (name: string, params?: Record<string, unknown>) => string;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ routeHelper }) => {
  const materialsUrl = routeHelper ? routeHelper("siswa.materials") : "#";
  const quizzesUrl = routeHelper ? routeHelper("siswa.quizzes") : "#";
  const gradesUrl = routeHelper ? routeHelper("siswa.grades") : "#";

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Kegiatan Cepat</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        <Button asChild variant="outline" className="justify-start gap-3">
          <Link href={materialsUrl}>
            <BookOpen className="h-5 w-5 text-blue-600" />
            Lihat Materi Pembelajaran
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start gap-3">
          <Link href={quizzesUrl}>
            <FileQuestion className="h-5 w-5 text-emerald-600" />
            Kerjakan Kuis Tersedia
          </Link>
        </Button>
        <Button asChild variant="outline" className="justify-start gap-3">
          <Link href={gradesUrl}>
            <FileText className="h-5 w-5 text-purple-600" />
            Lihat Nilai Saya
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
