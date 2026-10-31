import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type {
  AdminTravelFactResponseDto,
  CreateTravelFactRequestDto,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";

interface Props {
  fact?: AdminTravelFactResponseDto | null;
  open: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (value: CreateTravelFactRequestDto) => Promise<void>;
}

export function TravelFactFormDialog({
  fact,
  open,
  error,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      text: fact?.text ?? "",
      countryCode: fact?.countryCode ?? "",
      destinationCode: fact?.destinationCode ?? "",
      tags: fact?.tags.join(", ") ?? "",
      isPublished: fact?.isPublished ?? false,
    },
    onSubmit: async ({ value }) =>
      onSubmit({
        text: value.text.trim(),
        countryCode: value.countryCode.trim().toUpperCase() || null,
        destinationCode: value.destinationCode.trim().toUpperCase() || null,
        tags: value.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isPublished: value.isPublished,
      }),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={fact ? t("editTravelFact") : t("addTravelFact")}
      description={t("travelFactFormHint")}
    >
      <form
        className="grid gap-5 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="text">
          {(field) => (
            <Field label={t("travelFactText")}>
              <Textarea
                required
                maxLength={1000}
                rows={5}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </Field>
          )}
        </form.Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="countryCode">
            {(field) => (
              <Field label={t("countryCode")}>
                <Input
                  maxLength={2}
                  placeholder="VN"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="destinationCode">
            {(field) => (
              <Field label={t("destinationCode")}>
                <Input
                  maxLength={3}
                  placeholder="PQC"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </Field>
            )}
          </form.Field>
        </div>
        <form.Field name="tags">
          {(field) => (
            <Field label={t("travelFactTags")}>
              <Input
                placeholder={t("travelFactTagsPlaceholder")}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </Field>
          )}
        </form.Field>
        <form.Field name="isPublished">
          {(field) => (
            <label className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <input
                className="size-4 accent-primary"
                type="checkbox"
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              />
              <span className="text-sm font-semibold">
                {t("publishTravelFact")}
              </span>
            </label>
          )}
        </form.Field>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label.Root className="text-sm font-medium">{label}</Label.Root>
      {children}
    </div>
  );
}
