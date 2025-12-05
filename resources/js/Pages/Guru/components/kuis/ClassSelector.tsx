import React from "react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import type { Option } from "./formTypes";

interface ClassSelectorProps {
  options: Option[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  error?: string;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({
  options,
  selectedIds,
  onToggle,
  error,
}) => (
  <div className="space-y-2">
    <div>
      <p className="text-sm font-medium text-gray-700">Pilih Kelas <span className="text-red-500">*</span></p>
      <p className="text-xs text-gray-500">
        Pilih satu atau lebih kelas untuk menerima kuis ini.
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      {options.map((kelas) => {
        const selected = selectedIds.includes(kelas.id);
        return (
          <Button
            key={kelas.id}
            type="button"
            variant={selected ? "default" : "outline"}
            onClick={() => onToggle(kelas.id)}
          >
            {selected && <Badge className="mr-2">Dipilih</Badge>}
            {kelas.nama}
          </Button>
        );
      })}
    </div>
    <input
      type="text"
      value={selectedIds.length > 0 ? selectedIds.join(",") : ""}
      required
      className="sr-only"
      tabIndex={-1}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default ClassSelector;

