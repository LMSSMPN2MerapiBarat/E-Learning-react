import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, Clock } from 'lucide-react';

export const Footer = () => {
<<<<<<< HEAD
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
=======
  const lat = -3.775410868995171;
  const lng = 103.60419528934982;
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=id&z=17&output=embed`;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'hero' || id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="footer" className="bg-[#0A2647] text-white pt-12 pb-5 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid lg:grid-cols-12 gap-x-8 gap-y-8 mb-8">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col">
              <h3 className="text-xl font-black tracking-tighter uppercase leading-none">
                SMPN <span className="text-blue-400">2</span> <br />
                <span className="text-base text-blue-50 uppercase tracking-tight">Merapi Barat</span>
              </h3>
              <div className="w-12 h-1 bg-blue-400 mt-3 rounded-full"></div>
            </div>
            <p className="text-blue-100/80 text-[13px] leading-relaxed max-w-xs font-medium">
              Mewujudkan generasi unggul yang berintegritas dan berwawasan global melalui pendidikan berkualitas di Merapi Barat.
            </p>
            <div className="flex items-center gap-2.5 text-blue-100 bg-white/5 w-fit px-3 py-1.5 rounded-lg border border-white/10">
              <Clock size={14} className="text-blue-300" />
              <span className="text-[10px] font-bold tracking-wide uppercase">Senin - Jumat: 07:00 - 15:00</span>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col justify-between py-1">
            <div className="mb-6">
              <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-blue-300 mb-4">Navigasi</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { name: 'Beranda', id: 'hero' },
                  { name: 'Tentang', id: 'about' },
                  { name: 'Prestasi', id: 'achievements' },
                  { name: 'Fasilitas', id: 'facilities' },
                  { name: 'Kegiatan', id: 'activities' },
                  { name: 'Kontak', id: 'footer' }
                ].map((item) => (
                  <li key={item.name}>
                    <a 
                      href={`#${item.id}`} 
                      onClick={(e) => handleScroll(e, item.id)}
                      className="text-blue-100/70 hover:text-white text-[12px] font-medium transition-all flex items-center gap-1 group"
                    >
                      <ArrowRight size={10} className="text-blue-300 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2.5">
              <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-blue-300 mb-3">Kontak</h4>
              <a href="tel:07111234567" className="flex items-center gap-3 text-blue-100/80 text-[12px] font-medium group hover:text-white transition-colors">
                <Phone size={14} className="text-blue-300" />
                <span>(0711) 123-4567</span>
              </a>
              <a href="mailto:info@smpn2merapi.sch.id" className="flex items-center gap-3 text-blue-100/80 text-[12px] font-medium group hover:text-white transition-colors">
                <Mail size={14} className="text-blue-300" />
                <span className="truncate">info@smpn2merapi.sch.id</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-44 lg:h-full min-h-[180px] rounded-2xl overflow-hidden border border-white/10 group shadow-xl">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className="absolute inset-0 grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                title="Lokasi"
              ></iframe>
              <div className="absolute bottom-2 left-2 right-2 bg-[#0A2647]/90 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                <div className="flex gap-2.5 items-center">
                  <MapPin className="text-blue-400 shrink-0" size={14} />
                  <p className="text-[10px] text-blue-50 leading-tight font-bold uppercase tracking-tight">
                    Karang Endah, Merapi Barat, Lahat, <br /> Sumatera Selatan 31419
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-blue-200/50 text-[10px] font-bold tracking-widest uppercase">
            © 2025 SMP NEGERI 2 MERAPI BARAT
          </p>
          <div className="flex gap-6">
            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className="text-blue-200/50 hover:text-white text-[9px] font-black uppercase tracking-[0.1em] transition-colors"
            >
              Back to Top
            </button>
            <a href="#" className="text-blue-200/50 hover:text-white text-[9px] font-black uppercase tracking-[0.1em] transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
>>>>>>> 5dfa3ea843f4243b3a1ba7df2a70a2f3eae67869
};