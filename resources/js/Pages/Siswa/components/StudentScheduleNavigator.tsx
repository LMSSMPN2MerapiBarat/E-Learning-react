import { motion } from "motion/react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudentScheduleNavigatorProps {
  currentDay: string;
  days: string[];
  onSelectDay: (day: string) => void;
  onNavigate: (direction: "prev" | "next") => void;
  totalClasses: number;
}

export default function StudentScheduleNavigator({
  currentDay,
  days,
  onSelectDay,
  onNavigate,
  totalClasses,
}: StudentScheduleNavigatorProps) {
  const hasDays = days.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("prev")}
              disabled={!hasDays}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{currentDay}</h3>
              <p className="text-sm text-gray-600">
                {totalClasses} Mata Pelajaran
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("next")}
              disabled={!hasDays}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {days.map((day) => {
              const isActive = day === currentDay;
              return (
                <button
                  key={day}
                  onClick={() => onSelectDay(day)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

