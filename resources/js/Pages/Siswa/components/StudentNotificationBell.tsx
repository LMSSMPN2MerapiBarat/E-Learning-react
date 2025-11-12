import { useEffect, useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { Bell, BookOpen, ClipboardList, FileText } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import type {
  StudentNotificationItem,
  StudentNotificationsPayload,
  StudentNotificationType,
} from "../types";

const ICON_MAP: Record<StudentNotificationType, typeof BookOpen> = {
  material: BookOpen,
  quiz: ClipboardList,
  assignment: FileText,
};

const TYPE_LABEL: Record<StudentNotificationType, string> = {
  material: "Materi",
  quiz: "Kuis",
  assignment: "Tugas",
};

interface StudentNotificationBellProps {
  notifications?: StudentNotificationsPayload;
}

const MAX_BADGE_COUNT = 9;
const PAGE_SIZE = 5;

const formatRelativeTime = (value?: string | null) => {
  if (!value) {
    return "Baru saja";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const isFuture = diffMs < 0;
  const absoluteMinutes = Math.round(Math.abs(diffMs) / 60000);

  if (absoluteMinutes < 1) {
    return isFuture ? "Sebentar lagi" : "Baru saja";
  }

  if (absoluteMinutes < 60) {
    return isFuture
      ? `Dalam ${absoluteMinutes} menit`
      : `${absoluteMinutes} menit lalu`;
  }

  const absoluteHours = Math.round(absoluteMinutes / 60);
  if (absoluteHours < 24) {
    return isFuture
      ? `Dalam ${absoluteHours} jam`
      : `${absoluteHours} jam lalu`;
  }

  const absoluteDays = Math.round(absoluteHours / 24);
  if (absoluteDays <= 7) {
    return isFuture
      ? `Dalam ${absoluteDays} hari`
      : `${absoluteDays} hari lalu`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const renderNotificationMeta = (meta?: string[]) => {
  if (!meta || meta.length === 0) {
    return null;
  }

  return (
    <p className="text-xs text-gray-500">
      {meta.filter(Boolean).join(" • ")}
    </p>
  );
};

const NotificationList = ({
  items,
}: {
  items: StudentNotificationItem[];
}) => {
  if (items.length === 0) {
    return (
      <div className="px-4 py-6 text-center text-sm text-gray-500">
        Belum ada notifikasi baru.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 py-1">
      {items.map((item) => {
        const Icon = ICON_MAP[item.type] ?? BookOpen;

        return (
          <DropdownMenuItem
            key={item.id}
            asChild
            className="px-2 py-1"
          >
            <Link
              href={item.url}
              className="flex w-full items-start gap-3 rounded-md p-2 text-xs transition hover:bg-muted/60"
            >
              <div className="mt-0.5 rounded-md bg-blue-100 p-1.5 text-blue-600">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <Badge
                  variant="secondary"
                  className="px-2 py-0 text-[9px] uppercase tracking-wide"
                >
                  {TYPE_LABEL[item.type] ?? item.type}
                </Badge>
                {renderNotificationMeta(item.meta)}
                <p className="text-[11px] text-gray-400">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </div>
  );
};

export default function StudentNotificationBell({
  notifications,
}: StudentNotificationBellProps) {
  const visibleItems = notifications?.items ?? [];
  const [seenTimestamp, setSeenTimestamp] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("studentNotificationsSeenAt");
  });
  const [page, setPage] = useState(0);

  const totalItems = visibleItems.length;
  useEffect(() => {
    setPage(0);
  }, [totalItems]);

  const totalPages = Math.max(1, Math.ceil(Math.max(totalItems, 1) / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paginatedItems = totalItems
    ? visibleItems.slice(
        currentPage * PAGE_SIZE,
        currentPage * PAGE_SIZE + PAGE_SIZE,
      )
    : [];

  const latestCreatedAt = useMemo(() => {
    if (!visibleItems.length) return null;
    const latest = visibleItems.reduce<string | null>((acc, item) => {
      if (!item.createdAt) return acc;
      if (!acc) return item.createdAt;
      return new Date(item.createdAt) > new Date(acc) ? item.createdAt : acc;
    }, null);
    return latest;
  }, [visibleItems]);

  const hasUnseen = useMemo(() => {
    if (!latestCreatedAt) return false;
    if (!seenTimestamp) return true;
    return new Date(latestCreatedAt) > new Date(seenTimestamp);
  }, [latestCreatedAt, seenTimestamp]);

  const serverUnreadCount = notifications?.unreadCount ?? 0;
  const unreadCount = hasUnseen ? serverUnreadCount : 0;
  const badgeText =
    unreadCount > MAX_BADGE_COUNT
      ? `${MAX_BADGE_COUNT}+`
      : unreadCount.toString();

  const handleOpenChange = (open: boolean) => {
    if (open && latestCreatedAt && typeof window !== "undefined") {
      window.localStorage.setItem("studentNotificationsSeenAt", latestCreatedAt);
      setSeenTimestamp(latestCreatedAt);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifikasi siswa"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold uppercase tracking-tight text-white">
              {badgeText}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-0">
        <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wide">
          <span>Notifikasi</span>
          {unreadCount > 0 && (
            <span className="text-[11px] font-normal text-gray-500">
              {unreadCount} baru
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NotificationList items={paginatedItems} />
        {notifications && (
          <>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-3 py-2 text-[11px] text-gray-400">
              <span>
                Halaman {totalItems ? currentPage + 1 : 0} dari{" "}
                {totalItems ? totalPages : 0}
              </span>
              {totalItems > PAGE_SIZE && (
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    disabled={currentPage === 0}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  >
                    {"<"}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages - 1))
                    }
                  >
                    {">"}
                  </Button>
                </div>
              )}
            </div>
            <p className="px-3 pb-2 text-[11px] text-gray-400">
              Menampilkan maks. {PAGE_SIZE} notifikasi terbaru dalam{" "}
              {notifications.windowDays} hari terakhir.
            </p>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
