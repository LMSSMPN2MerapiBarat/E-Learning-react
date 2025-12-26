import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export const Navbar = () => {
  const { auth } = usePage().props as any;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#' }, // Link ke atas
    { name: 'Tentang', href: '#about' },
    { name: 'Prestasi', href: '#achievements' },
    { name: 'Fasilitas', href: '#facilities' },
    { name: 'Kegiatan', href: '#activities' },
    { name: 'Kontak', href: '#footer' }, // DISINKRONKAN ke id="footer"
  ];

  // Fungsi navigasi universal
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href === '#') {
      // Ke Beranda / Atas
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Ke Section Spesifik
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/90 backdrop-blur-md shadow-sm py-3'
        : 'bg-transparent py-5'
      }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">

          {/* LOGO SECTION (Beranda) */}
          <div
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/img/LogoSekolah.png" alt="Logo" className="h-10 w-10 object-contain group-hover:scale-110 transition-transform" />
            <div className="flex flex-col justify-center leading-none">
              <div className={`font-black text-lg md:text-xl transition-colors ${scrolled ? 'text-blue-950' : 'text-white'}`}>
                SMPN <span className={scrolled ? 'text-blue-600' : 'text-blue-400'}>2</span>
              </div>
              <div className={`font-bold tracking-[0.3em] text-[9px] uppercase transition-colors ${scrolled ? 'text-slate-500' : 'text-blue-200/80'}`}>
                Merapi Barat
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3 py-2 text-sm font-bold transition-all group ${scrolled ? 'text-slate-700' : 'text-white/90'
                    }`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </a>
              ))}
            </div>

            <Link
              href={auth.user ? "/dashboard" : "/login"}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-900 hover:bg-blue-50'
                }`}
            >
              {auth.user ? "Dasbor" : "Masuk"}
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className={scrolled ? 'text-blue-900' : 'text-white'} /> : <Menu className={scrolled ? 'text-blue-900' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-4 px-4 flex flex-col space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-800 hover:bg-blue-50 px-4 py-3 rounded-xl font-bold text-sm"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};