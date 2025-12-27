import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

interface AchievementItem {
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
}

const achievements: AchievementItem[] = [
  { title: "Juara 1 Matematika Nasional", category: "Akademik", description: "Meraih medali emas dalam kompetisi sains paling bergengsi tingkat nasional yang diselenggarakan oleh Puspresnas.", image: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&q=80&w=800", year: "2024" },
  { title: "Juara Umum Pramuka", category: "Karakter", description: "Menjadi juara umum dalam kegiatan Jambore Daerah tingkat provinsi dengan perolehan medali terbanyak.", image: "https://images.unsplash.com/photo-1589187151032-573a91317445?auto=format&fit=crop&q=80&w=800", year: "2024" },
  { title: "Emas Kejuaraan Karate", category: "Olahraga", description: "Mempertahankan prestasi medali emas dalam kejuaraan karate terbuka tingkat internasional.", image: "https://images.unsplash.com/photo-1614632537423-1f6c2e7e0aab?auto=format&fit=crop&q=80&w=800", year: "2024" },
  { title: "Perpustakaan Terbaik", category: "Literasi", description: "Penghargaan nasional atas inovasi tata kelola perpustakaan digital dan pengembangan literasi sekolah.", image: "https://images.unsplash.com/photo-1635932130324-4f2452286e7c?auto=format&fit=crop&q=80&w=800", year: "2024" },
  { title: "Juara FLS2N Tari Kreasi", category: "Seni", description: "Menampilkan budaya lokal melalui gerak tari modern dan tradisional di tingkat nasional.", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800", year: "2023" },
  { title: "Medali Perak Fisika", category: "Akademik", description: "Kompetisi ketat antar pelajar tingkat Asia Pasifik dalam bidang fisika teori dan eksperimen.", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800", year: "2023" },
  { title: "Best Speaker Debat", category: "Bahasa", description: "Menjadi pembicara terbaik (Best Speaker) dalam National Schools Debating Championship.", image: "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?auto=format&fit=crop&q=80&w=800", year: "2023" },
  { title: "Juara 1 Basket", category: "Olahraga", description: "Kemenangan beruntun tim sekolah dalam turnamen antar sekolah menengah se-provinsi.", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800", year: "2024" },
  { title: "Inovasi Filter Air", category: "Teknologi", description: "Menciptakan alat penyaring air otomatis berbasis panel surya untuk masyarakat desa.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800", year: "2023" },
  { title: "Grand Prix Choir", category: "Seni", description: "Meraih penghargaan tertinggi dalam kompetisi paduan suara pemuda internasional di Singapura.", image: "https://images.unsplash.com/photo-1514320291944-9694b462494e?auto=format&fit=crop&q=80&w=800", year: "2024" }
];

export const Achievements = () => {
  return (
    <section id="achievements" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* --- HEADER CONCEPT SYNCED WITH ABOUT SECTION --- */}
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-[3px] bg-blue-600"></div>
              <span className="text-blue-600 font-black text-sm uppercase tracking-[0.2em]">Pencapaian Kami</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase leading-none tracking-tighter">
              Prestasi <span className="text-blue-600">Siswa</span> <br />
              SMPN 2 Merapi Barat
            </h2>
          </div>

          <div className="lg:border-l-2 lg:border-blue-100 lg:pl-10">
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl font-medium">
              Apresiasi atas dedikasi dan kerja keras siswa kami dalam meraih keunggulan di tingkat nasional dan internasional. Kami berkomitmen mendukung setiap potensi luar biasa.
            </p>
          </div>
        </div>
        {/* --- END HEADER CONCEPT --- */}

        {/* SLIDER SECTION - TETAP SESUAI KODE ANDA */}
        <Swiper
          modules={[Pagination, Autoplay, FreeMode]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            1280: { slidesPerView: 4 }, 
            1024: { slidesPerView: 3 },
            640: { slidesPerView: 2 }
          }}
          className="achievement-swiper !pb-14"
        >
          {achievements.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-slate-900 group transition-all duration-500 hover:shadow-xl">
                
                <div className="absolute inset-0">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                <div className="relative h-full flex flex-col p-6 text-white">
                  <div className="flex justify-start">
                    <span className="inline-block px-3 py-1.5 bg-blue-500/30 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-blue-300/40">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex-grow"></div>
                  
                  <div className="space-y-2">
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                      Tahun {item.year}
                    </p>
                    <h3 className="text-lg font-bold uppercase leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <div className="w-8 h-1 bg-blue-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
                    
                    <p className="text-gray-300 text-xs font-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .achievement-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #1e40af;
          opacity: 0.3;
        }
        .achievement-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #2563eb;
          width: 20px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
};