import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import ScheduleForm from "@/Pages/Admin/components/ComponentsJadwalKelas/ScheduleForm";
import type { PageProps } from "@/types";
import type { ScheduleFormValues, ScheduleReference } from "./types";

interface CreatePageProps extends PageProps {
  reference: ScheduleReference;
}

export default function CreateSchedule() {
  const { props } = usePage<CreatePageProps>();
  const reference = props.reference;

  const form = useForm<ScheduleFormValues>({
    guru_id: "",
    mata_pelajaran_id: "",
    kelas_id: "",
    day: "",
    start_time: "",
    end_time: "",
    room: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.post("/admin/jadwal-kelas", {
      preserveScroll: true,
      onSuccess: () => toast.success("Jadwal baru berhasil ditambahkan."),
      onError: () => toast.error("Gagal menyimpan jadwal."),
    });
  };

  return (
    <AdminLayout>
      <Head title="Tambah Jadwal Pelajaran" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/jadwal-kelas/Jadwal">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Jadwal
            </Link>
          </Button>
          <div className="text-right">
            <p className="text-xl font-semibold text-gray-900">Tambah Jadwal</p>
            <p className="text-sm text-gray-500">
              Tentukan guru, mata pelajaran, kelas, dan jam belajar.
            </p>
          </div>
        </div>

        <ScheduleForm
          reference={reference}
          values={form.data}
          errors={form.errors}
          processing={form.processing}
          submitLabel="Simpan Jadwal"
          onChange={(field, value) => form.setData(field, value)}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
}
