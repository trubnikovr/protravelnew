import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Files, Search, Users } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { customersQueryOptions } from "@/features/customers/api/customers.api";
import type { CustomerResponseDto } from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { DataTable } from "@/shared/ui/DataTable";
import { Input } from "@/shared/ui/Input";
import { Pagination } from "@/shared/ui/Pagination";

interface DocumentsSearch {
  page?: number;
  search?: string;
}

export function CustomerDocumentsScreen() {
  const search = useSearch({ strict: false }) as DocumentsSearch;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const customers = useQuery(
    customersQueryOptions({
      page: search.page ?? 1,
      limit: 20,
      search: search.search || undefined,
      sortBy: "firstName",
      sortDirection: "asc",
    })
  );
  const columns = useMemo<ColumnDef<CustomerResponseDto>[]>(
    () => [
      {
        header: t("customer"),
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
      { header: t("status"), accessorKey: "status" },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button asChild variant="outline" size="sm">
              <Link
                to="/customers/$customerId"
                params={{ customerId: row.original.id }}
              >
                <Users className="size-4" />
                {t("managePeopleDocuments")}
              </Link>
            </Button>
          </div>
        ),
      },
    ],
    [t]
  );
  const pagination = customers.data?.meta.pagination;
  const updateSearch = (patch: DocumentsSearch) =>
    void navigate({
      to: "/customers/documents",
      search: {
        page: patch.page ?? search.page ?? 1,
        search: "search" in patch ? patch.search : search.search,
      },
    });

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-start gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
          <Files className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t("peopleAndDocuments")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("documentsDirectorySubtitle")}
          </p>
        </div>
      </div>
      <div className="relative my-6 max-w-xl">
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
    </main>
  );
}
