import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { FileText, Calendar, Clock, User, BookOpen } from "lucide-react";
import type { StudentAssignmentItem } from "@/Pages/Siswa/types";

interface AssignmentHeaderCardProps {
  assignment: StudentAssignmentItem;
  statusLabel: string;
}

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "-";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "submitted":
    case "graded":
      return "default"; // or a specific success variant if available
    case "late":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function AssignmentHeaderCard({
  assignment,
  statusLabel,
}: AssignmentHeaderCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-gray-200">
      <div className="border-b bg-gray-50/50 px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
                {assignment.subject ?? "Umum"}
              </Badge>
              <Badge variant={getStatusBadgeVariant(assignment.status)} className="capitalize">
                {statusLabel}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {assignment.title}
            </h2>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span>{assignment.teacher}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-400" />
            <span>{assignment.classes.filter(Boolean).join(", ")}</span>
          </div>
        </div>
      </div>

      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 rounded-lg border bg-slate-50 p-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-100">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-gray-500">Dibuka</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(assignment.openDate)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-gray-100">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-gray-500">Tenggat Waktu</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(assignment.closeDate)}
              </p>
            </div>
          </div>
        </div>

        {assignment.description && (
          <div className="prose prose-sm max-w-none text-gray-600">
            <h3 className="text-sm font-semibold text-gray-900">Deskripsi Tugas</h3>
            <p className="whitespace-pre-wrap leading-relaxed">
              {assignment.description}
            </p>
          </div>
        )}

        {assignment.attachments.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900">Lampiran & Referensi</Label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {assignment.attachments.map((file) => (
                <div
                  key={file.id}
                  className="group relative flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="rounded bg-blue-50 p-2 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="truncate text-sm font-medium text-gray-700 group-hover:text-blue-700">
                      {file.name}
                    </span>
                  </div>
                  {file.url && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full p-0 text-gray-400 hover:text-blue-600"
                    >
                      <a href={file.url} target="_blank" rel="noreferrer" title="Unduh File">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-download"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        <span className="sr-only">Unduh</span>
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
