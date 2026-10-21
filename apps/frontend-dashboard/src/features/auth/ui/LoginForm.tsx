import * as Label from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { LoaderCircle, LockKeyhole, UserRound } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/shared/api/api-client";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useLogin } from "../model/use-login";

function errorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    if (error.code === "ADMIN_AUTH_INVALID_CREDENTIALS") {
      return t("invalidCredentials");
    }
    if (error.status === 429) return t("tooManyAttempts");
    return error.message;
  }
  return t("connectionError");
}

export function LoginForm() {
  const login = useLogin();
  const { t } = useTranslation();
  const loginSchema = z
    .string()
    .trim()
    .min(3, t("loginMinLength"))
    .max(80, t("loginMaxLength"))
    .regex(/^[a-zA-Z][a-zA-Z0-9._-]*$/, t("loginPattern"));
  const passwordSchema = z.string().min(1, t("passwordRequired"));
  const form = useForm({
    defaultValues: { login: "", password: "" },
    onSubmit: async ({ value }) => {
      await login.mutateAsync({
        login: value.login.trim(),
        password: value.password,
      });
    },
  });

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      noValidate
    >
      <form.Field
        name="login"
        validators={{
          onBlur: ({ value }) =>
            loginSchema.safeParse(value).error?.issues[0]?.message,
          onChange: ({ value }) =>
            value.length > 0
              ? loginSchema.safeParse(value).error?.issues[0]?.message
              : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium" htmlFor={field.name}>
              {t("login")}
            </Label.Root>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
              <Input
                id={field.name}
                name={field.name}
                type="text"
                autoComplete="username"
                placeholder="admin"
                className="pl-10"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
            </div>
            {field.state.meta.errors[0] && (
              <p className="text-xs text-destructive">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onBlur: ({ value }) =>
            passwordSchema.safeParse(value).error?.issues[0]?.message,
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium" htmlFor={field.name}>
              {t("password")}
            </Label.Root>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="current-password"
                placeholder={t("enterPassword")}
                className="pl-10"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={field.state.meta.errors.length > 0}
              />
            </div>
            {field.state.meta.errors[0] && (
              <p className="text-xs text-destructive">
                {String(field.state.meta.errors[0])}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {login.isError && (
        <div
          className="rounded-lg border border-destructive/20 bg-destructive/8 px-3.5 py-3 text-sm text-destructive"
          role="alert"
        >
          {errorMessage(login.error, t)}
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            className="w-full"
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
            {isSubmitting ? t("signingIn") : t("signIn")}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
