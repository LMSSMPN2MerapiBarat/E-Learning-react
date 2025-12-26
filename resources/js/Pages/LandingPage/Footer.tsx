import React from 'react';
import { Mail, Phone, MapPin, ArrowRight, Clock } from 'lucide-react';

export const Footer = () => {
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
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
};