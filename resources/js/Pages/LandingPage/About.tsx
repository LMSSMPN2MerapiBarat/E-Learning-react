
import React from 'react';
import { Target, BookOpen } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">Tentang Sekolah Kami</h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              SMP Negeri 2 Merapi Barat berdedikasi untuk menyediakan pendidikan berkualitas tinggi yang memberdayakan siswa untuk mencapai potensi penuh mereka.
              Didirikan dengan komitmen terhadap keunggulan akademik dan pembangunan karakter, sekolah kami menciptakan lingkungan di mana siswa dapat berkembang
              secara intelektual, sosial, dan emosional.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Kami percaya dalam membina komunitas pembelajar yang penuh rasa ingin tahu, hormat, dan menjadi warga negara yang bertanggung jawab siap berkontribusi kepada masyarakat.
            </p>
          </div>

          <div className="grid gap-6">
            <div data-aos="fade-left" data-aos-delay="100" className="bg-blue-50 p-8 rounded-2xl border-l-4 border-blue-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-3 rounded-full text-white">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Visi Kami</h3>
                  <p className="text-gray-700">
                    Mewujudkan peserta didik yang Bertaqwa, Kreatif, Bergotong-royong dan Berwawasan Lingkungan.
                  </p>
                </div>
              </div>
            </div>

            <div data-aos="fade-left" data-aos-delay="200" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-3 rounded-full text-white">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Misi Kami</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Mewujudkan siswa yang sadar dalam melaksanakan ibadah sesuai dengan keyakinannya.</li>
                    <li>Menumbuhkan rasa hormat terhadap orang tua, guru dan sesama siswa dan menghindari perundungan.</li>
                    <li>Mengembangkan pembelajaran yang aktif, kreatif & inovatif dengan memanfaatkan lingkungan sekitar sehingga mampu meningkatkan potensi secara optimal.</li>
                    <li>Menumbuhkan kesadaran dan rasa cinta memiliki sekolah sebagai bagian dari kehidupan.</li>
                    <li>Membangun kehidupan sekolah yang bersih dan rindang.</li>
                    <li>Membangun kesadaran warga sekolah akan kebersihan lingkungan belajar.</li>
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
