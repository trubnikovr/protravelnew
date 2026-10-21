import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface DataTableProps<Row> {
  columns: ColumnDef<Row>[];
  data: Row[];
  emptyText?: string;
}

export function DataTable<Row>({
  columns,
  data,
  emptyText,
}: DataTableProps<Row>) {
  const { t } = useTranslation();
  const resolvedEmptyText = emptyText ?? t("noData");
  // TanStack Table intentionally exposes callback-based state; React Compiler skips it.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-[var(--shadow-card)]">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="border-b bg-muted/55 text-xs uppercase tracking-wide text-muted-foreground">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="px-4 py-3.5 font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-muted/35">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3.5 align-middle">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {!data.length && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-16 text-center text-muted-foreground"
              >
                {resolvedEmptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
