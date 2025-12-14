import React from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderRoot,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import CreateMapel from "@/Pages/admin/Mapel/Create";

interface MapelHeaderProps {
  selectedIds: number[];
  isBulkDeleting: boolean;
  setBulkDeleteConfirm: (value: boolean) => void;
  isAddOpen: boolean;
  setIsAddOpen: (value: boolean) => void;
  onAddSuccess: () => void;
}

const MapelHeader: React.FC<MapelHeaderProps> = ({
  selectedIds,
  isBulkDeleting,
  setBulkDeleteConfirm,
  isAddOpen,
  setIsAddOpen,
  onAddSuccess,
}) => {
  return (
    <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <CardTitle className="text-base font-normal">Data Mata Pelajaran</CardTitle>
        <CardDescription className="text-xs">
          Kelola daftar mata pelajaran dan guru pengajar
        </CardDescription>
      </div>

      <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBulkDeleteConfirm(true)}
            disabled={isBulkDeleting}
            className="w-full sm:w-auto"
          >
            <Trash2 className="mr-1.5 h-3 w-3" />
            Hapus Terpilih ({selectedIds.length})
          </Button>
        )}

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full sm:w-auto">
              <Plus className="mr-1.5 h-3 w-3" /> Tambah Mapel
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-md"
            onInteractOutside={(event) => event.preventDefault()}
          >
            <DialogHeaderRoot>
              <DialogTitle>Tambah Mata Pelajaran</DialogTitle>
            </DialogHeaderRoot>
            <CreateMapel onSuccess={onAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  );
};

export default MapelHeader;

