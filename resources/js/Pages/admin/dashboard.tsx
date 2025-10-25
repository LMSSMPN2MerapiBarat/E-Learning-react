import React from "react";
import { Head, usePage } from "@inertiajs/react";
import StatsCards from "@/Components/StatsCards";
import AdminLayout from "@/Layouts/AdminLayout";
import DashboardOverview from "@/Components/DashboardOverview";

export default function AdminDashboard() {
  const { totalGuru, totalSiswa, totalMateri, totalKuis }: any = usePage().props;

  return (
    <>
      <Head title="Dashboard Admin" />
      <AdminLayout title="Dashboard">
        {/* Bagian Statistik */}
        {/* <StatsCards
          totalGuru={totalGuru}
          totalSiswa={totalSiswa}
          totalMateri={totalMateri}
          totalKuis={totalKuis}
        /> */}

        {/* Tambahkan DashboardOverview di bawahnya */}
        <div className="mt-6">
          <DashboardOverview />
        </div>
      </AdminLayout>
    </>
  );
}
