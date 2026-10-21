import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CircleAlert,
  Edit3,
  Info,
  Plus,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { currentAdminQueryOptions } from "@/features/auth/api/auth.api";
import {
  createSystemMessage,
  deleteSystemMessage,
  systemMessagesQueryKey,
  systemMessagesQueryOptions,
  updateSystemMessage,
} from "@/features/system-messages/api/system-messages.api";
import { SystemMessageFormDialog } from "@/features/system-messages/ui/SystemMessageFormDialog";
import { ApiError } from "@/shared/api/api-client";
import type {
  CreateSystemMessageRequestDto,
  SystemMessageResponseDto,
} from "@/shared/api/generated/v1/models";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";

export function SystemMessagesScreen() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: admin } = useQuery(currentAdminQueryOptions());
  const messages = useQuery(systemMessagesQueryOptions());
  const [editing, setEditing] = useState<SystemMessageResponseDto | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canWrite = admin?.permissions.includes("content.write") ?? false;
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: systemMessagesQueryKey });
  const mutationError = (value: unknown, fallback: string) =>
    setError(value instanceof ApiError ? value.message : fallback);
  const save = useMutation({
    mutationFn: (payload: CreateSystemMessageRequestDto) =>
      editing
        ? updateSystemMessage(editing.id, payload)
        : createSystemMessage(payload),
    onSuccess: async () => {
      await refresh();
      setEditing(null);
      setCreating(false);
      setError(null);
    },
    onError: (value) => mutationError(value, t("saveSystemMessageError")),
  });
  const toggle = useMutation({
    mutationFn: (message: SystemMessageResponseDto) =>
      updateSystemMessage(message.id, { isActive: !message.isActive }),
    onSuccess: refresh,
    onError: (value) => mutationError(value, t("saveSystemMessageError")),
  });
  const remove = useMutation({
    mutationFn: deleteSystemMessage,
    onSuccess: refresh,
    onError: (value) => mutationError(value, t("deleteSystemMessageError")),
  });
  const columns = useMemo<ColumnDef<SystemMessageResponseDto>[]>(
    () => [
      {
        header: t("messageText"),
        cell: ({ row }) => (
          <div className="flex max-w-2xl items-start gap-3">
            <span
              className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg ${
                row.original.type === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {row.original.type === "error" ? (
                <CircleAlert className="size-4" />
              ) : (
                <Info className="size-4" />
              )}
            </span>
            <p className="leading-6">{row.original.text}</p>
          </div>
        ),
      },
      {
        header: t("messageType"),
        cell: ({ row }) => (
          <Badge
            className={
              row.original.type === "error"
                ? "border-destructive/20 bg-destructive/8 text-destructive"
                : "border-primary/20 bg-primary/10 text-primary"
            }
          >
            {row.original.type === "error"
              ? t("messageError")
              : t("messageInfo")}
          </Badge>
        ),
      },
      {
        header: t("status"),
        cell: ({ row }) => (
          <Badge
            className={
              row.original.isActive
                ? "border-success/25 bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
            }
          >
            {row.original.isActive ? t("active") : t("inactive")}
          </Badge>
        ),
      },
      {
        header: t("updated"),
        cell: ({ row }) => row.original.updatedAt.toLocaleString(i18n.language),
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
                  row.original.isActive ? t("deactivate") : t("activate")
                }
                onClick={() => toggle.mutate(row.original)}
              >
                {row.original.isActive ? (
                  <PowerOff className="size-4" />
                ) : (
                  <Power className="size-4" />
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
                  if (window.confirm(t("deleteSystemMessageConfirm"))) {
                    remove.mutate(row.original.id);
                  }
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ) : null,
      },
    ],
    [canWrite, i18n.language, remove, t, toggle]
  );

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("systemMessages")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("systemMessagesSubtitle")}
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" /> {t("addSystemMessage")}
          </Button>
        )}
      </div>
      {error && (
        <div className="my-6 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {messages.isError && (
        <div className="mt-6 rounded-xl border p-10 text-center text-destructive">
          {t("loadSystemMessagesError")}
        </div>
      )}
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={messages.data ?? []}
          emptyText={messages.isLoading ? t("loading") : t("noSystemMessages")}
        />
      </div>
      <SystemMessageFormDialog
        key={editing?.id ?? (creating ? "create" : "closed")}
        open={creating || Boolean(editing)}
        message={editing}
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
