import React, { useEffect, useState } from "react";
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
import type {
  Option,
  QuizAttemptLimitOption,
  QuizBaseForm,
  QuizStatus,
} from "./formTypes";

interface QuizMetadataFieldsProps {
  data: QuizBaseForm;
  setData: <K extends keyof QuizBaseForm>(
    key: K,
    value: QuizBaseForm[K],
  ) => void;
  errors: Record<string, string | undefined>;
  mapelOptions: Option[];
  attemptLimitError?: string | undefined;
}

const QuizMetadataFields: React.FC<QuizMetadataFieldsProps> = ({
  data,
  setData,
  errors,
  mapelOptions,
  attemptLimitError,
}) => {
  const [schedulingEnabled, setSchedulingEnabled] = useState<boolean>(
    Boolean(data.available_from || data.available_until),
  );

  useEffect(() => {
    setSchedulingEnabled(Boolean(data.available_from || data.available_until));
  }, [data.available_from, data.available_until]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="title">Judul Kuis</Label>
        <Input
          id="title"
          required
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
          required
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
        <Label>Limit Percobaan</Label>
        <Select
          value={data.max_attempts}
          onValueChange={(value) =>
            setData(
              "max_attempts",
              value as QuizAttemptLimitOption,
            )
          }
        >
          <SelectTrigger aria-required="true">
            <SelectValue placeholder="Pilih batas percobaan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unlimited">Tanpa batas</SelectItem>
            <SelectItem value="1">1 kali percobaan</SelectItem>
            <SelectItem value="2">2 kali percobaan</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Batasi berapa kali siswa dapat mengerjakan kuis ini.
        </p>
        {(attemptLimitError ?? errors.max_attempts) && (
          <p className="text-xs text-red-500">
            {attemptLimitError ?? errors.max_attempts}
          </p>
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
          <SelectTrigger id="mapel" aria-required="true">
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
          <SelectTrigger aria-required="true">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Dipublikasikan</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-xs text-red-500">{errors.status}</p>
        )}
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

      <div className="md:col-span-2 space-y-4 rounded-lg border p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">
              Batasi Jadwal Ketersediaan
            </p>
            <p className="text-xs text-gray-500">
              Atur dari tanggal dan jam berapa kuis boleh diakses sampai
              kapan. Biarkan nonaktif jika kuis tersedia kapan saja.
              <br />
              <span className="text-blue-600 font-medium">
                Catatan: Waktu yang dipilih akan disimpan sebagai Waktu Indonesia Barat (WIB).
              </span>
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
              checked={schedulingEnabled}
              onChange={(event) => {
                const checked = event.target.checked;
                setSchedulingEnabled(checked);
                if (!checked) {
                  setData("available_from", null);
                  setData("available_until", null);
                }
              }}
            />
            Aktifkan pembatasan
          </label>
        </div>

        {schedulingEnabled && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="available_from">Mulai Tersedia</Label>
              <Input
                id="available_from"
                type="datetime-local"
                value={data.available_from ?? ""}
                onChange={(event) =>
                  setData(
                    "available_from",
                    event.target.value ? event.target.value : null,
                  )
                }
              />
              {errors.available_from && (
                <p className="text-xs text-red-500">
                  {errors.available_from}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="available_until">Berakhir Pada</Label>
              <Input
                id="available_until"
                type="datetime-local"
                value={data.available_until ?? ""}
                onChange={(event) =>
                  setData(
                    "available_until",
                    event.target.value ? event.target.value : null,
                  )
                }
                min={data.available_from ?? undefined}
              />
              {errors.available_until && (
                <p className="text-xs text-red-500">
                  {errors.available_until}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMetadataFields;
