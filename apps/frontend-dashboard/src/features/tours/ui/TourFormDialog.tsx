import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { ImagePlus, LoaderCircle, Search, X } from "lucide-react";
import type { TFunction } from "i18next";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";
import type {
  CreateTourRequestDto,
  CreateTourRequestDtoStatusEnum,
  CreateTourRequestDtoTypeEnum,
  ReferenceSuggestionResponseDto,
  TourPackageDetailsRequestDtoMealTypeEnum,
  TourResponseDto,
} from "@/shared/api/generated/v1/models";
import { suggestReferences, uploadTourImage } from "../api/tours.api";
import { slugifyRussian } from "../lib/slugify";

type MealType = TourPackageDetailsRequestDtoMealTypeEnum;
type TourStatus = CreateTourRequestDtoStatusEnum;
type TourType = CreateTourRequestDtoTypeEnum;

interface SelectedDestination {
  countryId: string;
  countryCode?: string | null;
  countryName: string;
  cityId?: string | null;
  cityName?: string | null;
  arrivalAirportId?: string | null;
  nights?: number | null;
}

interface ContentValues {
  title: string;
  shortDescription: string;
  description: string;
  inclusions: string;
  exclusions: string;
}

interface TourFormValues {
  slug: string;
  status: TourStatus;
  type: TourType;
  destinations: SelectedDestination[];
  departures: CreateTourRequestDto["departures"];
  minTravelers: string;
  maxTravelers: string;
  durationDays: string;
  durationNights: string;
  amount: string;
  currency: "RUB" | "USD" | "EUR";
  hotelName: string;
  hotelCategory: string;
  mealType: MealType;
  transferIncluded: boolean;
  insuranceIncluded: boolean;
  guideLanguage: string;
  groupSizeMax: string;
  program: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  activeFrom: string;
  activeTo: string;
  isFeatured: boolean;
  sortOrder: string;
  content: ContentValues;
}

type ValidationErrors = Partial<Record<string, string>>;

const emptyContent = (): ContentValues => ({
  title: "",
  shortDescription: "",
  description: "",
  inclusions: "",
  exclusions: "",
});

const lines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const dateInput = (value?: Date | null) =>
  value?.toISOString().slice(0, 10) ?? "";

function defaultValues(tour?: TourResponseDto | null): TourFormValues {
  return {
    slug: tour?.slug ?? "",
    status: tour?.status ?? "draft",
    type: tour?.type ?? "package",
    destinations:
      tour?.destinations.map((item) => ({
        countryId: item.countryId,
        countryCode: item.countryCode,
        countryName: item.countryName,
        cityId: item.cityId,
        cityName: item.cityName,
        arrivalAirportId: item.arrivalAirportId,
        nights: item.nights,
      })) ?? [],
    departures:
      tour?.departures.map((item) => ({
        departureDate: item.departureDate,
        returnDate: item.returnDate,
        departureCityId: item.departureCityId,
        departureAirportId: item.departureAirportId,
        arrivalAirportId: item.arrivalAirportId,
        price: {
          amount: item.price.amount,
          currency: item.price.currency,
        },
        seatsTotal: item.seatsTotal,
        seatsAvailable: item.seatsAvailable,
      })) ?? [],
    minTravelers: tour ? String(tour.minTravelers ?? "") : "1",
    maxTravelers: tour ? String(tour.maxTravelers ?? "") : "2",
    durationDays: String(tour?.durationDays ?? 1),
    durationNights: String(tour?.durationNights ?? 0),
    amount: tour?.price.amount ?? "",
    currency: tour?.price.currency ?? "RUB",
    hotelName: tour?.packageDetails?.hotelName ?? "",
    hotelCategory: String(tour?.packageDetails?.hotelCategory ?? ""),
    mealType: tour?.packageDetails?.mealType ?? "breakfast",
    transferIncluded: tour?.packageDetails?.transferIncluded ?? false,
    insuranceIncluded: tour?.packageDetails?.insuranceIncluded ?? false,
    guideLanguage: tour?.excursionDetails?.guideLanguage ?? "Русский",
    groupSizeMax: String(tour?.excursionDetails?.groupSizeMax ?? ""),
    program:
      tour?.programDays
        .map((day) => `${day.title} | ${day.description}`)
        .join("\n") ?? "",
    coverImageUrl: tour?.coverImage?.url ?? "",
    galleryImageUrls: tour?.galleryImages.map(({ url }) => url) ?? [],
    activeFrom: dateInput(tour?.activeFrom),
    activeTo: dateInput(tour?.activeTo),
    isFeatured: tour?.isFeatured ?? false,
    sortOrder: String(tour?.sortOrder ?? 0),
    content: tour
      ? {
          title: tour.content.title,
          shortDescription: tour.content.shortDescription,
          description: tour.content.description,
          inclusions: tour.content.inclusions.join("\n"),
          exclusions: tour.content.exclusions.join("\n"),
        }
      : emptyContent(),
  };
}

