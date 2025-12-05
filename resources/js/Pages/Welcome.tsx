import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { GraduationCap, BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/Components/figma/ImageWithFallback';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: BookOpen,
      title: 'Akses Materi 24/7',
      description: 'Akses materi pembelajaran kapan saja dan di mana saja tanpa batasan waktu',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Pembelajaran Interaktif',
      description: 'Kuis dan diskusi untuk meningkatkan pemahaman siswa',
      color: 'bg-green-500'
    },
    {
      icon: Award,
      title: 'Monitoring Progress',
      description: 'Pantau perkembangan belajar dengan sistem tracking yang komprehensif',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="bg-blue-600 p-2 rounded-lg">
        <GraduationCap className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-lg font-semibold">E-Learning SMPN 2 Merapi Barat</h1>
      </div>
    </div>
    <Button onClick={() => window.location.href = '/login'}>
      Login
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </div>
    </header>


      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
              Sistem Pembelajaran Digital
            </div>
            <h1 className="text-4xl md:text-5xl">
              Belajar Lebih Mudah dengan E-Learning
            </h1>
            <p className="text-lg text-gray-600">
              Platform pembelajaran digital untuk SMP Negeri 2 Merapi Barat yang memudahkan akses materi pembelajaran, kuis interaktif, dan monitoring perkembangan belajar siswa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={onGetStarted}>
                Mulai Belajar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Pelajari Lebih Lanjut
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div>
                <p className="text-3xl text-blue-600">342+</p>
                <p className="text-sm text-gray-600">Siswa Aktif</p>
              </div>
              <div>
                <p className="text-3xl text-blue-600">28+</p>
                <p className="text-sm text-gray-600">Guru</p>
              </div>
              <div>
                <p className="text-3xl text-blue-600">156+</p>
                <p className="text-sm text-gray-600">Materi</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1540151812223-c30b3fab58e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzdHVkZW50cyUyMGxlYXJuaW5nfGVufDF8fHx8MTc2MTMxNjc5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Students Learning"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Fitur Unggulan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistem e-learning yang dirancang khusus untuk mendukung pembelajaran mandiri dan meningkatkan efektivitas belajar mengajar
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTI2ODIwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Education Technology"
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl">Tentang Sistem E-Learning</h2>
            <p className="text-gray-600 text-lg">
              Sistem e-learning ini dikembangkan sebagai solusi untuk mengatasi keterbatasan akses materi pembelajaran di luar jam sekolah dan mengoptimalkan penggunaan laboratorium komputer.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg mt-1">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="mb-1">Manajemen Materi Pembelajaran</h3>
                  <p className="text-gray-600">Guru dapat mengunggah dan mengelola materi pembelajaran secara online</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg mt-1">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-1">Tiga Role Pengguna</h3>
                  <p className="text-gray-600">Admin, Guru, dan Siswa dengan fitur yang disesuaikan kebutuhan masing-masing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg mt-1">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="mb-1">Kuis Interaktif</h3>
                  <p className="text-gray-600">Evaluasi pembelajaran dengan kuis online yang interaktif dan otomatis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl mb-4 text-white">Siap Memulai Pembelajaran Digital?</h2>
            <p className="text-lg mb-8 text-blue-50 max-w-2xl mx-auto">
              Bergabunglah dengan sistem e-learning SMP Negeri 2 Merapi Barat dan nikmati pengalaman belajar yang lebih fleksibel dan efektif
            </p>
            <Button size="lg" variant="secondary" onClick={onGetStarted}>
              Login Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span>SMP Negeri 2 Merapi Barat</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 E-Learning SMPN 2 Merapi Barat. Capstone Project - Sistem Manajemen Pembelajaran.
          </p>
        </div>
      </footer>
    </div>
  );
}
