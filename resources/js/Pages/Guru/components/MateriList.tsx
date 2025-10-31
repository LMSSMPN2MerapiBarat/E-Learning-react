import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { FileText, Download, Pencil, Trash2 } from "lucide-react";
import type { MateriItem } from "@/Pages/Guru/components/materiTypes";
import { getFileExtension, getFileTypeColor } from "@/Pages/Guru/components/materiHelpers";

interface MateriListProps {
  items: MateriItem[];
  onEdit: (materi: MateriItem) => void;
  onDelete: (id: number) => void;
}

const MateriList: React.FC<MateriListProps> = ({ items, onEdit, onDelete }) => (
  <div className="space-y-4">
    {items.length === 0 ? (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <FileText className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p>Belum ada materi yang diunggah.</p>
          <p className="text-sm">
            Klik tombol "Unggah Materi" untuk menambahkan.
          </p>
        </CardContent>
      </Card>
    ) : (
      items.map((materi) => {
        const extension = getFileExtension(materi.file_name, materi.file_mime);
        const fileTypeLabel = extension ? extension.toUpperCase() : "FILE";
        const fileTypeClass = getFileTypeColor(extension ?? "default");

        return (
          <Card key={materi.id} className="border transition-shadow hover:shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800">
                        {materi.judul}
                      </h3>
                      {materi.deskripsi && (
                        <p className="mt-1 text-sm text-gray-600">
                          {materi.deskripsi}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                        {materi.mapel?.nama && (
                          <Badge variant="outline">{materi.mapel.nama}</Badge>
                        )}
                        {materi.kelas?.nama && (
                          <Badge variant="outline">Kelas {materi.kelas.nama}</Badge>
                        )}
                        <Badge className={fileTypeClass}>{fileTypeLabel}</Badge>
                        {materi.created_at && (
                          <span>
                            Diunggah: {new Date(materi.created_at).toLocaleDateString("id-ID")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {materi.file_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={materi.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Unduh
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(materi)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(materi.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                    Hapus
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })
    )}
  </div>
);

export default MateriList;