import React, { PropsWithChildren, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Menu } from "lucide-react";
import TeacherSidebar from "@/Components/TeacherSidebar";
import { cn } from "@/Components/ui/utils";
import type { PageProps } from "@/types";

interface TeacherLayoutProps {
  title?: string;
}

const getInitials = (name?: string | null) => {
  if (!name) return "G";
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "G";
};

export default function TeacherLayout({
  title,
  children,
}: PropsWithChildren<TeacherLayoutProps>) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { auth } = usePage<PageProps>().props;
  const displayName = auth?.user?.name?.trim() || "Guru";
  const initials = getInitials(auth?.user?.name);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSidebarOpen(event.matches);
    };

    handleChange(mediaQuery);

    const listener = (event: MediaQueryListEvent) => handleChange(event);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }

    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0",
        )}
      >
        <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {title || "Dashboard Guru"}
              </h1>
              <p className="text-sm text-gray-600">
                Kelola materi, kuis, dan aktivitas pembelajaran
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-500">Guru Aktif</p>
              <p className="text-sm font-semibold text-gray-800">
                {displayName}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
