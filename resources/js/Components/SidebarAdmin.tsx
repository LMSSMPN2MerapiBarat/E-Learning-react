import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  LibraryBig,
  LogOut,
  X,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/Components/ui/button";

interface SidebarProps {
  sidebarOpen: boolean;
  onClose: () => void;
}

export default function SidebarAdmin({ sidebarOpen, onClose }: SidebarProps) {
  const { url } = usePage();

  const menus = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Kelola Guru", icon: GraduationCap, href: "/admin/guru/Guru" },
    { name: "Kelola Mata Pelajaran", icon: BookOpen, href: "/admin/mapel/Mapel" },
    { name: "Kelola Siswa", icon: Users, href: "/admin/siswa/Siswa" },
    { name: "Kelola Kelas", icon: LibraryBig, href: "/admin/kelas/Kelas" },
    { name: "Kelola Jadwal Kelas", icon: CalendarClock, href: "/admin/jadwal-kelas/Jadwal" },
  ];

  const handleLogout = () => {
    router.post("/logout");
  };

  const handleNavClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  const translateClass = sidebarOpen
    ? "translate-x-0 lg:translate-x-0"
    : "-translate-x-full lg:-translate-x-full";

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-48 border-r bg-white shadow-md transition-transform duration-300 ease-in-out ${translateClass}`}
    >
      {/* Header Sidebar */}
      <div className="px-3 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo Sekolah */}
            <img
              src="/img/LogoSekolah.webp"
              alt="Logo SMPN 2 Merapi Barat"
              className="w-8 h-8 object-contain"
            />

            {/* Judul dan subjudul */}
            <div className="flex flex-col">
              <h2 className="text-sm text-gray-800 font-normal leading-tight">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-500">
                SMPN 2 Merapi Barat
              </p>
            </div>
          </div>

          {/* Tombol close di layar kecil */}
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Menu Navigasi */}
      <nav className="mt-3 space-y-0.5">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = url.startsWith(menu.href);
          return (
            <Link
              key={menu.name}
              href={menu.href}
              className={`flex items-center px-3 py-1.5 text-xs font-normal transition rounded-md ${active
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
                }`}
              onClick={handleNavClick}
            >
              <Icon className="w-4 h-4 mr-2" />
              {menu.name}
            </Link>
          );
        })}
      </nav>

      {/* Tombol Logout */}
      <div className="absolute bottom-3 w-full px-3">
        <Button
          variant="outline"
          size="sm"
          className="flex w-full items-center justify-start gap-1.5 text-xs"
          onClick={handleLogout}
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
