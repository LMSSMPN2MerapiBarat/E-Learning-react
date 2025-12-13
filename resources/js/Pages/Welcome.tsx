import React from 'react';
import { Navbar } from '@/Pages/LandingPage/Navbar';
import { Hero } from '@/Pages/LandingPage/Hero';
import { About } from '@/Pages/LandingPage/About';
import { Facilities } from '@/Pages/LandingPage/Facilities';
import { Activities } from '@/Pages/LandingPage/Activities';
import { Location } from '@/Pages/LandingPage/Location';
import { Footer } from '@/Pages/LandingPage/Footer';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white font-sans w-full overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Facilities />
        <Activities />
        <Location />
      </main>
      <Footer />
    </div>
  );
}