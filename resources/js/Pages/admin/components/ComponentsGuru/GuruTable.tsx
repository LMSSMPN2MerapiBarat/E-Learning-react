import React, { useEffect, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import SimplePagination from "@/Components/SimplePagination";

const formatKelasLabel = (value: unknown) => {
  if (!value) return "-";
  const items = Array.isArray(value)
    ? value
    : String(value)
        .split(",")
        .map((item) => item.trim());

  const formatted = items
    .map((item) =>
      item
        .replace(/Kelas\s*\d+\s*[-:]?\s*/gi, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);

  return formatted.length ? formatted.join(", ") : "-";
};

export default function GuruTable({
  guruList,
  setSelectedGuru,
  setIsEditOpen,
  setDeleteConfirm,
  selectedIds,
  setSelectedIds,
}: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredGurus = Array.isArray(guruList)
    ? guruList.filter((guru: any) => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchSearch =
          guru.name?.toLowerCase().includes(lowerSearch) ||
          guru.email?.toLowerCase().includes(lowerSearch) ||
          guru.nip?.toLowerCase().includes(lowerSearch) ||
          guru.kelas?.toLowerCase().includes(lowerSearch);
        const matchSubject =
          selectedSubject === "all" ||
          guru.mapel?.toLowerCase().includes(selectedSubject.toLowerCase());
        return matchSearch && matchSubject;
      })
    : [];

  const totalPages = Math.max(1, Math.ceil(filteredGurus.length / itemsPerPage));
  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedGurus = filteredGurus.slice(offset, offset + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSubject]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleSelectAll = () => {
    const pageIds = paginatedGurus.map((g: any) => g.id);
    const allSelected =
      pageIds.length > 0 &&
      pageIds.every((id: number) => selectedIds.includes(id));

    setSelectedIds((prev: number[]) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev: number[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* 🔍 Pencarian dan Filter */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Cari nama, email, atau NIP guru..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            <SelectItem value="matematika">Matematika</SelectItem>
            <SelectItem value="ipa">IPA</SelectItem>
            <SelectItem value="ips">IPS</SelectItem>
            <SelectItem value="bahasa indonesia">Bahasa Indonesia</SelectItem>
            <SelectItem value="bahasa inggris">Bahasa Inggris</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 Tabel Guru */}
      <div className="hidden overflow-x-auto rounded-lg border bg-white md:block">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[40px] p-3 text-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                  checked={
                    paginatedGurus.length > 0 &&
                    paginatedGurus.every((guru: any) =>
                      selectedIds.includes(guru.id)
                    )
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="w-[60px] p-3 text-center">No</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">NIP</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mata Pelajaran</th>
              <th className="p-3 text-left">Kelas Diajar</th>
              <th className="p-3 text-left">No. Telepon</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGurus.length > 0 ? (
              paginatedGurus.map((guru: any, index: number) => (
                <tr key={guru.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-blue-600"
                      checked={selectedIds.includes(guru.id)}
                      onChange={() => toggleSelect(guru.id)}
                    />
                  </td>
                  <td className="p-3 text-center">{offset + index + 1}</td>
                  <td className="p-3">{guru.name}</td>
                  <td className="p-3">{guru.nip || "-"}</td>
                  <td className="p-3">{guru.email}</td>
                  <td className="p-3">{guru.mapel || "-"}</td>
                  <td className="p-3">{formatKelasLabel(guru.kelas)}</td>
                  <td className="p-3">{guru.no_telp || "-"}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedGuru(guru);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(guru.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredGurus.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  Tidak ada data guru yang cocok.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {paginatedGurus.length > 0 ? (
          paginatedGurus.map((guru: any, index: number) => (
            <div
              key={guru.id}
              className="space-y-3 rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    No. {offset + index + 1}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {guru.name}
                  </p>
                  <p className="text-sm text-gray-500">{guru.email}</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={selectedIds.includes(guru.id)}
                  onChange={() => toggleSelect(guru.id)}
                />
              </div>
              <div className="grid gap-1 text-sm">
                <p>
                  <span className="font-medium text-gray-600">NIP:</span>{" "}
                  {guru.nip || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Mapel:</span>{" "}
                  {guru.mapel || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Kelas:</span>{" "}
                  {formatKelasLabel(guru.kelas)}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    No. Telepon:
                  </span>{" "}
                  {guru.no_telp || "-"}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedGuru(guru);
                    setIsEditOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirm(guru.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        ) : filteredGurus.length === 0 ? (
          <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
            Tidak ada data guru yang cocok.
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
}
