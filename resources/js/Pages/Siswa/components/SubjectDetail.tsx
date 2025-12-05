import { useMemo } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileQuestion,
  FileText,
  Mail,
  Play,
  PlayCircle,
  User,
  Youtube,
  MapPin,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import type { MaterialItem, StudentSubject } from "@/Pages/Siswa/types";

interface SubjectDetailProps {
  subject: StudentSubject;
  onBack: () => void;
}

export default function SubjectDetail({ subject, onBack }: SubjectDetailProps) {
  const formattedMaterials = useMemo(() => {
    return subject.materials.map((material) => ({
      ...material,
      fileType: guessMaterialType(material),
      uploadedAt: material.createdAt
        ? new Date(material.createdAt)
        : null,
    }));
  }, [subject.materials]);

  const formattedQuizzes = useMemo(() => subject.quizzes, [subject.quizzes]);
  const scheduleSlots = subject.scheduleSlots ?? [];
  const hasScheduleSlots = scheduleSlots.length > 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke daftar mata pelajaran
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <div className={`h-3 ${subjectDecoration(subject.id).background}`} />
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/5 to-white/30 p-6 shadow-inner backdrop-blur-md md:w-48">
                <span className="text-6xl drop-shadow-sm">
                  {subjectDecoration(subject.id).icon}
                </span>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {subject.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {subject.description ??
                      "Materi dan kuis terbaru dari guru pengampu mata pelajaran ini."}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoRow
                    icon={User}
                    label="Guru Pengampu"
                    value={subject.teacher ?? "-"}
                  />
                  <InfoRow
                    icon={Mail}
                    label="Kontak Guru"
                    value={subject.teacherEmail ?? "Belum tersedia"}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Kelas"
                    value={subject.className ?? "-"}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Jadwal"
                    value={subject.schedule ?? "Belum dijadwalkan"}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                    <FileText className="mr-1 h-3 w-3" />
                    {subject.materialCount} Materi
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 border border-green-200">
                    <FileQuestion className="mr-1 h-3 w-3" />
                    {subject.quizCount} Kuis
                  </Badge>
                </div>
                {hasScheduleSlots && (
                  <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      <Calendar className="h-3 w-3" />
                      Jadwal Pelajaran
                    </p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {scheduleSlots.map((slot) => (
                        <div
                          key={`${slot.id}-${slot.day}-${slot.startTime}`}
                          className="rounded-xl bg-white/70 p-3 text-xs text-indigo-900 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">{slot.day}</span>
                            {slot.room && (
                              <span className="flex items-center gap-1 text-[11px] text-indigo-600">
                                <MapPin className="h-3 w-3" />
                                {slot.room}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          {slot.teacherName && (
                            <div className="mt-1 flex items-center gap-2">
                              <User className="h-3 w-3" />
                              {slot.teacherName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="materials">
          <TabsList className="w-full justify-start bg-white">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Materi
              <Badge variant="secondary">{formattedMaterials.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              Kuis
              <Badge variant="secondary">{formattedQuizzes.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-6">
            {formattedMaterials.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Belum ada materi"
                description="Materi untuk mata pelajaran ini akan muncul di sini."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {formattedMaterials.map((material, index) => {
                  const previewHref = material.previewUrl ?? material.fileUrl ?? undefined;
                  const downloadHref =
                    material.downloadUrl ?? material.fileUrl ?? undefined;

                  return (
                    <motion.div
                      key={`material-${material.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-l-4 border-l-blue-600">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                              {material.fileType.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-base font-semibold text-gray-900">
                                    {material.title}
                                  </h3>
                                  {material.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                      {material.description}
                                    </p>
                                  )}
                                </div>
                                <Badge className={material.fileType.badgeClass}>
                                  {material.fileType.label}
                                </Badge>
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                {material.uploadedAt
                                  ? material.uploadedAt.toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                  : "Tanggal tidak tersedia"}
                              </div>

                              {/* Tampilan File yang Dilampirkan */}
                              {material.fileName && (
                                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                  <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="font-medium text-sm text-gray-800 break-all">
                                        {material.fileName}
                                      </p>
                                      <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <span className="uppercase font-semibold text-[10px] bg-gray-200 px-1.5 py-0.5 rounded">
                                            {material.fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                                          </span>
                                          {material.fileSize && (
                                            <span>{formatFileSize(material.fileSize)}</span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {previewHref && (
                                            <Button size="sm" variant="ghost" className="h-7 px-2" asChild>
                                              <a href={previewHref} target="_blank" rel="noopener noreferrer">
                                                <Eye className="h-3.5 w-3.5 mr-1" />
                                                Lihat
                                              </a>
                                            </Button>
                                          )}
                                          {downloadHref && (
                                            <Button size="sm" variant="ghost" className="h-7 px-2" asChild>
                                              <a href={downloadHref} download={material.fileName}>
                                                <Download className="h-3.5 w-3.5 mr-1" />
                                                Unduh
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {(material.youtubeEmbedUrl || material.videoUrl) && (
                                <div className="mt-4 space-y-4">
                                  {material.youtubeEmbedUrl && (
                                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                                      <iframe
                                        src={`${material.youtubeEmbedUrl}?rel=0`}
                                        title={`Video YouTube ${material.title}`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="h-full w-full"
                                      />
                                    </div>
                                  )}
                                  {material.videoUrl && (
                                    <video
                                      controls
                                      preload="metadata"
                                      className="w-full rounded-lg border border-gray-200"
                                    >
                                      <source src={material.videoUrl} />
                                      Browser Anda tidak mendukung pemutaran video.
                                    </video>
                                  )}
                                </div>
                              )}

                              {material.scheduleSlots?.length ? (
                                <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-900">
                                  <div className="flex items-center gap-2 font-semibold uppercase tracking-wide text-indigo-600">
                                    <Calendar className="h-3 w-3" />
                                    Jadwal Kelas
                                  </div>
                                  <div className="mt-2 space-y-1">
                                    {material.scheduleSlots.map((slot) => (
                                      <div
                                        key={`${material.id}-${slot.id}-${slot.startTime}`}
                                        className="flex flex-wrap items-center gap-3"
                                      >
                                        <span className="font-semibold">{slot.day}</span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {slot.startTime} - {slot.endTime}
                                        </span>
                                        {slot.room && (
                                          <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {slot.room}
                                          </span>
                                        )}
                                        {slot.teacherName && (
                                          <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {slot.teacherName}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}

                              <div className="mt-4 flex flex-wrap gap-2">
                                {/* Tombol untuk file hanya ditampilkan jika tidak ada fileName (sudah ada di box file) */}
                                {!material.fileName && previewHref && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="flex-1"
                                    asChild
                                  >
                                    <a
                                      href={previewHref}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      Buka
                                    </a>
                                  </Button>
                                )}
                                {!material.fileName && downloadHref && (
                                  <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <a href={downloadHref} target="_blank" rel="noopener noreferrer">
                                      <Download className="mr-2 h-4 w-4" />
                                      Unduh
                                    </a>
                                  </Button>
                                )}
                                {material.videoUrl && (
                                  <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <a
                                      href={material.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <PlayCircle className="mr-2 h-4 w-4" />
                                      Unduh Video
                                    </a>
                                  </Button>
                                )}
                                {material.youtubeUrl && (
                                  <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <a
                                      href={material.youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Youtube className="mr-2 h-4 w-4" />
                                      Buka di YouTube
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            {formattedQuizzes.length === 0 ? (
              <EmptyState
                icon={FileQuestion}
                title="Belum ada kuis"
                description="Kuis untuk mata pelajaran ini akan muncul di sini."
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {formattedQuizzes.map((quiz, index) => {
                  const completed = !!quiz.latestAttempt;
                  return (
                    <motion.div
                      key={`quiz-${quiz.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`border-l-4 ${completed ? "border-l-green-600 bg-green-50/30" : "border-l-blue-600"
                          }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex gap-3">
                            <div
                              className={`rounded-lg p-3 ${completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                }`}
                            >
                              {completed ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <FileQuestion className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-gray-900">
                                {quiz.title}
                              </h3>
                              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                                <Badge variant="outline" className="text-[11px]">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {quiz.duration} menit
                                </Badge>
                                <Badge variant="outline" className="text-[11px]">
                                  {quiz.totalQuestions} soal
                                </Badge>
                                {completed && quiz.latestAttempt?.score !== undefined && (
                                  <Badge className="bg-green-600 text-white text-[11px]">
                                    <Award className="mr-1 h-3 w-3" />
                                    Nilai {quiz.latestAttempt.score}
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                {quiz.availableUntil
                                  ? `Batas akhir: ${new Date(
                                    quiz.availableUntil,
                                  ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}`
                                  : "Tidak ada batas akhir"}
                              </div>
                              <div className="mt-4">
                                {completed ? (
                                  <Button variant="outline" size="sm" className="w-full" disabled>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Sudah dikerjakan
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                                    asChild
                                    disabled={!quiz.entryUrl || !quiz.isAvailable}
                                  >
                                    <Link href={quiz.entryUrl ?? "#"} preserveScroll>
                                      <Play className="mr-2 h-4 w-4" />
                                      Mulai Kuis
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
      <Icon className="h-4 w-4 text-gray-400" />
      <div>
        <p className="text-[11px] uppercase text-gray-400">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="py-16 text-center text-sm text-gray-500">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Icon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
}

function guessMaterialType(material: MaterialItem) {
  if (material.videoUrl || material.youtubeEmbedUrl || material.youtubeUrl) {
    return {
      label: "Video",
      icon: "🎥",
      badgeClass: "bg-purple-600 text-white",
    };
  }

  const extension =
    material.fileName?.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "pdf") {
    return { label: "PDF", icon: "📄", badgeClass: "bg-red-600 text-white" };
  }

  if (["ppt", "pptx"].includes(extension)) {
    return { label: "PPT", icon: "📊", badgeClass: "bg-orange-500 text-white" };
  }

  if (["doc", "docx"].includes(extension)) {
    return { label: "DOC", icon: "📝", badgeClass: "bg-blue-600 text-white" };
  }

  return { label: "Materi", icon: "📁", badgeClass: "bg-gray-600 text-white" };
}

function subjectDecoration(id: number) {
  const palette = [
    { background: "bg-gradient-to-r from-blue-500 to-blue-700", icon: "📘" },
    { background: "bg-gradient-to-r from-red-500 to-red-700", icon: "📕" },
    { background: "bg-gradient-to-r from-green-500 to-green-700", icon: "📗" },
    { background: "bg-gradient-to-r from-purple-500 to-purple-700", icon: "📔" },
    { background: "bg-gradient-to-r from-indigo-500 to-indigo-700", icon: "📙" },
  ];
  return palette[id % palette.length];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

