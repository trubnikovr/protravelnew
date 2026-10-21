import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>{t("total", { count: total })}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" /> {t("back")}
        </Button>
        <span className="min-w-20 text-center">
          {t("page", { page, total: Math.max(totalPages, 1) })}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t("next")} <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
