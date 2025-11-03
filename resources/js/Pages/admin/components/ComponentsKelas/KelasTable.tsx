import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import SimplePagination from "@/Components/SimplePagination";

interface KelasTableProps {
  kelasList: any[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedKelas: (kelas: any) => void;
  setIsEditOpen: (value: boolean) => void;
  setDeleteConfirm: (value: number | null) => void;
  onViewDetail: (id: number) => void;
}

const KelasTable: React.FC<KelasTableProps> = ({
  kelasList,
  selectedIds,
  setSelectedIds,
  setSelectedKelas,
  setIsEditOpen,
  setDeleteConfirm,
  onViewDetail,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const offset = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(kelasList.length / itemsPerPage));
  const paginatedKelas = kelasList.slice(offset, offset + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [kelasList.length]);

  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((value) => value !== id)
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    const pageIds = paginatedKelas.map((kelas) => kelas.id);
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const pageAllSelected =
    paginatedKelas.length > 0 &&
    paginatedKelas.every((kelas) => selectedIds.includes(kelas.id));

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border bg-white md:block">
        <table className="min-w-[780px] w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-10 p-2">
                <input
                  type="checkbox"
                  checked={pageAllSelected}
                  disabled={paginatedKelas.length === 0}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-2 text-center">No</th>
              <th className="p-2 text-left">Tingkat</th>
              <th className="p-2 text-left">Nama Kelas</th>
              <th className="p-2 text-left">Tahun Ajaran</th>
              <th className="p-2 text-left">Jumlah Siswa</th>
              <th className="p-2 text-left">Jumlah Pengajar</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedKelas.length > 0 ? (
              paginatedKelas.map((kelas, index) => (
                <tr key={kelas.id} className="border-t">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(kelas.id)}
                      onChange={(e) => toggleSelect(kelas.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-2 text-center">{offset + index + 1}</td>
                  <td className="p-2">{kelas.tingkat}</td>
                  <td className="p-2">{kelas.kelas}</td>
                  <td className="p-2">{kelas.tahun_ajaran}</td>
                  <td className="p-2 text-center">{kelas.siswa_count ?? 0}</td>
                  <td className="p-2 text-center">{kelas.guru_count ?? 0}</td>
                  <td className="flex justify-center gap-2 p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(kelas.id)}
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedKelas(kelas);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirm(kelas.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : kelasList.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-sm text-gray-500"
                >
                  Tidak ada data kelas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {paginatedKelas.length > 0 ? (
          paginatedKelas.map((kelas, index) => (
            <div
              key={kelas.id}
              className="space-y-3 rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    No. {offset + index + 1}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {kelas.kelas}
                  </p>
                  <p className="text-sm text-gray-500">{kelas.tingkat}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(kelas.id)}
                  onChange={(e) => toggleSelect(kelas.id, e.target.checked)}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />
              </div>
              <div className="grid gap-1 text-sm">
                <p>
                  <span className="font-medium text-gray-600">
                    Tahun Ajaran:
                  </span>{" "}
                  {kelas.tahun_ajaran}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Jumlah Siswa:
                  </span>{" "}
                  {kelas.siswa_count ?? 0}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Jumlah Pengajar:
                  </span>{" "}
                  {kelas.guru_count ?? 0}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetail(kelas.id)}
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedKelas(kelas);
                    setIsEditOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirm(kelas.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        ) : kelasList.length === 0 ? (
          <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
            Tidak ada data kelas.
          </p>
        ) : null}
      </div>

      <SimplePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default KelasTable;
