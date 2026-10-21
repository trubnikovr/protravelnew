import { Activity, CircleDollarSign, Plane, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DashboardScreen() {
  const { t } = useTranslation();
  const cards = [
    { label: t("bookings"), value: "—", icon: Plane },
    { label: t("travelers"), value: "—", icon: Users },
    { label: t("revenue"), value: "—", icon: CircleDollarSign },
    { label: "Health Score", value: "—", icon: Activity },
  ];
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("overview")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboardSubtitle")}
        </p>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("apiLater")}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
