import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createTour,
  deleteTour,
  toursQueryOptions,
  updateTour,
} from "@/features/tours/api/tours.api";
import { TourFormDialog } from "@/features/tours/ui/TourFormDialog";
import type {
  CreateTourRequestDto,
  TourResponseDto,
} from "@/shared/api/generated/v1/models";
import { ApiError } from "@/shared/api/api-client";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";
import { Input } from "@/shared/ui/Input";
import { Pagination } from "@/shared/ui/Pagination";
import { Select } from "@/shared/ui/Select";

interface ToursSearch {
  page?: number;
  search?: string;
  status?: "draft" | "published" | "archived";
  sortBy?: "createdAt" | "updatedAt" | "sortOrder" | "price" | "durationDays";
}

type StoredTourFilters = Pick<ToursSearch, "search" | "status" | "sortBy">;

const filtersStorageKey = "protravel.admin.tours.filters";
const tourStatuses = ["draft", "published", "archived"] as const;
const tourSortFields = [
  "createdAt",
  "updatedAt",
  "sortOrder",
  "price",
  "durationDays",
] as const;

function readStoredFilters(): StoredTourFilters {
  try {
    const raw = localStorage.getItem(filtersStorageKey);
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (!value || typeof value !== "object") return {};
    const filters = value as Record<string, unknown>;
    return {
      search: typeof filters.search === "string" ? filters.search : undefined,
      status: tourStatuses.includes(
        filters.status as (typeof tourStatuses)[number]
      )
        ? (filters.status as ToursSearch["status"])
        : undefined,
      sortBy: tourSortFields.includes(
        filters.sortBy as (typeof tourSortFields)[number]
      )
        ? (filters.sortBy as ToursSearch["sortBy"])
        : undefined,
    };
  } catch {
    return {};
  }
}

function saveStoredFilters(filters: StoredTourFilters) {
  try {
    localStorage.setItem(filtersStorageKey, JSON.stringify(filters));
  } catch {
    // Filters still work through URL state when storage is unavailable.
  }
}

function clearStoredFilters() {
  try {
    localStorage.removeItem(filtersStorageKey);
  } catch {
    // Filters still reset through URL state when storage is unavailable.
  }
}

const statusClass = {
  draft: "bg-muted text-muted-foreground",
  published: "border-success/25 bg-success/10 text-success",
  archived: "border-destructive/20 bg-destructive/8 text-destructive",
} as const;

