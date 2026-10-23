import { useTranslation } from "react-i18next";
import type { TourBookingResponseDtoStatusEnum } from "@/shared/api/generated/v1/models";
import { Badge } from "@/shared/ui/Badge";

const statusStyles: Record<TourBookingResponseDtoStatusEnum, string> = {
  pending: "border-amber-500/25 bg-amber-500/10 text-amber-700",
  confirmed: "border-blue-500/25 bg-blue-500/10 text-blue-700",
  awaiting_payment: "border-amber-500/25 bg-amber-500/10 text-amber-700",
  paid: "border-success/25 bg-success/10 text-success",
  completed: "border-primary/25 bg-primary/10 text-primary",
  cancelled: "border-destructive/20 bg-destructive/8 text-destructive",
};

export function TourBookingStatusBadge({
  status,
}: {
  status: TourBookingResponseDtoStatusEnum;
}) {
  const { t } = useTranslation();
  return (
    <Badge className={statusStyles[status]}>{t(`booking_${status}`)}</Badge>
  );
}
