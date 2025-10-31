import { usePage } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import TeacherLayout from "@/Layouts/TeacherLayout";
import StatOverview from "@/Pages/Guru/components/StatOverview";
import SubjectsCard from "@/Pages/Guru/components/SubjectsCard";
import RecentMateriCard from "@/Pages/Guru/components/RecentMateriCard";
import RecentQuizzesCard from "@/Pages/Guru/components/RecentQuizzesCard";
import type {
  DashboardStats,
  RecentMateriItem,
  RecentQuizItem,
} from "@/Pages/Guru/components/dashboardHelpers";

interface DashboardProps {
  stats: DashboardStats;
  mataPelajaran: string[];
  recentMateri: RecentMateriItem[];
  recentQuizzes: RecentQuizItem[];
}

type GuruDashboardPageProps = InertiaPageProps & DashboardProps;

export default function GuruDashboard() {
  const { stats, mataPelajaran, recentMateri, recentQuizzes } =
    usePage<GuruDashboardPageProps>().props;

  return (
    <TeacherLayout title="Dashboard Guru">
      <div className="space-y-6">
        <StatOverview stats={stats} />

        <SubjectsCard subjects={mataPelajaran} />

        <div className="grid gap-4 lg:grid-cols-2">
          <RecentMateriCard items={recentMateri} />
          <RecentQuizzesCard items={recentQuizzes} />
        </div>
      </div>
    </TeacherLayout>
  );
}