export function ToursScreen() {
  const search = useSearch({ strict: false }) as ToursSearch;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<TourResponseDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedFilters, setStoredFilters] =
    useState<StoredTourFilters>(readStoredFilters);
  const { t, i18n } = useTranslation();
  const hasUrlFilters = Boolean(
    search.search || search.status || search.sortBy !== "createdAt"
  );
  const activeSearch: ToursSearch = hasUrlFilters
    ? search
    : { ...search, ...storedFilters };
  const filters = {
    page: activeSearch.page ?? 1,
    limit: 20,
    search: activeSearch.search || undefined,
    status: activeSearch.status,
    sortBy: activeSearch.sortBy ?? "createdAt",
    sortDirection: "desc",
  } as const;
  const tours = useQuery(toursQueryOptions(filters));

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "tours"] });
  const save = useMutation({
    mutationFn: async (payload: CreateTourRequestDto) =>
      editing ? updateTour(editing.id, payload) : createTour(payload),
    onSuccess: async () => {
      await refresh();
      setEditing(null);
      setCreating(false);
      setError(null);
    },
    onError: (mutationError) =>
      setError(
        mutationError instanceof ApiError
          ? mutationError.message
          : t("saveTourError")
      ),
  });
  const remove = useMutation({
    mutationFn: deleteTour,
    onSuccess: refresh,
    onError: (mutationError) =>
      setError(
        mutationError instanceof ApiError
          ? mutationError.message
          : t("deleteTourError")
      ),
  });
  const columns = useMemo<ColumnDef<TourResponseDto>[]>(() => {
    const statusLabel = {
      draft: t("draft"),
      published: t("published"),
      archived: t("archived"),
    };
    return [
      {
        header: t("tour"),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.coverImage?.url ? (
              <img
                className="size-11 rounded-lg object-cover"
                src={row.original.coverImage.url}
                alt=""
              />
            ) : (
              <div className="size-11 rounded-lg bg-muted" />
            )}
            <div>
              <p className="font-semibold">{row.original.content.title}</p>
              <p className="text-xs text-muted-foreground">
                {row.original.slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: t("route"),
        cell: ({ row }) => (
          <span>
            {row.original.destinations
              .map((item) =>
                item.cityName
                  ? `${item.countryName} — ${item.cityName}`
                  : item.countryName ?? item.countryCode ?? item.countryId
              )
              .join(", ")}
          </span>
        ),
      },
      {
        header: t("duration"),
        cell: ({ row }) => (
          <span>
            {t("daysNights", {
              days: row.original.durationDays,
              nights: row.original.durationNights,
            })}
          </span>
        ),
      },
      {
        header: t("price"),
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.price.formatted}</span>
        ),
      },
      {
        header: t("status"),
        cell: ({ row }) => (
          <Badge className={statusClass[row.original.status]}>
            {statusLabel[row.original.status]}
          </Badge>
        ),
      },
      {
        header: t("updated"),
        cell: ({ row }) =>
          row.original.updatedAt.toLocaleDateString(i18n.language),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("edit")}
              onClick={() => setEditing(row.original)}
            >
              <Edit3 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("delete")}
              onClick={() => {
                if (
                  window.confirm(
                    t("deleteTourConfirm", {
                      title: row.original.content.title,
                    })
                  )
                )
                  remove.mutate(row.original.id);
              }}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ];
  }, [i18n.language, remove, t]);

  const updateSearch = (patch: Partial<ToursSearch>) => {
    const next = {
      page: patch.page ?? activeSearch.page ?? 1,
      search: "search" in patch ? patch.search : activeSearch.search,
      status: "status" in patch ? patch.status : activeSearch.status,
      sortBy: patch.sortBy ?? activeSearch.sortBy ?? "createdAt",
    };
    const stored = {
      search: next.search,
      status: next.status,
      sortBy: next.sortBy,
    };
    saveStoredFilters(stored);
    setStoredFilters(stored);
    void navigate({
      to: "/tours",
      search: next,
    });
  };
  const resetFilters = () => {
    clearStoredFilters();
    setStoredFilters({});
    void navigate({
      to: "/tours",
      search: {
        page: 1,
        search: undefined,
        status: undefined,
        sortBy: "createdAt",
      },
    });
  };
  const pagination = tours.data?.meta.pagination;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("tours")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("toursSubtitle")}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" /> {t("addTour")}
        </Button>
      </div>
      <div className="my-6 flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder={t("tourSearch")}
            value={activeSearch.search ?? ""}
            onChange={(event) =>
              updateSearch({ search: event.target.value || undefined, page: 1 })
            }
          />
        </div>
        <Select
          className="w-48"
          value={activeSearch.status ?? ""}
          onChange={(event) =>
            updateSearch({
              status: (event.target.value ||
                undefined) as ToursSearch["status"],
              page: 1,
            })
          }
        >
          <option value="">{t("allStatuses")}</option>
          <option value="draft">{t("draft")}</option>
          <option value="published">{t("published")}</option>
          <option value="archived">{t("archived")}</option>
        </Select>
        <Select
          className="w-52"
          value={activeSearch.sortBy ?? "createdAt"}
          onChange={(event) =>
            updateSearch({
              sortBy: event.target.value as ToursSearch["sortBy"],
              page: 1,
            })
          }
        >
          <option value="createdAt">{t("newFirst")}</option>
          <option value="updatedAt">{t("changedFirst")}</option>
          <option value="price">{t("byPrice")}</option>
          <option value="sortOrder">{t("byOrder")}</option>
        </Select>
        <Button
          type="button"
          variant="outline"
          disabled={
            !activeSearch.search &&
            !activeSearch.status &&
            (activeSearch.sortBy ?? "createdAt") === "createdAt"
          }
          onClick={resetFilters}
        >
          <RotateCcw className="size-4" />
          {t("resetFilters")}
        </Button>
      </div>
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {tours.isError && (
        <div className="rounded-xl border p-10 text-center text-destructive">
          {t("loadToursError")}
        </div>
      )}
      <DataTable
        columns={columns}
        data={tours.data?.data ?? []}
        emptyText={tours.isLoading ? t("loading") : t("noTours")}
      />
      {pagination && (
        <Pagination
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={(page) => updateSearch({ page })}
        />
      )}
      <TourFormDialog
        key={editing?.id ?? (creating ? "create" : "closed")}
        open={creating || Boolean(editing)}
        tour={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(payload) => save.mutateAsync(payload).then(() => undefined)}
      />
    </main>
  );
}
