import {useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {listSystemMessages} from '../api/system-messages.api';

export const systemMessagesQueryKey = ['system-messages'] as const;

export function useSystemMessages() {
  const {data, refetch} = useQuery({
    queryKey: systemMessagesQueryKey,
    queryFn: listSystemMessages,
    staleTime: 30 * 1000,
  });
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    messages: data ?? [],
    refresh,
  };
}
