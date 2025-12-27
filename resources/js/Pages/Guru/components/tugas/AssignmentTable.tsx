import { Eye, Edit, Trash2, Calendar, Users } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
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

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "Aktif";
    case "closed":
      return "Selesai";
    default:
      return "Draft";
  }
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
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
    <>
      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="border">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{assignment.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assignment.kelas.map((kelas) => (
                      <Badge key={kelas.id} variant="outline" className="text-[10px]">
                        {kelas.nama}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge variant={statusVariant[assignment.status] ?? "outline"} className="shrink-0 text-[10px]">
                  {getStatusLabel(assignment.status)}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(assignment.openDate)} – {formatDate(assignment.closeDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {assignment.stats.submitted}/{assignment.stats.totalStudents} dikumpulkan
                </span>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                  onClick={() => onView(assignment)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Lihat
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs"
                  onClick={() => onEdit(assignment)}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-destructive"
                  onClick={() => onDelete(assignment)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border bg-white overflow-x-auto">
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
                  <p className="font-medium">{assignment.title}</p>
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
                  {formatDate(assignment.openDate)} – {formatDate(assignment.closeDate)}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[assignment.status] ?? "outline"}>
                    {getStatusLabel(assignment.status)}
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
    </>
  );
}

