import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

interface SubjectsCardProps {
  subjects?: string[];
}

const SubjectsCard: React.FC<SubjectsCardProps> = ({ subjects }) => {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mata Pelajaran Diampu</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {subjects.map((nama) => (
          <Badge key={nama} variant="outline" className="px-2 py-0.5 text-xs">
            {nama}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
};

export default SubjectsCard;
