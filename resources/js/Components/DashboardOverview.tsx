import { useState } from "react";
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

interface Student {
  id: number;
  name: string;
  email: string;
  kelas?: string;
  no_telp?: string;
  nis?: string;
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
  totalGuru: number;
  totalSiswa: number;
  totalMateri: number;
  totalKuis: number;
}

export default function DashboardOverview() {
  const {
    students = [],
    totalGuru = 0,
    totalSiswa = 0,
    totalMateri = 0,
    totalKuis = 0,
  } = usePage<PageProps>().props;

  const [searchStudents, setSearchStudents] = useState("");
  const [searchGuru, setSearchGuru] = useState("");
  const [searchKelas, setSearchKelas] = useState("");
  const [searchMapel, setSearchMapel] = useState("");

  const guruData = [
    { id: 1, name: "Bapak Ahmad", email: "ahmad@smpn2mb.sch.id", mapel: "Matematika" },
    { id: 2, name: "Ibu Rina", email: "rina@smpn2mb.sch.id", mapel: "Bahasa Indonesia" },
    { id: 3, name: "Bapak Budi", email: "budi@smpn2mb.sch.id", mapel: "IPA" },
  ];

  const kelasData = [
    { id: 1, nama: "VII A", wali: "Bapak Ahmad" },
    { id: 2, nama: "VIII B", wali: "Ibu Rina" },
  ];

  const mapelData = [
    { id: 1, nama: "Matematika", guru: "Bapak Ahmad" },
    { id: 2, nama: "Bahasa Indonesia", guru: "Ibu Rina" },
    { id: 3, nama: "IPA", guru: "Bapak Budi" },
  ];

  // === FILTERING ===
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
      s.nis?.includes(searchStudents) ||
      s.kelas?.toLowerCase().includes(searchStudents.toLowerCase())
  );
  const filteredGuru = guruData.filter(
    (g) =>
      g.name.toLowerCase().includes(searchGuru.toLowerCase()) ||
      g.mapel.toLowerCase().includes(searchGuru.toLowerCase())
  );
  const filteredKelas = kelasData.filter((k) =>
    k.nama.toLowerCase().includes(searchKelas.toLowerCase())
  );
  const filteredMapel = mapelData.filter((m) =>
    m.nama.toLowerCase().includes(searchMapel.toLowerCase())
  );

  // === PAGINATION HANDLER ===
  const usePagination = (data: any[], perPage = 10) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(data.length / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = data.slice(start, end);

    const next = () => page < totalPages && setPage(page + 1);
    const prev = () => page > 1 && setPage(page - 1);

    return { page, totalPages, data: paginated, next, prev };
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

      {/* === Tabs Data === */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sekolah</CardTitle>
          <CardDescription>
            Data siswa, guru, kelas, dan mata pelajaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="students" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="students">Siswa</TabsTrigger>
              <TabsTrigger value="guru">Guru</TabsTrigger>
              <TabsTrigger value="kelas">Kelas</TabsTrigger>
              <TabsTrigger value="mapel">Mata Pelajaran</TabsTrigger>
            </TabsList>

            {/* === SISWA === */}
            <TabsContent value="students" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari siswa (nama, NIS, kelas)..."
                  value={searchStudents}
                  onChange={(e) => setSearchStudents(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="border rounded-lg">
                <Table>
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
                        <TableCell>{s.nis}</TableCell>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.kelas || "-"}</TableCell>
                        <TableCell>{s.no_telp || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={siswaPagination.prev}
                    disabled={siswaPagination.page === 1}
                  >
                    ← Sebelumnya
                  </Button>
                  <p className="text-sm text-gray-500">
                    Halaman {siswaPagination.page} dari {siswaPagination.totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={siswaPagination.next}
                    disabled={siswaPagination.page === siswaPagination.totalPages}
                  >
                    Berikutnya →
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* === GURU === */}
            <TabsContent value="guru" className="space-y-4">
              <Input
                placeholder="Cari guru (nama, mapel)..."
                value={searchGuru}
                onChange={(e) => setSearchGuru(e.target.value)}
              />
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guruPagination.data.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell>{g.name}</TableCell>
                        <TableCell>{g.email}</TableCell>
                        <TableCell>{g.mapel}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={guruPagination.prev}
                    disabled={guruPagination.page === 1}
                  >
                    ← Sebelumnya
                  </Button>
                  <p className="text-sm text-gray-500">
                    Halaman {guruPagination.page} dari {guruPagination.totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={guruPagination.next}
                    disabled={guruPagination.page === guruPagination.totalPages}
                  >
                    Berikutnya →
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* === KELAS === */}
            <TabsContent value="kelas" className="space-y-4">
              <Input
                placeholder="Cari kelas..."
                value={searchKelas}
                onChange={(e) => setSearchKelas(e.target.value)}
              />
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Kelas</TableHead>
                      <TableHead>Wali Kelas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kelasPagination.data.map((k) => (
                      <TableRow key={k.id}>
                        <TableCell>{k.nama}</TableCell>
                        <TableCell>{k.wali}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={kelasPagination.prev}
                    disabled={kelasPagination.page === 1}
                  >
                    ← Sebelumnya
                  </Button>
                  <p className="text-sm text-gray-500">
                    Halaman {kelasPagination.page} dari {kelasPagination.totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={kelasPagination.next}
                    disabled={kelasPagination.page === kelasPagination.totalPages}
                  >
                    Berikutnya →
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* === MAPEL === */}
            <TabsContent value="mapel" className="space-y-4">
              <Input
                placeholder="Cari mata pelajaran..."
                value={searchMapel}
                onChange={(e) => setSearchMapel(e.target.value)}
              />
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Mata Pelajaran</TableHead>
                      <TableHead>Guru Pengampu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mapelPagination.data.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.nama}</TableCell>
                        <TableCell>{m.guru}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={mapelPagination.prev}
                    disabled={mapelPagination.page === 1}
                  >
                    ← Sebelumnya
                  </Button>
                  <p className="text-sm text-gray-500">
                    Halaman {mapelPagination.page} dari {mapelPagination.totalPages}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={mapelPagination.next}
                    disabled={mapelPagination.page === mapelPagination.totalPages}
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
