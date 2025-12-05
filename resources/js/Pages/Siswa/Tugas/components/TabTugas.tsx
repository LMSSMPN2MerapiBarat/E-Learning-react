import { useState, useMemo } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Calendar, Clock, Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import type { StudentAssignmentItem } from "@/Pages/Siswa/types";

const ITEMS_PER_PAGE = 5;

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
  currentPage,
  onPageChange,
}: {
  items: StudentAssignmentItem[];
  emptyText: string;
  actionLabel: string;
  onSelect: (assignment: StudentAssignmentItem) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
        <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        {emptyText}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {paginatedItems.map((assignment) => (
        <Card key={assignment.id} className="border-l-4 border-l-blue-500">
          <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-base font-semibold">{assignment.title}</p>
                {assignment.subject && (
                  <Badge variant="outline" className="text-[10px]">{assignment.subject}</Badge>
                )}
                <Badge variant="secondary" className="text-[10px]">
                  {assignment.status === "pending"
                    ? "Belum dikumpulkan"
                    : assignment.status === "submitted"
                      ? "Menunggu penilaian"
                      : assignment.status === "late"
                        ? "Terlambat"
                        : "Dinilai"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                {assignment.description}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" />
                  Batas: {formatDeadline(assignment.closeDate)}
                </span>
                {assignment.submittedDate && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    Dikumpulkan: {formatDeadline(assignment.submittedDate)}
                  </span>
                )}
              </div>
            </div>
            <Button size="sm" className="text-xs" onClick={() => onSelect(assignment)}>{actionLabel}</Button>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {items.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs text-gray-600 min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default function AssignmentTabs({
  pending,
  submitted,
  graded,
  onSelect,
}: AssignmentTabsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingPage, setPendingPage] = useState(1);
  const [submittedPage, setSubmittedPage] = useState(1);
  const [gradedPage, setGradedPage] = useState(1);

  // Filter berdasarkan search
  const filterItems = (items: StudentAssignmentItem[]) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) => {
      const pool = [
        item.title,
        item.description ?? "",
        item.subject ?? "",
        item.teacher ?? "",
      ];
      return pool.some((value) => value.toLowerCase().includes(term));
    });
  };

  const filteredPending = useMemo(() => filterItems(pending), [pending, searchTerm]);
  const filteredSubmitted = useMemo(() => filterItems(submitted), [submitted, searchTerm]);
  const filteredGraded = useMemo(() => filterItems(graded), [graded, searchTerm]);

  // Reset page ketika search berubah
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPendingPage(1);
    setSubmittedPage(1);
    setGradedPage(1);
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative w-full md:w-72">
        <Input
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari tugas..."
          className="pl-8 text-xs h-8"
        />
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
      </div>

      <Tabs defaultValue="pending" className="space-y-3">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="text-xs">
            Belum Dikumpulkan ({filteredPending.length})
          </TabsTrigger>
          <TabsTrigger value="submitted" className="text-xs">
            Menunggu Nilai ({filteredSubmitted.length})
          </TabsTrigger>
          <TabsTrigger value="graded" className="text-xs">
            Dinilai ({filteredGraded.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <AssignmentList
            items={filteredPending}
            emptyText={pending.length === 0 ? "Tidak ada tugas yang harus dikumpulkan." : "Tidak ada tugas yang sesuai dengan pencarian."}
            actionLabel="Kerjakan"
            onSelect={onSelect}
            currentPage={pendingPage}
            onPageChange={setPendingPage}
          />
        </TabsContent>

        <TabsContent value="submitted">
          <AssignmentList
            items={filteredSubmitted}
            emptyText={submitted.length === 0 ? "Tidak ada tugas yang menunggu penilaian." : "Tidak ada tugas yang sesuai dengan pencarian."}
            actionLabel="Lihat Detail"
            onSelect={onSelect}
            currentPage={submittedPage}
            onPageChange={setSubmittedPage}
          />
        </TabsContent>

        <TabsContent value="graded">
          <AssignmentList
            items={filteredGraded}
            emptyText={graded.length === 0 ? "Belum ada tugas yang dinilai." : "Tidak ada tugas yang sesuai dengan pencarian."}
            actionLabel="Lihat Nilai"
            onSelect={onSelect}
            currentPage={gradedPage}
            onPageChange={setGradedPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

