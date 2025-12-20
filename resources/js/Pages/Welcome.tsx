import React from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/Pages/LandingPage/Navbar';
import { Hero } from '@/Pages/LandingPage/Hero';
import { About } from '@/Pages/LandingPage/About';
import { Achievements } from '@/Pages/LandingPage/Achievements';
import { Facilities } from '@/Pages/LandingPage/Facilities';
import { Activities } from '@/Pages/LandingPage/Activities';
import { Location } from '@/Pages/LandingPage/Location';
import { Footer } from '@/Pages/LandingPage/Footer';

export default function Welcome() {
  return (
    <>
    <Head title="Welcome" />
    <div className="min-h-screen bg-white font-sans w-full overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Achievements />
        <Facilities />
        <Activities />
        <Location />
      </main>
      <Footer />
    </div>
    </>
  );
}