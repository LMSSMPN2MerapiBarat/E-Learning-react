// src/components/landing/CaraKerjaSection.tsx
import { Card } from '@/Components/ui/card';
import { ImageWithFallback } from '@/Components/figma/ImageWithFallback';
import { UserPlus, BookOpen, ArrowRightCircle } from 'lucide-react';

// Import Gambar Lokal
import elearningImage from '@/assets/e-learning-session.png';

// ===========================================
// Konstanta Gaya Gradien Serasi
// ===========================================
const ICON_GRADIENT = 'bg-gradient-to-br from-blue-600 to-cyan-400';
const ICON_SHADOW = 'shadow-[0_10px_20px_rgba(37,99,235,0.4)]'; // Bayangan biru yang kuat

const edulearnSteps = [
  {
    icon: UserPlus,
    title: 'Daftar Akun',
    description: 'Buat akun gratis dengan email atau nomor telepon Anda',
  },
  {
    icon: BookOpen,
    title: 'Pilih Kursus',
    description: 'Jelajahi berbagai kursus dan pilih yang sesuai dengan minat Anda',
  },
  {
    icon: ArrowRightCircle,
    title: 'Mulai Belajar',
    description: 'Akses materi pembelajaran dan mulai perjalanan belajar Anda',
  },
];

export default function CaraKerjaSection() {
  return (
    <section id="e-learning" className="py-16 md:py-24">
      <div className="mx-auto px-4 lg:px-16 max-w-screen-2xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Langkah-langkah */}
        <div className="space-y-12">
            <div className="space-y-4">
                {/* Badge Cara Kerja: Biru Konsisten */}
                <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold uppercase">
                    Cara Kerja
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Tentang Sistem E-Learning</h2>
            </div>
            {/* Kontainer Langkah-Langkah: Tanpa Garis Halus (divide-y dihilangkan) */}
            <div className="space-y-10"> 
              {edulearnSteps.map((step) => (
                <div key={step.title} className={`flex items-start gap-5`}> 
                  
                  {/* Ikon: Gradien Semi-Petak (rounded-2xl) */}
                  <div className={`w-14 h-14 flex-shrink-0 ${ICON_GRADIENT} rounded-2xl flex items-center justify-center ${ICON_SHADOW}`}>
                    <step.icon className="w-7 h-7 text-white" /> 
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold mb-1 text-gray-900">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gambar Live Session */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={elearningImage}
                alt="E-Learning Live Session"
                className="w-full h-auto max-h-[450px] object-cover"
              />
              <div className="absolute top-6 right-6 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                • Live Session
              </div>
            </div>
            {/* Stat Card */}
            <Card className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-white p-4 shadow-2xl rounded-xl flex items-center justify-center w-2/3">
                <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">500+</p>
                    <p className="text-sm text-gray-500">Siswa Aktif</p>
                </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}