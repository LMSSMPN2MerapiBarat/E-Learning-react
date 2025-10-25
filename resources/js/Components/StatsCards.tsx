import React from "react";
import { Card, CardContent } from "./ui/card";
import { Users, GraduationCap, BookOpen, School } from "lucide-react";

interface StatsCardsProps {
  totalGuru: number;
  totalSiswa: number;
  totalMateri: number;
  totalKuis: number;
}

export default function StatsCards({
  totalGuru,
  totalSiswa,
  totalMateri,
  totalKuis,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Siswa</p>
              <p className="text-3xl mt-2">{totalSiswa}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Guru</p>
              <p className="text-3xl mt-2">{totalGuru}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Materi</p>
              <p className="text-3xl mt-2">{totalMateri}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Kuis</p>
              <p className="text-3xl mt-2">{totalKuis}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <School className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
