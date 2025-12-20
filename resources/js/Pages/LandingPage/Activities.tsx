import React from 'react';
import { Microscope, Palette, Music, Dna } from 'lucide-react';

const activities = [
  {
    title: "Pramuka",
    category: "Pembentukan Karakter",
    image: "/img/Ekstrakurikuler/pramuka2.jpeg",
    description: "Mengembangkan kepemimpinan, keterampilan bertahan hidup, dan disiplin melalui kegiatan luar ruangan."
  },
  {
    title: "Drumband",
    category: "Akademik",
    image: "/img/Ekstrakurikuler/drumband.jpeg",
    description: "Menjelajahi keajaiban sains melalui eksperimen dan kompetisi."
  },
  {
    title: "Voli",
    category: "Atletik",
    image: "/img/Ekstrakurikuler/voli.jpeg",
    description: "Berkompetisi dalam turnamen lokal dan regional seperti sepak bola, voli, dan lainnya."
  }
];

export const Activities = () => {
  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center mb-16">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Ekstrakurikuler</h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Selain akademik, kami menawarkan beragam kegiatan ekstrakurikuler untuk membantu siswa menemukan passion mereka.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl h-96 transition-all duration-500 cursor-pointer hover:-translate-y-2"
              style={{ 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' 
              }}
            >
              {/* --- BAGIAN YANG DIUBAH: GRADIENT BLACK --- */}
              <div className="absolute inset-0">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient dirubah ke hitam (from-black/80). 
                   Menghilangkan via-blue agar murni hitam. 
                   Tinggi gradien diatur agar tidak sampai ke atas (to-transparent). 
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              {/* ------------------------------------------ */}

              {/* Content: Tetap mempertahankan warna biru sesuai kode Anda */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                {/* Category Badge - Tetap Biru */}
                <div className="flex justify-start">
                  <span className="inline-block px-4 py-2 bg-blue-500/30 backdrop-blur-md text-white text-xs font-bold rounded-full border border-blue-300/40">
                    {activity.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                    {activity.title}
                  </h3>
                  
                  {/* Description Box - Tetap Biru */}
                  <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500">
                    <p className="text-white text-sm leading-relaxed bg-blue-900/60 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 mt-2">
                      {activity.description}
                    </p>
                  </div>

                  {/* Bottom Line - Tetap Biru */}
                  <div className="mt-4 h-1 w-0 bg-blue-400 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};