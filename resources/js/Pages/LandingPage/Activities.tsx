import React from 'react';

const activities = [
<<<<<<< HEAD
    {
        title: "Pramuka",
        category: "Pembentukan Karakter",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1080",
        description: "Mengembangkan kepemimpinan, keterampilan bertahan hidup, dan disiplin melalui kegiatan luar ruangan."
    },
    {
        title: "Klub Sains",
        category: "Akademik",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1080",
        description: "Menjelajahi keajaiban sains melalui eksperimen dan kompetisi."
    },
    {
        title: "Seni & Budaya",
        category: "Kreatif",
        image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=1080",
        description: "Mengekspresikan kreativitas melalui tarian tradisional, musik, dan seni visual."
    },
    {
        title: "Tim Olahraga",
        category: "Atletik",
        image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=1080",
        description: "Berkompetisi dalam turnamen lokal dan regional seperti sepak bola, voli, dan lainnya."
    }
];

export const Activities = () => {
    return (
        <section id="activities" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                {/* PERUBAHAN DI SINI: Mengganti flex dengan text-center */}
                <div className="text-center mb-16">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Kehidupan Siswa</h2>

                        {/* Garis: Menambahkan mx-auto untuk menengahkan garis */}
                        <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>

                        {/* Deskripsi: Menambahkan mx-auto dan max-w agar deskripsi berada di tengah */}
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Selain akademik, kami menawarkan beragam kegiatan ekstrakurikuler untuk membantu siswa menemukan passion mereka.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-3xl h-96 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-between p-6">
                                {/* Category Badge */}
                                <div className="flex justify-start">
                                    <span className="inline-block px-4 py-2 bg-blue-500/30 backdrop-blur-md text-white text-xs font-bold rounded-full border border-blue-300/40">
                                        {activity.category}
                                    </span>
                                </div>

                                {/* Title and Description */}
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-3 transform group-hover:-translate-y-1 transition-transform duration-300">
                                        {activity.title}
                                    </h3>

                                    {/* Description Box */}
                                    <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500">
                                        <p className="text-white text-sm leading-relaxed bg-blue-900/60 backdrop-blur-sm p-4 rounded-xl border border-blue-400/30 mt-2">
                                            {activity.description}
                                        </p>
                                    </div>

                                    {/* Bottom Line */}
                                    <div className="mt-4 h-1 w-0 bg-blue-400 rounded-full group-hover:w-full transition-all duration-500"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
=======
  {
    title: "Pramuka",
    category: "Pembentukan Karakter",
    image: "/img/Ekstrakurikuler/pramuka2.jpeg",
    description: "Mengembangkan kepemimpinan, keterampilan bertahan hidup, dan disiplin melalui kegiatan luar ruangan."
  },
  {
    title: "Drumband",
    category: "Seni & Musik",
    image: "/img/Ekstrakurikuler/drumband.jpeg",
    description: "Mengasah harmoni, kedisiplinan, dan kreativitas musikal melalui ansambel musik tiup dan perkusi."
  },
  {
    title: "Voli",
    category: "Olahraga",
    image: "/img/Ekstrakurikuler/voli.jpeg",
    description: "Membangun kerja sama tim dan ketangkasan fisik melalui latihan rutin dan kompetisi antar sekolah."
  }
];

export const Activities = () => {
  return (
    <section id="activities" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* --- HEADER CONCEPT SYNCED WITH PREVIOUS SECTIONS --- */}
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-[3px] bg-blue-600"></div>
              <span className="text-blue-600 font-black text-sm uppercase tracking-[0.2em]">Pengembangan Diri</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 uppercase leading-none tracking-tighter">
              EKSTRA<span className="text-blue-600">KURIKULER</span>
            </h2>
          </div>

          <div className="lg:border-l-2 lg:border-blue-100 lg:pl-10">
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl font-medium">
              Selain akademik, kami menawarkan beragam wadah pengembangan diri untuk membantu siswa menemukan passion dan mengasah talenta mereka sejak dini.
            </p>
          </div>
        </div>
        {/* --- END HEADER CONCEPT --- */}

        {/* GRID CARDS - TETAP MEMPERTAHANKAN STRUKTUR ASLI ANDA */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl h-[450px] transition-all duration-500 cursor-pointer hover:-translate-y-2"
              style={{ 
                boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)' 
              }}
            >
              {/* Image & Gradient Background */}
              <div className="absolute inset-0">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-7">
                {/* Category Badge */}
                <div className="flex justify-start">
                  <span className="inline-block px-4 py-2 bg-blue-500/30 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-300/40">
                    {activity.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white mb-2 transform group-hover:-translate-y-1 transition-transform duration-300 uppercase tracking-tight">
                    {activity.title}
                  </h3>
                  
                  {/* Description Box */}
                  <div className="max-h-0 overflow-hidden group-hover:max-h-48 transition-all duration-500 ease-in-out">
                    <p className="text-white/90 text-sm leading-relaxed bg-blue-950/70 backdrop-blur-sm p-4 rounded-2xl border border-blue-400/20 mt-3 font-medium">
                      {activity.description}
                    </p>
                  </div>

                  {/* Bottom Animated Line */}
                  <div className="mt-5 h-[3px] w-12 bg-blue-500 rounded-full group-hover:w-full transition-all duration-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 
>>>>>>> 5dfa3ea843f4243b3a1ba7df2a70a2f3eae67869
