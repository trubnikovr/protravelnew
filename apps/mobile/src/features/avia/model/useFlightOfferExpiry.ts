import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { Temporal } from '@js-temporal/polyfill';

export function flightOfferRemainingSeconds(expiresAt?: string | Date | null, now = Temporal.Now.instant().epochMilliseconds): number | null {
  if (!expiresAt || expiresAt === '0') return null;
  try {
    const instant = expiresAt instanceof Date ? Temporal.Instant.fromEpochMilliseconds(expiresAt.getTime()) : Temporal.Instant.from(expiresAt);
    if (instant.epochMilliseconds <= 0) return null;
    return Math.max(0, Math.ceil((instant.epochMilliseconds - now) / 1000));
  } catch {
    return null;
  }
}

export function useFlightOfferExpiry(expiresAt?: string | Date | null) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    const subscription = AppState.addEventListener('change', () => setNow(Date.now()));
    return () => { clearInterval(timer); subscription.remove(); };
  }, []);
  const remaining = flightOfferRemainingSeconds(expiresAt, now);
  const countdown = remaining === null ? null : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  return { expired: remaining === 0, countdown };
}
