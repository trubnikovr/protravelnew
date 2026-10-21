import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";
import type {
  CreateTravelerRequestDto,
  TravelerResponseDto,
} from "@/shared/api/generated/v1/models";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";

interface Props {
  open: boolean;
  traveler?: TravelerResponseDto | null;
  onClose: () => void;
  onSubmit: (value: CreateTravelerRequestDto) => Promise<void>;
}

export function TravelerFormDialog({
  open,
  traveler,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      relationship: traveler?.relationship ?? ("other" as const),
      firstName: traveler?.firstName ?? "",
      lastName: traveler?.lastName ?? "",
      middleName: traveler?.middleName ?? "",
      firstNameLatin: traveler?.firstNameLatin ?? "",
      lastNameLatin: traveler?.lastNameLatin ?? "",
      gender: traveler?.gender ?? ("unspecified" as const),
      birthDate: traveler?.birthDate
        ? traveler.birthDate.toISOString().slice(0, 10)
        : "",
      citizenshipCountryCode: traveler?.citizenshipCountryCode ?? "",
      phone: traveler?.phone ?? "",
      email: traveler?.email ?? "",
    },
    onSubmit: async ({ value }) =>
      onSubmit({
        ...value,
        relationship: value.relationship,
        gender: value.gender,
        middleName: value.middleName || null,
        firstNameLatin: value.firstNameLatin || null,
        lastNameLatin: value.lastNameLatin || null,
        birthDate: value.birthDate
          ? new Date(`${value.birthDate}T00:00:00.000Z`)
          : null,
        citizenshipCountryCode:
          value.citizenshipCountryCode.toUpperCase() || null,
        phone: value.phone || null,
        email: value.email || null,
      }),
  });
  const field = (name: string) => t(name);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={traveler ? t("edit") : t("addTraveler")}
    >
      <form
        className="grid gap-4 p-6 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="relationship">
          {(item) => (
            <FormField label={field("relationship")}>
              <Select
                value={item.state.value}
                onChange={(event) =>
                  item.handleChange(
                    event.target.value as typeof item.state.value
                  )
                }
              >
                {["self", "spouse", "child", "parent", "sibling", "other"].map(
                  (value) => (
                    <option key={value} value={value}>
                      {t(value)}
                    </option>
                  )
                )}
              </Select>
            </FormField>
          )}
        </form.Field>
        <form.Field name="gender">
          {(item) => (
            <FormField label={field("gender")}>
              <Select
                value={item.state.value}
                onChange={(event) =>
                  item.handleChange(
                    event.target.value as typeof item.state.value
                  )
                }
              >
                {["male", "female", "unspecified"].map((value) => (
                  <option key={value} value={value}>
                    {t(value)}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        </form.Field>
        {(
          [
            "firstName",
            "lastName",
            "middleName",
            "firstNameLatin",
            "lastNameLatin",
          ] as const
        ).map((name) => (
          <form.Field key={name} name={name}>
            {(item) => (
              <FormField label={field(name)}>
                <Input
                  required={name === "firstName" || name === "lastName"}
                  value={item.state.value}
                  onChange={(event) => item.handleChange(event.target.value)}
                />
              </FormField>
            )}
          </form.Field>
        ))}
        <form.Field name="birthDate">
          {(item) => (
            <FormField label={field("birthDate")}>
              <Input
                type="date"
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="citizenshipCountryCode">
          {(item) => (
            <FormField label={field("citizenship")}>
              <Input
                maxLength={2}
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="phone">
          {(item) => (
            <FormField label={field("phone")}>
              <Input
                value={item.state.value}
                onChange={(event) => item.handleChange(event.target.value)}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="email">
          {(item) => (
            <FormField label={field("email")}>
              <Input
                type="email"
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
