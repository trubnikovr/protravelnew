import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  FileText,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  changeTourBookingStatus,
  deleteTourBookingDocument,
  downloadTourBookingDocument,
  tourBookingQueryOptions,
  uploadTourBookingDocument,
} from "@/features/tour-bookings/api/tour-bookings.api";
import { TourBookingStatusBadge } from "@/features/tour-bookings/ui/TourBookingStatusBadge";
import type { TourBookingResponseDtoStatusEnum } from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Select } from "@/shared/ui/Select";

const transitions: Record<
  TourBookingResponseDtoStatusEnum,
  TourBookingResponseDtoStatusEnum[]
> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["paid", "cancelled"],
  awaiting_payment: ["paid", "cancelled"],
  paid: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
};

export function TourBookingDetailScreen() {
  const { bookingId } = useParams({ strict: false }) as { bookingId: string };
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const booking = useQuery(tourBookingQueryOptions(bookingId));
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "tour-bookings"] });
  const statusMutation = useMutation({
    mutationFn: (status: TourBookingResponseDtoStatusEnum) =>
      changeTourBookingStatus(bookingId, status),
    onSuccess: invalidate,
  });
  const uploadMutation = useMutation({
    mutationFn: (selected: File) =>
      uploadTourBookingDocument(bookingId, selected),
    onSuccess: async () => {
      setFile(null);
      await invalidate();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (documentId: string) =>
      deleteTourBookingDocument(bookingId, documentId),
    onSuccess: invalidate,
  });
  const downloadMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      downloadTourBookingDocument(bookingId, id, name),
  });

  if (booking.isLoading) {
    return (
      <main className="p-8 text-sm text-muted-foreground">{t("loading")}</main>
    );
  }
  if (!booking.data || booking.isError) {
    return (
      <main className="p-8 text-sm text-destructive">
        {booking.error?.message ?? t("bookingNotFound")}
      </main>
    );
  }

  const item = booking.data;
  const errors =
    statusMutation.error ??
    uploadMutation.error ??
    deleteMutation.error ??
    downloadMutation.error;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <Button asChild variant="ghost" className="mb-5 -ml-3">
        <Link
          to="/tour-bookings"
          search={{ page: 1, search: undefined, status: undefined }}
        >
          <ArrowLeft className="size-4" /> {t("backBookings")}
        </Link>
      </Button>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {item.bookingNumber}
            </h1>
            <TourBookingStatusBadge status={item.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("created")} {item.createdAt.toLocaleString(i18n.language)}
          </p>
        </div>
        {transitions[item.status].length > 0 && (
          <Select
            className="w-56"
            value=""
            disabled={statusMutation.isPending}
            onChange={(event) =>
              statusMutation.mutate(
                event.target.value as TourBookingResponseDtoStatusEnum
              )
            }
          >
            <option value="">{t("changeBookingStatus")}</option>
            {transitions[item.status].map((status) => (
              <option key={status} value={status}>
                {t(`booking_${status}`)}
              </option>
            ))}
          </Select>
        )}
      </div>
      {errors && (
        <p className="mt-5 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
          {errors.message}
        </p>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-bold">{t("bookingDetails")}</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("customer")}
              </dt>
              <dd className="mt-1 font-medium">
                <Link
                  to="/customers/$customerId"
                  params={{ customerId: item.customerId }}
                  className="text-primary hover:underline"
                >
                  {item.customerName}
                </Link>
              </dd>
              <dd className="text-sm text-muted-foreground">
                {item.customerEmail || "—"}
              </dd>
              <dd className="text-sm text-muted-foreground">
                {item.customerPhone || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("tour")}
              </dt>
              <dd className="mt-1 font-medium">{item.tourTitle}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("departureDate")}
              </dt>
              <dd className="mt-1">
                {item.departureDate?.toLocaleDateString(i18n.language) ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("travelers")}
              </dt>
              <dd className="mt-1 inline-flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                {item.travelersCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("price")}
              </dt>
              <dd className="mt-1 text-lg font-bold">
                {item.totalPrice.formatted}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("paidAt")}
              </dt>
              <dd className="mt-1">
                {item.paidAt?.toLocaleString(i18n.language) ?? "—"}
              </dd>
            </div>
          </dl>
          {item.travelers.length > 0 && (
            <div className="mt-5 border-t pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("travelers")}
              </p>
              <div className="mt-3 space-y-2">
                {item.travelers.map((traveler) => (
                  <div key={traveler.id} className="rounded-lg bg-muted p-3">
                    <p className="font-medium">
                      {[
                        traveler.lastName,
                        traveler.firstName,
                        traveler.middleName,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {traveler.birthDate?.toLocaleDateString(i18n.language) ??
                        "—"}
                      {traveler.citizenshipCountryCode
                        ? ` · ${traveler.citizenshipCountryCode}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {item.notes && (
            <div className="mt-5 border-t pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("notes")}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{item.notes}</p>
            </div>
          )}
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-bold">{t("bookingDocuments")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("bookingDocumentsHint")}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-dashed p-4">
            <input
              key={file?.name ?? "empty"}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
              className="min-w-0 flex-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:font-medium"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            <Button
              disabled={!file || uploadMutation.isPending}
              onClick={() => file && uploadMutation.mutate(file)}
            >
              <Upload className="size-4" />
              {uploadMutation.isPending ? t("uploading") : t("uploadDocument")}
            </Button>
            <p className="w-full text-xs text-muted-foreground">
              {t("bookingDocumentRequirements")}
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {item.documents.length === 0 && (
              <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                {t("noBookingDocuments")}
              </p>
            )}
            {item.documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {document.originalName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(document.size)} ·{" "}
                    {document.createdAt.toLocaleString(i18n.language)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    downloadMutation.mutate({
                      id: document.id,
                      name: document.originalName,
                    })
                  }
                  aria-label={t("download")}
                >
                  <Download className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (window.confirm(t("deleteBookingDocumentConfirm"))) {
                      deleteMutation.mutate(document.id);
                    }
                  }}
                  aria-label={t("delete")}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
