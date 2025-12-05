import type { PropsWithChildren } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Home,
  Layers,
  LogOut,
  PenSquare,
  Trophy,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import StudentNotificationBell from "@/Pages/Siswa/components/StudentNotificationBell";
import type { SiswaPageProps } from "@/Pages/Siswa/types";

interface StudentLayoutProps {
  title?: string;
  subtitle?: string;
}

type StudentNavKey =
  | "dashboard"
  | "assignments"
  | "materials"
  | "subjects"
  | "schedule"
  | "quizzes"
  | "grades";

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
    key: "schedule",
    label: "Jadwal",
    routeName: "siswa.schedule",
    icon: CalendarDays,
  },
  {
    key: "assignments",
    label: "Tugas",
    routeName: "siswa.tugas.index",
    icon: PenSquare,
  },
  {
    key: "subjects",
    label: "Mata Pelajaran",
    routeName: "siswa.subjects",
    icon: Layers,
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
  const page = usePage<SiswaPageProps>();
  const { auth, notifications } = page.props;
  const displayName = auth?.user?.name?.trim() || "Siswa";
  const initials = getInitials(auth?.user?.name, "S");
  const kelasName = (auth?.user as any)?.kelas?.nama || null;

  const routeHelper =
    typeof window !== "undefined" && typeof (window as any).route === "function"
      ? ((window as any).route as (
          name: string,
          params?: Record<string, unknown>,
          absolute?: boolean,
          config?: unknown,
        ) => string)
      : undefined;

  const ziggyHasRoute =
    routeHelper && typeof (routeHelper as unknown as { has?: unknown }).has === "function"
      ? ((routeHelper as unknown as { has: (name: string) => boolean }).has.bind(routeHelper))
      : undefined;

  const hasCurrentMethod =
    routeHelper && typeof (routeHelper as unknown as { current?: unknown }).current === "function";

  const resolveActiveKey = (): StudentNavKey => {
    if (hasCurrentMethod) {
      for (const item of NAV_ITEMS) {
        const { routeName, key } = item;
        if (ziggyHasRoute && !ziggyHasRoute(routeName)) continue;
        try {
          if (
            (routeHelper as unknown as { current: (name: string) => boolean }).current(
              routeName,
            )
          ) {
            return key;
          }
        } catch {
          continue;
        }
      }
    }

    const component = page.component.toLowerCase();
    if (component.includes("siswa/grades")) return "grades";
    if (component.includes("siswa/subjects")) return "subjects";
    if (component.includes("siswa/schedule")) return "schedule";
    if (component.includes("siswa/quizzes")) return "quizzes";
    if (component.includes("siswa/materials")) return "materials";
    if (component.includes("siswa/tugas")) return "assignments";

    return "dashboard";
  };

  const activeKey = resolveActiveKey();

  const fallbackPaths: Record<StudentNavKey, string> = {
    dashboard: "/siswa/dashboard",
    assignments: "/siswa/tugas",
    materials: "/siswa/materi",
    subjects: "/siswa/mata-pelajaran",
    schedule: "/siswa/jadwal",
    quizzes: "/siswa/kuis",
    grades: "/siswa/nilai",
  };

  const resolveHref = (name: string, fallback: string) => {
    if (routeHelper && (!ziggyHasRoute || ziggyHasRoute(name))) {
      try {
        return routeHelper(name);
      } catch {
        return fallback;
      }
    }
    return fallback;
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
            <StudentNotificationBell notifications={notifications} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-gray-100">
                  <div className="hidden text-right sm:block">
                    <p className="text-xs text-gray-500">Halo</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {displayName}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {initials}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="font-medium text-gray-900">{displayName}</p>
                  {kelasName && (
                    <p className="text-xs text-gray-500">Kelas {kelasName}</p>
                  )}
                </div>
                <DropdownMenuItem asChild className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Link
                    href={routeHelper ? routeHelper("logout") : "/logout"}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="border-t">
          <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:flex-wrap sm:justify-start sm:overflow-visible">
            {NAV_ITEMS.map(({ key, label, routeName, icon: Icon }) => {
              const isActive = key === activeKey;
              const href = resolveHref(routeName, fallbackPaths[key]);
              return (
                <Link
                  key={key}
                  href={href}
                  className="relative inline-flex shrink-0"
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
