import { Link, router, usePage } from "@inertiajs/react";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookPen,
  Users,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { cn } from "@/Components/ui/utils";
import { useMemo } from "react";

interface TeacherSidebarProps {
  sidebarOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { label: "Dashboard", href: "/guru/dashboard", icon: LayoutDashboard },
  {
    label: "Kelola Materi Pembelajaran",
    href: "/guru/materi",
    icon: BookOpen,
  },
  { label: "Kelas Saya", href: "/guru/kelas", icon: Users },
  { label: "Kelola Tugas", href: "/guru/tugas", icon: NotebookPen },
  { label: "Kelola Kuis", href: "/guru/kuis", icon: ClipboardList },
];

export default function TeacherSidebar({ sidebarOpen, onToggle }: TeacherSidebarProps) {
  const { url } = usePage();
  const activeHref = useMemo(
    () =>
      menuItems.find((item) => url === item.href || url.startsWith(`${item.href}/`))?.href ??
      menuItems[0].href,
    [url],
  );

  const handleLogout = () => {
    router.post("/logout");
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 z-30 w-64 border-r bg-white shadow-lg transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Panel Guru</h2>
              <p className="text-xs text-gray-500">SMP Negeri 2 Merapi Barat</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          <Button
            variant="outline"
            className="flex w-full items-center justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/40 transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onToggle}
      />
    </>
  );
}
