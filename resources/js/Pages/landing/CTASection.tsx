import { Button } from '@/Components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export default function CTASection({ onGetStarted }: CTASectionProps) {
  
  // Menggunakan warna biru/cyan untuk gradien (Serasi dengan komponen lain)
  const gradientStart = "from-blue-700"; // Biru Tua
  const gradientEnd = "to-cyan-500"; // Cyan Cerah
  
  // Warna teks utama untuk tombol (Biru Seragam)
  const buttonMainColor = "text-blue-600";
  
  const stats = [
    { value: '10K+', label: 'Siswa Aktif' },
    { value: '500+', label: 'Kursus' },
    { value: '98%', label: 'Kepuasan' },
  ];

  return (
    <section className="py-24 md:py-32 px-4 lg:px-16"> 
      
      {/* KARTU BESAR CTA (Container Utama) - Gradien Biru Tua ke Cyan Cerah */}
      <div 
        className={`max-w-screen-2xl mx-auto bg-gradient-to-r ${gradientStart} ${gradientEnd} 
                    text-center text-white py-16 md:py-24 rounded-3xl shadow-2xl`}
      >
        
        {/* Konten CTA */}
        <div className="px-4"> 
            
          {/* 1. Badge Subjudul */}
          <div className="inline-flex items-center space-x-2 text-sm font-semibold mb-4 px-4 py-2 rounded-full border border-white/70 bg-white/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
            <p className="tracking-widest uppercase">Bergabung Sekarang</p>
          </div>

          {/* 2. Judul Utama */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Mulai Perjalanan Belajar Anda
          </h2>
          
          {/* 3. Deskripsi */}
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Daftar sekarang dan dapatkan akses ke ratusan kursus berkualitas dari pengajar profesional
          </p>
          
          {/* 4. Tombol CTA - Background Putih Solid, Teks Biru */}
          <Button 
            size="lg" 
            className={`${buttonMainColor} bg-white hover:bg-gray-100 text-lg font-bold px-10 py-6 rounded-full shadow-2xl transition transform hover:scale-[1.02]`} 
            onClick={() => window.location.href = '/login'} 
          >
            Masuk Sekarang
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
          
          {/* GARIS PEMISAH HORIZONTAL TIPIS */}
          <hr className="mt-16 mb-8 border-white/20 w-1/4 mx-auto" />
          
          {/* 5. Teks Kepercayaan */}
          <p className="text-white/70 font-medium text-sm mb-4">
            Dipercaya oleh ribuan siswa
          </p>
          
          {/* 6. Statistik / Pencapaian */}
          <div className="flex justify-center divide-x divide-white/30 max-w-lg mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.value} 
                className={`flex-1 px-8 ${index === 0 ? 'pr-8' : index === stats.length - 1 ? 'pl-8' : 'px-8'}`} 
              >
                <p className="text-4xl font-extrabold">{stat.value}</p>
                <p className="text-sm opacity-80 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}