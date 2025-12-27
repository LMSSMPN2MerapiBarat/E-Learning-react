import { Head, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import PenjelajahMateri from "./components/Materi";
import type { SiswaPageProps } from "../types";

export default function Materials() {
  const { props } = usePage<SiswaPageProps>();
  const { student, hasClass, materials = [], materialSubjects = [] } = props;

  return (
    <StudentLayout
      title="Materi Pembelajaran"
      subtitle="Semua materi dari guru Anda"
    >
      <Head title="Materi Pembelajaran" />

      <div className="space-y-4">
        {!hasClass && (
          <Alert className="border-l-4 border-l-amber-500">
            <AlertDescription>
              Akun Anda belum terhubung ke kelas. Hubungi admin atau guru agar
              bisa mengakses materi.
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PenjelajahMateri
            materials={materials}
            subjects={materialSubjects}
          />
        </motion.div>
      </div>
    </StudentLayout>
  );
}
