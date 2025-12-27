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
  {
    title: "Juara 1 First Ranking Quiziz",
    category: "Akademik",
    description: "Meraih peringkat pertama dalam kompetisi Quiziz tingkat nasional, menunjukkan keunggulan dalam penguasaan materi pembelajaran.",
    image: "/img/Prestasi/Juara1FirstRankingQuiziz.jpeg",
    year: "2024"
  },
  {
    title: "Juara 1 Tari FLS2N",
    category: "Seni",
    description: "Meraih juara pertama dalam Festival Lomba Seni Siswa Nasional (FLS2N) cabang tari, menampilkan keindahan budaya Indonesia.",
    image: "/img/Prestasi/Juara1TariFLSN.jpeg",
    year: "2024"
  },
  {
    title: "Juara 2 Drumband",
    category: "Seni",
    description: "Meraih juara kedua dalam kompetisi Drumband, menunjukkan kemampuan musikal dan kekompakan tim yang luar biasa.",
    image: "/img/Prestasi/Juara2Drumband.jpeg",
    year: "2024"
  },
  {
    title: "Juara 2 First Ranking Quiziz",
    category: "Akademik",
    description: "Meraih peringkat kedua dalam kompetisi Quiziz, menunjukkan konsistensi prestasi akademik siswa.",
    image: "/img/Prestasi/Juara2FirstRankingQuiziz.jpeg",
    year: "2024"
  },
  {
    title: "Juara 2 Renang Putra",
    category: "Olahraga",
    description: "Meraih juara kedua dalam kompetisi renang putra, menunjukkan kemampuan atletik dan dedikasi dalam olahraga air.",
    image: "/img/Prestasi/Juara2RenangPutra.jpeg",
    year: "2024"
  },
  {
    title: "Juara 2 Vocal Solo",
    category: "Seni",
    description: "Meraih juara kedua dalam lomba vocal solo, menampilkan bakat bernyanyi yang memukau.",
    image: "/img/Prestasi/Juara2VocalSolo.jpeg",
    year: "2024"
  },
  {
    title: "Juara 3 Ceramah",
    category: "Keagamaan",
    description: "Meraih juara ketiga dalam lomba ceramah, menunjukkan kemampuan public speaking dan pemahaman keagamaan.",
    image: "/img/Prestasi/Juara3Ceramah.jpeg",
    year: "2024"
  },
  {
    title: "Juara 3 Renang Putri",
    category: "Olahraga",
    description: "Meraih juara ketiga dalam kompetisi renang putri, menunjukkan prestasi olahraga yang membanggakan.",
    image: "/img/Prestasi/Juara3RenangPutri.jpeg",
    year: "2024"
  },
  {
    title: "Juara 3 Tari Kreasi",
    category: "Seni",
    description: "Meraih juara ketiga dalam lomba tari kreasi, menampilkan kreativitas dan inovasi dalam seni tari.",
    image: "/img/Prestasi/Juara3TariKreasi.jpeg",
    year: "2024"
  },
  {
    title: "Juara 3 Voli Putra",
    category: "Olahraga",
    description: "Meraih juara ketiga dalam kompetisi voli putra, menunjukkan kerjasama tim dan sportivitas.",
    image: "/img/Prestasi/Juara3VoliPutra.jpeg",
    year: "2024"
  },
  {
    title: "Juara Harapan 2 Drumband",
    category: "Seni",
    description: "Meraih juara harapan 2 dalam kompetisi Drumband, menunjukkan semangat dan potensi yang terus berkembang.",
    image: "/img/Prestasi/JuaraHarapan2Drumband.jpeg",
    year: "2024"
  }
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