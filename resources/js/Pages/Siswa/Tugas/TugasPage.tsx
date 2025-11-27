import { useMemo, useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import AssignmentStatsGrid from "@/Pages/Siswa/components/assignments/AssignmentStatsGrid";
import AssignmentTabs from "@/Pages/Siswa/components/assignments/AssignmentTabs";
import AssignmentDetailView from "@/Pages/Siswa/components/assignments/AssignmentDetailView";
import type {
  StudentAssignmentItem,
  SiswaPageProps,
} from "@/Pages/Siswa/types";

export default function TugasPage() {
  const { student, hasClass, assignments = [] } =
    usePage<SiswaPageProps>().props;

  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const highlightId = params.get("highlight");
    if (highlightId) {
      const id = Number(highlightId);
      if (!isNaN(id)) {
        setSelectedId(id);
      }
    }
  }, []);

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment.id === selectedId) ?? null,
    [assignments, selectedId],
  );

  const pending = assignments.filter(
    (assignment) => assignment.status === "pending" || assignment.status === "late",
  );
  const submitted = assignments.filter(
    (assignment) => assignment.status === "submitted",
  );
  const graded = assignments.filter(
    (assignment) => assignment.status === "graded",
  );

  const averageScore = graded.length
    ? Math.round(
        graded.reduce(
          (total, item) => total + (item.score ?? 0),
          0,
        ) / graded.length,
      )
    : null;

  return (
    <StudentLayout title="Tugas Saya">
      <Head title="Tugas Siswa" />
      <div className="space-y-6">
        <AssignmentStatsGrid
          total={assignments.length}
          pending={pending.length}
          submitted={submitted.length}
          averageScore={averageScore}
        />

        {selectedAssignment ? (
          <AssignmentDetailView
            assignment={selectedAssignment}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <AssignmentTabs
            pending={pending}
            submitted={submitted}
            graded={graded}
            onSelect={(assignment: StudentAssignmentItem) =>
              setSelectedId(assignment.id)
            }
          />
        )}
      </div>
    </StudentLayout>
  );
}
