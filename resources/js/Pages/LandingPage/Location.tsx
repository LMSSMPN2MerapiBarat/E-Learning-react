
import React from 'react';
import { MapPin, ExternalLink, Phone, MailQuestion, Clock, Mail } from 'lucide-react';

export const Location = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Lokasi & Kontak</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">
            Temukan kami di lokasi strategis di Merapi Barat
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Map Container - Full Width dengan Overlay Info */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[600px] border-4 border-white">
            {/* Google Maps */}
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

            {/* Floating Contact Card - Bottom Right */}
            <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-blue-900">SMP Negeri 2</h3>
                  <p className="text-gray-600 text-sm">Merapi Barat</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Jalan Raya Merapi Barat No. 12<br />
                      Sumatera Selatan, Indonesia
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm">+62 812-3456-7890</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm">info@smpn2merapibarat.sch.id</p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm">Senin - Jumat: 07.00 - 15.00 WIB</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="https://maps.app.goo.gl/fgHJ94HsoYkT5tGn7"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl w-full"
              >
                Buka di Google Maps
                <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Feature Cards Below Map */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin size={28} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-2">Lokasi Strategis</h4>
              <p className="text-gray-600 text-sm">Mudah diakses dari berbagai area di Merapi Barat</p>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone size={28} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-2">Respon Cepat</h4>
              <p className="text-gray-600 text-sm">Hubungi kami untuk informasi dan pertanyaan</p>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail size={28} className="text-white" />
              </div>
              <h4 className="text-xl font-bold text-blue-900 mb-2">Layanan Email</h4>
              <p className="text-gray-600 text-sm">Balasan dalam 1x24 jam kerja</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
