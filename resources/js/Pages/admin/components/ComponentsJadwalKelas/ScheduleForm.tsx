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
    if (!selectedTeacher) return reference.subjects;

    let availableSubjects = selectedTeacher.subjects;

    // Filter by selected class if any
    if (values.kelas_id) {
      const allowedSubjectIds = selectedTeacher.class_subjects[Number(values.kelas_id)] || [];
      availableSubjects = availableSubjects.filter(sub => allowedSubjectIds.includes(sub.id));
    }

    return availableSubjects;
  }, [reference.subjects, selectedTeacher, values.kelas_id]);

  const classOptions = useMemo(() => {
    if (!selectedTeacher) return reference.classes;

    let availableClasses = selectedTeacher.classes;

    // Filter by selected subject if any
    if (values.mata_pelajaran_id) {
      // Find classes that have this subject assigned
      availableClasses = availableClasses.filter(cls => {
        const subjectsInClass = selectedTeacher.class_subjects[cls.id] || [];
        return subjectsInClass.includes(Number(values.mata_pelajaran_id));
      });
    }

    return availableClasses;
  }, [reference.classes, selectedTeacher, values.mata_pelajaran_id]);

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
      <CardContent className="space-y-4 pt-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
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
                    <CommandList className="max-h-[200px] overflow-y-auto">
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
              {/* Hidden input untuk native browser validation */}
              <input
                type="text"
                value={values.guru_id || ""}
                required
                readOnly
                className="sr-only"
                tabIndex={-1}
                onFocus={() => setTeacherOpen(true)}
              />
            </Field>
            <Field label="Mata Pelajaran" error={errors.mata_pelajaran_id}>
              <Select
                value={values.mata_pelajaran_id?.toString() ?? ""}
                onValueChange={(value) => onChange("mata_pelajaran_id", value)}
                required
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
              <input
                type="text"
                value={values.mata_pelajaran_id || ""}
                required
                readOnly
                className="sr-only"
                tabIndex={-1}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Kelas" error={errors.kelas_id}>
              <Select
                value={values.kelas_id?.toString() ?? ""}
                onValueChange={(value) => onChange("kelas_id", value)}
                required
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
              <input
                type="text"
                value={values.kelas_id || ""}
                required
                readOnly
                className="sr-only"
                tabIndex={-1}
              />
            </Field>
            <Field label="Hari" error={errors.day}>
              <Select value={values.day} onValueChange={(value) => onChange("day", value)} required>
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
              <input
                type="text"
                value={values.day || ""}
                required
                readOnly
                className="sr-only"
                tabIndex={-1}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Jam Mulai" error={errors.start_time}>
              <Input
                type="time"
                value={values.start_time}
                onChange={(event) => onChange("start_time", event.target.value)}
                required
              />
            </Field>
            <Field label="Jam Selesai" error={errors.end_time}>
              <Input
                type="time"
                value={values.end_time}
                onChange={(event) => onChange("end_time", event.target.value)}
                required
              />
            </Field>
          </div>

          <Button type="submit" size="sm" className="w-full" disabled={processing}>
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-700">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
