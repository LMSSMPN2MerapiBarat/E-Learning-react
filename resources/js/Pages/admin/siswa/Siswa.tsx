import React, { useState, useMemo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { LoadingOverlay, FilterBar, Pagination } from "@/Pages/admin/components/ComponentsSiswa/SiswaComponents";

import SiswaHeader from "@/Pages/admin/components/ComponentsSiswa/SiswaHeader";
import SiswaTable from "@/Pages/admin/components/ComponentsSiswa/SiswaTable";
import SiswaDialogs from "@/Pages/admin/components/ComponentsSiswa/SiswaDialogs";

export default function SiswaPage() {
  const { props }: any = usePage();
  const initialStudents: any[] = props.students || [];

  const [studentsList, setStudentsList] = useState<any[]>(initialStudents);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<null | number>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 🔄 Reload data siswa
  const reloadStudents = () => {
    router.reload({
      only: ["students"],
      onSuccess: (page) => {
        const newStudents = (page.props as any).students || [];
        setStudentsList(newStudents);
        setSelectedIds([]);
      },
    });
  };

  // ✅ Handler success CRUD
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

  // 🔍 Filter & Pagination
  const kelasOptions = useMemo(() => {
    const allClasses = studentsList.map((s) => s.kelas).filter(Boolean);
    return Array.from(new Set(allClasses)).sort();
  }, [studentsList]);

  const filteredStudents = useMemo(() => {
    return studentsList.filter((student) => {
      const matchSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nis?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKelas =
        selectedClass === "all" || student.kelas === selectedClass;
      return matchSearch && matchKelas;
    });
  }, [studentsList, searchTerm, selectedClass]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AdminLayout>
      <Head title="Kelola Siswa" />
      {isLoading && <LoadingOverlay text="Sedang memproses data siswa..." />}

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="font-normal text-xl">Data Siswa</CardTitle>
            <CardDescription>
              Kelola data siswa dan informasi pribadi
            </CardDescription>
          </div>

          <SiswaHeader
            {...{
              selectedIds,
              setIsAddOpen,
              setIsDeleteDialogOpen,
              setIsLoading,
              reloadStudents,
              setSelectedIds,
            }}
          />
        </CardHeader>

        <CardContent>
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            kelasOptions={kelasOptions}
          />

          <SiswaTable
            students={paginatedStudents}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            setSelectedStudent={setSelectedStudent}
            setIsEditOpen={setIsEditOpen}
            setDeleteConfirm={setDeleteConfirm}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <SiswaDialogs
        {...{
          isAddOpen,
          setIsAddOpen,
          isEditOpen,
          setIsEditOpen,
          selectedStudent,
          handleAddSuccess,
          handleEditSuccess,
          deleteConfirm,
          setDeleteConfirm,
          isDeleteDialogOpen,
          setIsDeleteDialogOpen,
          selectedIds,
          reloadStudents,
          setIsLoading,
        }}
      />
    </AdminLayout>
  );
}
