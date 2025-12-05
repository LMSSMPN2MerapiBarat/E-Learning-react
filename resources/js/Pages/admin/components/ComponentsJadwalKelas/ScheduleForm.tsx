import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/Components/ui/utils";
import type { ScheduleFormValues, ScheduleReference } from "@/Pages/Admin/JadwalKelas/types";

interface ScheduleFormProps {
  reference: ScheduleReference;
  values: ScheduleFormValues;
  errors: Record<string, string | undefined>;
  onChange: (field: keyof ScheduleFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  processing?: boolean;
  submitLabel: string;
}

export default function ScheduleForm({
  reference,
  values,
  errors,
  onChange,
  onSubmit,
  processing,
  submitLabel,
}: ScheduleFormProps) {
  const [teacherOpen, setTeacherOpen] = useState(false);
  
  const teacherValue = values.guru_id?.toString() ?? "";

  const selectedTeacher = useMemo(
    () => reference.teachers.find((teacher) => teacher.id.toString() === teacherValue),
    [reference.teachers, teacherValue],
  );

  const subjectOptions = useMemo(() => {
    if (selectedTeacher?.subjects?.length) {
      return selectedTeacher.subjects;
    }
    return reference.subjects;
  }, [reference.subjects, selectedTeacher]);

  const classOptions = useMemo(() => {
    if (selectedTeacher?.classes?.length) {
      return selectedTeacher.classes;
    }
    return reference.classes;
  }, [reference.classes, selectedTeacher]);

  useEffect(() => {
    if (!values.mata_pelajaran_id) return;
    const exists = subjectOptions.some(
      (subject) => subject.id.toString() === values.mata_pelajaran_id.toString(),
    );
    if (!exists) {
      onChange("mata_pelajaran_id", "");
    }
  }, [subjectOptions, values.mata_pelajaran_id, onChange]);

  useEffect(() => {
    if (!values.kelas_id) return;
    const exists = classOptions.some(
      (cls) => cls.id.toString() === values.kelas_id.toString(),
    );
    if (!exists) {
      onChange("kelas_id", "");
    }
  }, [classOptions, values.kelas_id, onChange]);

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Guru Pengampu" error={errors.guru_id}>
              <Popover open={teacherOpen} onOpenChange={setTeacherOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={teacherOpen}
                    className={cn(
                      "w-full justify-between font-normal h-10 px-3 border-input bg-background hover:bg-accent hover:text-accent-foreground",
                      !selectedTeacher && "text-muted-foreground"
                    )}
                  >
                    {selectedTeacher ? selectedTeacher.name : "Pilih guru..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[--radix-popover-trigger-width] p-0" 
                  align="start"
                  sideOffset={4}
                >
                  <Command className="border rounded-md">
                    <CommandInput placeholder="Cari nama guru..." className="h-9" />
                    <CommandList className="max-h-[200px]">
                      <CommandEmpty>Guru tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {reference.teachers.map((teacher) => (
                          <CommandItem
                            key={teacher.id}
                            value={teacher.name}
                            onSelect={() => {
                              onChange("guru_id", teacher.id.toString());
                              setTeacherOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                teacherValue === teacher.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {teacher.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </Field>
            <Field label="Mata Pelajaran" error={errors.mata_pelajaran_id}>
              <Select
                value={values.mata_pelajaran_id?.toString() ?? ""}
                onValueChange={(value) => onChange("mata_pelajaran_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata pelajaran" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {subjectOptions.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Kelas" error={errors.kelas_id}>
              <Select
                value={values.kelas_id?.toString() ?? ""}
                onValueChange={(value) => onChange("kelas_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {classOptions.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Hari" error={errors.day}>
              <Select value={values.day} onValueChange={(value) => onChange("day", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {reference.days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Jam Mulai" error={errors.start_time}>
              <Input
                type="time"
                value={values.start_time}
                onChange={(event) => onChange("start_time", event.target.value)}
              />
            </Field>
            <Field label="Jam Selesai" error={errors.end_time}>
              <Input
                type="time"
                value={values.end_time}
                onChange={(event) => onChange("end_time", event.target.value)}
              />
            </Field>
          </div>

          <Field label="Ruangan" error={errors.room}>
            <Input
              placeholder="Contoh: Lab Komputer 1"
              value={values.room}
              onChange={(event) => onChange("room", event.target.value)}
            />
          </Field>

          <Button type="submit" className="w-full" disabled={processing}>
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
