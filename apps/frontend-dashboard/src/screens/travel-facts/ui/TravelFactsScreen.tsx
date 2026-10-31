import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Eye, EyeOff, Lightbulb, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { currentAdminQueryOptions } from "@/features/auth/api/auth.api";
import {
  createTravelFact,
  deleteTravelFact,
  travelFactsQueryKey,
  travelFactsQueryOptions,
  updateTravelFact,
} from "@/features/travel-facts/api/travel-facts.api";
import { TravelFactFormDialog } from "@/features/travel-facts/ui/TravelFactFormDialog";
import { ApiError } from "@/shared/api/api-client";
import type {
  AdminTravelFactResponseDto,
  CreateTravelFactRequestDto,
} from "@/shared/api/generated/v1/models";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";

export function TravelFactsScreen() {
  const { t } = useTranslation();
  const client = useQueryClient();
  const { data: admin } = useQuery(currentAdminQueryOptions());
  const query = useQuery(travelFactsQueryOptions());
  const [editing, setEditing] = useState<AdminTravelFactResponseDto | null>(
    null
  );
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canWrite = admin?.permissions.includes("content.write") ?? false;
  const refresh = () =>
    client.invalidateQueries({ queryKey: travelFactsQueryKey });
  const fail = (value: unknown) =>
    setError(
      value instanceof ApiError ? value.message : t("saveTravelFactError")
    );
  const save = useMutation({
    mutationFn: (payload: CreateTravelFactRequestDto) =>
      editing
        ? updateTravelFact(editing.id, payload)
        : createTravelFact(payload),
    onSuccess: async () => {
      await refresh();
      setEditing(null);
      setCreating(false);
      setError(null);
    },
    onError: fail,
  });
  const toggle = useMutation({
    mutationFn: (fact: AdminTravelFactResponseDto) =>
      updateTravelFact(fact.id, { isPublished: !fact.isPublished }),
    onSuccess: refresh,
    onError: fail,
  });
  const remove = useMutation({
    mutationFn: deleteTravelFact,
    onSuccess: refresh,
    onError: fail,
  });
  const columns = useMemo<ColumnDef<AdminTravelFactResponseDto>[]>(
    () => [
      {
        header: t("travelFactText"),
        cell: ({ row }) => (
          <div className="flex max-w-2xl gap-3">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Lightbulb className="size-4" />
            </span>
            <p className="line-clamp-3 text-sm leading-5">
              {row.original.text}
            </p>
          </div>
        ),
      },
      {
        header: t("travelFactScope"),
        cell: ({ row }) => (
          <Badge>
            {row.original.destinationCode ||
              row.original.countryCode ||
              t("allCountries")}
          </Badge>
        ),
      },
      {
        header: t("travelFactTags"),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.tags.join(", ") || "—"}
          </span>
        ),
      },
      {
        header: t("status"),
        cell: ({ row }) => (
          <Badge
            className={
              row.original.isPublished
                ? "border-success/25 bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
            }
          >
            {row.original.isPublished ? t("published") : t("draft")}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) =>
          canWrite ? (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  row.original.isPublished ? t("unpublish") : t("publish")
                }
                onClick={() => toggle.mutate(row.original)}
              >
                {row.original.isPublished ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
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
                  if (window.confirm(t("deleteTravelFactConfirm")))
                    remove.mutate(row.original.id);
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ) : null,
      },
    ],
    [canWrite, remove, t, toggle]
  );

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("travelFacts")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("travelFactsSubtitle")}
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" /> {t("addTravelFact")}
          </Button>
        )}
      </div>
      {error && (
        <div className="my-6 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={query.data ?? []}
          emptyText={query.isLoading ? t("loading") : t("noTravelFacts")}
        />
      </div>
      <TravelFactFormDialog
        key={editing?.id ?? (creating ? "create" : "closed")}
        open={creating || Boolean(editing)}
        fact={editing}
        error={save.isError ? error : null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
          setError(null);
        }}
        onSubmit={(payload) => save.mutateAsync(payload).then(() => undefined)}
      />
    </main>
  );
}
