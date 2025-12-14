import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import ScheduleForm from "@/Pages/admin/components/ComponentsJadwalKelas/ScheduleForm";
import type { PageProps } from "@/types";
import type { ScheduleFormValues, ScheduleItem, ScheduleReference } from "./types";

interface EditPageProps extends PageProps {
  reference: ScheduleReference;
  schedule: ScheduleItem;
}

export default function EditSchedule() {
  const { props } = usePage<EditPageProps>();
  const { reference, schedule } = props;

  const form = useForm<ScheduleFormValues>({
    guru_id: schedule.teacher.id,
    mata_pelajaran_id: schedule.subject.id,
    kelas_id: schedule.class.id,
    day: schedule.day,
    start_time: schedule.startTime,
    end_time: schedule.endTime,
    room: schedule.room ?? "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    form.put(`/admin/jadwal-kelas/${schedule.id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success("Jadwal berhasil diperbarui."),
      onError: () => toast.error("Gagal memperbarui jadwal."),
    });
  };

  return (
    <AdminLayout>
      <Head title={`Edit Jadwal ${schedule.subject.name}`} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/jadwal-kelas/Jadwal">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Jadwal
            </Link>
          </Button>
          <div className="text-right">
            <p className="text-xl font-semibold text-gray-900">
              Edit Jadwal {schedule.subject.name}
            </p>
            <p className="text-sm text-gray-500">
              Perbarui informasi guru, kelas, atau jam belajar.
            </p>
          </div>
        </div>

        <ScheduleForm
          reference={reference}
          values={form.data}
          errors={form.errors}
          processing={form.processing}
          submitLabel="Perbarui Jadwal"
          onChange={(field, value) => form.setData(field, value)}
          onSubmit={handleSubmit}
        />
      </div>
    </AdminLayout>
  );
}
