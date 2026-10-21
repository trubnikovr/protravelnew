import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {CustomerAuthSession} from '../api/customer-auth.api';
import {useQueryClient} from '@tanstack/react-query';
import {
  clearAuthSession,
  restoreAuthSession,
  saveAuthSession,
  subscribeAuthSession,
  type StoredAuthSession,
} from '../../../shared/api/auth-session';

type AuthSessionState = {
  session: CustomerAuthSession | null;
  phone: string | null;
  restoring: boolean;
  signIn: (session: CustomerAuthSession, phone: string) => void;
  signOut: () => void;
};

const AuthSessionContext = createContext<AuthSessionState | null>(null);

export function AuthSessionProvider({children}: React.PropsWithChildren) {
  const queryClient = useQueryClient();
  const [stored, setStored] = useState<StoredAuthSession | null>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthSession(session => {
      setStored(session);
      if (!session) queryClient.removeQueries({queryKey: ['customer']});
    });
    restoreAuthSession()
      .then(setStored)
      .catch(() => setStored(null))
      .finally(() => setRestoring(false));
    return unsubscribe;
  }, [queryClient]);

  const value = useMemo<AuthSessionState>(
    () => ({
      session: stored,
      phone: stored?.phone ?? null,
      restoring,
      signIn: (nextSession, nextPhone) => {
        saveAuthSession({...nextSession, phone: nextPhone}).catch(() => null);
      },
      signOut: () => {
        clearAuthSession().catch(() => null);
      },
    }),
    [restoring, stored],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionState {
  const value = useContext(AuthSessionContext);
  if (!value) {
    throw new Error('useAuthSession must be used inside AuthSessionProvider');
  }
  return value;
}
