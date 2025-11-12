import { Search, Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import type { Option } from "./types";

interface AssignmentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  kelasFilter: string;
  onKelasChange: (value: string) => void;
  kelasOptions: Option[];
  onCreate: () => void;
}

export default function AssignmentToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  kelasFilter,
  onKelasChange,
  kelasOptions,
  onCreate,
}: AssignmentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-9"
            placeholder="Cari judul, mapel, atau kelas..."
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Selesai</SelectItem>
          </SelectContent>
        </Select>
        <Select value={kelasFilter} onValueChange={onKelasChange}>
          <SelectTrigger>
            <SelectValue placeholder="Semua kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kelas</SelectItem>
            {kelasOptions.map((kelas) => (
              <SelectItem key={kelas.id} value={String(kelas.id)}>
                {kelas.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onCreate} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Buat Tugas
      </Button>
    </div>
  );
}
