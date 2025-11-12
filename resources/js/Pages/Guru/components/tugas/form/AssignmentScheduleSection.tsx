import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import type { AssignmentFormState } from "../types";

interface AssignmentScheduleSectionProps {
  data: AssignmentFormState;
  errors: Record<string, string | undefined>;
  setFieldValue: <K extends keyof AssignmentFormState>(
    key: K,
    value: AssignmentFormState[K],
  ) => void;
}

const toDateTimeLocal = (value?: string): string => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 16);
};

export default function AssignmentScheduleSection({
  data,
  errors,
  setFieldValue,
}: AssignmentScheduleSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>Dibuka pada</Label>
        <Input
          type="datetime-local"
          value={toDateTimeLocal(data.open_at)}
          onChange={(event) => setFieldValue("open_at", event.target.value)}
        />
        {errors.open_at && (
          <p className="text-xs text-destructive">{errors.open_at}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Ditutup pada</Label>
        <Input
          type="datetime-local"
          value={toDateTimeLocal(data.close_at)}
          onChange={(event) => setFieldValue("close_at", event.target.value)}
        />
        {errors.close_at && (
          <p className="text-xs text-destructive">{errors.close_at}</p>
        )}
      </div>
    </div>
  );
}
