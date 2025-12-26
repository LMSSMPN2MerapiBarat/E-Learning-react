import React from "react";
import { Monitor, Trophy, Users } from "lucide-react";

const facilities = [
  {
    name: "Laboratorium IPA",
    icon: <Users size={40} className="text-blue-600" />,
    description:
      "Ruang kelas yang luas dan berventilasi baik dengan peralatan pembelajaran multimedia.",
    image: "/img/Fasilitas/LabIPA2.jpeg",
  },
  {
    name: "Laboratorium Komputer",
    icon: <Monitor size={40} className="text-blue-600" />,
    description:
      "Komputer spesifikasi tinggi dengan akses internet untuk pembelajaran dan penelitian digital.",
    image: "/img/Fasilitas/LabKomputer.jpeg",
  },
  {
    name: "Lapangan Olahraga",
    icon: <Trophy size={40} className="text-blue-600" />,
    description:
      "Lapangan luas untuk sepak bola, basket, dan aktivitas atletik lainnya.",
    image: "/img/Fasilitas/Lapangan.jpeg",
  },
];

export const Facilities = () => {
  return (
    <section id="facilities" className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-10">

        {/* --- HEADER CONCEPT SYNCED WITH ABOUT & PRESTASI --- */}
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-[3px] bg-blue-600"></div>
              <span className="text-blue-600 font-black text-sm uppercase tracking-[0.2em]">Sarana Belajar</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase leading-none tracking-tighter">
              FASILITAS <br />
              <span className="text-blue-600">MODERN</span>
            </h2>
          </div>

          <div className="lg:border-l-2 lg:border-blue-100 lg:pl-10">
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl font-medium">
              Menyediakan lingkungan terbaik dengan infrastruktur pendukung yang lengkap untuk menunjang pertumbuhan akademis dan kreativitas siswa.
            </p>
          </div>
        </div>
        {/* --- END HEADER CONCEPT --- */}

        {/* GRID CARDS - TETAP MEMPERTAHANKAN STRUKTUR ASLI ANDA */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              {/* Icon Badge */}
              <div className="absolute right-6 top-56 transform -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg group-hover:shadow-blue-900/10 transition-all duration-300 z-10 border-2 border-blue-50 group-hover:border-blue-100">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {facility.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-8">
                <h3 className="text-xl font-bold text-blue-950 mb-2 group-hover:text-blue-600 transition-colors duration-300 uppercase tracking-tight">
                  {facility.name}
                </h3>

                {/* Divider Line */}
                <div className="w-12 h-1 bg-blue-500 rounded-full mb-4 group-hover:w-full transition-all duration-500"></div>

                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {facility.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};