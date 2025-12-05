import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import SimplePagination from "@/Components/SimplePagination";

interface MapelTableProps {
  mapelList: any[];
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectedMapel: (mapel: any) => void;
  setIsEditOpen: (value: boolean) => void;
  setDeleteConfirm: (value: number | null) => void;
  onViewDetail: (id: number) => void;
}

const MapelTable: React.FC<MapelTableProps> = ({
  mapelList,
  selectedIds,
  setSelectedIds,
  setSelectedMapel,
  setIsEditOpen,
  setDeleteConfirm,
  onViewDetail,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const offset = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.max(1, Math.ceil(mapelList.length / itemsPerPage));
  const paginatedMapel = mapelList.slice(offset, offset + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [mapelList.length]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedMapel.map((m) => m.id);
    const allSelected =
      pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-1.5 text-center">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5"
                  checked={
                    paginatedMapel.length > 0 &&
                    paginatedMapel.every((mapel) =>
                      selectedIds.includes(mapel.id)
                    )
                  }
                  disabled={paginatedMapel.length === 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-1.5 text-center">No</th>
              <th className="p-1.5 text-left">Nama Mata Pelajaran</th>
              <th className="p-1.5 text-left">Jumlah Guru</th>
              <th className="p-1.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMapel.length > 0 ? (
              paginatedMapel.map((mapel, index) => (
                <tr key={mapel.id} className="border-t">
                  <td className="p-1.5 text-center">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5"
                      checked={selectedIds.includes(mapel.id)}
                      onChange={() => toggleSelect(mapel.id)}
                    />
                  </td>
                  <td className="p-1.5 text-center">{offset + index + 1}</td>
                  <td className="p-1.5">{mapel.nama_mapel}</td>
                  <td className="p-1.5">{mapel.gurus_count ?? 0}</td>
                  <td className="flex justify-center gap-1.5 p-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onViewDetail(mapel.id)}
                    >
                      <Eye className="h-3 w-3 text-gray-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        setSelectedMapel(mapel);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="h-3 w-3 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setDeleteConfirm(mapel.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : mapelList.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500 text-xs">
                  Tidak ada data mata pelajaran.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <SimplePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default MapelTable;
