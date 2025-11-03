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
  file_size?: number | null;
  youtube_url?: string | null;
  youtube_embed_url?: string | null;
  video_name?: string | null;
  video_mime?: string | null;
  video_size?: number | null;
  video_url?: string | null;
  created_at?: string | null;
}