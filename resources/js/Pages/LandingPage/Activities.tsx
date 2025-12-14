
import React from 'react';
import { Microscope, Palette, Music, Dna } from 'lucide-react';

const activities = [
  {
    title: "Pramuka",
    category: "Pembentukan Karakter",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1080",
    description: "Mengembangkan kepemimpinan, keterampilan bertahan hidup, dan disiplin melalui kegiatan luar ruangan."
  },
  {
    title: "Klub Sains",
    category: "Akademik",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1080",
    description: "Menjelajahi keajaiban sains melalui eksperimen dan kompetisi."
  },
  {
    title: "Seni & Budaya",
    category: "Kreatif",
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=1080",
    description: "Mengekspresikan kreativitas melalui tarian tradisional, musik, dan seni visual."
  },
  {
    title: "Tim Olahraga",
    category: "Atletik",
    image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=1080",
    description: "Berkompetisi dalam turnamen lokal dan regional seperti sepak bola, voli, dan lainnya."
  }
];

export const Activities = () => {
  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12" data-aos="fade-in">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Kehidupan Siswa</h2>
            <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-xl">
              Selain akademik, kami menawarkan beragam kegiatan ekstrakurikuler untuk membantu siswa menemukan passion mereka.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl h-80 shadow-lg cursor-pointer"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full w-fit mb-2">
                  {activity.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{activity.title}</h3>
                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
