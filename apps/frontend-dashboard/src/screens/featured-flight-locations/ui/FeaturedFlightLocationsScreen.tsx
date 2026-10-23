import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  featuredFlightLocationsKey,
  featuredFlightLocationsQueryOptions,
  replaceFeaturedFlightLocations,
} from "@/features/featured-flight-locations/api/featured-flight-locations.api";
import type { FeaturedFlightLocationRequestDto } from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export function FeaturedFlightLocationsScreen() {
  const { t } = useTranslation();
  const client = useQueryClient();
  const query = useQuery(featuredFlightLocationsQueryOptions());
  const [draft, setDraft] = useState<FeaturedFlightLocationRequestDto[] | null>(
    null
  );
  const items =
    draft ??
    query.data?.map(({ code, name, countryName, sortOrder, isActive }) => ({
      code,
      name,
      countryName,
      sortOrder,
      isActive,
    })) ??
    [];
  const save = useMutation({
    mutationFn: replaceFeaturedFlightLocations,
    onSuccess: (data) => {
      client.setQueryData(featuredFlightLocationsKey, data);
    },
  });
  const update = (
    index: number,
    patch: Partial<FeaturedFlightLocationRequestDto>
  ) =>
    setDraft(
      items.map((item, position) =>
        position === index ? { ...item, ...patch } : item
      )
    );

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t("featuredFlightLocations")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("featuredFlightLocationsSubtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setDraft([
                ...items,
                {
                  code: "",
                  name: "",
                  countryName: "",
                  sortOrder: (items.length + 1) * 10,
                  isActive: true,
                },
              ])
            }
          >
            <Plus className="size-4" />
            {t("add")}
          </Button>
          <Button disabled={save.isPending} onClick={() => save.mutate(items)}>
            <Save className="size-4" />
            {t("save")}
          </Button>
        </div>
      </div>
      {query.isPending ? (
        <p className="mt-8">{t("loading")}</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.code}-${index}`}
              className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[100px_1fr_1fr_110px_90px_44px]"
            >
              <Input
                maxLength={3}
                value={item.code}
                placeholder="IATA"
                onChange={(event) =>
                  update(index, { code: event.target.value.toUpperCase() })
                }
              />
              <Input
                value={item.name}
                placeholder={t("locationName")}
                onChange={(event) =>
                  update(index, { name: event.target.value })
                }
              />
              <Input
                value={item.countryName}
                placeholder={t("country")}
                onChange={(event) =>
                  update(index, { countryName: event.target.value })
                }
              />
              <Input
                type="number"
                value={item.sortOrder}
                onChange={(event) =>
                  update(index, { sortOrder: Number(event.target.value) })
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(event) =>
                    update(index, { isActive: event.target.checked })
                  }
                />
                {t("active")}
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setDraft(items.filter((_, position) => position !== index))
                }
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {save.isError ? (
        <p className="mt-4 text-sm text-destructive">
          {t("saveFeaturedFlightLocationsError")}
        </p>
      ) : null}
    </main>
  );
}
