import React from 'react';
import { Monitor, FlaskConical, Book, Trophy, Users } from 'lucide-react';

const facilities = [
  {
    name: "Ruang Kelas Modern",
    icon: <Users size={40} className="text-blue-600" />,
    description: "Ruang kelas yang luas dan berventilasi baik dengan peralatan pembelajaran multimedia.",
    image: "https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGluJTIwY2xhc3Nyb29tJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzY1NjUyMzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Laboratorium Sains",
    icon: <FlaskConical size={40} className="text-blue-600" />,
    description: "Laboratorium lengkap untuk praktikum Fisika, Kimia, dan Biologi.",
    image: "https://images.unsplash.com/photo-1636386689060-37d233b5d345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzY2hvb2wlMjBzY2llbmNlJTIwbGFib3JhdG9yeXxlbnwxfHx8fDE3NjU2MDc3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Laboratorium Komputer",
    icon: <Monitor size={40} className="text-blue-600" />,
    description: "Komputer spesifikasi tinggi dengan akses internet untuk pembelajaran dan penelitian digital.",
    image: "https://images.unsplash.com/photo-1719159381981-1327b22aff9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzY2hvb2wlMjBjb21wdXRlciUyMGxhYnxlbnwxfHx8fDE3NjU1NjE0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Perpustakaan Sekolah",
    icon: <Book size={40} className="text-blue-600" />,
    description: "Ruang tenang dengan koleksi buku yang luas dan sumber daya digital.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1080"
  },
  {
    name: "Lapangan Olahraga",
    icon: <Trophy size={40} className="text-blue-600" />,
    description: "Lapangan luas untuk sepak bola, basket, dan aktivitas atletik lainnya.",
    image: "https://images.unsplash.com/photo-1649182462992-ea644b7f8155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzcG9ydHMlMjBmaWVsZHxlbnwxfHx8fDE3NjU1NjE0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

export const Facilities = () => {
  return (
    <section id="facilities" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Fasilitas Kami</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Menyediakan lingkungan terbaik untuk pertumbuhan akademis dan pribadi.
          </p>
        </div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-50">
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Icon Badge - Positioned between image and content (right side) */}
              <div className="absolute right-6 top-56 transform -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300 z-10 border-2 border-blue-100">
                {facility.icon}
              </div>

              {/* Content */}
              <div className="p-6 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  {facility.name}
                </h3>
                
                {/* Divider Line */}
                <div className="w-12 h-1 bg-blue-500 rounded-full mb-3 group-hover:w-16 transition-all duration-300"></div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
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