import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3"> 
            <h3 className="text-2xl font-bold">SMPN 2 Merapi Barat</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Mendidik generasi berikutnya dengan integritas, pengetahuan, dan iman. Menciptakan masa depan yang lebih baik bagi komunitas dan bangsa.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Hubungi Kami</h4> 
            <ul className="space-y-3"> 
              <li className="flex items-start gap-3 text-blue-200 text-sm"> 
                <MapPin size={18} className="mt-0.5 flex-shrink-0" /> 
                <span>Jl. Raya Merapi Barat, South Sumatra, Indonesia</span>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm"> 
                <Phone size={18} /> 
                <span>(0711) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm"> 
                <Mail size={18} /> 
                <span>info@smpn2merapibarat.sch.id</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Tautan Cepat</h4> 
            <ul className="space-y-2"> 
              <li><a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">Beranda</a></li> 
              <li><a href="#about" className="text-blue-200 hover:text-white transition-colors text-sm">Tentang Kami</a></li> 
              <li><a href="#facilities" className="text-blue-200 hover:text-white transition-colors text-sm">Fasilitas</a></li> 
              <li><a href="#activities" className="text-blue-200 hover:text-white transition-colors text-sm">Kegiatan</a></li>
              <li><a href="#contact" className="text-blue-200 hover:text-white transition-colors text-sm">Kontak</a></li> 
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Ikuti Kami</h4> 
            <div className="flex gap-3"> 
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"> 
                <Facebook size={18} /> 
              </a>
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"> 
                <Instagram size={18} /> 
              </a>
              <a href="#" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition-colors"> 
                <Youtube size={18} /> 
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bawah */}
        <div className="border-t border-blue-800 pt-5 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-300 text-xs"> 
          <p>© 2025 SMP Negeri 2 Merapi Barat. All rights reserved.</p>
          <div className="flex gap-4 text-sm"> 
            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white">Syarat Layanan</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};