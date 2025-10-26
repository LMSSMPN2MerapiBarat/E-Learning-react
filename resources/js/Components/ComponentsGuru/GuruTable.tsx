import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

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

  const filteredGurus = guruList.filter((guru: any) => {
    const matchSearch =
      guru.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guru.nip?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSubject =
      selectedSubject === "all" ||
      guru.mapel?.toLowerCase() === selectedSubject.toLowerCase();
    return matchSearch && matchSubject;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredGurus.length) setSelectedIds([]);
    else setSelectedIds(filteredGurus.map((g: any) => g.id));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev: number[]) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
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
            <SelectItem value="Matematika">Matematika</SelectItem>
            <SelectItem value="IPA">IPA</SelectItem>
            <SelectItem value="IPS">IPS</SelectItem>
            <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
            <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-x-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredGurus.length && filteredGurus.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">NIP</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mata Pelajaran</th>
              <th className="p-3 text-left">No. Telepon</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredGurus.length > 0 ? (
              filteredGurus.map((guru: any) => (
                <tr key={guru.id} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(guru.id)}
                      onChange={() => toggleSelect(guru.id)}
                    />
                  </td>
                  <td className="p-3">{guru.name}</td>
                  <td className="p-3">{guru.nip || "-"}</td>
                  <td className="p-3">{guru.email}</td>
                  <td className="p-3">{guru.mapel || "-"}</td>
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
                <td colSpan={7} className="text-center py-6 text-gray-500">
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
