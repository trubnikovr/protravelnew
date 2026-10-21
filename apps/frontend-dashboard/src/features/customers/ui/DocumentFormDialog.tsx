import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import type {
  CreateTravelerDocumentRequestDto,
  TravelerDocumentResponseDto,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";

export type DocumentFormPayload = Omit<
  CreateTravelerDocumentRequestDto,
  "number"
> & {
  number?: string;
};

interface Props {
  open: boolean;
  document?: TravelerDocumentResponseDto | null;
  onClose: () => void;
  onSubmit: (value: DocumentFormPayload) => Promise<void>;
}

export function DocumentFormDialog({
  open,
  document,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      type: document?.type ?? ("international_passport" as const),
      number: "",
      issuingCountryCode: document?.issuingCountryCode ?? "UZ",
      issuedAt: document?.issuedAt?.toISOString().slice(0, 10) ?? "",
      expiresAt: document?.expiresAt?.toISOString().slice(0, 10) ?? "",
      firstNameLatin: document?.firstNameLatin ?? "",
      lastNameLatin: document?.lastNameLatin ?? "",
    },
    onSubmit: async ({ value }) => {
      const { number, ...fields } = value;
      const payload: DocumentFormPayload = {
        ...fields,
        issuingCountryCode: value.issuingCountryCode.toUpperCase(),
        issuedAt: value.issuedAt
          ? new Date(`${value.issuedAt}T00:00:00.000Z`)
          : null,
        expiresAt: value.expiresAt
          ? new Date(`${value.expiresAt}T00:00:00.000Z`)
          : null,
      };
      if (number) payload.number = number;
      await onSubmit(payload);
    },
  });
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={document ? t("editDocument") : t("addDocument")}
    >
      <form
        className="grid gap-4 p-6 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="type">
          {(item) => (
            <FormField label={t("documentType")}>
              <Select
                value={item.state.value}
                onChange={(event) =>
                  item.handleChange(
                    event.target.value as typeof item.state.value
                  )
                }
              >
                <option value="national_passport">
                  {t("nationalPassport")}
                </option>
                <option value="international_passport">
                  {t("internationalPassport")}
                </option>
                <option value="id_card">{t("idCard")}</option>
                <option value="birth_certificate">
                  {t("birthCertificate")}
                </option>
              </Select>
            </FormField>
          )}
        </form.Field>
        <form.Field name="number">
          {(item) => (
            <FormField label={t("documentNumber")}>
              <Input
                required={!document}
                placeholder={document?.maskedNumber}
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="issuingCountryCode">
          {(item) => (
            <FormField label={t("issuingCountry")}>
              <Input
                required
                maxLength={2}
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="issuedAt">
          {(item) => (
            <FormField label={t("issuedAt")}>
              <Input
                type="date"
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="expiresAt">
          {(item) => (
            <FormField label={t("expiresAt")}>
              <Input
                type="date"
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="firstNameLatin">
          {(item) => (
            <FormField label={t("firstNameLatin")}>
              <Input
                required
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="lastNameLatin">
          {(item) => (
            <FormField label={t("lastNameLatin")}>
              <Input
                required
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <div className="flex justify-end gap-3 border-t pt-4 sm:col-span-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Dialog>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label.Root className="text-sm font-medium">{label}</Label.Root>
      {children}
    </div>
  );
}
