import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import type { AssignmentFormState } from "../types";

interface AssignmentGradingSectionProps {
  data: AssignmentFormState;
  errors: Record<string, string | undefined>;
  setFieldValue: <K extends keyof AssignmentFormState>(
    key: K,
    value: AssignmentFormState[K],
  ) => void;
}

export default function AssignmentGradingSection({
  data,
  errors,
  setFieldValue,
}: AssignmentGradingSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label>Skor maksimal *</Label>
        <Input
          type="number"
          min={1}
          value={data.max_score}
          onChange={(event) => setFieldValue("max_score", event.target.value)}
        />
        {errors.max_score && (
          <p className="text-xs text-destructive">{errors.max_score}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Passing grade</Label>
        <Input
          type="number"
          min={0}
          value={data.passing_grade ?? ""}
          onChange={(event) =>
            setFieldValue("passing_grade", event.target.value || null)
          }
        />
        {errors.passing_grade && (
          <p className="text-xs text-destructive">{errors.passing_grade}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={data.status}
          onValueChange={(value) =>
            setFieldValue("status", value as AssignmentFormState["status"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Terbitkan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
