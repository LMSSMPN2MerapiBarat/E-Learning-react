import { Card, CardContent } from "@/Components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Calendar, Clock } from "lucide-react";
import type { StudentAssignmentItem } from "@/Pages/Siswa/types";

interface AssignmentTabsProps {
  pending: StudentAssignmentItem[];
  submitted: StudentAssignmentItem[];
  graded: StudentAssignmentItem[];
  onSelect: (assignment: StudentAssignmentItem) => void;
}

const formatDeadline = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
      })
    : "-";

const AssignmentList = ({
  items,
  emptyText,
  actionLabel,
  onSelect,
}: {
  items: StudentAssignmentItem[];
  emptyText: string;
  actionLabel: string;
  onSelect: (assignment: StudentAssignmentItem) => void;
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((assignment) => (
        <Card key={assignment.id} className="border-l-4 border-l-blue-500">
          <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold">{assignment.title}</p>
                {assignment.subject && (
                  <Badge variant="outline">{assignment.subject}</Badge>
                )}
                <Badge variant="secondary">
                  {assignment.status === "pending"
                    ? "Belum dikumpulkan"
                    : assignment.status === "submitted"
                      ? "Menunggu penilaian"
                      : assignment.status === "late"
                        ? "Terlambat"
                        : "Dinilai"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {assignment.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Batas: {formatDeadline(assignment.closeDate)}
                </span>
                {assignment.submittedDate && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Dikumpulkan: {formatDeadline(assignment.submittedDate)}
                  </span>
                )}
              </div>
            </div>
            <Button onClick={() => onSelect(assignment)}>{actionLabel}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function AssignmentTabs({
  pending,
  submitted,
  graded,
  onSelect,
}: AssignmentTabsProps) {
  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending">
          Belum Dikumpulkan ({pending.length})
        </TabsTrigger>
        <TabsTrigger value="submitted">
          Menunggu Nilai ({submitted.length})
        </TabsTrigger>
        <TabsTrigger value="graded">
          Dinilai ({graded.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <AssignmentList
          items={pending}
          emptyText="Tidak ada tugas yang harus dikumpulkan."
          actionLabel="Kerjakan"
          onSelect={onSelect}
        />
      </TabsContent>

      <TabsContent value="submitted">
        <AssignmentList
          items={submitted}
          emptyText="Tidak ada tugas yang menunggu penilaian."
          actionLabel="Lihat Detail"
          onSelect={onSelect}
        />
      </TabsContent>

      <TabsContent value="graded">
        <AssignmentList
          items={graded}
          emptyText="Belum ada tugas yang dinilai."
          actionLabel="Lihat Nilai"
          onSelect={onSelect}
        />
      </TabsContent>
    </Tabs>
  );
}
