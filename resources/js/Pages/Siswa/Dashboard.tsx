import { Head, usePage } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import StudentStatsGrid from "./components/StudentStatsGrid";
import QuickActionsCard from "./components/QuickActionsCard";
import RecentMaterialsCard from "./components/RecentMaterialsCard";
import UpcomingQuizzesCard from "./components/UpcomingQuizzesCard";
import type { SiswaPageProps } from "./types";

export default function Dashboard() {
  const { props } = usePage<SiswaPageProps>();
  const {
    student,
    hasClass,
    stats,
    materials = [],
    quizzes = [],
  } = props;

  const routeHelper =
    typeof window !== "undefined" && typeof (window as any).route === "function"
      ? ((window as any).route as (
        name: string,
        params?: Record<string, unknown>
      ) => string)
      : undefined;

  const recentMaterials = materials.slice(0, 3);
  const upcomingQuizzes = quizzes.slice(0, 3);

  return (
    <StudentLayout
      title="Dashboard Siswa"
      subtitle={
        student.className
          ? `${student.className}`
          : "Silakan hubungi admin atau guru untuk penempatan kelas."
      }
    >
      <Head title="Dashboard Siswa" />

      <div className="space-y-4">
        {!hasClass && (
          <Alert className="border-l-4 border-l-amber-500">
            <AlertDescription>
              Akun Anda belum terhubung ke kelas. Hubungi admin atau guru agar
              bisa mengakses materi dan kuis.
            </AlertDescription>
          </Alert>
        )}

        <StudentStatsGrid stats={stats} />

        <QuickActionsCard routeHelper={routeHelper} />

        <div className="grid gap-4 lg:grid-cols-2">
          <RecentMaterialsCard
            items={recentMaterials}
            routeHelper={routeHelper}
          />
          <UpcomingQuizzesCard
            items={upcomingQuizzes}
            routeHelper={routeHelper}
          />
        </div>
      </div>
    </StudentLayout>
  );
}
