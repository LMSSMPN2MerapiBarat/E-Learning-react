export interface SubjectOption {
  id: number;
  name: string;
}

export interface ClassOption {
  id: number;
  label: string;
}

export interface TeacherOption {
  id: number;
  name: string;
  nip?: string | null;
  subjects: SubjectOption[];
  classes: ClassOption[];
  class_subjects: Record<number, number[]>;
}

export interface ScheduleReference {
  teachers: TeacherOption[];
  subjects: SubjectOption[];
  classes: ClassOption[];
  days: string[];
}

export interface ScheduleItem {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  room?: string | null;
  teacher: { id: number; name: string };
  subject: { id: number; name: string };
  class: { id: number; label: string };
}

export interface ScheduleStats {
  total: number;
  distinctClass: number;
  distinctGuru: number;
}

export interface ScheduleFormValues {
  guru_id: string | number;
  mata_pelajaran_id: string | number;
  kelas_id: string | number;
  day: string;
  start_time: string;
  end_time: string;
}
