import { Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import type { AssignmentItem } from "./types";

interface AssignmentTableProps {
  assignments: AssignmentItem[];
  onView: (assignment: AssignmentItem) => void;
  onEdit: (assignment: AssignmentItem) => void;
  onDelete: (assignment: AssignmentItem) => void;
}

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  draft: "secondary",
  closed: "outline",
};

export default function AssignmentTable({
  assignments,
  onView,
  onEdit,
  onDelete,
}: AssignmentTableProps) {
  if (assignments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
        Belum ada tugas yang memenuhi filter.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kelas</TableHead>
            <TableHead>Durasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pengumpulan</TableHead>
            <TableHead className="w-[150px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  {assignment.description && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {assignment.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {assignment.kelas.map((kelas) => (
                    <Badge key={kelas.id} variant="outline">
                      {kelas.nama}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {assignment.openDate
                  ? new Date(assignment.openDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })
                  : "-"}{" "}
                &ndash;{" "}
                {assignment.closeDate
                  ? new Date(assignment.closeDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[assignment.status] ?? "outline"}>
                  {assignment.status === "active"
                    ? "Aktif"
                    : assignment.status === "closed"
                      ? "Selesai"
                      : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {assignment.stats.submitted}/{assignment.stats.totalStudents}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onView(assignment)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(assignment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => onDelete(assignment)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
