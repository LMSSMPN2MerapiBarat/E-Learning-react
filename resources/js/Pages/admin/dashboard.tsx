import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { LogOut, Users, Plus, Trash2 } from 'lucide-react';

import StatsCards from '@/Components/StatsCards';
import CreateSiswa from './siswa/Create';

export default function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const { props } = usePage<any>();
  const { auth, students, totalGuru, totalSiswa, totalMateri, totalKuis } = props;

  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleDelete = (id: number | string) => {
    if (!confirm('Yakin hapus siswa ini?')) return;
    router.delete(`/admin/users/${id}`, {
      onSuccess: () => router.reload({ only: ['students'] }),
    });
  };

  return (
    <>
      <Head title="Dashboard Admin" />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">SMP Negeri 2 Merapi Barat</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Statistik */}
          <StatsCards
            totalGuru={totalGuru}
            totalSiswa={totalSiswa}
            totalMateri={totalMateri}
            totalKuis={totalKuis}
          />

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Siswa</TabsTrigger>
              <TabsTrigger value="teachers">Guru</TabsTrigger>
              <TabsTrigger value="classes">Kelas</TabsTrigger>
              <TabsTrigger value="subjects">Mapel</TabsTrigger>
            </TabsList>

            {/* Siswa */}
            <TabsContent value="students">
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Manajemen Data Siswa</CardTitle>
                    <CardDescription>Kelola data siswa dan informasi pribadi</CardDescription>
                  </div>

                  <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Siswa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tambah Siswa Baru</DialogTitle>
                      </DialogHeader>
                      <CreateSiswa onSuccess={() => setIsAddOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>

                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NIS</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Kelas</TableHead>
                          <TableHead>No. Telepon</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.length > 0 ? (
                          students.map((student: any) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.nis}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{student.kelas}</TableCell>
                              <TableCell>{student.no_telp}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleDelete(student.id)}>
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                              Tidak ada data siswa.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
