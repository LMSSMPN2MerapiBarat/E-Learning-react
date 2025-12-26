import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Navbar } from '@/Pages/LandingPage/Navbar';
import { Hero } from '@/Pages/LandingPage/Hero';
import { About } from '@/Pages/LandingPage/About';
import { Achievements } from '@/Pages/LandingPage/Achievements';
import { Facilities } from '@/Pages/LandingPage/Facilities';
import { Activities } from '@/Pages/LandingPage/Activities'
import { Footer } from '@/Pages/LandingPage/Footer';

interface WelcomeProps {
  totalSiswa: number;
  totalGuru: number;
}

export default function Welcome({ totalSiswa, totalGuru }: WelcomeProps) {
  return (
    <>
      <Head title="Welcome" />
      <div className="min-h-screen bg-white font-sans w-full overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <About totalSiswa={totalSiswa} totalGuru={totalGuru} />
          <Achievements />
          <Facilities />
          <Activities />
        </main>
        <Footer />
      </div>
    </>
  );
}