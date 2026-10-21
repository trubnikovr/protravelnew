import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit3, Plus, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createCustomer,
  customersQueryOptions,
  deleteCustomer,
  updateCustomer,
  updateCustomerStatus,
} from "@/features/customers/api/customers.api";
import { CustomerFormDialog } from "@/features/customers/ui/CustomerFormDialog";
import type {
  CreateCustomerRequestDto,
  CustomerResponseDto,
  UpdateCustomerRequestDto,
} from "@/shared/api/generated/v1/models";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";
import { Input } from "@/shared/ui/Input";
import { Pagination } from "@/shared/ui/Pagination";
import { Select } from "@/shared/ui/Select";

interface CustomersSearch {
  page?: number;
  search?: string;
  status?: "active" | "blocked";
  sortBy?: "createdAt" | "updatedAt" | "email" | "firstName";
}

export function CustomersScreen() {
  const search = useSearch({ strict: false }) as CustomersSearch;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CustomerResponseDto | null>(null);
  const filters = {
    page: search.page ?? 1,
    limit: 20,
    search: search.search || undefined,
    status: search.status,
    sortBy: search.sortBy ?? "createdAt",
    sortDirection: "desc" as const,
  };
  const customers = useQuery(customersQueryOptions(filters));
  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "blocked";
    }) => updateCustomerStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] }),
  });
  const saveMutation = useMutation({
    mutationFn: (
      payload: CreateCustomerRequestDto | UpdateCustomerRequestDto
    ) =>
      editing
        ? updateCustomer(editing.id, payload as UpdateCustomerRequestDto)
        : createCustomer(payload as CreateCustomerRequestDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      setCreating(false);
      setEditing(null);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] }),
  });
  const columns = useMemo<ColumnDef<CustomerResponseDto>[]>(
    () => [
      {
        header: t("customers"),
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">
              {row.original.firstName} {row.original.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.phone}
              {row.original.email ? ` · ${row.original.email}` : ""}
            </p>
          </div>
        ),
      },
      { header: t("language"), accessorKey: "locale" },
      { header: t("currency"), accessorKey: "currency" },
      { header: t("timeZone"), accessorKey: "timeZone" },
      {
        header: t("status"),
        cell: ({ row }) => (
          <Badge
            className={
              row.original.status === "active"
                ? "border-success/25 bg-success/10 text-success"
                : "border-destructive/20 bg-destructive/8 text-destructive"
            }
          >
            {row.original.status === "active" ? t("active") : t("blocked")}
          </Badge>
        ),
      },
      {
        header: t("created"),
        cell: ({ row }) =>
          row.original.createdAt.toLocaleDateString(i18n.language),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button asChild variant="outline" size="sm">
              <Link
                to="/customers/$customerId"
                params={{ customerId: row.original.id }}
              >
                <Users className="size-4" /> {t("peopleAndDocuments")}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(row.original)}
              aria-label={t("edit")}
            >
              <Edit3 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={statusMutation.isPending}
              onClick={() =>
                statusMutation.mutate({
                  id: row.original.id,
                  status:
                    row.original.status === "active" ? "blocked" : "active",
                })
              }
            >
              {row.original.status === "active" ? t("block") : t("activate")}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (
                  window.confirm(
                    t("deleteCustomerConfirm", {
                      name: `${row.original.firstName} ${
                        row.original.lastName ?? ""
                      }`,
                    })
                  )
                )
                  deleteMutation.mutate(row.original.id);
              }}
              aria-label={t("delete")}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation, i18n.language, statusMutation, t]
  );
  const updateSearch = (patch: Partial<CustomersSearch>) =>
    void navigate({
      to: "/customers",
      search: {
        page: patch.page ?? search.page ?? 1,
        search: "search" in patch ? patch.search : search.search,
        status: "status" in patch ? patch.status : search.status,
        sortBy: patch.sortBy ?? search.sortBy ?? "createdAt",
      },
    });
  const pagination = customers.data?.meta.pagination;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("customers")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("customersSubtitle")}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          {t("addCustomer")}
        </Button>
      </div>
      <div className="my-6 flex flex-wrap gap-3">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder={t("customerSearch")}
            value={search.search ?? ""}
            onChange={(event) =>
              updateSearch({ search: event.target.value || undefined, page: 1 })
            }
          />
        </div>
        <Select
          className="w-48"
          value={search.status ?? ""}
          onChange={(event) =>
            updateSearch({
              status: (event.target.value ||
                undefined) as CustomersSearch["status"],
              page: 1,
            })
          }
        >
          <option value="">{t("allStatuses")}</option>
          <option value="active">{t("activeMany")}</option>
          <option value="blocked">{t("blockedMany")}</option>
        </Select>
        <Select
          className="w-52"
          value={search.sortBy ?? "createdAt"}
          onChange={(event) =>
            updateSearch({
              sortBy: event.target.value as CustomersSearch["sortBy"],
              page: 1,
            })
          }
        >
          <option value="createdAt">{t("newFirst")}</option>
          <option value="updatedAt">{t("changedFirst")}</option>
          <option value="firstName">{t("byName")}</option>
          <option value="email">{t("byEmail")}</option>
        </Select>
      </div>
      {statusMutation.isError && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
          {t("statusError")}
        </div>
      )}
      {deleteMutation.isError && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm text-destructive">
          {deleteMutation.error.message}
        </div>
      )}
      <DataTable
        columns={columns}
        data={customers.data?.data ?? []}
        emptyText={customers.isLoading ? t("loading") : t("noCustomers")}
      />
      {pagination && (
        <Pagination
          page={pagination.page}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={(page) => updateSearch({ page })}
        />
      )}
      <CustomerFormDialog
        key={editing?.id ?? (creating ? "create" : "closed")}
        open={creating || Boolean(editing)}
        customer={editing}
        error={saveMutation.error?.message}
        onClose={() => {
          setCreating(false);
          setEditing(null);
          saveMutation.reset();
        }}
        onSubmit={(payload) =>
          saveMutation.mutateAsync(payload).then(() => undefined)
        }
      />
    </main>
  );
}
