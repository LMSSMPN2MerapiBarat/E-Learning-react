import React, { useEffect, useState } from "react";
import SidebarAdmin from "@/Components/SidebarAdmin";
import { Menu } from "lucide-react";

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
        className={`flex min-h-screen flex-1 flex-col transition-[padding] duration-300 ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-800"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-sm text-gray-600">SMP Negeri 2 Merapi Barat</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
