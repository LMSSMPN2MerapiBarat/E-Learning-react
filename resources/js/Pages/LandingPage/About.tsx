import React from 'react';
import { Target, BookOpen } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section - Centered */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Tentang Sekolah Kami
          </h2>
          <div
            className="w-20 h-1 bg-blue-600 mx-auto rounded-full"
          ></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Kolom Kiri: Deskripsi Sekolah */}
          <div className="space-y-6">
            {/* Description Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-5">
                SMP Negeri 2 Merapi Barat berdedikasi untuk menyediakan pendidikan berkualitas tinggi yang memberdayakan siswa untuk mencapai potensi penuh mereka.
              </p>
              <p className="text-gray-700 leading-relaxed mb-5">
                Didirikan dengan komitmen terhadap keunggulan akademik dan pembangunan karakter, sekolah kami menciptakan lingkungan di mana siswa dapat berkembang secara intelektual, sosial, dan emosional.
              </p>
              <p className="text-gray-700 leading-relaxed mb-0">
                Kami percaya dalam membina komunitas pembelajar yang penuh rasa ingin tahu, hormat, dan menjadi warga negara yang bertanggung jawab siap berkontribusi kepada masyarakat.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              {/* Siswa Aktif */}
              <div className="group relative bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-blue-500/20">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-100 text-xs font-medium uppercase tracking-wider">Siswa Aktif</div>
              </div>

              {/* Guru Ahli */}
              <div className="group relative bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-blue-500/20">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-blue-100 text-xs font-medium uppercase tracking-wider">Guru Ahli</div>
              </div>

              {/* Tahun Berdiri */}
              <div className="group relative bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-blue-500/20">
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-blue-100 text-xs font-medium uppercase tracking-wider">Tahun Berdiri</div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Visi dan Misi */}
          <div className="space-y-6">

            {/* Kartu Visi Kami */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-md">
                  <Target size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    Visi Kami
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Menjadi lembaga pendidikan terkemuka yang menghasilkan lulusan yang beriman, cerdas, dan kompetitif dengan karakter moral yang kuat.
                  </p>
                </div>
              </div>
            </div>

            {/* Kartu Misi Kami */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-md">
                  <BookOpen size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">
                    Misi Kami
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="leading-relaxed">Menumbuhkan nilai-nilai religius dan karakter mulia.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="leading-relaxed">Menerapkan pembelajaran yang aktif, kreatif, dan efektif.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="leading-relaxed">Mengembangkan potensi siswa dalam sains dan teknologi.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                      <span className="leading-relaxed">Membudayakan lingkungan sekolah yang bersih, sehat, dan hijau.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};