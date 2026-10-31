export const APP_LOG_EVENT = 'application.log.v1';

export type AppLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface AppLogEvent {
  level: AppLogLevel;
  context: string;
  message: string;
  fields: Record<string, unknown>;
}
