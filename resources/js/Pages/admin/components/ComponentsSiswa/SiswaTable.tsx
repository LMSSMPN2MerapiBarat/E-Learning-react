import React from "react";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2, CheckSquare, Square, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

interface Props {
  students: any[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedStudent: (v: any) => void;
  setIsEditOpen: (v: boolean) => void;
  setDeleteConfirm: (v: number | null) => void;
  startIndex: number;
  onViewDetail: (student: any) => void;
}

export default function SiswaTable({
  students,
  selectedIds,
  setSelectedIds,
  setSelectedStudent,
  setIsEditOpen,
  setDeleteConfirm,
  startIndex,
  onViewDetail,
}: Props) {
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) setSelectedIds([]);
    else setSelectedIds(students.map((s) => s.id));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border bg-white md:block">
        <Table className="min-w-[880px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSelectAll}
                  className="p-0"
                >
                  {selectedIds.length === students.length ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-500" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-[60px] text-center">No</TableHead>
              <TableHead>NISN</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => toggleSelect(student.id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>{student.nis || "-"}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell className="capitalize">
                    {student.jenis_kelamin || "-"}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.kelas || "-"}</TableCell>
                  <TableCell>{student.no_telp || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* UPDATED: sama seperti style pertama (outline, sm) */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(student)}
                      className="px-2"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
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
                      onClick={() => setDeleteConfirm(student.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                  Tidak ada data siswa yang cocok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {students.length > 0 ? (
          students.map((student, index) => (
            <div
              key={student.id}
              className="space-y-3 rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    No. {startIndex + index + 1}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {student.name}
                  </p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(student.id)}
                  onChange={() => toggleSelect(student.id)}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />
              </div>

              <div className="grid gap-1 text-sm">
                <p>
                  <span className="font-medium text-gray-600">NIS:</span>{" "}
                  {student.nis || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Jenis Kelamin:</span>{" "}
                  {student.jenis_kelamin || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Kelas:</span>{" "}
                  {student.kelas || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">No. Telepon:</span>{" "}
                  {student.no_telp || "-"}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                {/* UPDATED: outline + sm agar match style */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(student)}
                  className="px-2"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(student)}
                >
                  Detail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedStudent(student);
                    setIsEditOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirm(student.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
            Tidak ada data siswa yang cocok.
          </p>
        )}
      </div>
    </>
  );
}
