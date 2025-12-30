import React from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Download, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderRoot,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import CreateKelas from "@/Pages/admin/Kelas/Create";

interface KelasHeaderProps {
  selectedIds: number[];
  isBulkDeleting: boolean;
  onBulkDeleteRequest: () => void;
  onExport: () => void;
  isAddOpen: boolean;
  setIsAddOpen: (value: boolean) => void;
  onAddSuccess: () => void;
}

const KelasHeader: React.FC<KelasHeaderProps> = ({
  selectedIds,
  isBulkDeleting,
  onBulkDeleteRequest,
  onExport,
  isAddOpen,
  setIsAddOpen,
  onAddSuccess,
}) => {
  return (
    <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <CardTitle className="text-base font-normal">Data Kelas</CardTitle>
        <CardDescription className="text-xs">
          Kelola data kelas, tingkat, dan tahun ajaran
        </CardDescription>
      </div>

      <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={onBulkDeleteRequest}
            disabled={isBulkDeleting}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-1.5 h-3 w-3" />
            Hapus Terpilih
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="w-full sm:w-auto border-blue-400 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        >
          <Download className="mr-1.5 h-3 w-3" />
          Export Excel
        </Button>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="mr-1.5 h-3 w-3" />
              Tambah Kelas
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-md"
            onInteractOutside={(event) => event.preventDefault()}
          >
            <DialogHeaderRoot>
              <DialogTitle>Tambah Kelas Baru</DialogTitle>
            </DialogHeaderRoot>
            <CreateKelas onSuccess={onAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  );
};

export default KelasHeader;

