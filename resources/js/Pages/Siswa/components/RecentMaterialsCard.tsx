import React from "react";
import { motion } from "motion/react";
import { Link } from "@inertiajs/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Calendar, Eye, FileText } from "lucide-react";
import type { MaterialItem } from "@/Pages/Siswa/types";

interface RecentMaterialsCardProps {
  items: MaterialItem[];
  routeHelper?: (name: string, params?: Record<string, unknown>) => string;
}

const RecentMaterialsCard: React.FC<RecentMaterialsCardProps> = ({
  items,
  routeHelper,
}) => {
  const materialsUrl = routeHelper ? routeHelper("siswa.materials") : "#";

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Materi Terbaru</CardTitle>
          <p className="text-sm text-gray-500">
            Tiga materi terbaru dari guru Anda.
          </p>
        </div>
        <Button variant="link" className="text-blue-600" asChild>
          <Link href={materialsUrl}>Lihat semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
            Belum ada materi yang tersedia.
          </div>
        ) : (
          items.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-blue-100 bg-blue-50/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {material.title}
                  </p>
                  {material.subject && (
                    <Badge variant="outline" className="mt-1">
                      {material.subject}
                    </Badge>
                  )}
                </div>
                {material.createdAt && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(material.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              {material.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {material.description}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {(material.previewUrl || material.fileUrl) && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={material.previewUrl ?? material.fileUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Buka
                    </a>
                  </Button>
                )}
                {(material.downloadUrl || material.fileUrl) && (
                  <Button size="sm" asChild>
                    <a
                      href={material.downloadUrl ?? material.fileUrl ?? undefined}
                      download={
                        material.downloadUrl || material.fileUrl
                          ? material.fileName ?? undefined
                          : undefined
                      }
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Unduh
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMaterialsCard;
