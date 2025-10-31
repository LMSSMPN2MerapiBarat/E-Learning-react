import React from "react";
import { Button } from "@/Components/ui/button";

interface KelasTableProps {
  kelasList: any[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedKelas: (kelas: any) => void;
  setIsEditOpen: (value: boolean) => void;
  setDeleteConfirm: (value: number | null) => void;
}

const KelasTable: React.FC<KelasTableProps> = ({
  kelasList,
  selectedIds,
  setSelectedIds,
  setSelectedKelas,
  setIsEditOpen,
  setDeleteConfirm,
}) => {
  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((value) => value !== id)
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(kelasList.map((kelas) => kelas.id));
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border bg-white md:block">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="w-10 p-2">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === kelasList.length &&
                    kelasList.length > 0
                  }
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-2 text-left">Tingkat</th>
              <th className="p-2 text-left">Nama Kelas</th>
              <th className="p-2 text-left">Tahun Ajaran</th>
              <th className="p-2 text-left">Jumlah Siswa</th>
              <th className="p-2 text-left">Jumlah Pengajar</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kelasList.map((kelas) => (
              <tr key={kelas.id} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(kelas.id)}
                    onChange={(e) => toggleSelect(kelas.id, e.target.checked)}
                  />
                </td>
                <td className="p-2">{kelas.tingkat}</td>
                <td className="p-2">{kelas.kelas}</td>
                <td className="p-2">{kelas.tahun_ajaran}</td>
                <td className="p-2 text-center">{kelas.siswa_count ?? 0}</td>
                <td className="p-2 text-center">{kelas.guru_count ?? 0}</td>
                <td className="flex justify-center gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedKelas(kelas);
                      setIsEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteConfirm(kelas.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
            {kelasList.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-sm text-gray-500"
                >
                  Tidak ada data kelas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {kelasList.length > 0 ? (
          kelasList.map((kelas) => (
            <div
              key={kelas.id}
              className="space-y-3 rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
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
                  onClick={() => {
                    setSelectedKelas(kelas);
                    setIsEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirm(kelas.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
            Tidak ada data kelas.
          </p>
        )}
      </div>
    </>
  );
};

export default KelasTable;
