import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Users, BookOpen, School, GraduationCap } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  kelas?: string;
  no_telp?: string;
  nis?: string;
}

interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
  students: Student[];
  totalGuru: number;
  totalSiswa: number;
  totalMateri: number;
  totalKuis: number;
}

export default function DashboardOverview() {
  const { students = [], totalGuru = 0, totalSiswa = 0, totalMateri = 0, totalKuis = 0 } =
    usePage<PageProps>().props;

  const [searchStudents, setSearchStudents] = useState('');
  const [searchGuru, setSearchGuru] = useState('');
  const [searchKelas, setSearchKelas] = useState('');
  const [searchMapel, setSearchMapel] = useState('');

  // ✅ Data lokal sementara
  const guruData = [
    { id: 1, name: 'Bapak Ahmad', email: 'ahmad@smpn2mb.sch.id', mapel: 'Matematika' },
    { id: 2, name: 'Ibu Rina', email: 'rina@smpn2mb.sch.id', mapel: 'Bahasa Indonesia' },
  ];

  const kelasData = [
    { id: 1, nama: 'VII A', wali: 'Bapak Ahmad' },
    { id: 2, nama: 'VIII B', wali: 'Ibu Rina' },
  ];

  const mapelData = [
    { id: 1, nama: 'Matematika', guru: 'Bapak Ahmad' },
    { id: 2, nama: 'Bahasa Indonesia', guru: 'Ibu Rina' },
    { id: 3, nama: 'IPA', guru: 'Bapak Budi' },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
      s.nis?.includes(searchStudents) ||
      s.kelas?.toLowerCase().includes(searchStudents.toLowerCase())
  );

  const filteredGuru = guruData.filter(
    (g) =>
      g.name.toLowerCase().includes(searchGuru.toLowerCase()) ||
      g.mapel.toLowerCase().includes(searchGuru.toLowerCase())
  );

  const filteredKelas = kelasData.filter((k) =>
    k.nama.toLowerCase().includes(searchKelas.toLowerCase())
  );

  const filteredMapel = mapelData.filter((m) =>
    m.nama.toLowerCase().includes(searchMapel.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Statistik */}
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

      {/* Tabs Data */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sekolah</CardTitle>
          <CardDescription>Data siswa, guru, kelas, dan mata pelajaran</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="students" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="students">Siswa</TabsTrigger>
              <TabsTrigger value="guru">Guru</TabsTrigger>
              <TabsTrigger value="kelas">Kelas</TabsTrigger>
              <TabsTrigger value="mapel">Mata Pelajaran</TabsTrigger>
            </TabsList>

            {/* ===== SISWA ===== */}
            <TabsContent value="students" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari siswa (nama, NIS, kelas)..."
                  value={searchStudents}
                  onChange={(e) => setSearchStudents(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIS</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>No. Telp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono">{student.nis}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.kelas || '-'}</TableCell>
                        <TableCell>{student.no_telp || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* ===== GURU ===== */}
            <TabsContent value="guru" className="space-y-4">
              <Input
                placeholder="Cari guru (nama, mapel)..."
                value={searchGuru}
                onChange={(e) => setSearchGuru(e.target.value)}
              />
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuru.map((guru) => (
                      <TableRow key={guru.id}>
                        <TableCell>{guru.name}</TableCell>
                        <TableCell>{guru.email}</TableCell>
                        <TableCell>{guru.mapel}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* ===== KELAS ===== */}
            <TabsContent value="kelas" className="space-y-4">
              <Input
                placeholder="Cari kelas..."
                value={searchKelas}
                onChange={(e) => setSearchKelas(e.target.value)}
              />
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Kelas</TableHead>
                      <TableHead>Wali Kelas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKelas.map((kelas) => (
                      <TableRow key={kelas.id}>
                        <TableCell>{kelas.nama}</TableCell>
                        <TableCell>{kelas.wali}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* ===== MATA PELAJARAN ===== */}
            <TabsContent value="mapel" className="space-y-4">
              <Input
                placeholder="Cari mata pelajaran..."
                value={searchMapel}
                onChange={(e) => setSearchMapel(e.target.value)}
              />
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Mata Pelajaran</TableHead>
                      <TableHead>Guru Pengampu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMapel.map((mapel) => (
                      <TableRow key={mapel.id}>
                        <TableCell>{mapel.nama}</TableCell>
                        <TableCell>{mapel.guru}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
