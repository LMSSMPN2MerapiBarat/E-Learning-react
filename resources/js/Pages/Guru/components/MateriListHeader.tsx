import React from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";

interface MateriListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}

const MateriListHeader: React.FC<MateriListHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onCreateClick,
}) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-base font-semibold text-gray-900">Materi Pembelajaran</h2>
      <p className="text-xs text-gray-600">
        Unggah dan kelola materi yang dapat diakses oleh siswa di kelas yang Anda pilih.
      </p>
    </div>
    <div className="flex w-full items-center gap-1.5 md:w-auto">
      <Input
        type="search"
        placeholder="Cari materi..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full md:w-56 h-8 text-xs"
      />
      <Button size="sm" onClick={onCreateClick}>
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        Unggah Materi
      </Button>
    </div>
  </div>
);

export default MateriListHeader;