import React, { useState, useEffect, useRef } from 'react';
import { Target, BookOpen, Users, Award, ShieldCheck } from 'lucide-react';

// --- 1. DEFINISI TIPE DATA (Untuk Menghilangkan Error TypeScript) ---
interface CounterProps {
  end: string | number;
  duration?: number;
}

interface StatItem {
  label: string;
  val: string;
  icon: React.ReactNode;
}

// --- 2. KOMPONEN ANIMASI PERHITUNGAN ANGKA ---
const Counter: React.FC<CounterProps> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState<number>(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    const currentRef = countRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const stringEnd = end ? end.toString() : "0";
    const endValue = parseInt(stringEnd.replace(/\D/g, "")) || 0;
    
    if (endValue === 0) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * endValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={countRef}>
      {count}{end?.toString().includes('+') ? '+' : ''}
    </span>
  );
};

// --- 3. KOMPONEN UTAMA ABOUT ---
export const About: React.FC = () => {
  const stats: StatItem[] = [
    { label: "Siswa Aktif", val: "500+", icon: <Users size={20} /> },
    { label: "Guru Ahli", val: "50+", icon: <Award size={20} /> },
    { label: "Akreditasi", val: "A", icon: <ShieldCheck size={20} /> }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Grid Utama: lg:grid-cols-2 & gap-10 agar sinkron dengan referensi Anda */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          
          {/* KOLOM KIRI: Deskripsi & Stats */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-[3px] bg-blue-600"></div>
                <span className="text-blue-600 font-black text-sm uppercase tracking-[0.2em]">Profil Sekolah</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase leading-none tracking-tighter">
                SMP Negeri <span className="text-blue-600">2</span> <br />
                Merapi Barat
              </h2>

              <div className="space-y-5 text-slate-600 text-lg leading-relaxed">
                <p>
                  SMP Negeri 2 Merapi Barat berdedikasi untuk menyediakan pendidikan berkualitas tinggi yang memberdayakan siswa untuk mencapai potensi penuh mereka.
                </p>
                <p className="font-medium text-slate-700">
                  Kami membangun lingkungan di mana siswa berkembang secara intelektual, sosial, dan emosional melalui komitmen pada keunggulan akademik.
                </p>
              </div>
            </div>

            {/* Stats Cards - Semi-White Aesthetic dengan Animasi Perhitungan */}
            <div className="grid grid-cols-3 gap-4 mt-auto">
              {stats.map((item, i) => (
                <div key={i} className="bg-slate-50/80 border border-slate-100 p-5 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 group text-center">
                  <div className="text-blue-600/70 mb-2 flex justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-black text-blue-950 tracking-tight">
                    {/* Logika: Jika ada angka, jalankan animasi. Jika tidak (seperti Akreditasi A), tampilkan biasa */}
                    {/\d/.test(item.val) ? <Counter end={item.val} /> : item.val}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOLOM KANAN: Visi & Misi - Unified & Balanced Height */}
          <div className="flex flex-col gap-6">
            
            {/* Kartu Visi Kami */}
            <div className="flex-1 bg-slate-50/80 p-8 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-600 hover:shadow-xl hover:bg-white transition-all duration-300 group flex flex-col justify-center">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-md group-hover:rotate-6 transition-transform">
                  <Target size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight mb-2">
                    Visi Kami
                  </h3>
                  <p className="text-slate-700 leading-relaxed font-bold italic text-lg">
                    "Menjadi lembaga pendidikan terkemuka yang menghasilkan lulusan yang beriman, cerdas, dan kompetitif dengan karakter moral yang kuat."
                  </p>
                </div>
              </div>
            </div>

            {/* Kartu Misi Kami */}
            <div className="flex-1 bg-slate-50/80 p-8 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-600 hover:shadow-xl hover:bg-white transition-all duration-300 group flex flex-col justify-center">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-md group-hover:rotate-6 transition-transform">
                  <BookOpen size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-blue-950 uppercase tracking-tight mb-4">
                    Misi Kami
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Menumbuhkan nilai-nilai religius dan karakter mulia.",
                      "Menerapkan pembelajaran yang aktif dan efektif.",
                      "Mengembangkan potensi sains dan teknologi.",
                      "Membudayakan lingkungan bersih dan sehat."
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 group/item">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-blue-600 rounded-full group-hover/item:scale-150 transition-transform"></span>
                        <span className="leading-tight font-bold text-sm md:text-base group-hover/item:text-blue-600 transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
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

export default About;