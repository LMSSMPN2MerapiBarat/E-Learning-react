
import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import { gsap } from 'gsap';

// Minimal Slick CSS to avoid import errors with fonts/images
const SlickCSS = () => (
  <style>{`
    .slick-slider { position: relative; display: block; box-sizing: border-box; user-select: none; touch-action: pan-y; -webkit-tap-highlight-color: transparent; }
    .slick-list { position: relative; display: block; overflow: hidden; margin: 0; padding: 0; }
    .slick-list:focus { outline: none; }
    .slick-list.dragging { cursor: pointer; cursor: hand; }
    .slick-slider .slick-track, .slick-slider .slick-list { transform: translate3d(0, 0, 0); }
    .slick-track { position: relative; top: 0; left: 0; display: block; margin-left: auto; margin-right: auto; }
    .slick-track:before, .slick-track:after { display: table; content: ''; }
    .slick-track:after { clear: both; }
    .slick-loading .slick-track { visibility: hidden; }
    .slick-slide { display: none; float: left; height: 100%; min-height: 1px; }
    .slick-slide img { display: block; }
    .slick-slide.slick-loading img { display: none; }
    .slick-slide.dragging img { pointer-events: none; }
    .slick-initialized .slick-slide { display: block; }
    .slick-vertical .slick-slide { display: block; height: auto; border: 1px solid transparent; }
    .slick-arrow.slick-hidden { display: none; }
    
    /* Custom Dots */
    .slick-dots { position: absolute; bottom: 25px; display: block; width: 100%; padding: 0; margin: 0; list-style: none; text-align: center; z-index: 20; }
    .slick-dots li { position: relative; display: inline-block; width: 12px; height: 12px; margin: 0 5px; padding: 0; cursor: pointer; }
    .slick-dots li button { font-size: 0; line-height: 0; display: block; width: 12px; height: 12px; padding: 5px; cursor: pointer; color: transparent; border: 0; outline: none; background: rgba(255,255,255,0.4); border-radius: 50%; transition: all 0.3s ease; }
    .slick-dots li.slick-active button { background: white; transform: scale(1.2); }
  `}</style>
);

const slides = [
  {
    image: "https://images.unsplash.com/photo-1764943630631-b63aadf86e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NTY1MjM0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Selamat Datang di SMP Negeri 2 Merapi Barat",
    subtitle: "Membentuk Masa Depan dengan Ilmu dan Integritas"
  },
  {
    image: "https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGluJTIwY2xhc3Nyb29tJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzY1NjUyMzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Keunggulan dalam Pendidikan",
    subtitle: "Menciptakan Lingkungan Belajar yang Mendukung"
  },
  {
    image: "https://images.unsplash.com/flagged/photo-1574305679704-747181205b5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwZXh0cmFjdXJyaWN1bGFyJTIwYWN0aXZpdGllc3xlbnwxfHx8fDE3NjU2NTIzNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Pengembangan Holistik",
    subtitle: "Mengembangkan Bakat di Luar Kelas"
  }
];

export const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    )
      .fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.5"
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
    <section className="relative w-full h-screen overflow-hidden">
      <SlickCSS />
      <Slider {...settings} className="w-full h-full">
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-screen relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Blue Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/40" />
          </div>
        ))}
      </Slider>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 pointer-events-none">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg"
        >
          SMP Negeri 2 Merapi Barat
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-gray-100 font-light max-w-2xl drop-shadow-md"
        >
          Membangun karakter, membina kecerdasan, dan mempersiapkan siswa untuk masa depan yang cerah.
        </p>
      </div>


    </section>
  );
};
