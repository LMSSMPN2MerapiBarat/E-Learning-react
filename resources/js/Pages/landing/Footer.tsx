import { GraduationCap, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  const menuItems = [
    { title: 'Menu', links: ['Beranda', 'Fitur', 'Visi & Misi', 'Tentang Sekolah', 'E-Learning'] },
    { title: 'Bantuan', links: ['FAQ', 'Panduan Pengguna', 'Kebijakan Privasi', 'Syarat & Ketentuan', 'Hubungi Kami'] },
    // Menghapus 'Hubungi Kami' dari kolom menu untuk menjadikannya kolom terpisah
  ];

  const contactInfo = [
    { icon: MapPin, text: 'Jl. Pendidikan No. 123, Jakarta Selatan 12345' },
    { icon: Phone, text: '(021) 123-4567' },
    { icon: Mail, text: 'info@edulearn.id' },
  ];

  const socialIcons = [
    { icon: Facebook, link: '#' },
    { icon: Instagram, link: '#' },
    { icon: Twitter, link: '#' },
    { icon: Youtube, link: '#' },
  ];

  return (
    // Mengurangi padding vertikal (py-12 md:py-16) menjadi py-8 md:py-12
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      {/* PERUBAHAN DI SINI:
          1. Menghapus class 'container'.
          2. Mengganti max-w-7xl dengan max-w-screen-2xl (lebih lebar).
          3. Menggunakan padding horizontal yang lebih kecil (lg:px-16) untuk mendekatkan konten ke tepi.
      */}
      <div className="mx-auto px-4 lg:px-16 max-w-screen-2xl">
        {/* Mengubah grid menjadi 4 kolom (2 Logo/Deskripsi + 2 Menu + 1 Kontak) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-8 mb-6">
          
          {/* 1. Logo & Deskripsi (Colspan 2) */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg"> 
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold">EduLearn</h4> {/* Ukuran font logo lebih kecil */}
                <p className="text-xs text-gray-400 leading-none">E-LEARNING PLATFORM</p>
              </div>
            </div>
            {/* Deskripsi lebih ringkas, margin bawah dikurangi */}
            <p className="text-gray-400 text-sm mb-4 max-w-sm">
              Platform e-learning terpercaya untuk pendidikan berkualitas. Belajar kapan saja, di mana saja dengan pengajar profesional.
            </p>
            {/* Tautan Sosial Media */}
            <div className="flex gap-3">
              {socialIcons.map((item, index) => (
                <a key={index} href={item.link} className="text-gray-400 hover:text-blue-500 transition border border-gray-700 p-2 rounded-full">
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Menu & Bantuan (Masing-masing 1 Kolom) */}
          {menuItems.map((col) => (
            <div key={col.title} className="md:col-span-1">
              <h5 className="font-bold text-base mb-4 text-white uppercase">{col.title}</h5> {/* Font lebih kecil, warna putih */}
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link}><a href={`#${link.toLowerCase().replace(/\s/g, '-')}`} className="text-gray-400 hover:text-white transition">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          {/* 3. Hubungi Kami (Kolom Terpisah) */}
          <div className="col-span-2 md:col-span-1">
            <h5 className="font-bold text-base mb-4 text-white uppercase">Hubungi Kami</h5>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-400">
                  <item.icon className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        {/* Margin atas dan bawah dikurangi */}
        <div className="text-center pt-2">
          <p className="text-gray-500 text-xs">
            © 2025 EduLearn E-LEARNING PLATFORM. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>
    </footer>
  );
}