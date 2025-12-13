import { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-900 rounded-b-[50px] md:rounded-b-[100px] z-0"></div>
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

        <div className="w-full max-w-md p-4 z-10 relative">


          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-blue-900 mb-6 transition-colors group w-fit"
              >
                <div className="p-1.5 rounded-full group-hover:bg-gray-100 transition-all mr-1.5">
                  <ArrowLeft size={16} />
                </div>
                <span className="text-sm font-medium">Kembali</span>
              </Link>

              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <img
                    src="/img/LogoSekolah.png"
                    alt="Logo SMPN 2 Merapi Barat"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mb-1.5">Selamat Datang</h2>
                <p className="text-sm text-gray-500">Silakan masuk ke akun Anda</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User size={20} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Masukkan email Anda"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Masukkan password Anda"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {processing ? "Memproses..." : "Masuk"}
                </button>
              </form>
            </div>

            <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
              <p className="text-xs text-gray-400">© 2025 SMP Negeri 2 Merapi Barat</p>
            </div>
          </div>
        </div>

        <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Login Gagal</AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
                Tutup
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
