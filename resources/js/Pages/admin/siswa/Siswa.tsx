import React, { useState, useMemo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  Upload,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { toast } from "sonner";

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

  // Konfirmasi hapus
  const [deleteConfirm, setDeleteConfirm] = useState<null | number>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 State untuk pencarian & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

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

  // 🧠 Handle Delete
  const confirmDelete = (id: number) => setDeleteConfirm(id);
  const handleDelete = () => {
    if (!deleteConfirm) return;
    setIsLoading(true);
    router.delete(`/admin/users/${deleteConfirm}`, {
      onSuccess: () => {
        toast.success("✅ Data siswa berhasil dihapus!");
        reloadStudents();
      },
      onError: () => toast.error("❌ Gagal menghapus data siswa."),
      onFinish: () => {
        setIsLoading(false);
        setDeleteConfirm(null);
      },
    });
  };

  const handleAddSuccess = () => {
    setIsAddOpen(false);
    toast.success("✅ Siswa berhasil ditambahkan!");
    reloadStudents();
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    toast.success("✅ Data siswa berhasil diperbarui!");
    reloadStudents();
  };

  // 🧠 Daftar kelas unik dari data siswa
  const kelasOptions = useMemo(() => {
    const allClasses = studentsList.map((s) => s.kelas).filter(Boolean);
    const unique = Array.from(new Set(allClasses));
    return unique.sort();
  }, [studentsList]);

  // 🔎 Filter + Search realtime
  const filteredStudents = useMemo(() => {
    return studentsList.filter((student) => {
      const matchSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.kelas?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchKelas =
        selectedClass === "all" || student.kelas === selectedClass;

      return matchSearch && matchKelas;
    });
  }, [studentsList, searchTerm, selectedClass]);

  // 📤 Export Excel
  const handleExport = async () => {
    setIsLoading(true);
    toast.loading("📦 Mengunduh data siswa...");
    try {
      window.location.href = "/admin/users/export/siswa";
      setTimeout(() => {
        toast.success("✅ Data siswa berhasil diekspor!");
      }, 2000);
    } catch {
      toast.error("❌ Gagal mengekspor data siswa.");
    } finally {
      setIsLoading(false);
    }
  };

  // 📥 Import Excel
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    toast.loading("📤 Mengimpor data siswa...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", "siswa");

    router.post("/admin/users/import", formData, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("✅ Data siswa berhasil diimpor!");
        reloadStudents();
      },
      onError: () => toast.error("❌ Gagal mengimpor data siswa."),
      onFinish: () => setIsLoading(false),
    });
  };

  return (
    <AdminLayout>
      <Head title="Kelola Siswa" />

      {/* 🔄 Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-3 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-700 font-medium">Memproses...</p>
          </div>
        </div>
      )}

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Siswa</CardTitle>
            <CardDescription>
              Kelola data siswa dan informasi pribadi
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Import Button */}
            <Button variant="outline" className="relative overflow-hidden" asChild>
              <label className="cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleImport}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </Button>

            {/* Export Button */}
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export
            </Button>

            {/* Tambah Siswa */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Tambah
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Siswa Baru</DialogTitle>
                </DialogHeader>
                <CreateSiswa onSuccess={handleAddSuccess} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* 🧭 Search dan Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari nama atau NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {kelasOptions.length > 0 ? (
                  kelasOptions.map((kelas, i) => (
                    <SelectItem key={i} value={kelas}>
                      {kelas}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Tidak ada kelas
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* 🧾 Tabel Data Siswa */}
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
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
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
                          onClick={() => confirmDelete(student.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      Tidak ada data siswa yang cocok.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 🧾 Dialog Edit */}
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

      {/* ⚠️ Alert Konfirmasi Hapus */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Siswa</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus data siswa ini? Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
