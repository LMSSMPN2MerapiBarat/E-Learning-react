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
      <CardHeader>
        <CardTitle>Mata Pelajaran Diampu</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {subjects.map((nama) => (
          <Badge key={nama} variant="outline" className="px-3 py-1">
            {nama}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
};

export default SubjectsCard;
