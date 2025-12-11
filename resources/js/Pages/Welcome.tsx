// Import komponen-komponen terpisah
import Header from '@/Pages/landing/Header';
import HeroSection from '@/Pages/landing/HeroSection';
import FeaturesSection from '@/Pages/landing/FeaturesSection';
import VisiMisiSection from '@/Pages/landing/VisiMisiSection';
import TentangSection from '@/Pages/landing/TentangSection';
import CaraKerjaSection from '@/Pages/landing/CaraKerjaSection';
import CTASection from '@/Pages/landing/CTASection';
import Footer from '@/Pages/landing/Footer';

// Asumsi fungsi ini dilewatkan dari router atau konteks aplikasi Anda
interface WelcomeProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export default function Welcome({ onLogin, onGetStarted }: WelcomeProps) {
  return (
    // Memastikan warna latar belakang putih
    <div className="min-h-screen bg-white font-sans">
      {/* Header tidak menggunakan max-w-7xl karena dia harus full width */}
      <Header onLogin={onLogin} />

      <main>
        {/*
          Semua komponen di bawah harus di-update di file masing-masing 
          untuk menggunakan wrapper container yang konsisten.
        */}
        <HeroSection onGetStarted={onGetStarted} />
        <FeaturesSection />
        <VisiMisiSection />
        <TentangSection />
        <CaraKerjaSection />
        <CTASection onGetStarted={onLogin} />
      </main>

      <Footer />
    </div>
  );
}
// Anda mungkin perlu mengekspor fungsi default jika file ini adalah file utama
// const App = () => <Welcome onLogin={() => console.log('Login')} onGetStarted={() => console.log('Get Started')} />;
// export default App;