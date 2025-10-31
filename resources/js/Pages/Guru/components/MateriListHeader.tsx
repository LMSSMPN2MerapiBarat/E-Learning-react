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
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-gray-900">Materi Pembelajaran</h2>
      <p className="text-sm text-gray-600">
        Unggah dan kelola materi yang dapat diakses oleh siswa di kelas yang Anda pilih.
      </p>
    </div>
    <div className="flex w-full items-center gap-2 md:w-auto">
      <Input
        type="search"
        placeholder="Cari materi..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full md:w-64"
      />
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Unggah Materi
      </Button>
    </div>
  </div>
);

export default MateriListHeader;