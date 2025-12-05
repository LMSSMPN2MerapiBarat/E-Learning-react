import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import type { DashboardStats } from "./dashboardHelpers";
import { statCards } from "./dashboardHelpers";

interface StatOverviewProps {
  stats?: DashboardStats;
}

const StatOverview: React.FC<StatOverviewProps> = ({ stats }) => (
  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
    {statCards.map(({ key, label, icon: Icon, color, bg }) => (
      <Card key={key}>
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1.5 text-2xl font-semibold text-gray-900">
              {stats?.[key] ?? 0}
            </p>
          </div>
          <div className={`${bg} rounded-lg p-2`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default StatOverview;
