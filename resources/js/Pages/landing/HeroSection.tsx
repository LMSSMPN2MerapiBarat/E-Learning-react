// src/components/landing/HeroSection.tsx

import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/Components/figma/ImageWithFallback';

import heroImage from '@/assets/hero-student.png'; 

interface HeroSectionProps {
	onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
	return (
		<section id="beranda" className="py-16 md:py-28">
			<div className="mx-auto px-4 lg:px-16 max-w-screen-2xl">
				<div className="grid md:grid-cols-2 gap-16 items-center">
					
					{/* Teks Konten (Sisi Kiri) */}
					<div className="space-y-6">
						<div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
							Platform E-Learning Terbaik
						</div>
						<h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
							Pendidikan Modern untuk 
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
								Masa Depan
							</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-lg">
							Kami menyediakan platform pembelajaran online yang interaktif dan berkualitas.
						</p>
						
						{/* PERUBAHAN UTAMA DI SINI: Tombol Gradien */}
						<Button 
							size="lg" 
							className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white text-lg px-8 py-6 rounded-full shadow-xl transition transform hover:scale-[1.02]" 
							onClick={() => window.location.href = '/login'}
						>
							Mulai Belajar
							<ArrowRight className="w-6 h-6 ml-3" />
						</Button>
					</div>
					
					{/* Gambar & Badge (Sisi Kanan) */}
					<div className="relative order-first md:order-last">
						<div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
							
							<ImageWithFallback
								src={heroImage} 
								alt="Student learning with headphones"
								className="w-full h-auto max-h-[550px] object-cover"
							/>
							
						</div>
						<Card className="absolute bottom-10 left-[-20px] bg-white p-4 shadow-2xl rounded-xl flex items-center gap-3 border-l-4 border-blue-500 transform hover:scale-[1.05] transition-transform">
							<div className="bg-blue-500 p-2 rounded-full flex items-center justify-center">
								<span className="text-white font-black text-xl">A+</span>
							</div>
							<div>
								<p className="font-bold text-gray-900 leading-snug">Nilai Tertinggi</p>
								<p className="text-sm text-gray-500">98% Kelulusan</p>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}