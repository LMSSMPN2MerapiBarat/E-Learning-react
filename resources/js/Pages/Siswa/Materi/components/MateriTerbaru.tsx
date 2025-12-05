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
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Materi Terbaru</CardTitle>
          <p className="text-xs text-gray-500">
            Tiga materi terbaru dari guru Anda.
          </p>
        </div>
        <Button variant="link" className="text-blue-600 text-xs" asChild>
          <Link href={materialsUrl}>Lihat semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center text-xs text-gray-500">
            Belum ada materi yang tersedia.
          </div>
        ) : (
          items.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-md border border-blue-100 bg-blue-50/40 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {material.title}
                  </p>
                  {material.subject && (
                    <Badge variant="outline" className="mt-0.5 text-[10px]">
                      {material.subject}
                    </Badge>
                  )}
                </div>
                {material.createdAt && (
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                    <Calendar className="h-2.5 w-2.5" />
                    {new Date(material.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              {material.description && (
                <p className="mt-1.5 line-clamp-2 text-xs text-gray-600">
                  {material.description}
                </p>
              )}
              <div className="mt-2 flex gap-1.5">
                {(material.previewUrl || material.fileUrl) && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                    <a
                      href={material.previewUrl ?? material.fileUrl ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Buka
                    </a>
                  </Button>
                )}
                {(material.downloadUrl || material.fileUrl) && (
                  <Button size="sm" className="h-7 text-xs" asChild>
                    <a
                      href={material.downloadUrl ?? material.fileUrl ?? undefined}
                      download={
                        material.downloadUrl || material.fileUrl
                          ? material.fileName ?? undefined
                          : undefined
                      }
                    >
                      <FileText className="mr-1.5 h-3.5 w-3.5" />
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
