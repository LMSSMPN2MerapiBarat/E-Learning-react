import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import type { Option, QuizBaseForm, QuizStatus } from "./formTypes";

interface QuizMetadataFieldsProps {
  data: QuizBaseForm;
  setData: <K extends keyof QuizBaseForm>(
    key: K,
    value: QuizBaseForm[K],
  ) => void;
  errors: Record<string, string | undefined>;
  mapelOptions: Option[];
}

const QuizMetadataFields: React.FC<QuizMetadataFieldsProps> = ({
  data,
  setData,
  errors,
  mapelOptions,
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="title">Judul Kuis</Label>
      <Input
        id="title"
        value={data.title}
        onChange={(event) => setData("title", event.target.value)}
        placeholder="contoh: Kuis Bab 1 - Aljabar"
      />
      {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
    </div>

    <div className="space-y-2">
      <Label htmlFor="duration">Durasi (menit)</Label>
      <Input
        id="duration"
        type="number"
        min={5}
        max={180}
        value={data.duration}
        onChange={(event) => setData("duration", Number(event.target.value))}
      />
      {errors.duration && (
        <p className="text-xs text-red-500">{errors.duration}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="mapel">Mata Pelajaran</Label>
      <Select
        value={data.mata_pelajaran_id?.toString() ?? ""}
        onValueChange={(value) =>
          setData("mata_pelajaran_id", value ? Number(value) : null)
        }
      >
        <SelectTrigger id="mapel">
          <SelectValue placeholder="Pilih mata pelajaran" />
        </SelectTrigger>
        <SelectContent>
          {mapelOptions.map((mapel) => (
            <SelectItem key={mapel.id} value={String(mapel.id)}>
              {mapel.nama}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.mata_pelajaran_id && (
        <p className="text-xs text-red-500">{errors.mata_pelajaran_id}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label>Status Kuis</Label>
      <Select
        value={data.status}
        onValueChange={(value) => setData("status", value as QuizStatus)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Dipublikasikan</SelectItem>
        </SelectContent>
      </Select>
      {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
    </div>

    <div className="md:col-span-2 space-y-2">
      <Label htmlFor="description">Deskripsi</Label>
      <Textarea
        id="description"
        rows={4}
        value={data.description}
        onChange={(event) => setData("description", event.target.value)}
        placeholder="contoh: Kuis ini mencakup materi persamaan linear satu variabel."
      />
      {errors.description && (
        <p className="text-xs text-red-500">{errors.description}</p>
      )}
    </div>
  </div>
);

export default QuizMetadataFields;
