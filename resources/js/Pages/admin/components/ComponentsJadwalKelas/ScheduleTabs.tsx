import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import { Calendar } from "lucide-react";
import ScheduleCard from "./ScheduleCard";
import type { ScheduleItem } from "@/Pages/Admin/JadwalKelas/types";

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

        {days.map((day) => (
          <TabsContent key={day} value={day} className="mt-6 space-y-3">
            {(groupedSchedules[day] ?? []).length > 0 ? (
              groupedSchedules[day].map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                  <p>Tidak ada jadwal untuk hari {day}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
