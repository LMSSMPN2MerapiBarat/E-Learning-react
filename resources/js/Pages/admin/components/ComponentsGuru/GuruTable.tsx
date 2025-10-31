import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

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

  // ✅ Pastikan guruList selalu array agar tidak error
  const filteredGurus = Array.isArray(guruList)
    ? guruList.filter((guru: any) => {
        const matchSearch =
          guru.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guru.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guru.nip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guru.kelas?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchSubject =
          selectedSubject === "all" ||
          guru.mapel?.toLowerCase().includes(selectedSubject.toLowerCase());
        return matchSearch && matchSubject;
      })
    : [];

  // ✅ Toggle semua checkbox
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredGurus.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredGurus.map((g: any) => g.id));
    }
  };

  // ✅ Toggle satu checkbox
  const toggleSelect = (id: number) => {
    setSelectedIds((prev: number[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* 🔍 Pencarian dan Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
      <div className="border rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 w-[40px] text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  checked={
                    filteredGurus.length > 0 &&
                    selectedIds.length === filteredGurus.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
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
            {filteredGurus.length > 0 ? (
              filteredGurus.map((guru: any) => (
                <tr key={guru.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600 cursor-pointer"
                      checked={selectedIds.includes(guru.id)}
                      onChange={() => toggleSelect(guru.id)}
                    />
                  </td>
                  <td className="p-3">{guru.name}</td>
                  <td className="p-3">{guru.nip || "-"}</td>
                  <td className="p-3">{guru.email}</td>
                  <td className="p-3">{guru.mapel || "-"}</td>
                  <td className="p-3">{formatKelasLabel(guru.kelas)}</td>
                  <td className="p-3">{guru.no_telp || "-"}</td>
                  <td className="p-3 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedGuru(guru);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteConfirm(guru.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500">
                  Tidak ada data guru yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