function validateTourForm(value: TourFormValues, t: TFunction) {
  const errors: ValidationErrors = {};
  const required = (path: string, fieldValue: string) => {
    if (!fieldValue.trim()) errors[path] = t("fieldRequired");
  };
  required("slug", value.slug);
  required("content.title", value.content.title);
  required("content.shortDescription", value.content.shortDescription);
  required("content.description", value.content.description);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) {
    errors.slug = t("slugInvalid");
  }
  if (!value.destinations.length)
    errors.destinations = t("destinationRequired");
  for (const key of ["minTravelers", "maxTravelers"] as const) {
    if (value[key] && !isIntegerInRange(value[key], 1, 100)) errors[key] = t("travelersInvalid");
  }
  if (value.minTravelers && value.maxTravelers && Number(value.minTravelers) > Number(value.maxTravelers)) {
    errors.maxTravelers = t("travelersRangeInvalid");
  }
  if (!isIntegerInRange(value.durationDays, 1, 365)) {
    errors.durationDays = t("daysInvalid");
  }
  if (!isIntegerInRange(value.durationNights, 0, 364)) {
    errors.durationNights = t("nightsInvalid");
  }
  if (!/^\d{1,18}$/.test(value.amount)) errors.amount = t("amountInvalid");
  if (value.activeFrom && value.activeTo && value.activeFrom > value.activeTo) {
    errors.activeTo = t("activePeriodInvalid");
  }
  if (value.type === "package") required("hotelName", value.hotelName);
  if (value.type === "excursion") {
    required("guideLanguage", value.guideLanguage);
    required("program", value.program);
  }
  return errors;
}

function isIntegerInRange(value: string, minimum: number, maximum: number) {
  return (
    /^\d+$/.test(value) && Number(value) >= minimum && Number(value) <= maximum
  );
}

function toPayload(value: TourFormValues): CreateTourRequestDto {
  const programDays = lines(value.program).map((line, index) => {
    const [title, ...description] = line.split("|");
    return {
      dayNumber: index + 1,
      title: title.trim(),
      description: description.join("|").trim() || title.trim(),
    };
  });
  return {
    slug: value.slug.trim(),
    status: value.status,
    type: value.type,
    minTravelers: value.minTravelers ? Number(value.minTravelers) : null,
    maxTravelers: value.maxTravelers ? Number(value.maxTravelers) : null,
    durationDays: Number(value.durationDays),
    durationNights: Number(value.durationNights),
    price: { amount: value.amount, currency: value.currency },
    destinations: value.destinations.map((item) => ({
      countryId: item.countryId,
      cityId: item.cityId,
      arrivalAirportId: item.arrivalAirportId,
      nights: item.nights,
    })),
    departures: value.departures,
    packageDetails:
      value.type === "package"
        ? {
            hotelName: value.hotelName.trim(),
            hotelCategory: value.hotelCategory
              ? Number(value.hotelCategory)
              : null,
            mealType: value.mealType,
            transferIncluded: value.transferIncluded,
            insuranceIncluded: value.insuranceIncluded,
          }
        : null,
    excursionDetails:
      value.type === "excursion"
        ? {
            guideLanguage: value.guideLanguage.trim(),
            groupSizeMax: value.groupSizeMax
              ? Number(value.groupSizeMax)
              : null,
          }
        : null,
    programDays: value.type === "excursion" ? programDays : [],
    coverImage: value.coverImageUrl ? { url: value.coverImageUrl } : null,
    galleryImages: value.galleryImageUrls.map((url) => ({ url })),
    activeFrom: value.activeFrom
      ? new Date(`${value.activeFrom}T00:00:00.000Z`)
      : null,
    activeTo: value.activeTo
      ? new Date(`${value.activeTo}T00:00:00.000Z`)
      : null,
    isFeatured: value.isFeatured,
    sortOrder: Number(value.sortOrder),
    content: {
      title: value.content.title.trim(),
      shortDescription: value.content.shortDescription.trim(),
      description: value.content.description.trim(),
      inclusions: lines(value.content.inclusions),
      exclusions: lines(value.content.exclusions),
    },
  };
}

