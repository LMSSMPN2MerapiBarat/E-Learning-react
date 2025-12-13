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
    { name: 'Beranda', href: '#' },
    { name: 'Tentang', href: '#about' },
    { name: 'Fasilitas', href: '#facilities' },
    { name: 'Kegiatan', href: '#activities' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* <img src="/img/LogoSekolah.png" alt="Logo SMPN 2 Merapi Barat" className="h-16 w-16 md:h-20 md:w-20 object-contain" /> */}
            <div className={`font-bold text-xl md:text-2xl ${scrolled ? 'text-blue-900' : 'text-white'}`}>
              SMPN 2 Merapi Barat
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors hover:text-blue-400 ${scrolled ? 'text-gray-700' : 'text-white/90'}`}
              >
                {link.name}
              </a>
            ))}

            {/* Auth Button */}
            {auth.user ? (
              <Link
                href="/dashboard"
                className={`px-5 py-2 rounded-full font-medium transition-colors ${scrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-900 hover:bg-blue-50'
                  }`}
              >
                Dasbor
              </Link>
            ) : (
              <Link
                href="/login"
                className={`px-5 py-2 rounded-full font-medium transition-colors ${scrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-900 hover:bg-blue-50'
                  }`}
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={scrolled ? 'text-gray-800' : 'text-white'} />
            ) : (
              <Menu className={scrolled ? 'text-gray-800' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-800 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 border-t border-gray-100">
              {auth.user ? (
                <Link
                  href="/dashboard"
                  className="block w-full text-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dasbor
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
