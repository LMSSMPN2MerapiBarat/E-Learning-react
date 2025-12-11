import { ImageWithFallback } from '@/Components/figma/ImageWithFallback';
import { Check } from 'lucide-react';

// ===========================================
// PERUBAHAN DI SINI: Import Gambar Lokal
// ===========================================
import visionImage from '@/assets/vision-image.png'; 
import missionImage from '@/assets/mission-image.png'; 

export default function VisiMisiSection() {
  return (
    <section id="visi-misi" className="py-16 md:py-24">
      {/* PERUBAHAN DI SINI:
        1. Menghapus max-w-7xl agar konten bisa meregang hingga 100% lebar layar.
        2. Menggunakan padding horizontal sangat kecil pada desktop (lg:px-12) atau bahkan lebih kecil.
        3. Saya menggunakan lg:px-16 untuk memberikan sedikit ruang bernapas, 
           tapi secara visual akan terasa lebih penuh daripada max-w-7xl.
        
        CATATAN: Jika Anda menggunakan framework seperti Laravel Breeze/Jetstream yang memiliki class 'container' default, 
        kita hanya perlu mengontrol paddingnya.
      */}
      <div className="mx-auto px-4 lg:px-16 max-w-screen-2xl"> 
        
        {/*
          ===================================
          1. VISI KAMI (Gambar Kiri, Teks Kanan)
          ===================================
        */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Gambar Visi (KIRI) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={visionImage}
              alt="Student with books representing our vision"
              className="w-full h-auto max-h-[450px] object-cover"
            />
          </div>
          
          {/* Teks Visi (KANAN) */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Visi Kami</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Memberdayakan generasi muda Indonesia melalui pendidikan digital yang inovatif dan berkualitas. Kami berkomitmen menciptakan lingkungan belajar yang inklusif, di mana setiap siswa memiliki akses terhadap pendidikan terbaik tanpa batas ruang dan waktu.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm shadow-md">Inovatif</span>
              <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm shadow-md">Inklusif</span>
              <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm shadow-md">Berkualitas</span>
            </div>
          </div>
        </div>

        {/*
          ===================================
          2. MISI KAMI (Teks Kiri, Gambar Kanan)
          ===================================
        */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Teks Misi (KIRI) */}
          <div className="space-y-6 md:order-1"> 
            <h2 className="text-4xl font-bold text-gray-900">Misi Kami</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Menyediakan kurikulum pembelajaran yang komprehensif dan relevan. Mengembangkan kemampuan berpikir kritis, kreatif, dan kolaboratif melalui metode pembelajaran interaktif yang didukung teknologi modern.
            </p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" /> Kurikulum terintegrasi dengan standar nasional
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" /> Pengajar profesional dan berpengalaman
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" /> Dukungan belajar 24/7 melalui platform
              </li>
            </ul>
          </div>
          
          {/* Gambar Misi (KANAN) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl md:order-2"> 
            <ImageWithFallback
              src={missionImage} 
              alt="Professional female teacher representing our mission"
              className="w-full h-auto max-h-[450px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}