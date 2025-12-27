import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { gsap } from 'gsap';
import { Sparkles } from 'lucide-react';

const SlickCustomCSS = () => (
  <style>{`
    .slick-slider { position: relative; display: block; box-sizing: border-box; user-select: none; }
    .slick-list { position: relative; display: block; overflow: hidden; margin: 0; padding: 0; }
    .slick-slide { display: none; float: left; height: 100%; min-height: 1px; }
    .slick-initialized .slick-slide { display: block; }
    
    .slick-dots { position: absolute; bottom: 40px; display: block; width: 100%; padding: 0; list-style: none; text-align: center; z-index: 20; }
    .slick-dots li { position: relative; display: inline-block; width: 10px; height: 10px; margin: 0 6px; cursor: pointer; }
    .slick-dots li button { font-size: 0; display: block; width: 10px; height: 10px; cursor: pointer; border: 0; outline: none; background: rgba(255,255,255,0.3); border-radius: 50%; transition: all 0.4s ease; }
    .slick-dots li.slick-active button { width: 32px; border-radius: 5px; background: white; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    .animate-glow-float { animation: float 6s ease-in-out infinite; }
  `}</style>
);

const slides = [
  { image: "/img/Sekolah/image1.jpeg" },
  { image: "/img/Sekolah/image2.jpeg" },
  { image: "/img/Sekolah/image4.jpeg" }
];

export const Hero = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(".hero-element", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    arrows: false,
  };

  return (
    <section className="relative h-screen w-full bg-slate-900 overflow-hidden flex items-center justify-center">
      <SlickCustomCSS />
      
      {/* Background Slider - Pencahayaan Tipis */}
      <div className="absolute inset-0 z-0">
        <Slider {...settings} className="h-full w-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-screen w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-slate-900/50" /> 
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Konten Utama */}
      <div className="container mx-auto px-6 z-10 relative">
        <div ref={contentRef} className="max-w-5xl mx-auto text-center">
          
          {/* --- BAGIAN YANG DIUBAH: BADGE WARNA BIRU SESUAI KODE ACTIVITIES --- */}
          <div className="hero-element inline-flex items-center gap-3 mb-8 px-5 py-2 bg-blue-500/30 backdrop-blur-md rounded-full border border-blue-300/40">
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.5em]">
              E-Learning Platform
            </span>
          </div>
          {/* ----------------------------------------------------------------- */}
          
          <h1 className="hero-element text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight drop-shadow-lg">
            Integritas Pendidikan dalam <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-300">
              Ekosistem Digital.
            </span>
          </h1>

          <div className="hero-element w-24 h-[4px] mx-auto mb-10 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

          <p className="hero-element text-base md:text-lg lg:text-xl text-white max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-md">
            Membangun masa depan melalui inovasi teknologi yang inklusif, <br className="hidden md:block" /> 
            cerdas, dan tetap menjunjung tinggi nilai-nilai karakter.
          </p>

        </div>
      </div>

      {/* Bagian Bawah Datar */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />

    </section>
  );
};