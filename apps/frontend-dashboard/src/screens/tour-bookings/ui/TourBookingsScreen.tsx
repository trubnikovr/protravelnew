import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { FileText, Plus, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createTourBooking,
  tourBookingsQueryOptions,
} from "@/features/tour-bookings/api/tour-bookings.api";
import { TourBookingFormDialog } from "@/features/tour-bookings/ui/TourBookingFormDialog";
import { TourBookingStatusBadge } from "@/features/tour-bookings/ui/TourBookingStatusBadge";
import type {
  CreateTourBookingRequestDto,
  TourBookingResponseDto,
  TourBookingResponseDtoStatusEnum,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";
import { Input } from "@/shared/ui/Input";
import { Pagination } from "@/shared/ui/Pagination";
import { Select } from "@/shared/ui/Select";

interface TourBookingsSearch {
  page?: number;
  search?: string;
  status?: TourBookingResponseDtoStatusEnum;
}

export function TourBookingsScreen() {
  const search = useSearch({ strict: false }) as TourBookingsSearch;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [creating, setCreating] = useState(false);
  const bookings = useQuery(
    tourBookingsQueryOptions({
      page: search.page ?? 1,
      limit: 20,
      search: search.search || undefined,
      status: search.status,
      sortDirection: "desc",
    })
  );
  const createMutation = useMutation({
    mutationFn: (payload: CreateTourBookingRequestDto) =>
      createTourBooking(payload),
    onSuccess: async (booking) => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "tour-bookings"],
      });
      setCreating(false);
      void navigate({
        to: "/tour-bookings/$bookingId",
        params: { bookingId: booking.id },
      });
    },
  });
  const columns = useMemo<ColumnDef<TourBookingResponseDto>[]>(
    () => [
      {
        header: t("bookingNumber"),
        cell: ({ row }) => (
          <div>
            <Link
              to="/tour-bookings/$bookingId"
              params={{ bookingId: row.original.id }}
              className="font-semibold text-primary hover:underline"
            >
              {row.original.bookingNumber}
            </Link>
            <p className="text-xs text-muted-foreground">
              {row.original.createdAt.toLocaleDateString(i18n.language)}
            </p>
          </div>
        ),
      },
      {
        header: t("customer"),
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.customerName}</p>
            <p className="text-xs text-muted-foreground">
              {[row.original.customerPhone, row.original.customerEmail]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          </div>
        ),
      },
      { header: t("tour"), accessorKey: "tourTitle" },
      {
        header: t("departureDate"),
        cell: ({ row }) =>
          row.original.departureDate
            ? row.original.departureDate.toLocaleDateString(i18n.language)
            : "—",
      },
      {
        header: t("travelers"),
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-muted-foreground" />
            {row.original.travelersCount}
          </span>
        ),
      },
      { header: t("price"), accessorKey: "totalPrice.formatted" },
      {
        header: t("status"),
        cell: ({ row }) => (
          <TourBookingStatusBadge status={row.original.status} />
        ),
      },
      {
        header: t("documents"),
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-4 text-muted-foreground" />
            {row.original.documents.length}
          </span>
        ),
      },
    ],
    [i18n.language, t]
  );
  const updateSearch = (patch: Partial<TourBookingsSearch>) =>
    void navigate({
      to: "/tour-bookings",
      search: {
        page: patch.page ?? search.page ?? 1,
        search: "search" in patch ? patch.search : search.search,
        status: "status" in patch ? patch.status : search.status,
      },
    });
  const pagination = bookings.data?.meta.pagination;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("tourBookings")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("tourBookingsSubtitle")}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          {t("addBooking")}
        </Button>
      </div>
      <div className="my-6 flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder={t("bookingSearch")}
            value={search.search ?? ""}
            onChange={(event) =>
              updateSearch({ search: event.target.value || undefined, page: 1 })
            }
          />
        </div>
        <Select
          className="w-52"
          value={search.status ?? ""}
          onChange={(event) =>
            updateSearch({
              status: (event.target.value ||
                undefined) as TourBookingsSearch["status"],
              page: 1,
            })
          }
        >
          <option value="">{t("allStatuses")}</option>
          {(
            ["pending", "confirmed", "paid", "completed", "cancelled"] as const
          ).map((status) => (
            <option key={status} value={status}>
              {t(`booking_${status}`)}
            </option>
          ))}
        </Select>
      </div>
      {bookings.isError && (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
          {bookings.error.message}
        </p>
      )}
      <DataTable
        columns={columns}
        data={bookings.data?.data ?? []}
        emptyText={bookings.isLoading ? t("loading") : t("noTourBookings")}
      />
      {pagination && (
        <Pagination
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={(page) => updateSearch({ page })}
        />
      )}
      <TourBookingFormDialog
        key={creating ? "open" : "closed"}
        open={creating}
        pending={createMutation.isPending}
        error={createMutation.error?.message}
        onClose={() => {
          setCreating(false);
          createMutation.reset();
        }}
        onSubmit={(payload) =>
          createMutation.mutateAsync(payload).then(() => undefined)
        }
      />
    </main>
  );
}
