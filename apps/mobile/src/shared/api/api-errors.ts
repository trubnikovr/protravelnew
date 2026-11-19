import { i18n } from '../i18n';
import { apiErrorMessages } from '../i18n/api-errors.ru';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export function getApiErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof ApiRequestError) {
    const code = error.code;
    if (code && Object.prototype.hasOwnProperty.call(apiErrorMessages, code)) {
      return i18n.t(`apiErrors.${code}`);
    }
    const statusCode = `HTTP_${error.status}`;
    if (Object.prototype.hasOwnProperty.call(apiErrorMessages, statusCode)) {
      return i18n.t(`apiErrors.${statusCode}`);
    }
    if (error.status >= 500) return i18n.t('apiErrors.HTTP_500');
  }
  return fallback ?? i18n.t('apiErrors.UNKNOWN');
}
