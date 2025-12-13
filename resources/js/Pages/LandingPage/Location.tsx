
import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

export const Location = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Lokasi & Kontak Sekolah</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">
            Kunjungi kami di kampus kami di Merapi Barat.
          </p>
        </div>

        <div
          className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
          data-aos="zoom-in"
        >
          <div className="grid md:grid-cols-3">
            {/* Contact Info Side */}
            <div className="p-8 md:p-10 bg-blue-50 flex flex-col justify-center">
              <div className="mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
                  <MapPin size={24} />
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Alamat Kami</h3>
                <p className="text-gray-700 leading-relaxed">
                  SMP Negeri 2 Merapi Barat<br />
                  Jalan Raya Merapi Barat No. 12<br />
                  Sumatera Selatan, Indonesia
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/fgHJ94HsoYkT5tGn7"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Lihat di Google Maps
                <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Map Side */}
            <div className="md:col-span-2 h-[400px] md:h-auto relative bg-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.159425671732!2d103.60161407315428!3d-3.775468696198392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e39fce9b4f26bbd%3A0x8847fd7c8e7f2c61!2sSMPN%202%20Merapi%20West!5e0!3m2!1sen!2sid!4v1765652189527!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
                title="SMP Negeri 2 Merapi Barat Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
