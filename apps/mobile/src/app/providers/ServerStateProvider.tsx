import React, {useEffect, useState} from 'react';
import {AppState, Platform, type AppStateStatus} from 'react-native';
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

function updateFocus(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: true,
        retry: 1,
        staleTime: 60 * 1000,
      },
    },
  });
}

export function ServerStateProvider({children}: React.PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    updateFocus(AppState.currentState);
    const subscription = AppState.addEventListener('change', updateFocus);
    return () => {
      subscription.remove();
      focusManager.setFocused(undefined);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
