import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

interface ScheduleFiltersProps {
  classes: { id: number; label: string }[];
  days: string[];
  selectedClass: string;
  selectedDay: string;
  onClassChange: (value: string) => void;
  onDayChange: (value: string) => void;
}

export default function ScheduleFilters({
  classes,
  days,
  selectedClass,
  selectedDay,
  onClassChange,
  onDayChange,
}: ScheduleFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Filter Kelas</Label>
            <Select value={selectedClass} onValueChange={onClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classes.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Filter Hari</Label>
            <Select value={selectedDay} onValueChange={onDayChange}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Hari" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Hari</SelectItem>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
