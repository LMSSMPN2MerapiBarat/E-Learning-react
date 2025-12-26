import { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { User, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      router.post(
        "/login",
        { email, password },
        {
          onSuccess: () => {
            setErrorDialogOpen(false);
          },
          onError: (errors) => {
            const message =
              errors.email ||
              errors.password ||
              "Email atau password salah. Silakan periksa kembali.";
            setErrorMessage(message);
            setErrorDialogOpen(true);
          },
          onFinish: () => setProcessing(false),
        }
      );
    } catch (error) {
      setErrorMessage("Terjadi kesalahan, coba lagi.");
      setErrorDialogOpen(true);
      setProcessing(false);
    }
  };

  return (
    <>
      <Head title="Login" />
      <div className="min-h-screen flex bg-white font-sans overflow-hidden">
        
        {/* NAVIGASI KEMBALI */}
        <div className="absolute top-8 left-8 z-30">
          <Link
            href="/"
            className="flex items-center text-slate-400 hover:text-blue-600 transition-all group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Beranda</span>
          </Link>
        </div>

        {/* SISI KIRI: FORM LOGIN */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 md:px-16 border-r border-slate-100 bg-white relative z-10">
          <div className="w-full max-w-[320px]">
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">Selamat Datang</h2>
              <p className="text-slate-500 text-[12px] leading-relaxed">
                Silakan masuk untuk mengakses sistem administrasi terpadu.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Email Kredensial
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase().replace(/[^a-z0-9.@]/g, ''))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all text-sm text-slate-700 shadow-none"
                    placeholder="nama@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Kata Sandi
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all text-sm text-slate-700 shadow-none"
                    placeholder="Masukkan kata sandi"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 mt-2"
              >
                {processing ? "Verifikasi..." : "Login"}
              </button>
            </form>

            <div className="mt-12 text-center pt-6 border-t border-slate-100">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                © 2025 SMP Negeri 2 Merapi Barat
              </p>
            </div>
          </div>
        </div>

        {/* SISI KANAN: BRANDING (ROYAL SATIN BLUE) */}
        <div className="hidden lg:flex w-1/2 bg-blue-700 items-center justify-center relative overflow-hidden">
          
          {/* Gradient Dasar: Menengah (Tidak Terlalu Gelap/Terang) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
          
          
          {/* Subtle Glow Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[120px] rounded-full"></div>

          <div className="relative z-10 w-full max-w-md text-center px-10">
            
            {/* Logo Frame: Polished Glass */}
            <div className="mb-10 inline-block relative">
              <div className="absolute inset-0 bg-white/20 blur-[50px] rounded-full"></div>
              <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-[3rem] border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/15">
                <img
                  src="/img/LogoSekolah.png"
                  alt="Logo Sekolah"
                  className="h-32 w-32 object-contain brightness-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                />
              </div>
            </div>

            {/* Judul: Putih Bersih dengan Shadow Halus */}
            <h1 className="text-white text-4xl font-black tracking-tight uppercase leading-[1.1] mb-6 drop-shadow-md">
              SMPN 2 <br />
              <span className="text-blue-200">Merapi Barat</span>
            </h1>
            
            <div className="w-16 h-1 bg-blue-300/40 mx-auto rounded-full mb-8"></div>
            
            <div className="space-y-2">
              <p className="text-blue-100 text-[12px] font-bold uppercase tracking-[0.5em] opacity-90">
                Portal Akademik Resmi
              </p>
            <div className="inline-block px-4 py-1 bg-black/10 backdrop-blur-md rounded-full border border-white/5">
                <p className="text-blue-200/60 text-[10px] font-bold uppercase tracking-[0.3em]">
                   Maju • Mandiri • Berprestasi
                </p>
              </div>
            </div>
          </div>

          {/* Aksentuasi Sudut: Modern Stroke */}
          <div className="absolute top-12 right-12 w-20 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-2xl"></div>
          <div className="absolute bottom-12 left-12 w-20 h-20 border-b-2 border-l-2 border-white/10 rounded-bl-2xl"></div>
        </div>

{/* DIALOG ERROR FORMAL */}
<AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
  <AlertDialogContent className="max-w-[400px] rounded-[2rem] border border-slate-100 bg-white p-0 overflow-hidden shadow-2xl">
  
    
    <div className="p-8">
      <AlertDialogHeader className="flex flex-col items-center text-center">
        {/* Container Ikon dengan Ring Animation halus */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
          <AlertCircle className="text-red-600" size={32} />
        </div>
        
        <div className="space-y-2">
          <AlertDialogTitle className="text-slate-900 text-xl font-bold tracking-tight">
            Kesalahan Otentikasi
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 text-sm leading-relaxed">
            {errorMessage || "Sistem tidak dapat memverifikasi kredensial Anda. Silakan periksa kembali email dan kata sandi yang dimasukkan."}
          </AlertDialogDescription>
        </div>
      </AlertDialogHeader>

      <AlertDialogFooter className="mt-8 flex flex-col sm:flex-col gap-3">
        <AlertDialogAction 
          onClick={() => setErrorDialogOpen(false)} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 border-none"
        >
          Coba Kembali
        </AlertDialogAction>
      </AlertDialogFooter>
    </div>
  </AlertDialogContent>
</AlertDialog>
      </div>
    </>
  );
}