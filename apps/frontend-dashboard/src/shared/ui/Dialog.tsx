import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  wide,
}: DialogProps) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`mx-auto my-6 rounded-2xl border bg-background shadow-2xl ${
          wide ? "max-w-5xl" : "max-w-xl"
        }`}
      >
        <header className="sticky top-0 z-10 flex items-start gap-4 rounded-t-2xl border-b bg-background px-6 py-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t("close")}
          >
            <X className="size-5" />
          </Button>
        </header>
        {children}
      </div>
    </div>
  );
}
