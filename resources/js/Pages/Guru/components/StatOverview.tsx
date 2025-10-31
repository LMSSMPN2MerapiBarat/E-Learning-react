import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import type { DashboardStats } from "./dashboardHelpers";
import { statCards } from "./dashboardHelpers";

interface StatOverviewProps {
  stats?: DashboardStats;
}

const StatOverview: React.FC<StatOverviewProps> = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {statCards.map(({ key, label, icon: Icon, color, bg }) => (
      <Card key={key}>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {stats?.[key] ?? 0}
            </p>
          </div>
          <div className={`${bg} rounded-lg p-3`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default StatOverview;
