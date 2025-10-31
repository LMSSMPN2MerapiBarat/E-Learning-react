export interface MateriItem {
  id: number;
  judul: string;
  deskripsi?: string | null;
  kelas_id?: number | null;
  kelas?: {
    id: number;
    nama: string;
    tingkat?: string | null;
  } | null;
  mata_pelajaran_id?: number | null;
  mapel?: {
    id: number;
    nama: string;
  } | null;
  file_name?: string | null;
  file_mime?: string | null;
  file_url?: string | null;
  created_at?: string | null;
}