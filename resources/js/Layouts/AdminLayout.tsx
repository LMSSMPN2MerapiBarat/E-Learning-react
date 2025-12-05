import React, { useEffect, useState } from "react";
import SidebarAdmin from "@/Components/SidebarAdmin";
import { Menu } from "lucide-react";
import { Toaster } from "@/Components/ui/sonner";

export default function AdminLayout({
  children,
  title = "Dashboard",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleResize = () => {
      setSidebarOpen(mediaQuery.matches);
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <SidebarAdmin
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div
        className={`flex min-h-screen flex-1 flex-col transition-[padding] duration-300 ${sidebarOpen ? "lg:pl-48" : "lg:pl-0"
          }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-white px-3 py-2 shadow-sm sm:px-4 sm:py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-800"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold">{title}</h1>
              <p className="text-xs text-gray-600">SMP Negeri 2 Merapi Barat</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4">{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
