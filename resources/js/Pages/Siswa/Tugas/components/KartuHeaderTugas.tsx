import { Card, CardContent } from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { FileText } from "lucide-react";
import type { StudentAssignmentItem } from "@/Pages/Siswa/types";

interface AssignmentHeaderCardProps {
  assignment: StudentAssignmentItem;
  statusLabel: string;
}

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString("id-ID") : "-";

export default function AssignmentHeaderCard({
  assignment,
  statusLabel,
}: AssignmentHeaderCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <h2 className="text-xl font-semibold">{assignment.title}</h2>
          <Badge variant="outline" className="text-[10px]">{assignment.subject ?? "Umum"}</Badge>
          <Badge variant="secondary" className="text-[10px]">{statusLabel}</Badge>
        </div>
        <p className="text-xs text-gray-900">
          {assignment.teacher} • {assignment.classes.filter(Boolean).join(", ")}
        </p>
        <Alert>
          <AlertDescription className="space-y-0.5 text-xs">
            <p>
              <strong>Dibuka:</strong> {formatDate(assignment.openDate)}
            </p>
            <p>
              <strong>Ditutup:</strong> {formatDate(assignment.closeDate)}
            </p>
          </AlertDescription>
        </Alert>
        {assignment.description && (
          <p className="text-xs text-gray-900 whitespace-pre-wrap">
            {assignment.description}
          </p>
        )}
        {assignment.attachments.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-xs">File Referensi</Label>
            {assignment.attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border p-2 text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{file.name}</span>
                </div>
                {file.url && (
                  <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                    <a href={file.url} target="_blank" rel="noreferrer">
                      Unduh
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
