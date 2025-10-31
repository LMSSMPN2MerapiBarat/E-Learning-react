import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { GraduationCap } from "lucide-react";
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
      <Head title="Login - E-Learning SMPN 2 Merapi Barat" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-600 p-3 rounded-full">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-lg font-semibold">
              Sistem E-Learning
            </CardTitle>
            <CardDescription>SMP Negeri 2 Merapi Barat</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {processing ? "Memproses..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Login gagal</AlertDialogTitle>
                <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
                  Tutup
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    </>
  );
}
