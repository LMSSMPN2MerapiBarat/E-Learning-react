
import React from 'react';
import { Calendar, Bell, ChevronRight } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: "Perayaan HUT Sekolah",
    date: "10 Des 2025",
    type: "Acara",
    summary: "Bergabunglah dengan kami untuk perayaan HUT ke-25 SMPN 2 Merapi Barat dengan pertunjukan dan pameran."
  },
  {
    id: 2,
    title: "Jadwal Ujian Semester Dirilis",
    date: "05 Des 2025",
    type: "Akademik",
    summary: "Jadwal ujian akhir semester sudah tersedia. Siswa diharapkan memeriksa papan pengumuman."
  },
  {
    id: 3,
    title: "Pemenang Pameran Sains",
    date: "28 Nov 2025",
    type: "Prestasi",
    summary: "Selamat kepada Tim Sains kami yang meraih juara 1 di Olimpiade Sains Regional."
  }
];

export const News = () => {
  return (
    <section id="news" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Berita & Update</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                  ${item.type === 'Acara' ? 'bg-purple-100 text-purple-600' :
                    item.type === 'Akademik' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'}`}>
                  {item.type}
                </span>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar size={14} className="mr-1" />
                  {item.date}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{item.summary}</p>
              <a href="#" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                Baca Selengkapnya <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
