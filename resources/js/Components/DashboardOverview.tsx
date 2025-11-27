import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Search,
  Users,
  BookOpen,
  School,
  GraduationCap,
} from "lucide-react";
import { Button } from "./ui/button";

// ==== Interfaces ====
interface Student {
  id: number;
  name?: string | null;
  email?: string | null;
  kelas?: string | null;
  no_telp?: string | null;
  nis?: string | null;
}

interface Guru {
  id: number;
  name?: string | null;
  email?: string | null;
  mapel?: string | null;
  kelas?: string | null;
}

interface KelasItem {
  id: number;
  nama?: string | null;
  wali?: string | null;
  jumlah_pengajar?: number | null;
}

interface Mapel {
  id: number;
  nama?: string | null;
  guru?: string | null;
}

interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
  students: Student[];
  gurus: Guru[];
  kelas: KelasItem[];
  mapels: Mapel[];
  totalGuru: number;
  totalSiswa: number;
  totalMateri: number;
  totalKuis: number;
  siswaLakiLaki: number;
  siswaPerempuan: number;
  guruLakiLaki: number;
  guruPerempuan: number;
}

// ==== Utils ====
const formatClassLabel = (
  value: string | string[] | null | undefined
): string => {
  if (!value) return "-";

  const items = Array.isArray(value)
    ? value
    : String(value)
        .split(",")
        .map((item) => item.trim());

  const formatted = items
    .map((item) =>
      item
        .replace(/Kelas\s*\d+\s*[-:]?\s*/gi, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);

  return formatted.length ? formatted.join(", ") : "-";
};

// ==== Main Component ====
export default function DashboardOverview() {
  const {
    students = [],
    gurus = [],
    kelas = [],
    mapels = [],
    totalGuru = 0,
    totalSiswa = 0,
    totalMateri = 0,
    totalKuis = 0,
    siswaLakiLaki = 0,
    siswaPerempuan = 0,
    guruLakiLaki = 0,
    guruPerempuan = 0,
  } = usePage<PageProps>().props;

  const [searchStudents, setSearchStudents] = useState("");
  const [searchGuru, setSearchGuru] = useState("");
  const [searchKelas, setSearchKelas] = useState("");
  const [searchMapel, setSearchMapel] = useState("");

  // === FILTERING ===
  const normalize = (value: string | number | null | undefined) =>
    String(value ?? "").toLowerCase();

  const studentQuery = searchStudents.trim().toLowerCase();
  const filteredStudents = studentQuery
    ? students.filter(
        (s) =>
          normalize(s.name).includes(studentQuery) ||
          normalize(s.nis).includes(studentQuery) ||
          normalize(s.kelas).includes(studentQuery)
      )
    : students;

  const guruQuery = searchGuru.trim().toLowerCase();
  const filteredGuru = guruQuery
    ? gurus.filter(
        (g) =>
          normalize(g.name).includes(guruQuery) ||
          normalize(g.mapel).includes(guruQuery) ||
          normalize(g.email).includes(guruQuery) ||
          normalize(g.kelas).includes(guruQuery)
      )
    : gurus;

  const kelasQuery = searchKelas.trim().toLowerCase();
  const filteredKelas = kelasQuery
    ? kelas.filter(
        (k) =>
          normalize(k.nama).includes(kelasQuery) ||
          normalize(k.wali).includes(kelasQuery)
      )
    : kelas;

  const mapelQuery = searchMapel.trim().toLowerCase();
  const filteredMapel = mapelQuery
    ? mapels.filter(
        (m) =>
          normalize(m.nama).includes(mapelQuery) ||
          normalize(m.guru).includes(mapelQuery)
      )
    : mapels;

  // === PAGINATION HANDLER ===
  const usePagination = <T,>(items: T[], perPage = 10) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * perPage;
    const paginated = items.slice(start, start + perPage);

    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    useEffect(() => {
      setPage(1);
    }, [items.length, perPage]);

    const next = () => setPage((prev) => Math.min(prev + 1, totalPages));
    const prev = () => setPage((prev) => Math.max(prev - 1, 1));

    return { page: safePage, totalPages, data: paginated, next, prev };
  };

  const siswaPagination = usePagination(filteredStudents);
  const guruPagination = usePagination(filteredGuru);
  const kelasPagination = usePagination(filteredKelas);
  const mapelPagination = usePagination(filteredMapel);

  return (
    <div className="space-y-6">
      {/* === Statistik === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Siswa</p>
              <p className="text-3xl mt-2">{totalSiswa}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Guru</p>
              <p className="text-3xl mt-2">{totalGuru}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Kelas</p>
              <p className="text-3xl mt-2">{totalMateri}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Mata Pelajaran</p>
              <p className="text-3xl mt-2">{totalKuis}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <School className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === Statistik Jenis Kelamin === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Statistik Siswa berdasarkan Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jenis Kelamin Siswa</CardTitle>
            <CardDescription>Distribusi siswa berdasarkan jenis kelamin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Laki-laki</p>
                  <p className="text-2xl font-bold text-blue-600">{siswaLakiLaki}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {totalSiswa > 0 ? ((siswaLakiLaki / totalSiswa) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Perempuan</p>
                  <p className="text-2xl font-bold text-pink-600">{siswaPerempuan}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {totalSiswa > 0 ? ((siswaPerempuan / totalSiswa) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistik Guru berdasarkan Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jenis Kelamin Guru</CardTitle>
            <CardDescription>Distribusi guru berdasarkan jenis kelamin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Laki-laki</p>
                  <p className="text-2xl font-bold text-green-600">{guruLakiLaki}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {totalGuru > 0 ? ((guruLakiLaki / totalGuru) * 100).toFixed(1) : 0}%
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Perempuan</p>
                  <p className="text-2xl font-bold text-purple-600">{guruPerempuan}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {totalGuru > 0 ? ((guruPerempuan / totalGuru) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === Tabs Data === */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sekolah</CardTitle>
          <CardDescription>
            Data siswa, guru, kelas, dan mata pelajaran
          </CardDescription>
        </CardHeader>

        {/* === Tabs Content Section === */}
        <CardContent>
          <Tabs defaultValue="students" className="space-y-6">
            {/* Tabs List */}
            <TabsList
              className="
                relative z-10 bg-white
                flex w-full flex-wrap gap-2
                sm:grid sm:grid-cols-4 sm:gap-2
                rounded-md shadow-sm mb-6
                sticky top-0
              "
            >
              <TabsTrigger value="students">Siswa</TabsTrigger>
              <TabsTrigger value="guru">Guru</TabsTrigger>
              <TabsTrigger value="kelas">Kelas</TabsTrigger>
              <TabsTrigger value="mapel">Mata Pelajaran</TabsTrigger>
            </TabsList>

            {/* === SISWA === */}
            <TabsContent
              value="students"
              className="space-y-4 relative z-0 transition-all duration-200 ease-in-out"
            >
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari siswa (nama, NIS, kelas)..."
                  value={searchStudents}
                  onChange={(e) => setSearchStudents(e.target.value)}
                  className="pl-10 py-2"
                />
              </div>

              <div className="rounded-lg border bg-white mt-2">
                {/* Table Desktop */}
                <div className="hidden overflow-x-auto md:block">
                  <Table className="min-w-[720px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>NIS</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>No. Telp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siswaPagination.data.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.nis ?? "-"}</TableCell>
                          <TableCell>{s.name ?? "-"}</TableCell>
                          <TableCell>{s.email ?? "-"}</TableCell>
                          <TableCell>{formatClassLabel(s.kelas)}</TableCell>
                          <TableCell>{s.no_telp ?? "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {siswaPagination.data.length > 0 ? (
                    siswaPagination.data.map((s) => (
                      <div
                        key={s.id}
                        className="space-y-2 rounded-lg border bg-white p-4 shadow-sm"
                      >
                        <p className="text-base font-semibold">{s.name ?? "-"}</p>
                        <p className="text-sm text-gray-500">{s.email ?? "-"}</p>
                        <div className="grid gap-1 text-sm">
                          <p><span className="font-medium">NIS:</span> {s.nis ?? "-"}</p>
                          <p><span className="font-medium">Kelas:</span> {formatClassLabel(s.kelas)}</p>
                          <p><span className="font-medium">No. Telp:</span> {s.no_telp ?? "-"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
                      Tidak ada data siswa.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t px-3 py-3 gap-2">
                  <Button variant="outline" size="sm" onClick={siswaPagination.prev} disabled={siswaPagination.page === 1} className="w-full sm:w-auto">
                    ← Sebelumnya
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    Halaman {siswaPagination.page} dari {siswaPagination.totalPages}
                  </p>
                  <Button variant="outline" size="sm" onClick={siswaPagination.next} disabled={siswaPagination.page === siswaPagination.totalPages} className="w-full sm:w-auto">
                    Berikutnya →
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* === GURU === */}
            <TabsContent value="guru" className="space-y-4 relative z-0">
              <Input
                placeholder="Cari guru (nama, mapel, kelas)..."
                value={searchGuru}
                onChange={(e) => setSearchGuru(e.target.value)}
                className="py-2"
              />

              <div className="rounded-lg border bg-white mt-2">
                <div className="hidden overflow-x-auto md:block">
                  <Table className="min-w-[680px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mata Pelajaran</TableHead>
                        <TableHead>Kelas Diajar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guruPagination.data.map((g) => (
                        <TableRow key={g.id}>
                          <TableCell>{g.name ?? "-"}</TableCell>
                          <TableCell>{g.email ?? "-"}</TableCell>
                          <TableCell>{g.mapel ?? "-"}</TableCell>
                          <TableCell>{formatClassLabel(g.kelas)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {guruPagination.data.length > 0 ? (
                    guruPagination.data.map((g) => (
                      <div key={g.id} className="space-y-2 rounded-lg border bg-white p-4 shadow-sm">
                        <p className="text-base font-semibold">{g.name ?? "-"}</p>
                        <p className="text-sm text-gray-500">{g.email ?? "-"}</p>
                        <div className="grid gap-1 text-sm">
                          <p><span className="font-medium">Mapel:</span> {g.mapel ?? "-"}</p>
                          <p><span className="font-medium">Kelas:</span> {formatClassLabel(g.kelas)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
                      Tidak ada data guru.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t px-3 py-3 gap-2">
                  <Button variant="outline" size="sm" onClick={guruPagination.prev} disabled={guruPagination.page === 1} className="w-full sm:w-auto">
                    ← Sebelumnya
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    Halaman {guruPagination.page} dari {guruPagination.totalPages}
                  </p>
                  <Button variant="outline" size="sm" onClick={guruPagination.next} disabled={guruPagination.page === guruPagination.totalPages} className="w-full sm:w-auto">
                    Berikutnya →
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* === KELAS === */}
            <TabsContent value="kelas" className="space-y-4 relative z-0">
              <Input
                placeholder="Cari kelas..."
                value={searchKelas}
                onChange={(e) => setSearchKelas(e.target.value)}
                className="py-2"
              />

              <div className="rounded-lg border bg-white mt-2">
                <div className="hidden overflow-x-auto md:block">
                  <Table className="min-w-[620px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Kelas</TableHead>
                        {/* <TableHead>Wali Kelas</TableHead> */}
                        <TableHead>Jumlah Pengajar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kelasPagination.data.map((k) => (
                        <TableRow key={k.id}>
                          <TableCell>{k.nama ?? "-"}</TableCell>
                          {/* <TableCell>{k.wali ?? "-"}</TableCell> */}
                          <TableCell>{k.jumlah_pengajar ?? 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="space-y-3 p-4 md:hidden">
                  {kelasPagination.data.length > 0 ? (
                    kelasPagination.data.map((k) => (
                      <div key={k.id} className="space-y-2 rounded-lg border bg-white p-4 shadow-sm">
                        <p className="text-base font-semibold">{k.nama ?? "-"}</p>
                        <div className="grid gap-1 text-sm">
                          {/* <p><span className="font-medium">Wali:</span> {k.wali ?? "-"}</p> */}
                          <p><span className="font-medium">Pengajar:</span> {k.jumlah_pengajar ?? 0}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
                      Tidak ada data kelas.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t px-3 py-3 gap-2">
                  <Button variant="outline" size="sm" onClick={kelasPagination.prev} disabled={kelasPagination.page === 1} className="w-full sm:w-auto">
                    ← Sebelumnya
                  </Button>
                  <p className="text-sm text-gray-500 text-center">
                    Halaman {kelasPagination.page} dari {kelasPagination.totalPages}
                  </p>
                  <Button variant="outline" size="sm" onClick={kelasPagination.next} disabled={kelasPagination.page === kelasPagination.totalPages} className="w-full sm:w-auto">
                    Berikutnya →
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* === MAPEL === */}
<TabsContent value="mapel" className="space-y-4 relative z-0">
  <div className="relative mt-4">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <Input
      placeholder="Cari mata pelajaran..."
      value={searchMapel}
      onChange={(e) => setSearchMapel(e.target.value)}
      className="pl-10 py-2"
    />
  </div>

  <div className="rounded-lg border bg-white mt-2">
    <div className="hidden overflow-x-auto md:block">
      <Table className="min-w-[520px]">
        <TableHeader>
          <TableRow>
            <TableHead>Nama Mata Pelajaran</TableHead>
            <TableHead>Guru Pengampu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mapelPagination.data.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.nama ?? "-"}</TableCell>
              <TableCell>{m.guru ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {/* Mobile Cards */}
    <div className="space-y-3 p-4 md:hidden">
      {mapelPagination.data.length > 0 ? (
        mapelPagination.data.map((m) => (
          <div key={m.id} className="space-y-1 rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-base font-semibold">{m.nama ?? "-"}</p>
            <p className="text-sm text-gray-600">
              Guru Pengampu: {m.guru ?? "-"}
            </p>
          </div>
        ))
      ) : (
        <p className="rounded-lg border bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
          Tidak ada data mata pelajaran.
        </p>
      )}
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row items-center justify-between border-t px-3 py-3 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={mapelPagination.prev}
        disabled={mapelPagination.page === 1}
        className="w-full sm:w-auto"
      >
        ← Sebelumnya
      </Button>
      <p className="text-sm text-gray-500 text-center">
        Halaman {mapelPagination.page} dari {mapelPagination.totalPages}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={mapelPagination.next}
        disabled={mapelPagination.page === mapelPagination.totalPages}
        className="w-full sm:w-auto"
      >
        Berikutnya →
      </Button>
    </div>
  </div>
</TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
