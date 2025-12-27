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
      <p className="text-lg font-bold text-gray-800">Pilih Kelas <span className="text-red-500">*</span></p>
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
            size="sm"
            variant={selected ? "default" : "outline"}
            onClick={() => onToggle(kelas.id)}
            className="text-xs sm:text-sm"
          >
            {kelas.nama}
          </Button>
        );
      })}
    </div>

    {selectedIds.length === 0 && (
      <div className="flex items-center gap-2 p-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md animate-in fade-in duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
        <span>Harap pilih minimal satu kelas tujuan.</span>
      </div>
    )}
    <input
      type="text"
      value={selectedIds.length > 0 ? selectedIds.join(",") : ""}
      required
      readOnly
      className="sr-only"
      tabIndex={-1}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default ClassSelector;

