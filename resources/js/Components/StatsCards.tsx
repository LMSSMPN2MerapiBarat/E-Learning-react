import { Card, CardContent } from '@/Components/ui/card';
import { Users, GraduationCap, BookOpen, BarChart3 } from 'lucide-react';

interface StatCardProps {
  totalSiswa: number;
  totalGuru: number;
  totalMateri: number;
  totalKuis: number;
}

export default function StatsCards({ totalSiswa, totalGuru, totalMateri, totalKuis }: StatCardProps) {
  const stats = [
    { title: 'Total Siswa', value: totalSiswa, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Guru', value: totalGuru, icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Materi Tersedia', value: totalMateri, icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Kuis Aktif', value: totalKuis, icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl mt-2 font-semibold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
