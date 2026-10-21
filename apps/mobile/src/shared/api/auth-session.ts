import * as Keychain from 'react-native-keychain';

export type StoredAuthSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  phone: string;
};

const SERVICE = 'uz.protravel.customer-session';
let currentSession: StoredAuthSession | null = null;
const listeners = new Set<(session: StoredAuthSession | null) => void>();

export function getAuthSession(): StoredAuthSession | null {
  return currentSession;
}

export async function restoreAuthSession(): Promise<StoredAuthSession | null> {
  const credentials = await Keychain.getGenericPassword({service: SERVICE});
  if (!credentials) return null;
  currentSession = JSON.parse(credentials.password) as StoredAuthSession;
  notify();
  return currentSession;
}

export async function saveAuthSession(session: StoredAuthSession) {
  currentSession = session;
  notify();
  await Keychain.setGenericPassword(session.phone, JSON.stringify(session), {
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    service: SERVICE,
  });
}

export async function clearAuthSession() {
  currentSession = null;
  notify();
  try {
    await Keychain.resetGenericPassword({service: SERVICE});
  } catch {
    // Clearing the in-memory session must still succeed when the native module
    // is temporarily unavailable (for example, before the app is rebuilt).
  }
}

export function subscribeAuthSession(
  listener: (session: StoredAuthSession | null) => void,
) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach(listener => listener(currentSession));
}
