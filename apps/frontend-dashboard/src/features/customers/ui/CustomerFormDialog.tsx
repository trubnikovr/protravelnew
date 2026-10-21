import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import type {
  CreateCustomerRequestDto,
  CustomerResponseDto,
  UpdateCustomerRequestDto,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";

interface Props {
  customer?: CustomerResponseDto | null;
  open: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (
    value: CreateCustomerRequestDto | UpdateCustomerRequestDto
  ) => Promise<void>;
}

export function CustomerFormDialog(props: Props) {
  const { customer, open, error, onClose, onSubmit } = props;
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      locale: "ru" as const,
      currency: customer?.currency ?? ("RUB" as const),
      timeZone: customer?.timeZone ?? "Europe/Moscow",
      status: customer?.status ?? ("active" as const),
    },
    onSubmit: async ({ value }) => {
      await onSubmit({
        ...value,
        email: value.email || null,
        lastName: value.lastName.trim(),
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={customer ? t("editCustomer") : t("addCustomer")}
    >
      <form
        className="grid gap-4 p-6 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="firstName">
          {(field) => (
            <FormField label={t("firstName")}>
              <Input
                required
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="lastName">
          {(field) => (
            <FormField label={t("lastName")}>
              <Input
                required
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="phone">
          {(field) => (
            <FormField label={t("phone")}>
              <Input
                required
                placeholder="+79991234567"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <FormField label={t("email")}>
              <Input
                type="email"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="currency">
          {(field) => (
            <FormField label={t("currency")}>
              <Select
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as typeof field.state.value
                  )
                }
              >
                {["RUB", "USD", "EUR"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </Select>
            </FormField>
          )}
        </form.Field>
        <form.Field name="timeZone">
          {(field) => (
            <FormField label={t("timeZone")}>
              <Input
                required
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="status">
          {(field) => (
            <FormField label={t("status")}>
              <Select
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(
                    event.target.value as typeof field.state.value
                  )
                }
              >
                <option value="active">{t("active")}</option>
                <option value="blocked">{t("blocked")}</option>
              </Select>
            </FormField>
          )}
        </form.Field>
        {error && (
          <p className="text-sm text-destructive sm:col-span-2">{error}</p>
        )}
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
