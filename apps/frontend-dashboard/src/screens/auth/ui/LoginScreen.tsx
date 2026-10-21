import { Moon, ShieldCheck, Sun } from "lucide-react";
import { useTheme } from "@/app/providers/theme-context";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Button } from "@/shared/ui/Button";
import { Logo } from "@/shared/ui/Logo";
import { useTranslation } from "react-i18next";

export function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-background lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(79,70,229,0.42),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(6,182,212,0.25),transparent_38%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />

        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm text-cyan-100 backdrop-blur">
            <ShieldCheck className="size-4" />
            {t("loginSecure")}
          </div>
          <h1 className="text-5xl font-semibold leading-[1.1] tracking-[-0.04em]">
            {t("loginHero")}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            {t("loginHeroText")}
          </p>
        </div>

        <p className="relative z-10 text-sm text-slate-500">
          © {new Date().getFullYear()} ProTravel
        </p>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="absolute right-5 top-5 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t("lightTheme") : t("darkTheme")}
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <p className="text-sm font-semibold text-primary">ADMIN DASHBOARD</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("welcome")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {t("loginSubtitle")}
          </p>
          <LoginForm />
          <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
            {t("authorizedOnly")}
          </p>
        </div>
      </section>
    </main>
  );
}
