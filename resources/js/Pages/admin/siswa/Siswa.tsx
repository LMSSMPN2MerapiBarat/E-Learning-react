import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import CreateSiswa from "./Create";
import EditSiswa from "./Edit";
import AdminLayout from "@/Layouts/AdminLayout";

export default function SiswaPage() {
  const { props }: any = usePage();
  const initialStudents: any[] = props.students || [];
  const [studentsList, setStudentsList] = useState<any[]>(initialStudents);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // 🔥 Auto reload data siswa dari backend
  const reloadStudents = () => {
    router.reload({
      only: ["students"],
      onSuccess: (page) => {
        const newStudents = (page.props as any).students || [];
        setStudentsList(newStudents);
      },
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Yakin hapus siswa ini?")) return;
    router.delete(`/admin/users/${id}`, {
      onSuccess: () => {
        reloadStudents(); // ✅ reload otomatis setelah hapus
      },
    });
  };

  const handleAddSuccess = () => {
    setIsAddOpen(false);
    reloadStudents(); // ✅ reload otomatis setelah tambah
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    reloadStudents(); // ✅ reload otomatis setelah edit
  };

  return (
    <AdminLayout>
      <Head title="Kelola Siswa" />

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Siswa</CardTitle>
            <CardDescription>Kelola data siswa dan informasi pribadi</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
              </DialogHeader>
              <CreateSiswa onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg overflow-x-auto bg-white">
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
                {studentsList.length > 0 ? (
                  studentsList.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.nis || "-"}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.kelas || "-"}</TableCell>
                      <TableCell>{student.no_telp || "-"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEditOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                        >
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

      {/* Dialog Edit */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Siswa</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <EditSiswa
              student={selectedStudent}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
