import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type {
  AdminNewsArticleResponseDto,
  CreateAdminNewsRequestDto,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";

interface Props {
  article?: AdminNewsArticleResponseDto | null;
  open: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (value: CreateAdminNewsRequestDto) => Promise<void>;
}

export function NewsFormDialog({
  article,
  open,
  error,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      title: article?.title ?? "",
      summary: article?.summary ?? "",
      content: article?.content ?? "",
      category: article?.category ?? ("general" as const),
      isPublished: article?.isPublished ?? false,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        title: value.title.trim(),
        summary: value.summary.trim(),
        content: value.content.trim(),
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={article ? t("editNews") : t("addNews")}
      description={t("newsFormHint")}
    >
      <form
        className="grid gap-5 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="title">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label.Root className="text-sm font-medium">
                  {t("newsTitle")}
                </Label.Root>
                <span className="text-xs text-muted-foreground">
                  {field.state.value.length}/180
                </span>
              </div>
              <Input
                required
                maxLength={180}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="summary">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label.Root className="text-sm font-medium">
                  {t("newsSummary")}
                </Label.Root>
                <span className="text-xs text-muted-foreground">
                  {field.state.value.length}/300
                </span>
              </div>
              <Textarea
                required
                maxLength={300}
                rows={3}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="content">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label.Root className="text-sm font-medium">
                  {t("newsContent")}
                </Label.Root>
                <span className="text-xs text-muted-foreground">
                  {field.state.value.length}/20000
                </span>
              </div>
              <Textarea
                required
                maxLength={20000}
                rows={12}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="category">
          {(field) => (
            <div className="space-y-2">
              <Label.Root className="text-sm font-medium">
                {t("newsCategory")}
              </Label.Root>
              <Select
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as "promotion" | "security" | "general"
                  )
                }
              >
                <option value="general">{t("newsGeneral")}</option>
                <option value="promotion">{t("newsPromotion")}</option>
                <option value="security">{t("newsSecurity")}</option>
              </Select>
            </div>
          )}
        </form.Field>
        <form.Field name="isPublished">
          {(field) => (
            <label className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
              <input
                className="mt-0.5 size-4 accent-primary"
                type="checkbox"
                checked={field.state.value}
                onChange={(event) => field.handleChange(event.target.checked)}
              />
              <span>
                <span className="block text-sm font-semibold">
                  {t("publishNews")}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t("publishNewsHint")}
                </span>
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
