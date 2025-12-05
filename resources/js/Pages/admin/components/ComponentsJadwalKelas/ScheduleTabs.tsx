import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import ScheduleCard from "./ScheduleCard";
import type { ScheduleItem } from "@/Pages/Admin/JadwalKelas/types";

const ITEMS_PER_PAGE = 5;

interface ScheduleTabsProps {
  days: string[];
  groupedSchedules: Record<string, ScheduleItem[]>;
  activeDay: string;
  onDayChange: (day: string) => void;
  onEdit: (schedule: ScheduleItem) => void;
  onDelete: (schedule: ScheduleItem) => void;
}

export default function ScheduleTabs({
  days,
  groupedSchedules,
  activeDay,
  onDayChange,
  onEdit,
  onDelete,
}: ScheduleTabsProps) {
  // State untuk menyimpan halaman aktif per hari
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});

  // Fungsi untuk mendapatkan halaman saat ini untuk hari tertentu
  const getCurrentPage = (day: string) => currentPages[day] ?? 1;

  // Fungsi untuk mengubah halaman
  const setPage = (day: string, page: number) => {
    setCurrentPages((prev) => ({ ...prev, [day]: page }));
  };

  // Fungsi untuk mendapatkan data yang sudah dipaginasi
  const getPaginatedSchedules = (day: string) => {
    const schedules = groupedSchedules[day] ?? [];
    const currentPage = getCurrentPage(day);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return schedules.slice(startIndex, endIndex);
  };

  // Fungsi untuk mendapatkan total halaman
  const getTotalPages = (day: string) => {
    const schedules = groupedSchedules[day] ?? [];
    return Math.ceil(schedules.length / ITEMS_PER_PAGE);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Tabs value={activeDay} onValueChange={onDayChange} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-3 rounded-lg border bg-white p-3 sm:grid-cols-3 lg:grid-cols-6">
          {days.map((day) => (
            <TabsTrigger
              key={day}
              value={day}
              className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:border-blue-500 data-[state=active]:border-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
            >
              {day}
              <Badge variant="secondary" className="ml-2">
                {groupedSchedules[day]?.length ?? 0}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => {
          const schedules = groupedSchedules[day] ?? [];
          const paginatedSchedules = getPaginatedSchedules(day);
          const totalPages = getTotalPages(day);
          const currentPage = getCurrentPage(day);

          return (
            <TabsContent key={day} value={day} className="mt-6 space-y-3">
              {schedules.length > 0 ? (
                <>
                  {paginatedSchedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}

                  {/* Pagination - hanya muncul jika data lebih dari 5 */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(day, currentPage - 1)}
                        disabled={currentPage === 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(day, page)}
                              className={`min-w-[36px] ${
                                currentPage === page
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : ""
                              }`}
                            >
                              {page}
                            </Button>
                          )
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(day, currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Info pagination */}
                  {totalPages > 1 && (
                    <p className="text-center text-sm text-gray-500">
                      Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                      {Math.min(currentPage * ITEMS_PER_PAGE, schedules.length)} dari{" "}
                      {schedules.length} jadwal
                    </p>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                    <p>Tidak ada jadwal untuk hari {day}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </motion.div>
  );
}