interface TourFormDialogProps {
  open: boolean;
  tour?: TourResponseDto | null;
  onClose: () => void;
  onSubmit: (payload: CreateTourRequestDto) => Promise<void>;
}

export function TourFormDialog({
  open,
  tour,
  onClose,
  onSubmit,
}: TourFormDialogProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const form = useForm({
    defaultValues: defaultValues(tour),
    onSubmit: async ({ value }) => {
      const errors = validateTourForm(value, t);
      setValidationErrors(errors);
      if (!Object.keys(errors).length) await onSubmit(toPayload(value));
    },
  });

  const clearError = (path: string) =>
    setValidationErrors((current) => {
      if (!current[path]) return current;
      const next = { ...current };
      delete next[path];
      return next;
    });

  const upload = async (files: File[], gallery: boolean) => {
    if (!files.length) return;
    setUploading(true);
    setUploadError("");
    try {
      if (gallery) {
        const current = form.getFieldValue("galleryImageUrls");
        const urls = await Promise.all(
          files.slice(0, 12 - current.length).map(uploadTourImage)
        );
        form.setFieldValue("galleryImageUrls", [...current, ...urls]);
      } else {
        form.setFieldValue("coverImageUrl", await uploadTourImage(files[0]));
      }
    } catch {
      setUploadError(t("imageUploadError"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      wide
      title={tour ? t("editTour") : t("newTour")}
      description={t("languagesRequired")}
    >
      <form
        noValidate
        className="space-y-7 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <form.Field name="slug">
            {(field) => (
              <Field required label={t("slug")} error={validationErrors.slug}>
                <Input
                  value={field.state.value}
                  placeholder={t("slugAutoHint")}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    clearError("slug");
                  }}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="status">
            {(field) => (
              <Field label={t("status")}>
                <Select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(event.target.value as TourStatus)
                  }
                >
                  <option value="draft">{t("draft")}</option>
                  <option value="published">{t("published")}</option>
                  <option value="archived">{t("archived")}</option>
                </Select>
              </Field>
            )}
          </form.Field>
          <form.Field name="type">
            {(field) => (
              <Field label={t("tourType")}>
                <Select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(event.target.value as TourType)
                  }
                >
                  <option value="package">{t("packageTour")}</option>
                  <option value="excursion">{t("excursionTour")}</option>
                </Select>
              </Field>
            )}
          </form.Field>
          <form.Field name="sortOrder">
            {(field) => (
              <Field label={t("order")}>
                <Input
                  type="number"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-bold">{t("destinations")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("destinationsHint")}
          </p>
          <form.Field name="destinations">
            {(field) => (
              <DestinationPicker
                value={field.state.value}
                error={validationErrors.destinations}
                onChange={(value) => {
                  field.handleChange(value);
                  clearError("destinations");
                }}
              />
            )}
          </form.Field>
        </section>

        <section className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2 lg:grid-cols-4">
          {(["minTravelers", "maxTravelers"] as const).map((name) => (
            <form.Field key={name} name={name}>
              {(field) => (
                <Field label={t(name)} error={validationErrors[name]}>
                  <Input type="number" min={1} max={100} value={field.state.value}
                    onChange={(event) => { field.handleChange(event.target.value); clearError("minTravelers"); clearError("maxTravelers"); }} />
                </Field>
              )}
            </form.Field>
          ))}
          <form.Field name="durationDays">
            {(field) => (
              <Field
                required
                label={t("days")}
                error={validationErrors.durationDays}
              >
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={field.state.value}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    form.setFieldValue(
                      "durationNights",
                      String(Math.max(0, Number(event.target.value || 1) - 1))
                    );
                    clearError("durationDays");
                    clearError("durationNights");
                  }}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="durationNights">
            {(field) => (
              <Field
                required
                label={t("nights")}
                error={validationErrors.durationNights}
              >
                <Input
                  type="number"
                  min={0}
                  max={364}
                  value={field.state.value}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    clearError("durationNights");
                  }}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="amount">
            {(field) => (
              <Field
                required
                label={t("minorAmount")}
                error={validationErrors.amount}
              >
                <Input
                  inputMode="numeric"
                  value={field.state.value}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    clearError("amount");
                  }}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="currency">
            {(field) => (
              <Field label={t("currency")}>
                <Select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value as TourFormValues["currency"]
                    )
                  }
                >
                  <option value="RUB">RUB</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Select>
              </Field>
            )}
          </form.Field>
          <form.Field name="activeFrom">
            {(field) => (
              <Field label={t("activeFrom")}>
                <Input
                  type="date"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="activeTo">
            {(field) => (
              <Field label={t("activeTo")} error={validationErrors.activeTo}>
                <Input
                  type="date"
                  min={form.getFieldValue("activeFrom") || undefined}
                  value={field.state.value}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    clearError("activeTo");
                  }}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="isFeatured">
            {(field) => (
              <label className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium md:col-span-2">
                <input
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(event) => field.handleChange(event.target.checked)}
                />
                {t("featured")}
              </label>
            )}
          </form.Field>
        </section>

        <form.Subscribe selector={(state) => state.values}>
          {(values) =>
            values.type === "package" ? (
              <PackageFields
                values={values}
                errors={validationErrors}
                onHotelName={(value) => form.setFieldValue("hotelName", value)}
                onHotelCategory={(value) =>
                  form.setFieldValue("hotelCategory", value)
                }
                onMealType={(value) => form.setFieldValue("mealType", value)}
                onTransferIncluded={(value) =>
                  form.setFieldValue("transferIncluded", value)
                }
                onInsuranceIncluded={(value) =>
                  form.setFieldValue("insuranceIncluded", value)
                }
                clearError={clearError}
              />
            ) : (
              <ExcursionFields
                values={values}
                errors={validationErrors}
                onGuideLanguage={(value) =>
                  form.setFieldValue("guideLanguage", value)
                }
                onGroupSizeMax={(value) =>
                  form.setFieldValue("groupSizeMax", value)
                }
                onProgram={(value) => form.setFieldValue("program", value)}
                clearError={clearError}
              />
            )
          }
        </form.Subscribe>

        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-bold">{t("tourImages")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("imageRequirements")}
          </p>
          {uploadError && (
            <p className="mt-3 text-sm text-destructive">{uploadError}</p>
          )}
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <form.Field name="coverImageUrl">
              {(field) => (
                <ImagePicker
                  label={t("mainImage")}
                  urls={field.state.value ? [field.state.value] : []}
                  uploading={uploading}
                  onFiles={(files) => void upload(files, false)}
                  onRemove={() => field.handleChange("")}
                />
              )}
            </form.Field>
            <form.Field name="galleryImageUrls">
              {(field) => (
                <ImagePicker
                  multiple
                  label={t("galleryImages")}
                  urls={field.state.value}
                  uploading={uploading}
                  onFiles={(files) => void upload(files, true)}
                  onRemove={(url) =>
                    field.handleChange(
                      field.state.value.filter((item) => item !== url)
                    )
                  }
                />
              )}
            </form.Field>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5">
          <h3 className="font-bold">{t("tour")}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <form.Field name="content.title">
              {(field) => (
                <Field
                  required
                  label={t("title")}
                  error={validationErrors["content.title"]}
                >
                  <Input
                    value={field.state.value}
                    onBlur={() => {
                      field.handleBlur();
                      if (!form.getFieldValue("slug").trim()) {
                        form.setFieldValue(
                          "slug",
                          slugifyRussian(field.state.value)
                        );
                        clearError("slug");
                      }
                    }}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                      clearError("content.title");
                    }}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="content.shortDescription">
              {(field) => (
                <Field
                  required
                  label={t("shortDescription")}
                  error={validationErrors["content.shortDescription"]}
                >
                  <Input
                    value={field.state.value}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                      clearError("content.shortDescription");
                    }}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="content.description">
              {(field) => (
                <div className="md:col-span-2">
                  <Field
                    required
                    label={t("description")}
                    error={validationErrors["content.description"]}
                  >
                    <Textarea
                      value={field.state.value}
                      onChange={(event) => {
                        field.handleChange(event.target.value);
                        clearError("content.description");
                      }}
                    />
                  </Field>
                </div>
              )}
            </form.Field>
            <form.Field name="content.inclusions">
              {(field) => (
                <Field label={t("included")}>
                  <Textarea
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="content.exclusions">
              {(field) => (
                <Field label={t("excluded")}>
                  <Textarea
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        </section>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="sticky bottom-0 space-y-3 border-t bg-background py-4">
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting || uploading}>
                  {(isSubmitting || uploading) && (
                    <LoaderCircle className="size-4 animate-spin" />
                  )}
                  {tour ? t("save") : t("createTour")}
                </Button>
              </div>
              {Object.keys(validationErrors).length > 0 && (
                <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {t("formHasErrors")}
                </div>
              )}
            </div>
          )}
        </form.Subscribe>
      </form>
    </Dialog>
  );
}

function DestinationPicker({
  value,
  error,
  onChange,
}: {
  value: SelectedDestination[];
  error?: string;
  onChange: (value: SelectedDestination[]) => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    ReferenceSuggestionResponseDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const search = query.trim();
    if (!search) return;
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      void suggestReferences(search, ["country", "city"])
        .then((items) => {
          if (active) setSuggestions(items);
        })
        .catch(() => {
          if (active) setSuggestions([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const add = (suggestion: ReferenceSuggestionResponseDto) => {
    const cityId = suggestion.type === "city" ? suggestion.id : null;
    const duplicate = value.some(
      (item) =>
        item.countryId === suggestion.countryId && item.cityId === cityId
    );
    if (!duplicate) {
      onChange([
        ...value,
        {
          countryId: suggestion.countryId,
          countryCode: suggestion.countryCode,
          countryName: suggestion.countryName,
          cityId,
          cityName: suggestion.type === "city" ? suggestion.name : null,
          arrivalAirportId: null,
          nights: null,
        },
      ]);
    }
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="mt-4">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
        <Input
          className="pl-10"
          value={query}
          placeholder={t("destinationSuggestPlaceholder")}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!event.target.value.trim()) setSuggestions([]);
          }}
          aria-expanded={suggestions.length > 0}
          aria-autocomplete="list"
        />
        {query.trim() && (
          <div
            className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl ring-1 ring-black/5 dark:ring-white/10"
            style={{ backgroundColor: "var(--popover)" }}
          >
            {loading && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                {t("loading")}
              </p>
            )}
            {!loading && !suggestions.length && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                {t("noSuggestions")}
              </p>
            )}
            {suggestions.map((suggestion) => (
              <button
                key={`${suggestion.type}-${suggestion.id}`}
                type="button"
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => add(suggestion)}
              >
                <span>
                  {suggestion.type === "city"
                    ? `${suggestion.countryName} — ${suggestion.name}`
                    : suggestion.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {suggestion.type === "city" ? t("city") : t("country")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span
            key={`${item.countryId}-${item.cityId ?? "country"}-${index}`}
            className="flex items-center gap-2 rounded-full border bg-muted px-3 py-2 text-sm"
          >
            {item.countryName ?? item.countryCode ?? item.countryId}
            {item.cityId && ` — ${item.cityName ?? item.cityId}`}
            <button
              type="button"
              aria-label={t("delete")}
              onClick={() =>
                onChange(value.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function PackageFields({
  values,
  errors,
  clearError,
  onHotelName,
  onHotelCategory,
  onMealType,
  onTransferIncluded,
  onInsuranceIncluded,
}: PackageFieldsProps) {
  const { t } = useTranslation();
  return (
    <section className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2 lg:grid-cols-4">
      <div className="md:col-span-2 lg:col-span-4">
        <h3 className="font-bold">{t("accommodation")}</h3>
      </div>
      <Field required label={t("hotelName")} error={errors.hotelName}>
        <Input
          value={values.hotelName}
          onChange={(event) => {
            onHotelName(event.target.value);
            clearError("hotelName");
          }}
        />
      </Field>
      <Field label={t("hotelCategory")}>
        <Input
          type="number"
          min={1}
          max={5}
          value={values.hotelCategory}
          onChange={(event) => onHotelCategory(event.target.value)}
        />
      </Field>
      <Field label={t("mealType")}>
        <Select
          value={values.mealType}
          onChange={(event) => onMealType(event.target.value as MealType)}
        >
          <option value="room_only">{t("roomOnly")}</option>
          <option value="breakfast">{t("breakfast")}</option>
          <option value="half_board">{t("halfBoard")}</option>
          <option value="full_board">{t("fullBoard")}</option>
          <option value="all_inclusive">{t("allInclusive")}</option>
        </Select>
      </Field>
      <div className="space-y-3 pt-1">
        <CheckField
          label={t("transferIncluded")}
          checked={values.transferIncluded}
          onChange={onTransferIncluded}
        />
        <CheckField
          label={t("insuranceIncluded")}
          checked={values.insuranceIncluded}
          onChange={onInsuranceIncluded}
        />
      </div>
    </section>
  );
}

function ExcursionFields({
  values,
  errors,
  clearError,
  onGuideLanguage,
  onGroupSizeMax,
  onProgram,
}: ExcursionFieldsProps) {
  const { t } = useTranslation();
  return (
    <section className="grid gap-4 rounded-xl border bg-card p-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <h3 className="font-bold">{t("excursionDetails")}</h3>
      </div>
      <Field required label={t("guideLanguage")} error={errors.guideLanguage}>
        <Input
          value={values.guideLanguage}
          onChange={(event) => {
            onGuideLanguage(event.target.value);
            clearError("guideLanguage");
          }}
        />
      </Field>
      <Field label={t("groupSizeMax")}>
        <Input
          type="number"
          min={1}
          value={values.groupSizeMax}
          onChange={(event) => onGroupSizeMax(event.target.value)}
        />
      </Field>
      <div className="md:col-span-2">
        <Field required label={t("program")} error={errors.program}>
          <Textarea
            value={values.program}
            placeholder={t("programHint")}
            onChange={(event) => {
              onProgram(event.target.value);
              clearError("program");
            }}
          />
        </Field>
      </div>
    </section>
  );
}

interface FormSectionProps {
  values: TourFormValues;
  errors: ValidationErrors;
  clearError: (path: string) => void;
}

interface PackageFieldsProps extends FormSectionProps {
  onHotelName: (value: string) => void;
  onHotelCategory: (value: string) => void;
  onMealType: (value: MealType) => void;
  onTransferIncluded: (value: boolean) => void;
  onInsuranceIncluded: (value: boolean) => void;
}

interface ExcursionFieldsProps extends FormSectionProps {
  onGuideLanguage: (value: string) => void;
  onGroupSizeMax: (value: string) => void;
  onProgram: (value: string) => void;
}

function CheckField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function ImagePicker({
  label,
  urls,
  multiple,
  uploading,
  onFiles,
  onRemove,
}: {
  label: string;
  urls: string[];
  multiple?: boolean;
  uploading: boolean;
  onFiles: (files: File[]) => void;
  onRemove: (url: string) => void;
}) {
  const { t } = useTranslation();
  const selectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    onFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };
  const canUpload = multiple ? urls.length < 12 : urls.length === 0;
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {urls.map((url) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(url)}
              aria-label={t("delete")}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/65 p-1 text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {canUpload && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center text-xs text-muted-foreground hover:bg-muted">
            <ImagePlus className="size-6" />
            {uploading ? t("uploading") : t("uploadImage")}
            <input
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={multiple}
              disabled={uploading}
              onChange={selectFiles}
            />
          </label>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  required,
}: {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label.Root
        className={`text-sm font-medium ${error ? "text-destructive" : ""}`}
      >
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label.Root>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
