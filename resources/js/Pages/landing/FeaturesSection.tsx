import { Card, CardContent, CardDescription, CardTitle } from '@/Components/ui/card';
import { Video, Zap, Award, MessageCircle } from 'lucide-react';

// Tentukan TEMA GRADIENT BIRU YANG SAMA untuk semua card
const CONSISTENT_MAIN_COLOR = 'text-blue-600';
const CONSISTENT_GRADIENT = 'bg-gradient-to-br from-blue-500 to-cyan-400';
const CONSISTENT_SHADOW = 'shadow-[0_10px_25px_rgba(29,78,216,0.5)]'; // Bayangan biru yang lebih kuat (blue-700)

const edulearnFeatures = [
  {
    icon: Video,
    title: 'Video Pembelajaran',
    description: 'Akses materi video berkualitas tinggi kapan saja dan di mana saja',
    info: '100+ Video',
    // Menggunakan tema yang seragam
    mainColor: CONSISTENT_MAIN_COLOR, 
    gradientClass: CONSISTENT_GRADIENT
  },
  {
    icon: Zap,
    title: 'Kuis Interaktif',
    description: 'Uji pemahaman dengan kuis yang menarik dan menantang',
    info: '500+ Soal',
    // Menggunakan tema yang seragam
    mainColor: CONSISTENT_MAIN_COLOR,
    gradientClass: CONSISTENT_GRADIENT
  },
  {
    icon: Award,
    title: 'Sertifikat',
    description: 'Dapatkan sertifikat resmi setelah menyelesaikan kursus',
    info: 'Terakreditasi',
    // Menggunakan tema yang seragam
    mainColor: CONSISTENT_MAIN_COLOR, 
    gradientClass: CONSISTENT_GRADIENT
  },
  {
    icon: MessageCircle,
    title: 'Komunitas Diskusi',
    description: 'Berdiskusi dengan sesama siswa dan pengajar ahli',
    info: 'Komunitas Aktif',
    // Menggunakan tema yang seragam
    mainColor: CONSISTENT_MAIN_COLOR,
    gradientClass: CONSISTENT_GRADIENT
  },
];

export default function FeaturesSection() {
  return (
    <section id="fitur" className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto px-4 lg:px-16 max-w-screen-2xl"> 
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold uppercase mb-4 tracking-wider">
            Fitur Unggulan
        </div>
          <h3 className="text-4xl font-bold text-gray-900">Fitur Lengkap untuk Pembelajaran Optimal</h3>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-lg">
            Platform kami dilengkapi dengan berbagai fitur modern yang dirancang untuk memberikan pengalaman belajar terbaik
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {edulearnFeatures.map((feature) => (
            <Card 
              key={feature.title} 
              // Garis tebal di atas menggunakan warna utama yang seragam
              className={`group p-6 text-center shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-300 border-t-8 ${feature.mainColor.replace('text', 'border')} border-b-0 border-l-0 border-r-0`}
            >
              <CardContent className="p-0">
                
                {/* Ikon: Gradien Biru Seragam dan Bayangan Biru Kuat Seragam */}
                <div className={`w-16 h-16 ${feature.gradientClass} rounded-xl flex items-center justify-center mx-auto mb-6 transform transition-transform group-hover:scale-110 ${CONSISTENT_SHADOW}`}>
                  <feature.icon className={`w-8 h-8 text-white drop-shadow-md`} /> 
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">{feature.description}</CardDescription>
                
                <p className={`mt-2 text-sm font-bold ${feature.mainColor}`}>{feature.info}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
      </div>
    </section>
  );
}