import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type {
  CreateSystemMessageRequestDto,
  SystemMessageResponseDto,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";

interface Props {
  message?: SystemMessageResponseDto | null;
  open: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (value: CreateSystemMessageRequestDto) => Promise<void>;
}

export function SystemMessageFormDialog({
  message,
  open,
  error,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      text: message?.text ?? "",
      type: message?.type ?? ("info" as const),
      isActive: message?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      await onSubmit({ ...value, text: value.text.trim() });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={message ? t("editSystemMessage") : t("addSystemMessage")}
      description={t("systemMessageFormHint")}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label.Root className="text-sm font-medium">
                  {t("messageText")}
                </Label.Root>
                <span className="text-xs text-muted-foreground">
                  {field.state.value.length}/500
                </span>
              </div>
              <Textarea
                required
                maxLength={500}
                rows={5}
                placeholder={t("systemMessagePlaceholder")}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="type">
          {(field) => (
            <div className="space-y-2">
              <Label.Root className="text-sm font-medium">
                {t("messageType")}
              </Label.Root>
              <Select
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.target.value as "info" | "error")
                }
              >
                <option value="info">{t("messageInfo")}</option>
                <option value="error">{t("messageError")}</option>
              </Select>
            </div>
          )}
        </form.Field>
        <form.Field name="isActive">
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
                  {t("publishImmediately")}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t("publishImmediatelyHint")}
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
