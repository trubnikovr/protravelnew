import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  featuredFlightLocationsKey,
  featuredFlightLocationsQueryOptions,
  replaceFeaturedFlightLocations,
  suggestFeaturedCities,
} from "@/features/featured-flight-locations/api/featured-flight-locations.api";
import { ApiError } from "@/shared/api/api-client";
import type {
  FeaturedFlightLocationResponseDto,
  ReferenceSuggestionResponseDto,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export function FeaturedFlightLocationsScreen() {
  const { t } = useTranslation();
  const client = useQueryClient();
  const query = useQuery(featuredFlightLocationsQueryOptions());
  const [draft, setDraft] = useState<FeaturedFlightLocationResponseDto[] | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<ReferenceSuggestionResponseDto[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const items = draft ?? query.data ?? [];
  useEffect(() => {
    const value = search.trim();
    if (!value) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setSuggesting(true);
      void suggestFeaturedCities(value)
        .then((results) => {
          if (active) {
            setSuggestions(
              results.filter(
                (item) => item.type === "city" && item.airportCodes.length > 0
              )
            );
          }
        })
        .catch(() => {
          if (active) setSuggestions([]);
        })
        .finally(() => {
          if (active) setSuggesting(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [search]);
  const save = useMutation({
    mutationFn: replaceFeaturedFlightLocations,
    onSuccess: (data) => {
      client.setQueryData(featuredFlightLocationsKey, data);
    },
  });
  const update = (
    index: number,
    patch: Partial<FeaturedFlightLocationResponseDto>
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
            disabled={save.isPending || (draft === null && !query.isSuccess)}
            onClick={() => save.mutate(items.map(({ cityId, sortOrder, isActive }) => ({ cityId, sortOrder, isActive })))}
          >
            <Save className="size-4" />
            {t("save")}
          </Button>
        </div>
      </div>
      <div className="relative mt-5 max-w-xl">
        <Input
          value={search}
          placeholder={t("featuredFlightCityPlaceholder")}
          onChange={(event) => {
            setSearch(event.target.value);
            if (!event.target.value.trim()) setSuggestions([]);
          }}
        />
        {search.trim() ? (
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border bg-popover p-1 shadow-xl">
            {suggesting ? <p className="px-3 py-2 text-sm text-muted-foreground">{t("loading")}</p> : null}
            {!suggesting && !suggestions.length ? <p className="px-3 py-2 text-sm text-muted-foreground">{t("noSuggestions")}</p> : null}
            {suggestions.map((suggestion) => (
              <button key={suggestion.id} type="button" disabled={items.some((item) => item.cityId === suggestion.id)} className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50" onClick={() => {
                setDraft([...items, { cityId: suggestion.id, name: suggestion.name, countryName: suggestion.countryName, airportCodes: suggestion.airportCodes, sortOrder: (items.length + 1) * 10, isActive: true }]);
                setSearch("");
              }}>
                <span>{suggestion.name}</span><span className="text-xs text-muted-foreground">{suggestion.countryName}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {query.isPending ? (
        <p className="mt-8">{t("loading")}</p>
      ) : query.isError ? (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-card p-4">
          <p className="text-sm text-destructive">
            {query.error instanceof ApiError &&
            query.error.code === "STALE_FEATURED_FLIGHT_LOCATIONS_API"
              ? t("featuredFlightLocationsApiOutdated")
              : query.error instanceof Error
              ? query.error.message
              : t("loadFeaturedFlightLocationsError")}
          </p>
          <Button className="mt-3" variant="outline" onClick={() => void query.refetch()}>
            {t("retry")}
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.cityId}-${index}`}
              className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_110px_90px_44px]"
            >
              <div className="flex items-center gap-2 text-sm font-medium">{item.name}<span className="font-normal text-muted-foreground">{item.countryName} · {item.airportCodes.join(", ")}</span></div>
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
