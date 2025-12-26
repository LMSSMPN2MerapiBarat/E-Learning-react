import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/Components/ui/utils";
import type { AssignmentFormState, Option } from "../types";

interface AssignmentBasicSectionProps {
  data: AssignmentFormState;
  errors: Record<string, string | undefined>;
  setFieldValue: <K extends keyof AssignmentFormState>(
    key: K,
    value: AssignmentFormState[K],
  ) => void;
  kelasOptions: Option[];
  mapelOptions: Option[];
}

const fieldError = (errors: Record<string, string | undefined>, key: string) =>
  errors[key] ? (
    <p className="text-xs text-destructive">{errors[key]}</p>
  ) : null;

export default function AssignmentBasicSection({
  data,
  errors,
  setFieldValue,
  kelasOptions,
  mapelOptions,
}: AssignmentBasicSectionProps) {
  const toggleClass = (id: number) => {
    const exists = data.kelas_ids.includes(id);
    const next = exists
      ? data.kelas_ids.filter((kelasId) => kelasId !== id)
      : [...data.kelas_ids, id];
    setFieldValue("kelas_ids", next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Judul Tugas *</Label>
        <Input
          value={data.title}
          onChange={(event) => setFieldValue("title", event.target.value)}
          placeholder="Contoh: Analisis Teks Deskripsi"
        />
        {fieldError(errors, "title")}
      </div>

      <div className="space-y-2">
        <Label>Deskripsi</Label>
        <Textarea
          rows={4}
          value={data.description}
          onChange={(event) => setFieldValue("description", event.target.value)}
          placeholder="Instruksi singkat atau detail tugas..."
        />
      </div>

      <div className="space-y-2">
        <Label>Mata Pelajaran</Label>
        <Select
          value={data.mata_pelajaran_id ? String(data.mata_pelajaran_id) : "none"}
          onValueChange={(value) =>
            setFieldValue(
              "mata_pelajaran_id",
              value === "none" ? null : Number(value),
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih mata pelajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tanpa Mapel</SelectItem>
            {mapelOptions.map((mapel) => (
              <SelectItem key={mapel.id} value={String(mapel.id)}>
                {mapel.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-bold">
          Kelas Tujuan <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {kelasOptions.map((kelas) => {
            const active = data.kelas_ids.includes(kelas.id);
            return (
              <Badge
                key={kelas.id}
                variant="outline"
                role="button"
                tabIndex={0}
                onClick={() => toggleClass(kelas.id)}
                onKeyDown={(event) =>
                  event.key === "Enter" && toggleClass(kelas.id)
                }
                className={cn(
                  "cursor-pointer border px-3 py-1",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-gray-100",
                )}
              >
                {kelas.nama}
              </Badge>
            );
          })}
        </div>
        {data.kelas_ids.length === 0 && (
          <div className="flex items-center gap-2 p-3 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md animate-in fade-in duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
            <span>Harap pilih minimal satu kelas tujuan.</span>
          </div>
        )}
        {fieldError(errors, "kelas_ids")}
      </div>
    </div>
  );
}
