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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={data.max_score}
          placeholder="100"
          onChange={(event) => {
            const val = event.target.value;
            if (val === "") {
              setFieldValue("max_score", "" as any);
              return;
            }
            if (!/^\d+$/.test(val)) return;
            let num = parseInt(val);
            if (num > 100) num = 100;
            setFieldValue("max_score", num);
          }}
          onBlur={() => {
            if (!data.max_score || (typeof data.max_score === 'number' && data.max_score < 1)) {
              setFieldValue("max_score", 100);
            }
          }}
        />
        {errors.max_score && (
          <p className="text-xs text-destructive">{errors.max_score}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Passing grade</Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={data.passing_grade ?? ""}
          placeholder="Contoh: 75"
          onChange={(event) => {
            const val = event.target.value;
            if (val === "") {
              setFieldValue("passing_grade", null);
              return;
            }
            if (!/^\d+$/.test(val)) return;
            let num = parseInt(val);
            if (num > 100) num = 100;
            setFieldValue("passing_grade", num);
          }}
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
