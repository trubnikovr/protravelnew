import { useQuery } from "@tanstack/react-query";
import { Link, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Bell,
  ClipboardCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  Moon,
  Newspaper,
  Search,
  Sun,
  Map,
  Plane,
  Files,
  UserRound,
  Users,
} from "lucide-react";
import { useTheme } from "@/app/providers/theme-context";
import { currentAdminQueryOptions } from "@/features/auth/api/auth.api";
import { useLogout } from "@/features/auth/model/use-logout";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";

function initials(firstName: string, lastName?: string | null): string {
  return `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}

export function AppShell() {
  const { data: admin } = useQuery(currentAdminQueryOptions());
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();
  const { t } = useTranslation();

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r bg-card px-4 py-5 lg:flex lg:flex-col">
        <div className="px-2">
          <Logo />
        </div>
        <nav className="mt-8 flex-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {t("management")}
          </p>
          <div className="mt-2 space-y-1">
            {[
              { to: "/", label: t("overview"), icon: LayoutDashboard },
              { to: "/tours", label: t("tours"), icon: Map },
              {
                to: "/featured-flight-locations",
                label: t("featuredFlightLocations"),
                icon: Plane,
              },
              {
                to: "/tour-bookings",
                label: t("tourBookings"),
                icon: ClipboardCheck,
              },
              ...(admin.permissions.includes("content.read")
                ? [
                    { to: "/news", label: t("news"), icon: Newspaper },
                    {
                      to: "/system-messages",
                      label: t("systemMessages"),
                      icon: Megaphone,
                    },
                  ]
                : []),
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                activeProps={{ className: "bg-primary/10 text-primary" }}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
            <div className="pt-2">
              <div className="flex h-9 items-center gap-3 px-3 text-sm font-semibold text-foreground">
                <Users className="size-4" />
                {t("customers")}
              </div>
              <div className="ml-5 space-y-1 border-l pl-3">
                <Link
                  to="/customers"
                  search={{
                    page: 1,
                    search: undefined,
                    status: undefined,
                    sortBy: "createdAt",
                  }}
                  activeOptions={{ exact: true }}
                  className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  activeProps={{ className: "bg-primary/10 text-primary" }}
                >
                  <UserRound className="size-4" />
                  {t("customerList")}
                </Link>
                <Link
                  to="/customers/documents"
                  search={{ page: 1, search: undefined }}
                  className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  activeProps={{ className: "bg-primary/10 text-primary" }}
                >
                  <Files className="size-4" />
                  {t("documents")}
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border p-2.5 text-left transition hover:bg-muted"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            {initials(admin.firstName, admin.lastName)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              {admin.firstName} {admin.lastName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {admin.email}
            </span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </aside>

      <div className="lg:col-start-2">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-xl sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={t("openMenu")}
          >
            <Menu className="size-5" />
          </Button>
          <div className="hidden h-9 max-w-sm flex-1 items-center gap-2 rounded-lg border bg-card px-3 text-muted-foreground sm:flex">
            <Search className="size-4" />
            <span className="text-sm">{t("search")}</span>
            <kbd className="ml-auto text-[11px]">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={t("theme")}
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" aria-label={t("notifications")}>
              <Bell className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void logout()}
              aria-label={t("logout")}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
