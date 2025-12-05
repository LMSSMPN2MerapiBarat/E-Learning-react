import React, { useEffect, useMemo, useState } from "react";
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

interface MapelOption {
  id?: number;
  nama_mapel?: string | null;
}

export default function GuruTable({
  guruList,
  setSelectedGuru,
  setIsEditOpen,
  setDeleteConfirm,
  selectedIds,
  setSelectedIds,
  mapelOptions,
}: {
  guruList: any[];
  setSelectedGuru: (guru: any) => void;
  setIsEditOpen: (open: boolean) => void;
  setDeleteConfirm: (id: number | null) => void;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  mapelOptions?: MapelOption[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const subjectOptions = useMemo(() => {
    const fromMapels =
      mapelOptions?.map((m) => (m?.nama_mapel ?? "").trim()).filter(Boolean) ?? [];

    const fromGurus = Array.isArray(guruList)
      ? guruList
        .flatMap((guru: any) =>
          (guru.mapel ?? "")
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean),
        )
      : [];

    const merged = [...fromMapels, ...fromGurus];
    const unique: string[] = [];
    merged.forEach((name) => {
      const lower = name.toLowerCase();
      if (!unique.some((existing) => existing.toLowerCase() === lower)) {
        unique.push(name);
      }
    });
    return unique;
  }, [mapelOptions, guruList]);

  const filteredGurus = Array.isArray(guruList)
    ? guruList.filter((guru: any) => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchSearch =
        guru.name?.toLowerCase().includes(lowerSearch) ||
        guru.email?.toLowerCase().includes(lowerSearch) ||
        guru.nip?.toLowerCase().includes(lowerSearch) ||
        guru.jenis_kelamin?.toLowerCase().includes(lowerSearch) ||
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
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Cari nama, email, atau NIP guru..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8"
          />
        </div>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-[180px] h-8 text-xs">
            <SelectValue placeholder="Filter Mapel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Mapel</SelectItem>
            {subjectOptions.map((mapel) => (
              <SelectItem key={mapel} value={mapel}>
                {mapel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 📋 Tabel Guru */}
      <div className="hidden overflow-x-auto rounded-lg border bg-white md:block">
        <table className="min-w-[800px] w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[36px] p-2 text-center">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                  checked={
                    paginatedGurus.length > 0 &&
                    paginatedGurus.every((guru: any) =>
                      selectedIds.includes(guru.id)
                    )
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="w-[50px] p-2 text-center">No</th>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Jenis Kelamin</th>
              <th className="p-2 text-left">NIP</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Mata Pelajaran</th>
              <th className="p-2 text-left">Kelas Diajar</th>
              <th className="p-2 text-left">No. Telepon</th>
              <th className="p-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGurus.length > 0 ? (
              paginatedGurus.map((guru: any, index: number) => (
                <tr key={guru.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 cursor-pointer accent-blue-600"
                      checked={selectedIds.includes(guru.id)}
                      onChange={() => toggleSelect(guru.id)}
                    />
                  </td>
                  <td className="p-2 text-center">{offset + index + 1}</td>
                  <td className="p-2">{guru.name}</td>
                  <td className="p-2 capitalize">
                    {guru.jenis_kelamin || "-"}
                  </td>
                  <td className="p-2">{guru.nip || "-"}</td>
                  <td className="p-2">{guru.email}</td>
                  <td className="p-2">{guru.mapel || "-"}</td>
                  <td className="p-2">{formatKelasLabel(guru.kelas)}</td>
                  <td className="p-2">{guru.no_telp || "-"}</td>
                  <td className="p-2 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setSelectedGuru(guru);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setDeleteConfirm(guru.id)}
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredGurus.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-4 text-center text-gray-500 text-xs">
                  Tidak ada data guru yang cocok.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 md:hidden">
        {paginatedGurus.length > 0 ? (
          paginatedGurus.map((guru: any, index: number) => (
            <div
              key={guru.id}
              className="space-y-2 rounded-lg border bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    No. {offset + index + 1}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {guru.name}
                  </p>
                  <p className="text-xs text-gray-500">{guru.email}</p>
                </div>
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-blue-600"
                  checked={selectedIds.includes(guru.id)}
                  onChange={() => toggleSelect(guru.id)}
                />
              </div>
              <div className="grid gap-0.5 text-xs">
                <p>
                  <span className="font-medium text-gray-600">NIP:</span>{" "}
                  {guru.nip || "-"}
                </p>
                <p>
                  <span className="font-medium text-gray-600">
                    Jenis Kelamin:
                  </span>{" "}
                  {guru.jenis_kelamin || "-"}
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
              <div className="flex justify-end gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => {
                    setSelectedGuru(guru);
                    setIsEditOpen(true);
                  }}
                >
                  <Pencil className="h-3 w-3 text-blue-600" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setDeleteConfirm(guru.id)}
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            </div>
          ))
        ) : filteredGurus.length === 0 ? (
          <p className="rounded-lg border bg-white p-3 text-center text-xs text-gray-500 shadow-sm">
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
