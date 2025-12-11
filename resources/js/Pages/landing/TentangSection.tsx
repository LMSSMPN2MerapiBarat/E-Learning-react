import { Card } from '@/Components/ui/card';
import { ImageWithFallback } from '@/Components/figma/ImageWithFallback';
import { GraduationCap, Users, Award, Globe } from 'lucide-react';

// ===========================================
// Import Gambar Lokal
// ===========================================
import aboutImage from '@/assets/about-school.png'; 

// ===========================================
// Konstanta Gaya Gradien (Disesuaikan dengan tema Biru/Cyan)
// ===========================================
const ICON_GRADIENT = 'bg-gradient-to-br from-blue-500 to-cyan-400';
const ICON_SHADOW = 'shadow-lg shadow-blue-400/50';

const edulearnStats = [
  { value: '10+', label: 'Tahun Berdiri', icon: GraduationCap },
  { value: '5000+', label: 'Alumni Sukses', icon: Users },
  { value: '50+', label: 'Penghargaan', icon: Award },
  { value: '100+', label: 'Mitra Industri', icon: Globe },
];

export default function TentangSection() {
  return (
    <section id="tentang" className="bg-white py-16 md:py-24">
      <div className="mx-auto px-4 lg:px-16 max-w-screen-2xl">
        
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tentang Sekolah Kami</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Kami adalah institusi pendidikan yang berkomitmen menghadirkan pengalaman belajar terbaik dengan dukungan teknologi modern.
          </p>
        </div>
        
        {/* TATA LETAK BARU: Gambar di Kiri (md:order-first) & Konten di Kanan */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Sisi KIRI: Gambar Utama */}
          <div className="relative order-last lg:order-first"> 
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-300/50">
              <ImageWithFallback
                src={aboutImage}
                alt="Modern classroom or school building"
                className="w-full h-auto max-h-[500px] object-cover"
              />
              {/* Badge Akreditasi */}
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-xl font-semibold text-sm">
                Terakreditasi A <span className="text-blue-600">BAN-SM 2024</span>
              </div>
            </div>
          </div>

          {/* Sisi KANAN: Deskripsi & Statistik BARU */}
          <div className="space-y-8">
            
            <h3 className="text-3xl font-bold text-blue-700">Transformasi Digital dalam Pendidikan</h3>
            <p className="text-lg text-gray-600">
              Sejak didirikan, kami terus berinovasi dalam menghadirkan metode pembelajaran yang efektif dan menyenangkan. Dengan dukungan infrastruktur teknologi modern dan kurikulum yang relevan, kami mempersiapkan siswa untuk menghadapi tantangan era digital.
            </p>
            <p className="text-gray-700 border-l-4 border-amber-500 pl-4 italic">
              Tim pengajar kami terdiri dari praktisi industri dan akademisi berpengalaman yang berkomitmen memberikan bimbingan terbaik untuk setiap siswa.
            </p>

            {/* Statistik / Pencapaian (Diubah menjadi card kecil di sebelah deskripsi) */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {edulearnStats.slice(0, 4).map((stat) => ( // Hanya tampilkan 4 statistik
                <Card 
                  key={stat.label} 
                  className="group p-4 shadow-md transition-all duration-300 bg-gray-50 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    {/* Ikon: Gradien + Bayangan (tetap konsisten) */}
                    <div className={`w-10 h-10 flex-shrink-0 ${ICON_GRADIENT} rounded-md flex items-center justify-center ${ICON_SHADOW}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div>
                      {/* Nilai: Teks Gradien */}
                      <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 leading-none">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}