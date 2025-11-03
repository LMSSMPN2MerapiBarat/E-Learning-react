import type { PropsWithChildren } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import { BookOpen, ClipboardList, Home, LogOut, Trophy } from "lucide-react";
import { Button } from "@/Components/ui/button";
import type { PageProps } from "@/types";

interface StudentLayoutProps {
  title?: string;
  subtitle?: string;
}

type StudentNavKey = "dashboard" | "materials" | "quizzes" | "grades";

const NAV_ITEMS: Array<{
  key: StudentNavKey;
  label: string;
  routeName: string;
  icon: typeof Home;
}> = [
  {
    key: "dashboard",
    label: "Dashboard",
    routeName: "siswa.dashboard",
    icon: Home,
  },
  {
    key: "materials",
    label: "Materi",
    routeName: "siswa.materials",
    icon: BookOpen,
  },
  {
    key: "quizzes",
    label: "Kuis",
    routeName: "siswa.quizzes",
    icon: ClipboardList,
  },
  {
    key: "grades",
    label: "Nilai Saya",
    routeName: "siswa.grades",
    icon: Trophy,
  },
];

const getInitials = (name?: string | null, fallback = "S") => {
  if (!name) return fallback;
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return letters || fallback;
};

export default function StudentLayout({
  title,
  subtitle,
  children,
}: PropsWithChildren<StudentLayoutProps>) {
  const page = usePage<PageProps>();
  const { auth } = page.props;
  const displayName = auth?.user?.name?.trim() || "Siswa";
  const initials = getInitials(auth?.user?.name, "S");

  const routeHelper =
    typeof window !== "undefined" && typeof (window as any).route === "function"
      ? ((window as any).route as (
          name: string,
          params?: Record<string, unknown>,
          absolute?: boolean,
          config?: unknown,
        ) => string)
      : undefined;

  const hasCurrentMethod =
    routeHelper && typeof (routeHelper as unknown as { current?: unknown }).current === "function";

  const resolveActiveKey = (): StudentNavKey => {
    if (hasCurrentMethod) {
      const matched = NAV_ITEMS.find(({ routeName }) =>
        (routeHelper as unknown as { current: (name: string) => boolean }).current(routeName),
      );
      if (matched) {
        return matched.key;
      }
    }

    const component = page.component.toLowerCase();
    if (component.includes("siswa/grades")) return "grades";
    if (component.includes("siswa/quizzes")) return "quizzes";
    if (component.includes("siswa/materials")) return "materials";

    return "dashboard";
  };

  const activeKey = resolveActiveKey();

  const fallbackPaths: Record<StudentNavKey, string> = {
    dashboard: "/siswa/dashboard",
    materials: "/siswa/materi",
    quizzes: "/siswa/kuis",
    grades: "/siswa/nilai",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-2 text-white shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {title ?? "Dashboard Siswa"}
              </h1>
              <p className="text-sm text-gray-600">
                {subtitle ??
                  "Pantau materi, kerjakan kuis, dan ikuti progres belajar Anda."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-500">Halo</p>
              <p className="text-sm font-semibold text-gray-900">
                {displayName}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {initials}
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link
                href={routeHelper ? routeHelper("logout") : "/logout"}
                method="post"
                as="button"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
        <div className="border-t">
          <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
            {NAV_ITEMS.map(({ key, label, routeName, icon: Icon }) => {
              const isActive = key === activeKey;
              return (
                <Link
                  key={key}
                  href={routeHelper ? routeHelper(routeName) : fallbackPaths[key]}
                  className="relative inline-flex"
                >
                  <motion.span
                    className={`relative flex items-center gap-2 overflow-hidden rounded-lg px-4 py-2 font-medium transition ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="student-nav-active"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 shadow-md"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-white" : "text-gray-500"
                        }`}
                      />
                      <span>{label}</span>
                    </span>
                  </motion.span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
