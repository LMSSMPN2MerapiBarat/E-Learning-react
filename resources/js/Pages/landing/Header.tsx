// src/components/landing/Header.tsx
import { Button } from '@/Components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onLogin: () => void;
}

export default function Header({ onLogin }: HeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-md">
      {/* PERUBAHAN DI SINI:
          1. Menghapus class 'container'.
          2. Mengganti max-w-7xl dengan max-w-screen-2xl (lebih lebar).
          3. Menggunakan padding horizontal yang lebih kecil (lg:px-16) untuk mendekatkan konten ke tepi.
      */}
      <div className="mx-auto px-4 py-4 flex items-center justify-between max-w-screen-2xl lg:px-16">
        <div className="flex items-center gap-3">
          {/* Warna Aksen Logo (Biru) - Konsisten */}
          <div className="bg-blue-600 p-2 rounded-lg"> 
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduLearn</h1>
            <p className="text-xs text-gray-500 leading-none">E-LEARNING PLATFORM</p>
          </div>
        </div>
        
        {/* Navigasi Modern */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium">
          {['Beranda', 'Fitur', 'Visi & Misi', 'Tentang', 'E-Learning'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s/g, '-')}`} 
              className="text-gray-600 hover:text-blue-600 transition duration-300 relative group"
            >
              {item}
              <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>

        {/* Tombol CTA */}
        {/* Menggunakan prop onLogin, tetapi mempertahankan window.location.href */}
        <Button onClick={() => window.location.href = '/login'}>
          Masuk
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </header>
  );
}