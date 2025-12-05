import React from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

export function LoadingOverlay({ text = "Memproses..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg flex flex-col items-center gap-2 shadow-xl">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <p className="text-gray-700 font-medium text-sm">{text}</p>
      </div>
    </div>
  );
}

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  kelasOptions: string[];
}

export function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedClass,
  setSelectedClass,
  kelasOptions,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
        <Input
          placeholder="Cari nama atau NIS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 text-xs h-8"
        />
      </div>

      <Select value={selectedClass} onValueChange={setSelectedClass}>
        <SelectTrigger className="w-full md:w-[180px] h-8 text-xs">
          <SelectValue placeholder="Filter Kelas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kelas</SelectItem>
          {kelasOptions.length > 0 ? (
            kelasOptions.map((kelas, i) => (
              <SelectItem key={i} value={kelas}>
                {kelas}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              Tidak ada kelas
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

