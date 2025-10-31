import React from "react";
import { Button } from "@/Components/ui/button";

interface MapelTableProps {
  mapelList: any[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedMapel: (mapel: any) => void;
  setIsEditOpen: (value: boolean) => void;
  setDeleteConfirm: (value: number | null) => void;
}

const MapelTable: React.FC<MapelTableProps> = ({
  mapelList,
  selectedIds,
  setSelectedIds,
  setSelectedMapel,
  setIsEditOpen,
  setDeleteConfirm,
}) => {
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === mapelList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mapelList.map((m) => m.id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 text-center">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === mapelList.length && mapelList.length > 0
                }
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-2 text-left">Nama Mata Pelajaran</th>
            <th className="p-2 text-left">Jumlah Guru</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mapelList.map((mapel) => (
            <tr key={mapel.id} className="border-t">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(mapel.id)}
                  onChange={() => toggleSelect(mapel.id)}
                />
              </td>
              <td className="p-2">{mapel.nama_mapel}</td>
              <td className="p-2">{mapel.gurus_count ?? 0}</td>
              <td className="flex justify-center gap-2 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMapel(mapel);
                    setIsEditOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirm(mapel.id)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
          {mapelList.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500">
                Tidak ada data mata pelajaran.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MapelTable;
